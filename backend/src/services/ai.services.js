const Groq=require('groq-sdk')

const groq=new Groq({
    apiKey:process.env.GROQ_API_KEY,
});

const VALID_ACTIONS = [
    "explain",
    "summarize",
    "improve",
    "debug",
    "optimize"
];

function buildPrompt(content, action) {

    switch (action) {

        case "explain":
            return `
You are an expert software engineer and technical writer.

First determine whether the provided content is source code or plain text.

If it is source code:
- Explain what the code does.
- Explain the logic step by step.
- Mention Time Complexity (if applicable).
- Mention Space Complexity (if applicable).
- Point out possible bugs or edge cases.
- Suggest improvements.

If it is plain text:
- Explain the content clearly.
- Mention the key idea.
- Highlight important points.

Keep the response well structured.

Content:

${content}
`;

        case "summarize":
            return `
Summarize the following content.

If it is code, summarize what the code does.

If it is text, summarize the important points.

Content:

${content}
`;

        case "improve":
            return `
Improve the following content.

If it is code:
- Improve readability.
- Suggest better variable names.
- Suggest best practices.

If it is plain text:
- Improve grammar.
- Improve clarity.
- Keep the original meaning.

Content:

${content}
`;

        case "debug":
            return `
Analyze the following code.

- Find possible bugs.
- Explain why they occur.
- Suggest fixes.

If the content is not code, politely explain that debugging is only applicable to code.

Content:

${content}
`;

        case "optimize":
            return `
Optimize the following content.

If it is code:
- Improve performance.
- Improve readability.
- Suggest better algorithms.

If it is plain text:
- Make it shorter while preserving meaning.

Content:

${content}
`;

        default:
            throw new Error("Invalid AI action");
    }
}

async function aiAssistant(content, action) {

    if (!content || content.trim() === "") {
        throw new Error("Content is required");
    }

    if (!action) {
        throw new Error("Action is required");
    }

    if (!VALID_ACTIONS.includes(action)) {
        throw new Error("Invalid AI action");
    }

    const prompt = buildPrompt(content, action);

    try {

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3
        });

        return completion.choices[0].message.content;

    }
   catch (error) {

    console.error("Groq Error:", error);

    throw new Error("Failed to generate AI response");

}

}

module.exports = {
    aiAssistant
};