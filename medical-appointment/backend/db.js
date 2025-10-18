const mysql = require('mysql2');

// إنشاء pool
const db = mysql.createPool({
  host: 'med_db',        // اسم الـ service في Docker Compose
  user: 'meduser',
  password: 'medpass',
  database: 'medical',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;  // بدون .promise()

