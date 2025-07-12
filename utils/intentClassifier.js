const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Classifies user input as "search" or "chat".
 */
async function classifyIntent(prompt) {
  const completion = await openai.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content:
          'Classify the user message strictly as either "search" (if requesting a movie suggestion) or "chat" (if it’s just small talk or unrelated). Respond only with "search" or "chat".',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0,
    max_tokens: 10,
  });

  const intent = completion.choices[0].message.content.trim().toLowerCase();

  if (intent === 'search' || intent === 'chat') {
    return intent;
  } else {
    // Default to search if response is unexpected
    return 'search';
  }
}

module.exports = { classifyIntent };
