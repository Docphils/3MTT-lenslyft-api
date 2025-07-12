const { classifyIntent } = require('../utils/intentClassifier');
const { parseMoodPrompt } = require('../utils/parseMoodPrompt');
const { fetchTMDbResults } = require('../utils/fetchTMDbResults');

exports.handleAIQuery = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
  const intent = await classifyIntent(prompt);
  console.log('🧠 Intent:', intent);

  if (intent === 'chat') {
    return res.json({ message: "You're welcome! Let me know if you want a movie recommendation." });
  }

  const parsed = await parseMoodPrompt(prompt);
  console.log('📦 Parsed from OpenAI:', parsed);

  const movies = await fetchTMDbResults(parsed);
  console.log('🎬 Movies fetched:', movies.length);

  res.json({ message: parsed.message, movies });
} catch (err) {
  console.error('🔥 AI Handler Error:', err.message);
  console.error(err); // add this to see full stack trace
  res.status(500).json({ message: 'Internal Server Error' });
}

};
