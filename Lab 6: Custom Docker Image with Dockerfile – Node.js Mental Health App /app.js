const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Mental Health App is running!',
    timestamp: new Date()
  });
});

// Wellness tips endpoint
app.get('/api/tips', (req, res) => {
  const tips = [
    'Take a 10-minute break to breathe deeply',
    'Drink water and stay hydrated',
    'Go for a short walk outside',
    'Practice gratitude by listing 3 things you are thankful for',
    'Connect with a friend or family member',
    'Practice meditation for 5 minutes',
    'Stretch your body and relax your muscles',
    'Limit your screen time',
    'Get 7-8 hours of sleep',
    'Engage in a hobby you enjoy'
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  res.json({ tip: randomTip });
});

// Mood tracker endpoint
app.get('/api/mood/:mood', (req, res) => {
  const mood = req.params.mood.toLowerCase();

  const responses = {
    happy: "That's wonderful! Keep shining! ✨",
    sad: "It's okay to feel down. Remember, you're not alone. 💙",
    anxious: "Take a deep breath. You've got this! 🌿",
    stressed: "Let's work through this together. Try meditation. 🧘",
    calm: "Enjoy this peaceful moment. 🌸",
    tired: "Rest is important. Take care of yourself. 😴"
  };

  const message =
    responses[mood] || 'Thank you for sharing your mood with us!';

  res.json({ mood, message });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧠 Mental Health App is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💡 Wellness tips: http://localhost:${PORT}/api/tips`);
});
