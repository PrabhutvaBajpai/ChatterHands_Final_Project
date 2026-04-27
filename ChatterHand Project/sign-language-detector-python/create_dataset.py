import os
import pickle

import mediapipe as mp
import cv2
import matplotlib.pyplot as plt

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# static_image_mode = True because we are processing stored images
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

DATA_DIR = './data'

data = []
labels = []

for dir_ in os.listdir(DATA_DIR):
    class_dir = os.path.join(DATA_DIR, dir_)
    
    # Skip if not a folder
    if not os.path.isdir(class_dir):
        continue
    
    for img_path in os.listdir(class_dir):

        img_full_path = os.path.join(class_dir, img_path)
        img = cv2.imread(img_full_path)

        # Skip unreadable or corrupted images
        if img is None:
            print(f"⚠️ Skipping unreadable image: {img_full_path}")
            continue

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        data_aux = []
        x_ = []
        y_ = []

        results = hands.process(img_rgb)

        if results.multi_hand_landmarks:

            # Use only the FIRST detected hand
            hand_landmarks = results.multi_hand_landmarks[0]

            # Collect raw landmark coordinates
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y

                x_.append(x)
                y_.append(y)

            # Normalize coordinates
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y

                data_aux.append(x - min(x_))
                data_aux.append(y - min(y_))

            # Ensure correct length (21 landmarks → 42 values)
            if len(data_aux) == 42:
                data.append(data_aux)
                labels.append(int(dir_))  # convert folder name to int label
            else:
                print(f"⚠️ Skipped sample in class {dir_}: incomplete landmarks")

        else:
            print(f"⚠️ No hand detected in {img_full_path}, skipping.")

# Save dataset
with open('data.pickle', 'wb') as f:
    pickle.dump({'data': data, 'labels': labels}, f)

print("✅ Dataset created successfully!")
print(f"Total samples collected: {len(data)}")
