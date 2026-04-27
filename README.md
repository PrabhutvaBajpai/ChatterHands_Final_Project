# 🧠 ChatterHands – Sign Language Recognition System

## 📌 Overview

ChatterHands is a full-stack application that translates sign language into text using a Machine Learning model.
It combines:

* 🧠 Python-based ML model for gesture recognition
* 🌐 MERN stack (MongoDB, Express, React, Node.js) for frontend & backend
* 🎥 Real-time interaction for user-friendly communication

---

## 🚀 Features

* ✋ Real-time sign language detection
* 🧾 Converts gestures into readable text
* 🌐 Interactive frontend built with React
* 🔗 Backend API integration with Node.js & Express
* 🤖 Machine Learning model trained using Python

---

## 🏗️ Project Structure

```
ChatterHands_Final_Project/
│
├── ChatterHand Project/
│   ├── Backend/                  # Node.js + Express server
│   ├── Frontend/                # React application
│   └── sign-language-detector-python/   # ML model (Python)
│
└── README.md
```

---

## ⚙️ Setup Guide

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/PrabhutvaBajpai/ChatterHands_Final_Project.git
cd ChatterHands_Final_Project
```

---

## 🖥️ Backend Setup (Node.js)

```bash
cd "ChatterHand Project/Backend"
npm install
npm start
```

👉 Server will run on: `http://localhost:5000` (or your configured port)

---

## 🌐 Frontend Setup (React)

Open a new terminal:

```bash
cd "ChatterHand Project/Frontend"
npm install
npm start
```

👉 Frontend runs on: `http://localhost:3000`

---

# 🤖 Sign Language Detection Module

This module detects hand gestures using a Machine Learning model and converts them into text.

It follows a step-by-step ML pipeline:

```bash
collect_imgs → create_dataset → train_classifier → inference_classifier → app.py
```

---

## 🧠 What Each File Does

### 📸 `collect_imgs.py` — Collect Data

* Opens webcam
* Captures hand gesture images
* Stores them in the `Data/` folder

👉 Use this when you want to **add new gesture data**

---

### 🧹 `create_dataset.py` — Process Data

* Reads images from `Data/`
* Extracts features (hand landmarks)
* Saves processed data

👉 Output:

* `data.pickle`

---

### 🧠 `train_classifier.py` — Train Model

* Uses `data.pickle`
* Trains the machine learning model

👉 Output:

* `model.p`

---

### 🎯 `inference_classifier.py` — Test Model

* Loads trained model
* Uses webcam for real-time prediction

👉 Use this to **test accuracy**

---

### 🚀 `app.py` — Final Application

* Runs the complete system
* Used for integration with frontend/backend

---

## ⚙️ Setup Guide

### 🔹 Step 1: Go to Folder

```bash
cd "ChatterHand Project/sign-language-detector-python"
```

---

### 🔹 Step 2: Create Virtual Environment

```bash
python -m venv venv
```

---

### 🔹 Step 3: Activate Environment

#### Windows:

```bash
venv\Scripts\activate
```

#### Mac/Linux:

```bash
source venv/bin/activate
```

---

### 🔹 Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🚀 How to Run (Step-by-Step)

### ✅ First Time (Full Pipeline)

```bash
# Step 1: Collect Data
python collect_imgs.py

# Step 2: Create Dataset
python create_dataset.py

# Step 3: Train Model
python train_classifier.py

# Step 4: Test Model
python inference_classifier.py

# Step 5: Run App
python app.py
```

---

## 🎯 When to Run What?

| Situation             | What to Run            |
| --------------------- | ---------------------- |
| First time setup      | Run all steps          |
| Already trained model | Run inference or app   |
| Improve accuracy      | Collect data + retrain |
| Demo/testing          | Run inference          |

---

## 🎯 Summary

This module covers the full ML workflow:

* Data Collection
* Data Processing
* Model Training
* Real-time Testing
* Application Integration

---


---

## 📦 Requirements

### 🔹 Backend & Frontend

* Node.js (v14 or higher)
* npm

### 🔹 Python

* Python 3.8+
* OpenCV
* NumPy
* Other dependencies (in requirements.txt)

---

## ⚠️ Important Notes

* ❌ `node_modules` and `venv` are not included (install locally)
* ❌ Dataset may not be included if large
* ✅ Ensure all services are running simultaneously

---

# 🤝 Contribution Guidelines

Welcome contributors! Please follow these rules to keep the project clean, organized, and easy to collaborate on.

---

## 🌿 1. Always Work on a New Branch

❌ Do NOT push directly to `main`
✅ Always create a new branch for your work

```bash
git checkout -b your-branch-name
```

---

## 🎯 2. One Type of Work = One Branch

Each branch should focus on only **one type of work**:

* Frontend → UI changes
* Backend → API/server changes
* Sign Language → ML/data work

👉 Example:

* `frontend-header`
* `backend-auth-api`
* `sign-language-data-update`

---

## 📝 3. Follow Proper Commit Message Format

Use this format:

```bash
TYPE-ID: Short description
```

### 🔹 Types:

* `FRT` → Frontend
* `BCK` → Backend
* `SLS` → Sign Language (ML)

---

### ✅ Examples:

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

## 🚀 4. Push Your Branch (Not Main)

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

## 🧠 Simple Workflow

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


## 🧠 Future Improvements

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
