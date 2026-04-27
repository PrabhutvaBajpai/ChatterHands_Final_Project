import os
import cv2

DATA_DIR = './data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

number_of_classes = 3
dataset_size = 100

cap = cv2.VideoCapture(0)
for j in range(number_of_classes):
    if not os.path.exists(os.path.join(DATA_DIR, str(j))):
        os.makedirs(os.path.join(DATA_DIR, str(j)))

    print('Collecting data for class {}'.format(j))

    done = False
    while True:
        ret, frame = cap.read()
        cv2.putText(frame, 'Ready? Press "Q" ! :)', (100, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3,
                    cv2.LINE_AA)
        cv2.imshow('frame', frame)
        if cv2.waitKey(25) == ord('q'):
            break

    counter = 0
    while counter < dataset_size:
        ret, frame = cap.read()
        cv2.imshow('frame', frame)
        cv2.waitKey(25)
        cv2.imwrite(os.path.join(DATA_DIR, str(j), '{}.jpg'.format(counter)), frame)

        counter += 1

cap.release()
cv2.destroyAllWindows()

# import os
# import cv2

# DATA_DIR = './data'
# if not os.path.exists(DATA_DIR):
#     os.makedirs(DATA_DIR)

# number_of_classes = 3
# dataset_size = 100

# # Try multiple camera indices
# for cam_index in range(3):
#     cap = cv2.VideoCapture(cam_index)
#     if cap.isOpened():
#         print(f"✅ Using camera index {cam_index}")
#         break
# else:
#     print("❌ No working camera found. Exiting...")
#     exit()

# for j in range(number_of_classes):
#     class_path = os.path.join(DATA_DIR, str(j))
#     if not os.path.exists(class_path):
#         os.makedirs(class_path)

#     print(f'📸 Collecting data for class {j}')
#     print('Press "Q" to start capturing...')

#     # Wait for user to press Q to start
#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             print("⚠️ Frame not captured, retrying...")
#             continue

#         cv2.putText(frame, 'Ready? Press "Q" to start!', (50, 50),
#                     cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
#         cv2.imshow('frame', frame)
#         if cv2.waitKey(25) & 0xFF == ord('q'):
#             break

#     counter = 0
#     while counter < dataset_size:
#         ret, frame = cap.read()
#         if not ret:
#             print("⚠️ Skipping empty frame...")
#             continue

#         cv2.imshow('frame', frame)
#         cv2.waitKey(25)
#         cv2.imwrite(os.path.join(class_path, f'{counter}.jpg'), frame)
#         counter += 1

# cap.release()
# cv2.destroyAllWindows()
