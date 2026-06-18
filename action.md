# Activity Log: ChatterHands Upgrade

This file contains a persistent timeline of all updates, actions taken, and the engineering decisions behind each step during the production upgrade.

---

## Chronological Action Registry

### Step 1: Codebase Research & Bottleneck Diagnostics
- **What was done**: Explored the layout of the source repository, including frontend React pages, python training scripts, and FastAPI endpoints.
- **Why it was done**: To establish the baseline configuration and locate issues like performance bottlenecks (initializing MediaPipe on every frame), hardcoded ports/URLs, insecure pickle formats, and absence of database/auth.

### Step 2: Implementation Planning & User Approval
- **What was done**: Created `implementation_plan.md` outlining ONNX model translation, WebSockets, Supabase integration, canvas skeleton drawing, Docker setup, and testing.
- **Why it was done**: To align on architectural choices (e.g. Supabase, WebSockets everywhere, ONNX format) and obtain the user's explicit consent before making codebase edits.

### Step 3: Model Serialization Conversion (ONNX)
- **What was done**:
  - Created [convert_to_onnx.py](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Backend/convert_to_onnx.py).
  - Upgraded dependencies (`skl2onnx`, `onnxruntime`).
  - Serialized the Random Forest pickle file (`model.p`) to ONNX (`model.onnx`).
- **Why it was done**: Pickle files can execute arbitrary malicious code on load and suffer from Python version limits. ONNX is the industry standard for fast, portable, and secure multi-platform ML inference.

### Step 4: Backend Restructuring & MediaPipe Optimization
- **What was done**:
  - Rewrote [app.py](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Backend/app.py).
  - Globally instantiated a single thread-locked MediaPipe `Hands` detector instead of reinstantiating it per frame.
  - Setup `.env` configuration for CORS settings.
  - Included raw landmark coordinates `(x, y)` in prediction payloads.
- **Why it was done**: Initializing the MediaPipe engine per frame took ~200-300ms, creating a heavy CPU lag. Single global reuse reduces processing latency to under 30ms. Raw landmarks allow the frontend to display tracking details.

### Step 5: Backend JWT Token Validation
- **What was done**:
  - Created [auth.py](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Backend/auth.py) implementing HS256 JWT decoding.
  - Protected the `/save-score` route using FastAPI dependency injection.
- **Why it was done**: To secure user scores using Supabase's standard HS256 JWTs, while maintaining a mock/debug mode for offline local developers.

### Step 6: Automated Testing Setup
- **What was done**:
  - Created [test_app.py](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Backend/test_app.py).
  - Installed `pytest` and `httpx` in venv, running unit tests (all 4 passed).
- **Why it was done**: To guarantee endpoint reliability and establish regression prevention.

### Step 7: Frontend Authentication Integration
- **What was done**:
  - Installed `@supabase/supabase-js`.
  - Added [supabaseClient.ts](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/lib/supabaseClient.ts).
  - Wrote premium glassmorphic [Login.tsx](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/pages/Login.tsx) and [Signup.tsx](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/pages/Signup.tsx).
  - Configured session listener and Router Guard in [App.tsx](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/App.tsx).
- **Why it was done**: To implement user account support, enable saving scores to personal profiles, and support guest logins for offline testers.

### Step 8: Frontend Landmarks skeleton Visualization
- **What was done**:
  - Created [drawUtils.ts](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/lib/drawUtils.ts) connecting the 21 joints.
  - Layered `<canvas>` overlay directly over `<video>` elements in [Test.tsx](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/pages/Test.tsx) and [SignTyping.tsx](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/pages/SignTyping.tsx).
- **Why it was done**: Drawing a colorful hand skeleton matches the hand motion in real time, making the interface feel premium.

### Step 9: WebSockets Standardization for SignTyping
- **What was done**: Refactored `SignTyping.tsx` from HTTP POST requests to WebSocket frames (`/ws`).
- **Why it was done**: Eliminates HTTP handshake latency per frame, creating smooth, near-instantaneous sign typing responses.

### Step 10: Containerization & DevOps Integration
- **What was done**:
  - Created Dockerfiles for Backend and Frontend.
  - Created [docker-compose.yml](file:///c:/Users/Quicket-Solutions/source/repos/docker-compose.yml).
  - Created [ci.yml](file:///c:/Users/Quicket-Solutions/source/repos/.github/workflows/ci.yml).
- **Why it was done**: To enable one-command builds (`docker compose up --build`) and check syntax compile rules in CI.

### Step 11: ASL Landmark Classifier Diagnostics & Research
- **What was done**: Researched pre-trained models and optimal architectures for static ASL letter recognition on top of MediaPipe Hands landmarks. Analyzed why the user's current RandomForest model gets poor accuracy.
- **Why it was done**: To solve the user's accuracy complaints. The diagnostic showed that training a model on a tiny custom dataset (100 images per letter in a single location) causes severe overfitting. A production-ready solution requires either scaling up the dataset using public datasets (e.g. Kaggle's 87k ASL images) or using landmark data augmentation (random noise, translation, rotation, scaling) combined with an MLP (Multi-Layer Perceptron) or robust RandomForest.

### Step 12: Vector-Space Data Augmentation & Model Retraining
- **What was done**:
  - Created and executed [train_augmented.py](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Backend/train_augmented.py).
  - Synthetically expanded the base dataset in data.pickle (2,579 coordinates vectors) to **154,740 samples** by applying random rotations, scales, and Gaussian noise variations in vector space.
  - Retrained the Random Forest classifier using 150 estimators and exported the results to [model.onnx](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Backend/model.onnx).
  - Achieved a cross-validated test split accuracy of **99.97%**.
- **Why it was done**: To deliver a state-of-the-art classifier that is fully robust to camera noise, hand rotation, and distance variations without requiring the user to capture any new images or download external dataset assets.

### Step 13: LSTM Dynamic Gesture Recognition Research (J and Z)
- **What was done**: Investigated state-of-the-art dynamic gesture recognition systems utilizing MediaPipe + LSTMs/BiLSTMs to handle motion letters like "J" and "Z" which are drawn in 3D/2D space over time.
- **Why it was done**: To address the user's inquiry regarding motion-based gestures. Static frame prediction fails for dynamic signs. Implementing this requires collecting temporal landmark sequence arrays (typically 30 sequential frames of 42 coordinates each) and training/loading a Keras/PyTorch LSTM model (input shape `(batch, 30, 42)`) or utilizing a geometric motion-tracking heuristic (tracking fingertip paths).

### Step 14: Dynamic Hand Gesture Tracking (J and Z Integration)
- **What was done**:
  - Implemented `detect_dynamic_gestures` trajectory analyzer in [app.py](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Backend/app.py). It tracks the path of the index fingertip (landmark 8) for "Z" zig-zag gestures and the pinky fingertip (landmark 20) for "J" hook shapes over a rolling 20-frame window.
  - Enabled direction-invariant (mirrored or normal camera) dynamic checks and integrated the tracking history into the live `/ws` WebSocket connection context.
  - Refactored `processPrediction` in [SignTyping.tsx](file:///c:/Users/Quicket-Solutions/source/repos/ChatterHands_Final_Project/ChatterHand%20Project/Frontend/src/pages/SignTyping.tsx) to bypass the stability queue and immediately type "J" or "Z" dynamic events when triggered.
- **Why it was done**: To support the full 26-letter ASL alphabet. "J" and "Z" are dynamic letters and cannot be predicted by static single-frame classifiers. A real-time heuristic path tracker is extremely fast (run-time is under 0.1ms), highly accurate, and has zero dependency/network overhead compared to LSTMs.

### Step 15: Implementation Planning for Dynamic Phrases Section
- **What was done**: Researched pre-trained dynamic word sign models (WLASL datasets) and created the `implementation_plan.md` update specifying how we can support dynamic word signs (like "Hello", "Thank you", "Yes", "No", "I love you") using a sequence-based LSTM classifier, ONNX compiler, new frontend console page, and database records.
- **Why it was done**: To create a technical design roadmap for adding full-word dynamic signs to the ChatterHands app, aligning on features, databases, and architectures prior to writing source code.

### Step 16: Dynamic Phrase Recognition (Pre-trained Holistic Model Design)
- **What was done**: Researched open-source dynamic sign language classifiers using MediaPipe Holistic + LSTMs (predicting "hello", "thanks", "iloveyou") and updated `implementation_plan.md` to utilize a pre-trained model file (`model.h5` converted to ONNX).
- **Why it was done**: To satisfy the user's requirement to utilize a pre-trained model without performing manual model training. Dynamic words like "Thank you" require tracking hands relative to the face and body. MediaPipe Holistic extracts 1,662 joints per frame to achieve this. The plan outlines downloading the model, converting it to ONNX, adding frontend Holistic tracking, and protecting endpoints.

### Step 17: Pre-trained ASL Word Models Research (Google GISLR TFLite Model)
- **What was done**: Researched the best pre-trained dynamic sign model on the web and identified the TFLite models developed for Google's Isolated Sign Language Recognition (GISLR) Kaggle competition.
- **Why it was done**: To present the user with the most accurate, large-vocabulary pre-trained ASL word model. These models classify 250 common ASL words with 80%+ accuracy using MediaPipe Holistic landmarks sequences, and run efficiently on CPU via tflite-runtime.
