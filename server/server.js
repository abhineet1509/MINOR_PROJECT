import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 4000;

// MongoDB connection
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://minor-project-1-8bxi.onrender.com'
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in the environment variables");
}

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    console.log("User message:", userMessage);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBXr2yADayO0cxm5vx_MTenJ5pm31vA3G8`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    console.log("Response status:", response.status);  // Log status code for debugging
    const data = await response.json();
    console.log("API response:", data);  // Log response data for debugging

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ response: aiText });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error fetching from Gemini API" });
  }
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));
