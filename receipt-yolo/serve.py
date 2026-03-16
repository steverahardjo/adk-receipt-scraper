"""
Serve the Receipt YOLO model with FastAPI.

Run with: uvicorn serve:app --host 0.0.0.0 --port 8000 --reload
"""

import base64
import logging
from types import SimpleNamespace

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from model import ReceiptCropper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import os

# Model is in parent directory (project root)
MODEL_URI = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "receipt-yolo.onnx")
)

app = FastAPI(title="Receipt YOLO Service")

# Load model at startup
logger.info(f"Loading model from {MODEL_URI}...")
rc = ReceiptCropper()
ctx = SimpleNamespace(artifacts={"onnx_model": MODEL_URI})
rc.load_context(ctx)
model = rc
logger.info("Model loaded successfully!")


@app.post("/crop")
async def crop(file: UploadFile = File(...)):
    """Crop receipt from uploaded image."""
    img_bytes = await file.read()

    if not img_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    b64 = base64.b64encode(img_bytes).decode("utf-8")
    df = pd.DataFrame([{"image": b64}])

    try:
        result = model.predict(None, df)
        return {"image": result}
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "model": "loaded"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
