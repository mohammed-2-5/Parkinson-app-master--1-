require("dotenv").config(); // Ensure environment variables are loaded
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- Gemini Configuration ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash"; // Or your preferred model

// --- Input Validation & Error Handling ---
if (!GEMINI_API_KEY) {
  throw new Error(
    "FATAL ERROR: GEMINI_API_KEY is not defined in the environment variables. Please check your .env file."
  );
}

// --- Initialize Gemini Client (do this once) ---
let model;
try {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: MODEL_NAME });
  console.log(`Gemini Helper: Initialized model ${MODEL_NAME} successfully.`);
} catch (error) {
  console.error(
    "Gemini Helper: Failed to initialize GoogleGenerativeAI:",
    error
  );
  throw new Error(
    "FATAL ERROR: Could not initialize Gemini Client. Check API Key and configuration."
  );
}

// Store conversation context
let conversationHistory = [];

/**
 * Gets a response from the Gemini model based on the user's message.
 * @param {string} userMessage - The message input from the user.
 * @returns {Promise<string>} - A promise that resolves with the bot's text response.
 */
exports.getBotResponse = async (userMessage) => {
  if (!model) {
    console.error("Gemini Helper: Model not initialized.");
    throw new Error("Gemini model is not available.");
  }

  if (typeof userMessage !== "string" || userMessage.trim() === "") {
    console.warn("Gemini Helper: Received empty or invalid user message.");
    throw new Error("User message cannot be empty.");
  }

  console.log(`Gemini Helper: Sending to Gemini: "${userMessage}"`);

  try {
    // Append the user message to the conversation history
    conversationHistory.push({ role: "user", content: userMessage });

    // Combine conversation history into a single prompt for the model
    const conversationPrompt = conversationHistory
      .map((entry) => `${entry.role}: ${entry.content}`)
      .join("\n");

    const result = await model.generateContent(conversationPrompt);
    const response = result.response;
    const botReply = await response.text(); // ✅ تم التعديل هنا

    console.log(`Gemini Helper: Received from Gemini: "${botReply}"`);

    // Append bot reply
    conversationHistory.push({ role: "bot", content: botReply });

    return botReply;
  } catch (error) {
    console.error("Gemini Helper: Error during Gemini API call:", error);

    if (error.message.includes("API key not valid")) {
      throw new Error("Authentication error with Gemini API Key.");
    } else if (
      error.response &&
      error.response.promptFeedback &&
      error.response.promptFeedback.blockReason
    ) {
      console.warn(
        `Gemini Helper: Response blocked due to ${error.response.promptFeedback.blockReason}`
      );
      throw new Error(
        `Response blocked due to safety settings (${error.response.promptFeedback.blockReason}).`
      );
    }

    throw new Error("Failed to get response from chatbot API.");
  }
};
