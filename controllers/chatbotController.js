const chatbotHelper = require("../utils/chatbotHelper");

/**
 * Handles incoming chat requests, gets a response from the helper,
 * cleans it up, and returns it to the client.
 */
exports.chatWithBot = async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res
      .status(400)
      .json({ error: "userMessage is required in the request body." });
  }

  try {
    // Get raw response from the chatbot helper (e.g. Gemini)
    const rawBotResponse = await chatbotHelper.getBotResponse(userMessage);

    // Clean up the response
    const cleanedResponse = rawBotResponse
      .trim()
      .replace(/\n+/g, "\n") // Collapse multiple newlines
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .replace(/\\n/g, "\n") // Unescape literal \n
      .trim();

    // Send response
    res.status(200).json({
      response: cleanedResponse,
    });
  } catch (error) {
    console.error("Error in chatWithBot controller:", error.message);
    res.status(500).json({
      error: error.message || "Error processing chatbot request",
    });
  }
};
