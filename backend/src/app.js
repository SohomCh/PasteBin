require("dotenv").config()

const express = require("express")
const rateLimit = require("express-rate-limit")
const cors = require("cors")

const app = express()

// ROUTES

const pasteRoutes = require("./routes/paste.routes")
const authRoutes = require("./routes/auth.routes")


// ---------------- MIDDLEWARE ----------------

// CORS

app.use(
    cors({
        origin: "http://localhost:5173"
    })
)

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


// ---------------- DB CONNECTION ----------------

const { connect } = require("./models/connect")

connect()
    .then(() => {

        console.log("DB Connected")

        app.listen(8000, () => {
            console.log("Server running on port 8000")
        })

    })
    .catch(err => {
        console.error(
            "DB connection failed:",
            err.message
        )
    })