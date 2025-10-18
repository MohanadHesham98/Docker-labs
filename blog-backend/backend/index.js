const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// login API
app.post('/api/login', (req, res) => {
  console.log("Request received at backend:", req.body); // ← هذا السطر
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      if (results.length > 0) {
        res.json({ message: 'Login succeed' });
      } else {
        res.json({ message: 'Not in our DB' });
      }
    }
  );
});


app.listen(5000, () => console.log('Backend running on port 5000'));
