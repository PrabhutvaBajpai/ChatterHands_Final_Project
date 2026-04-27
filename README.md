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

## 🤖 Python ML Setup

```bash
cd "ChatterHand Project/sign-language-detector-python"
```

### 🔸 Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

### 🔸 Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Run ML Model

```bash
python inference_classifier.py
```

👉 This will start the sign language detection system

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
