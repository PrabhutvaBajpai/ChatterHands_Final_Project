import base64
import os
import pickle
from typing import Optional

import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

app = FastAPI()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SIGN_LANGUAGE_MODEL_PATH = os.path.normpath(
    os.path.join(BASE_DIR, "..", "sign-language-detector-python", "model.p")
)
LOCAL_MODEL_PATH = os.path.join(BASE_DIR, "model.p")
MODEL_PATH = SIGN_LANGUAGE_MODEL_PATH if os.path.exists(SIGN_LANGUAGE_MODEL_PATH) else LOCAL_MODEL_PATH

LABELS_DICT = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
    7: "H",
    8: "I",
    9: "J",
    10: "K",
    11: "L",
    12: "M",
    13: "N",
    14: "O",
    15: "P",
    16: "Q",
    17: "R",
    18: "S",
    19: "T",
    20: "U",
    21: "V",
    22: "W",
    23: "X",
    24: "Y",
    25: "Z",
}


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    with open(MODEL_PATH, "rb") as f:
        model_dict = pickle.load(f)

    if isinstance(model_dict, dict) and "model" in model_dict:
        return model_dict["model"]

    return model_dict


model = load_model()

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)


@app.get("/health")
def health():
    return {"status": "ok"}


def parse_base64_frame(base64_string: str) -> Optional[np.ndarray]:
    if base64_string.startswith("data:"):
        base64_string = base64_string.split(",", 1)[1]

    try:
        image_bytes = base64.b64decode(base64_string)
        buffer = np.frombuffer(image_bytes, dtype=np.uint8)
        frame = cv2.imdecode(buffer, cv2.IMREAD_COLOR)
        return frame
    except Exception:
        return None


def extract_normalized_landmarks(landmarks) -> Optional[list[float]]:
    x_values = [lm.x for lm in landmarks]
    y_values = [lm.y for lm in landmarks]

    if not x_values or not y_values:
        return None

    x_min = min(x_values)
    y_min = min(y_values)

    normalized = []
    for lm in landmarks:
        normalized.append(lm.x - x_min)
        normalized.append(lm.y - y_min)

    return normalized if len(normalized) == 42 else None


def decode_prediction(prediction) -> Optional[str]:
    if prediction is None:
        return None

    if isinstance(prediction, (np.integer, int)):
        return LABELS_DICT.get(int(prediction))

    if isinstance(prediction, str):
        return prediction.upper()

    return str(prediction).upper()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            payload = await websocket.receive_text()
            frame = parse_base64_frame(payload)

            if frame is None:
                await websocket.send_json(
                    {"prediction": None, "hand_detected": False, "error": "invalid_frame"}
                )
                continue

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)

            if not results.multi_hand_landmarks:
                await websocket.send_json({"prediction": None, "hand_detected": False})
                continue

            hand_landmarks = results.multi_hand_landmarks[0].landmark
            features = extract_normalized_landmarks(hand_landmarks)

            if features is None:
                await websocket.send_json({"prediction": None, "hand_detected": False})
                continue

            prediction = model.predict([np.asarray(features)])
            raw_result = prediction[0] if len(prediction) else None
            letter = decode_prediction(raw_result)

            await websocket.send_json(
                {
                    "prediction": letter,
                    "hand_detected": letter is not None,
                }
            )

    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close(code=1011)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000)
