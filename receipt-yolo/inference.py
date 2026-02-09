import mlflow.pyfunc
import onnxruntime as ort
import cv2
import numpy as np
import base64
import pandas as pd
import os
import gdown
import mlflow
from datetime import datetime

# --- CONFIG & PATHS ---
MODEL_ID = ""
MODEL_LINK = f"https://drive.google.com/uc?id={MODEL_ID}"

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "receipt-yolo.onnx")

# --- MLFLOW SETUP ---
mlflow.set_tracking_uri("sqlite:///mlflow.db")

# --- AUTO-RECOVERY ---
if not os.path.exists(model_path):
    print(f"📂 Model missing. Re-downloading to {model_path}...")
    try:
        gdown.download(MODEL_LINK, model_path, quiet=False)
    except Exception as e:
        print(f"❌ Download failed: {e}")
        exit(1)

# --- MODEL CLASS ---
class ReceiptCropper(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        # context.artifacts is provided by MLflow when loading the model
        self.session = ort.InferenceSession(context.artifacts["onnx_model"])
        self.input_name = self.session.get_inputs()[0].name

    def predict(self, context, model_input):
        # Extract base64 string
        b64_str = model_input.iloc[0, 0] if hasattr(model_input, 'iloc') else model_input["image"]
        img_bytes = base64.b64decode(b64_str)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return "Error: Could not decode image"
            
        orig_h, orig_w = img.shape[:2]

        # YOLO Preprocessing
        input_img = cv2.resize(img, (640, 640))
        input_img = input_img.transpose(2, 0, 1)
        input_img = np.expand_dims(input_img, axis=0).astype(np.float32) / 255.0

        # Inference
        outputs = self.session.run(None, {self.input_name: input_img})
        output0 = np.squeeze(outputs[0]).T

        # Filter boxes
        boxes = output0[:, :4]
        scores = np.max(output0[:, 4:], axis=1)
        mask = scores > 0.4
        
        # Scale to original
        x1 = (boxes[mask, 0] - boxes[mask, 2]/2) * (orig_w/640)
        y1 = (boxes[mask, 1] - boxes[mask, 3]/2) * (orig_h/640)
        x2 = (boxes[mask, 0] + boxes[mask, 2]/2) * (orig_w/640)
        y2 = (boxes[mask, 1] + boxes[mask, 3]/2) * (orig_h/640)
        
        xyxy = np.stack([x1, y1, x2, y2], axis=1)
        indices = cv2.dnn.NMSBoxes(xyxy.tolist(), scores[mask].tolist(), 0.4, 0.45)

        if len(indices) > 0:
            idx = indices[0]
            if isinstance(idx, (list, np.ndarray)): idx = idx[0]
            bx1, by1, bx2, by2 = xyxy[idx].astype(int)
            cropped = img[max(0, by1):min(orig_h, by2), max(0, bx1):min(orig_w, bx2)]
        else:
            cropped = img

        _, buffer = cv2.imencode('.jpg', cropped)
        return base64.b64encode(buffer).decode('utf-8')

# --- LOGGING & REGISTRATION ---
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Double check failed: {model_path} still doesn't exist.")

print(f"Logging model to SQLite (mlflow.db)...")
with mlflow.start_run(run_name=f"run_{datetime.now().strftime('%Y%m%d_%H%M%S')}") as run:
    mlflow.pyfunc.log_model(
        artifact_path="receipt_model",
        python_model=ReceiptCropper(),
        artifacts={"onnx_model": model_path},
        registered_model_name="receipt-yolo"
    )
    model_uri = f"runs:/{run.info.run_id}/receipt_model"

# --- DRY RUN ---
print("Loading model from registry for dry run...")
loaded_model = mlflow.pyfunc.load_model(model_uri)

# Correct path to your input image
input_image_path = "/home/holyknight101/Downloads/661.jpg"

if os.path.exists(input_image_path):
    with open(input_image_path, "rb") as f:
        encoded_input = base64.b64encode(f.read()).decode('utf-8')

    test_df = pd.DataFrame({"image": [encoded_input]})
    print("Running inference...")
    encoded_result = loaded_model.predict(test_df)

    output_filename = "test_output_cropped.jpg"
    with open(output_filename, "wb") as f:
        f.write(base64.b64decode(encoded_result))
    print(f"Dry run successful! Saved to '{output_filename}'")
else:
    print(f"Input image not found at {input_image_path}. Please check the path.")