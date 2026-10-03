const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/mental_health_db';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema for Mood Logging
const MoodSchema = new mongoose.Schema({
  mood: String,
  note: String,
  date: { type: Date, default: Date.now }
});
const Mood = mongoose.model('Mood', MoodSchema);

// API: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Mental Health Stack is healthy!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

// API: Get Random Wellness Tip
app.get('/api/tips', (req, res) => {
  const tips = [
    'Take a 10-minute break to breathe deeply',
    'Drink water and stay hydrated',
    'Go for a short walk outside',
    'Practice gratitude by listing 3 things you are thankful for',
    'Connect with a friend or family member'
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  res.json({ tip: randomTip });
});

// API: Get & Post Mood Logs
app.get('/api/moods', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 }).limit(10);
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/moods', async (req, res) => {
  try {
    const newMood = new Mood({ mood: req.body.mood, note: req.body.note });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧠 Mental Health App backend listening on port ${PORT}`);
});
