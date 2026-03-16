import os
from datetime import datetime

import gdown
import mlflow.onnx
import onnx

MODEL_ID = "16Jty6BR3Y1ec6BkmYFZkl2SQNdrLWDaL"
MODEL_LINK = f"https://drive.google.com/uc?id={MODEL_ID}"


def load_gdrive(model_link: str, model_name: str) -> str:
    # Ensure we save it in the root project dir where you want it
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output = os.path.join(script_dir, "..", f"{model_name}.onnx")

    if not os.path.exists(output):
        print(f"Downloading model to {output}...")
        # fuzzy=True helps gdown handle Drive URLs better
        gdown.download(model_link, output, quiet=False)
    return output


# --- Execution ---
# 2. Download/Locate the model first
model_path = load_gdrive(MODEL_LINK, "receipt-yolo")

# 3. Load the model (Now it's actually a binary file, not HTML)
try:
    onnx_model = onnx.load(model_path)
    # Basic check to ensure it's valid
    onnx.checker.check_model(onnx_model)
except Exception as e:
    print(f"Failed to load ONNX model: {e}")
    print("Tip: Delete the existing .onnx file and run again to re-download.")
    exit(1)

# 4. MLflow Logging
mlflow.set_tracking_uri("file:./mlruns")  # Ensures logs stay in your project
with mlflow.start_run(
    run_name=f"versioning_receipt-yolo_{datetime.now().strftime('%Y%m%d')}"
):
    mlflow.set_tags(
        {
            "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "gpu_model": "Tesla-T2",
            "framework": "Ultralytics 8.4.11",
            "device_id": "CUDA:0",
        }
    )

    # Fixed typo in 'images'
    mlflow.log_metrics(
        {"mAP_50": 0.995, "images": 596, "inference_ms": 7.1, "postprocess_ms": 1.5}
    )

    mlflow.onnx.log_model(
        onnx_model=onnx_model,
        artifact_path="model",
        registered_model_name="receipt-yolo",  # Fixed parameter name
    )

print("MLflow run complete and model registered.")
