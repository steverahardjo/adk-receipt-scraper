import base64
from types import SimpleNamespace
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from model import ReceiptCropper

MODEL_URI = "receipt.onnx"

app = FastAPI(title="Receipt Cropper API")

# model will be initialized at startup
model = None


@app.on_event("startup")
def load_model():
    global model
    rc = ReceiptCropper()
    ctx = SimpleNamespace(artifacts={"onnx_model": MODEL_URI})
    rc.load_context(ctx)
    model = rc


@app.post("/crop")
async def crop(file: UploadFile = File(...)):
    img_bytes = await file.read()

    if not img_bytes:
        raise HTTPException(400, "Empty file")

    b64 = base64.b64encode(img_bytes).decode("utf-8")

    df = pd.DataFrame([{"image": b64}])

    try:
        cropped_b64 = model.predict(None, df)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"image": cropped_b64}
