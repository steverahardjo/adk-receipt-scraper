import base64
import cv2
import mlflow.pyfunc
import numpy as np
import onnxruntime as ort
import pandas as pd

CONF_THRESH = 0.4
NMS_THRESH = 0.45
INPUT_SIZE = 640


class ReceiptCropper(mlflow.pyfunc.PythonModel):

    def load_context(self, context):
        self.session = ort.InferenceSession(
            context.artifacts["onnx_model"],
            providers=["CPUExecutionProvider"],
        )
        self.input_name = self.session.get_inputs()[0].name

    def predict(self, context, model_input: pd.DataFrame):
        b64 = model_input.iloc[0]["image"]

        img_bytes = base64.b64decode(b64)
        img = cv2.imdecode(
            np.frombuffer(img_bytes, np.uint8),
            cv2.IMREAD_COLOR,
        )

        if img is None:
            raise ValueError("Invalid image")

        h, w = img.shape[:2]

        # preprocess
        x = cv2.resize(img, (INPUT_SIZE, INPUT_SIZE))
        x = x.transpose(2, 0, 1)
        x = np.expand_dims(x, 0).astype(np.float32) / 255.0

        # inference
        outputs = self.session.run(None, {self.input_name: x})
        preds = np.squeeze(outputs[0]).T

        boxes = preds[:, :4]
        scores = preds[:, 4:].max(axis=1)

        keep = scores > CONF_THRESH
        boxes, scores = boxes[keep], scores[keep]

        if len(boxes) == 0:
            cropped = img
        else:
            x1 = (boxes[:, 0] - boxes[:, 2] / 2) * (w / INPUT_SIZE)
            y1 = (boxes[:, 1] - boxes[:, 3] / 2) * (h / INPUT_SIZE)
            x2 = (boxes[:, 0] + boxes[:, 2] / 2) * (w / INPUT_SIZE)
            y2 = (boxes[:, 1] + boxes[:, 3] / 2) * (h / INPUT_SIZE)

            xyxy = np.stack([x1, y1, x2, y2], axis=1)

            idxs = cv2.dnn.NMSBoxes(
                xyxy.tolist(),
                scores.tolist(),
                CONF_THRESH,
                NMS_THRESH,
            )

            if len(idxs) > 0:
                i = int(idxs[0])
                x1, y1, x2, y2 = xyxy[i].astype(int)
                cropped = img[
                    max(0, y1):min(h, y2),
                    max(0, x1):min(w, x2),
                ]
            else:
                cropped = img

        _, buf = cv2.imencode(".jpg", cropped)
        return base64.b64encode(buf).decode("utf-8")
