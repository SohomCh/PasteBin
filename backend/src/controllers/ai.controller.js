const { aiAssistant } = require("../services/ai.services");

async function aiAssistantController(req, res) {
    try {

        const { content, action } = req.body;

        // Optional: will use this later for rate limiting / AI history
        const { userId } = req.user;

        const response = await aiAssistant(
            content,
            action
        );

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {

        console.error(
            "AI Controller Error:",
            error.message
        );

        return res.status(400).json({
            success: false,
            error: error.message
        });

    }
}

module.exports = {
    aiAssistantController
};