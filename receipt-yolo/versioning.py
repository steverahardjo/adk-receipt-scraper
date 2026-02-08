import mlflow.onnx
import os
import gdown
import onnx
from datetime import datetime

# --- CONFIG ---
# Direct download ID from your link
MODEL_ID = ""
MODEL_LINK = f"https://drive.google.com/uc?id={MODEL_ID}"

def load_gdrive(model_link: str, model_name: str) -> str:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Places the .onnx file in the root 'adk-exp_tracker' folder
    output = os.path.abspath(os.path.join(script_dir, "..", f"{model_name}.onnx"))
    
    if not os.path.exists(output):
        print(f"Downloading model to: {output}")
        # gdown will now fetch the actual binary content
        gdown.download(model_link, output, quiet=False)
    return output

# --- EXECUTION ---
model_path = load_gdrive(MODEL_LINK, "receipt-yolo")

try:
    # Load and verify the model structure
    onnx_model = onnx.load(model_path)
    onnx.checker.check_model(onnx_model)
    print("✅ Model loaded and verified successfully.")
except Exception as e:
    print(f"❌ Failed to load ONNX model: {e}")
    # Check if the file is actually an HTML file in disguise
    with open(model_path, 'r', errors='ignore') as f:
        if "<!DOCTYPE html>" in f.read(100):
            print("CRITICAL: The downloaded file is an HTML page, not a model.")
            print("Ensure the Google Drive file is shared as 'Anyone with the link'.")
    exit(1)

with mlflow.start_run(run_name=f"versioning_receipt-yolo"):
    mlflow.set_tags({
        "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "gpu_model": "Tesla-T2",
        "framework": "Ultralytics 8.4.11"
    })
    
    mlflow.log_metrics({
        "mAP_50": 0.995,
        "images": 596,
        "inference_ms": 7.1
    })

    # Fix: parameter is registered_model_name, not registered_model
    mlflow.onnx.log_model(
        onnx_model=onnx_model,
        artifact_path="model",
        registered_model_name="receipt-yolo"
    )

print("🚀 MLflow run complete.")