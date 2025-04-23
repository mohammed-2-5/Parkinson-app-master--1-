const axios = require("axios");

const generatePrediction = async (symptoms) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo",
        prompt: `Given these symptoms: ${symptoms}, what could be the potential diagnosis?`,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    throw new Error("AI prediction failed: " + error.message);
  }
};

module.exports = { generatePrediction };
