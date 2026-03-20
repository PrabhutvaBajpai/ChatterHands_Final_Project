import os
import cv2
import mediapipe as mp
import argparse

# --- Function to process each frame ---
def process_img(img, face_detection):
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = face_detection.process(img_rgb)

    H, W, _ = img.shape

    if results.detections:
        for detection in results.detections:
            bboxC = detection.location_data.relative_bounding_box
            x1, y1, w, h = bboxC.xmin, bboxC.ymin, bboxC.width, bboxC.height

            # Convert relative coordinates to absolute pixel values
            x1 = int(x1 * W)
            y1 = int(y1 * H)
            w = int(w * W)
            h = int(h * H)

            # Keep bounding box inside image
            x1 = max(0, x1)
            y1 = max(0, y1)
            w = min(w, W - x1)
            h = min(h, H - y1)

            # Apply blur
            img[y1:y1+h, x1:x1+w] = cv2.blur(img[y1:y1+h, x1:x1+w], (30, 30))

    return img


# --- Argument parser ---
parser = argparse.ArgumentParser()
parser.add_argument("--mode", default='video')
parser.add_argument("--filePath", default='./data/testVideo.mp4')
args = parser.parse_args()

# --- Output directory setup ---
output_dir = './output'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# --- Initialize MediaPipe Face Detection ---
mp_face_detection = mp.solutions.face_detection

with mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5) as face_detection:
    if args.mode == 'video':
        cap = cv2.VideoCapture(args.filePath)

        if not cap.isOpened():
            print("Error: Could not open video file!")
            exit()

        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # Define output video writer
        output_path = os.path.join(output_dir, 'blurred_output.mp4')
        out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

        print(f"Processing video... Saving to {output_path}")

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Process the frame
            processed_frame = process_img(frame, face_detection)

            # Write to output video
            out.write(processed_frame)

            # (Optional) Display in smaller window
            display_frame = cv2.resize(processed_frame, (800, 600))
            cv2.imshow("Blurred Video", display_frame)

            # Press 'q' to stop early
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        out.release()
        cv2.destroyAllWindows()

        print("✅ Video processing complete!")

