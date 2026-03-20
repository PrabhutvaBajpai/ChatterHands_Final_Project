import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow large image data

// API route to receive image and forward to Python backend
app.post("/api/predict", async (req, res) => {
  const { image } = req.body;

  try {
    // Forward the image to Python Flask API
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error connecting to Python API" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Node.js backend running on port ${PORT}`);
});
