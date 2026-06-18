import cv2
import numpy as np
import mediapipe as mp
from collections import deque
from tensorflow.keras.models import load_model

model = load_model("../models/lstm_model.h5")

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()

cap = cv2.VideoCapture(0)

sequence = deque(maxlen=30)

labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6:'G',7:'H',8:'I', 9:'J',
               10:'K', 11:'L', 12:'M', 13:'N', 14: 'O', 15:'P', 16:'Q', 17:'R', 18:'S', 19:'T', 
                20:'U', 21:'V', 22:'W',23: 'X', 24:'Y', 25:'Z'} ; 

while True:
    ret, frame = cap.read()

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if results.multi_hand_landmarks:
        hand = results.multi_hand_landmarks[0]

        x_, y_ = [], []
        for lm in hand.landmark:
            x_.append(lm.x)
            y_.append(lm.y)

        min_x, min_y = min(x_), min(y_)
        max_x, max_y = max(x_), max(y_)

        data = []
        for lm in hand.landmark:
            data.append((lm.x - min_x)/(max_x-min_x+1e-6))
            data.append((lm.y - min_y)/(max_y-min_y+1e-6))

        if len(data) == 42:
            sequence.append(data)

    if len(sequence) == 30:
        pred = model.predict(np.expand_dims(sequence, axis=0))
        label = np.argmax(pred)
        text = labels_dict[label]

        cv2.putText(frame, text, (50, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0,255,0), 3)

    cv2.imshow("LSTM Model", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()