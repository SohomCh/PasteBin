require('dotenv').config()
const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })
    } catch (err) {
        console.error("REAL DB ERROR:", err.message)
        process.exit(1)
    }
}

module.exports = { connect }