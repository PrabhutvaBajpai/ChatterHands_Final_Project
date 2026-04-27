import pickle
import cv2
import mediapipe as mp
import numpy as np
from collections import deque

# Load trained model
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

# Webcam
cap = cv2.VideoCapture(0)

# Mediapipe hands (dynamic mode for real-time)
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Labels
labels_dict = {0:'A', 1:'B', 2:'C'}; 

# labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6:'G',7:'H',8:'I', 9:'J',
#                10:'K', 11:'L', 12:'M', 13:'N', 14: 'O', 15:'P', 16:'Q', 17:'R', 18:'S', 19:'T', 
#                 20:'U', 21:'V', 22:'W',23: 'X', 24:'Y', 25:'Z'} ; 

# For smoothing predictions
prediction_queue = deque(maxlen=5)

while True:
    data_aux = []
    x_ = []
    y_ = []

    ret, frame = cap.read()
    if not ret:
        print("⚠ Unable to read camera")
        break

    H, W, _ = frame.shape
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if results.multi_hand_landmarks:
        hand_landmarks = results.multi_hand_landmarks[0]

        # Draw landmarks
        mp_drawing.draw_landmarks(
            frame,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS,
            mp_drawing_styles.get_default_hand_landmarks_style(),
            mp_drawing_styles.get_default_hand_connections_style()
        )

        # Extract normalized coordinates
        for lm in hand_landmarks.landmark:
            x_.append(lm.x)
            y_.append(lm.y)

        for lm in hand_landmarks.landmark:
            data_aux.append(lm.x - min(x_))
            data_aux.append(lm.y - min(y_))

        # Ensure we have correct data length (21 landmarks × 2)
        if len(data_aux) != 42:
            continue

        # Predict
        prediction = model.predict([np.asarray(data_aux)])
        pred_letter = labels_dict[int(prediction[0])]

        # Add to smoothing queue
        prediction_queue.append(pred_letter)

        # Get most frequent recent prediction
        final_prediction = max(set(prediction_queue), key=prediction_queue.count)

        # Bounding box
        x1 = int(min(x_) * W) - 10
        y1 = int(min(y_) * H) - 10
        x2 = int(max(x_) * W) + 10
        y2 = int(max(y_) * H) + 10

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 3)
        cv2.putText(
            frame, final_prediction, (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 1.6, (0, 0, 0), 3
        )

    cv2.imshow("Hand Gesture Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
