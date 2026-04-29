# ChatterHands – Sign Language Recognition System

## Overview

ChatterHands is a full-stack application that translates sign language into text using a machine learning model.
It combines:

* a Python-based ML module for gesture recognition
* a React frontend built with Vite
* a FastAPI backend to serve predictions and connect the model to the UI
* real-time interaction for a responsive user experience

---

## Features

* real-time sign language detection
* gesture-to-text translation
* interactive React user interface
* FastAPI backend integration
* machine learning model trained and packaged in Python

---

## Project Structure

```
ChatterHands_Final_Project/
│
├── ChatterHand Project/
│   ├── Backend/                        # FastAPI backend loading the trained model
│   ├── Frontend/                       # Vite + React frontend application
│   └── sign-language-detector-python/  # ML data collection, dataset creation, training, and model files
│
└── README.md
```

---

## Setup Guide

### 1. Clone the repository

```bash
git clone https://github.com/PrabhutvaBajpai/ChatterHands_Final_Project.git
cd ChatterHands_Final_Project
```

---

## Backend Setup (Python + FastAPI)

```bash
cd "ChatterHand Project/Backend"
python -m venv venv
venv\Scripts\activate  # on Windows
# or source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend runs on: `http://localhost:8000`

---

## Frontend Setup (React + Vite)

Open a new terminal:

```bash
cd "ChatterHand Project/Frontend"
npm install
npm run dev
```

The frontend runs on the port shown by Vite, typically `http://localhost:5173`.

---

## Sign Language Detection Module

This module detects hand gestures using a machine learning model and converts them into text.

The workflow is:

```bash
collect_imgs → create_dataset → train_classifier → inference_classifier → app.py
```

---

## What Each File Does

### `collect_imgs.py` — collect data

* opens the webcam
* captures hand gesture images
* stores images in the `data/` folder

Use this to add new training examples.

---

### `create_dataset.py` — process data

* loads images from `data/`
* extracts hand landmark features
* saves processed examples for training

Output:

* `data.pickle`

---

### `train_classifier.py` — train model

* loads `data.pickle`
* trains the classifier

Output:

* `model.p`

---

### `inference_classifier.py` — test model

* loads the trained model
* uses the webcam for real-time prediction

Use this to verify model accuracy before integrating with the frontend.

---

### `app.py` — FastAPI integration

* runs the inference service
* receives webcam frames from the frontend
* performs landmark extraction and prediction
* returns the predicted sign

---

## ML Module Setup

### Step 1: go to the Python folder

```bash
cd "ChatterHand Project/sign-language-detector-python"
```

---

### Step 2: create a virtual environment

```bash
python -m venv venv
```

---

### Step 3: activate the environment

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

---

### Step 4: install Python dependencies

```bash
pip install -r requirements.txt
```

---

## How to Run the Full Pipeline

### First time setup

```bash
# collect training images
python collect_imgs.py

# prepare the dataset
python create_dataset.py

# train the model
python train_classifier.py

# test the model with webcam input
python inference_classifier.py

# launch the FastAPI service
python app.py
```

---

## When to Run What

| Situation                | What to Run                          |
|-------------------------|--------------------------------------|
| first time setup        | run full pipeline                    |
| model already trained   | run `inference_classifier.py` or `app.py` |
| improve accuracy        | collect more data and retrain        |
| demo/testing            | run `inference_classifier.py`        |

---

## Summary

This project includes the full machine learning workflow:

* data collection
* data processing
* model training
* real-time testing
* application integration

---

## Requirements

### Backend and frontend

* Node.js
* npm

### Python module

* Python 3.8 or higher
* OpenCV
* NumPy
* other dependencies listed in `requirements.txt`

---

## Important Notes

* `node_modules/` and `venv/` are not included in the repository
* the dataset and model files may not be included if they are large
* run the backend and frontend services at the same time for the application to work

---

## Contribution Guidelines

Follow these rules to keep the repository organized and easy to contribute to.

### 1. work on a new branch

Do not push directly to `main`.

```bash
git checkout -b your-branch-name
```

---

### 2. keep each branch focused

Use a separate branch for each type of work:

* frontend changes
* backend/API changes
* machine learning or dataset work

---

### 3. use clear commit messages

A consistent format helps reviewers understand your changes.

Examples:

```bash
FRT-1: added header component
BCK-1: created API endpoint
SLS-1: updated training data
```

---

### 4. push your branch

```bash
git push origin your-branch-name
```

---

### 5. do not merge your own branch

Leave merges to reviewers so the code can be checked first.

---

### 6. keep code clean

* do not commit `node_modules/`
* do not commit `venv/`
* do not commit secrets or `.env` files

---

## Future improvements

* deploy the model to cloud services
* add text-to-speech output
* improve model accuracy with additional data
* add mobile support

---

## Author

**Prabhutva Bajpai**

---

## If you like this project

Give it a star on GitHub.


❌ Do NOT push directly to `main`
✅ Always create a new branch for your work

```bash
git checkout -b your-branch-name
```

---

##  2. One Type of Work = One Branch

Each branch should focus on only **one type of work**:

* Frontend → UI changes
* Backend → API/server changes
* Sign Language → ML/data work

👉 Example:

* `frontend-header`
* `backend-auth-api`
* `sign-language-data-update`

---

##  3. Follow Proper Commit Message Format

Use this format:

```bash
TYPE-ID: Short description
```

### 🔹 Types:

* `FRT` → Frontend
* `BCK` → Backend
* `SLS` → Sign Language (ML)

---

###  Examples:

```bash
FRT-1: Added header component
BCK-1: Created login API
SLS-1: Added new training data
```

👉 Keep messages:

* Short
* Clear
* Meaningful

---

##  4. Push Your Branch (Not Main)

```bash
git push origin your-branch-name
```

---

## 🔒 5. Do NOT Merge Your Own Code

❌ Don’t merge your branch into `main` yourself

👉 Someone else will:

* Review your code
* Test it
* Merge it

---

## 📌 6. Keep Code Clean

* Follow proper folder structure
* Do not upload:

  * `node_modules/`
  * `venv/`
  * `.env` files

---

##  Simple Workflow

```bash
Create branch → Make changes → Commit properly → Push → Wait for review → Merge
```

---

## 🎯 Goal

These rules help us:

* Avoid conflicts
* Keep code organized
* Work like a real development team

---


##  Future Improvements

* Deploy model to cloud (AWS/GCP)
* Add speech output (Text → Voice)
* Improve model accuracy with more data
* Mobile app integration

---

## 👨‍💻 Author

**Prabhutva Bajpai**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!

Happy Coding 🚀
