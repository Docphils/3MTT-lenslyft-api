const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Parses a user's movie request into genres, keywords, and a friendly message.
 * @param {string} prompt
 * @returns {Object} { genres: [], keywords: [], message: string }
 */
async function parseMoodPrompt(prompt) {
  const completion = await openai.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content: `
Given a user's movie request, extract:
- genres: array of movie genres (e.g. ["Comedy", "Romance"])
- keywords: array of 2–4 descriptive keywords (e.g. ["lighthearted", "funny", "feel-good"])
- message: a friendly, short suggestion response like a movie assistant would say

Return JSON with "genres", "keywords", and "message". No other text.
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 150,
  });

  let response = completion.choices[0].message.content;

  try {
    const parsed = JSON.parse(response);
    return {
      genres: parsed.genres || [],
      keywords: parsed.keywords || [],
      message: parsed.message || "Here are some recommendations you might like!",
    };
  } catch (err) {
    console.error('Failed to parse OpenAI response:', response);
    throw new Error('AI response could not be parsed as JSON.');
  }
}

module.exports = { parseMoodPrompt };
