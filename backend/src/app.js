require("dotenv").config()

const express = require("express")
const rateLimit = require("express-rate-limit")
const cors = require("cors")

const app = express()

// ROUTES

const pasteRoutes = require("./routes/paste.routes")
const authRoutes = require("./routes/auth.routes")
const aiRoutes=require("./routes/ai.routes");

// ---------------- MIDDLEWARE ----------------

// CORS

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://paste-vault-taupe.vercel.app"
        ]
    })
);
// JSON Parser

app.use(express.json())

// Rate Limiter

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: {
        success: false,
        error: "Too many requests, please try again later"
    }
})

// Apply Globally

app.use(limiter)


// ---------------- TEST ROUTE ----------------

app.get("/", (req, res) => {
    res.send("Server running")
})


// ---------------- ROUTES ----------------

// Paste Routes

app.use("/", pasteRoutes)

// Auth Routes

app.use("/auth", authRoutes)

//AI Routes
app.use("/ai",aiRoutes)


// ---------------- DB CONNECTION ----------------

const { connect } = require("./models/connect")

connect()
    .then(() => {
        console.log("DB Connected");

        const PORT = process.env.PORT || 8000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(
            "DB connection failed:",
            err.message
        );
    });