import os
import cv2
import mediapipe as mp
import numpy as np

DATA_DIR = '../data'
SEQUENCE_LENGTH = 30
NUM_CLASSES = 26  # start small
SAMPLES_PER_CLASS = 50

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1)

cap = cv2.VideoCapture(0)

for label in range(NUM_CLASSES):
    class_dir = os.path.join(DATA_DIR, str(label))
    os.makedirs(class_dir, exist_ok=True)

    print(f"\nCollecting class {label}")
    input("Press ENTER to start...")

    for sample in range(SAMPLES_PER_CLASS):
        sequence = []

        while len(sequence) < SEQUENCE_LENGTH:
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
                    data.append((lm.x - min_x) / (max_x - min_x + 1e-6))
                    data.append((lm.y - min_y) / (max_y - min_y + 1e-6))

                if len(data) == 42:
                    sequence.append(data)

            cv2.imshow("Collecting", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        np.save(os.path.join(class_dir, f"{sample}.npy"), sequence)

cap.release()
cv2.destroyAllWindows()