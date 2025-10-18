# 🏥 Medical Appointment System

A complete, containerized web application for booking medical appointments. This project demonstrates frontend–backend–database–reverse proxy integration using Docker Compose across two virtual machines (VMs).

## 🧠 Overview

### 🎯 Features

- Browse doctors and specialties 🩺
- View available appointment slots ⏰
- Book appointments instantly 🧾
- Backend API built with Node.js + Express
- Database using MySQL (persistent storage)
- Frontend served via NGINX (reverse proxy)
- Fully containerized with Docker Compose

### 🧩 Architecture

| VM | Role | Components |
| --- | --- | --- |
| VM1 | Backend + Database | Node.js (API) + MySQL |
| VM2 | Frontend + Reverse Proxy | HTML/CSS/JS + NGINX |

### 🖥️ IPs Used

| VM | IP Address |
| --- | --- |
| VM1 | 192.168.107.196 |
| VM2 | 192.168.107.197 |

## ⚙️ Setup Instructions

### 1️⃣ Install Docker on Both VMs

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker --now
docker --version
docker-compose --version
```

✅ Now both VMs are ready for containerized deployment.

### 2️⃣ VM1 – Backend + MySQL Setup

#### 📁 Project Structure

```
project/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── db.js
│   └── package.json
└── db/
    └── init.sql
```

#### 🧩 docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: mysql:8.0
    container_name: med_db
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: medical
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-p$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: med_backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_USER=meduser
      - DB_PASSWORD=medpass
      - DB_NAME=medical
    depends_on:
      db:
        condition: service_healthy
```

#### 🧠 Backend (Node.js + Express)

**index.js**

```javascript
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/doctors", (req, res) => {
  db.query("SELECT * FROM doctors", (err, results) => {
    if (err) return res.status(500).json({ error: "DB query failed" });
    res.json(results);
  });
});

app.get("/api/slots/:doctor_id", (req, res) => {
  db.query(
    "SELECT * FROM slots WHERE doctor_id = ? AND booked = FALSE",
    [req.params.doctor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB query failed" });
      res.json(results);
    }
  );
});

app.post("/api/appointments", (req, res) => {
  const { patient_name, patient_email, doctor_id, slot_id } = req.body;
  if (!patient_name || !patient_email || !doctor_id || !slot_id)
    return res.status(400).json({ message: "Missing fields" });

  db.query("UPDATE slots SET booked = TRUE WHERE id = ?", [slot_id], (err) => {
    if (err) return res.status(500).json({ message: "Slot update failed" });

    db.query(
      `INSERT INTO appointments (patient_name, patient_email, doctor_id, slot_id, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [patient_name, patient_email, doctor_id, slot_id],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(201).json({ message: "✅ Appointment booked", id: result.insertId });
      }
    );
  });
});

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));
```

**db.js**

```javascript
const mysql = require("mysql2");
const db = mysql.createPool({
  host: "med_db",
  user: "meduser",
  password: "medpass",
  database: "medical",
  waitForConnections: true,
  connectionLimit: 10,
});
module.exports = db;
```

**Dockerfile**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

**init.sql**

```sql
CREATE DATABASE IF NOT EXISTS medical;
USE medical;

CREATE USER IF NOT EXISTS 'meduser'@'%' IDENTIFIED BY 'medpass';
GRANT ALL PRIVILEGES ON medical.* TO 'meduser'@'%';
FLUSH PRIVILEGES;

CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  specialty VARCHAR(100),
  qualifications VARCHAR(255),
  education VARCHAR(255),
  experience VARCHAR(255)
);

INSERT INTO doctors (name, specialty, qualifications, education, experience) VALUES
('Dr. Ahmed', 'Cardiology', 'MBBS, Cardiology Specialist', 'Cairo University', '10 years'),
('Dr. Mona', 'Dermatology', 'MD, Dermatology Specialist', 'Alexandria University', '8 years');

CREATE TABLE slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT,
  slot_time DATETIME,
  booked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

INSERT INTO slots (doctor_id, slot_time) VALUES
(1, '2025-10-15 13:00:00'),
(2, '2025-10-16 13:30:00');

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(100),
  patient_email VARCHAR(100),
  doctor_id INT,
  slot_id INT,
  status VARCHAR(50) DEFAULT 'pending',
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (slot_id) REFERENCES slots(id)
);
```

#### ▶️ Run Backend + Database

```bash
cd ~/Desktop/project
sudo docker-compose up -d --build
sudo docker ps
```

#### ✅ Test API

```bash
curl http://localhost:5000/api/doctors
```

### 3️⃣ VM2 – Frontend + NGINX Setup

#### 📁 Project Structure

```
project/
├── docker-compose.yml
└── frontend/
    ├── Dockerfile
    ├── default.conf
    ├── index.html
    ├── style.css
    └── app.js
```

#### 🧩 docker-compose.yml

```yaml
version: "3.8"
services:
  frontend:
    build: ./frontend
    container_name: med_frontend
    ports:
      - "80:80"
    restart: always
```

#### 🧠 NGINX Reverse Proxy

**default.conf**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://192.168.107.196:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 🌐 Frontend Files

**Dockerfile**

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Medical Appointment</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <header>
      <h1>🩺 Medical Appointment System</h1>
      <p>Book your appointment easily and quickly</p>
    </header>
    <main id="doctors-container"></main>
    <footer>
      <p>© 2025 Medical Appointment System | Designed by Mohanad</p>
    </footer>
  </div>
  <script src="app.js"></script>
</body>
</html>
```

**app.js**

> Loads doctors, slots, and books appointments dynamically using API.

**style.css**

> Modern responsive UI with green-blue medical theme.

#### ▶️ Run Frontend

```bash
cd ~/Desktop/project
sudo docker-compose up -d --build
sudo docker ps
```

Then open:\
👉 http://192.168.107.197

You should see the Medical Appointment Dashboard 💊

## 🧩 API Overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/doctors` | GET | List all doctors |
| `/api/slots/:doctor_id` | GET | Available slots for a doctor |
| `/api/appointments` | POST | Book an appointment |

## 🐳 Docker Summary

| Service | Description | Port |
| --- | --- | --- |
| `med_db` | MySQL database | 3306 |
| `med_backend` | Node.js backend | 5000 |
| `med_frontend` | NGINX + frontend | 80 |

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | MySQL |
| Reverse Proxy | NGINX |
| Containerization | Docker, Docker Compose |

## ❤️ Contributing

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Push and open a Pull Request

## 📜 License

This project is open-source and available under the MIT License.

✅ Now your project is fully ready for GitHub — just copy-paste this into your `README.md` file. It explains everything, even for someone who’s never touched Docker or NGINX before.