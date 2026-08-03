const express = require("express");
const router = express.Router();

const {authMiddleware} = require("../middlewares/auth.middleware");

const {
    aiAssistantController
} = require("../controllers/ai.controller");

console.log("authMiddleware:", authMiddleware);
console.log("aiAssistantController:", aiAssistantController);

router.post(
    "/chat",
    authMiddleware,
    aiAssistantController
);

module.exports = router;