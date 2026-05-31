require("dotenv").config()

const express = require("express")
const rateLimit = require("express-rate-limit")

const app = express()

// ROUTES
const pasteRoutes = require("./routes/paste.routes")
const authRoutes = require("./routes/auth.routes")


// ---------------- MIDDLEWARE ----------------

// JSON parser
app.use(express.json())


// Rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: {
        success: false,
        error: "Too many requests, please try again later"
    }
})

// apply globally
app.use(limiter)


// ---------------- TEST ROUTE ----------------

app.get("/", (req, res) => {
    res.send("Server running")
})


// ---------------- ROUTES ----------------

// Paste routes
app.use("/", pasteRoutes)

// Auth routes
app.use("/auth", authRoutes)


// ---------------- DB CONNECTION ----------------

const { connect } = require("./models/connect")

connect()
    .then(() => {
        app.listen(8000, () => {
        })
    })
    .catch(err => {
        console.error("DB connection failed:", err.message)
    })