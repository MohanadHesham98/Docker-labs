# Weather Dashboard 🌦️

A simple, fully containerized web application that displays current weather and a 5-day forecast for any city using the OpenWeatherMap API.

This project includes both a frontend (NGINX) and a backend (Node.js + Express), running together with Docker Compose.

## 🚀 Features

- Search weather by city name 🌍
- Displays current temperature, weather condition, and forecast
- Automatically updates background based on weather type
- Backend API powered by Node.js and Express
- Frontend served via NGINX
- Containerized using Docker Compose (no manual setup needed)

## 🏗️ Project Structure

```
weather-project/
├── docker-compose.yml
├── weather-backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── .env
└── weather-frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── index.html
        ├── script.js
        └── style.css
```

## ⚙️ Setup Instructions

Follow these steps carefully — everything you need is included.

### 1️⃣ Clone the repository

```bash
git clone https://github.com/MohanadHesham98/Docker-labs.git
cd Docker-labs/weather-project
```

### 2️⃣ Get your OpenWeatherMap API key

1. Go to OpenWeatherMap API Keys (https://home.openweathermap.org/users/sign_in)
2. Sign up or log in
3. Copy your API key
4. Open the file `weather-backend/.env` and replace the existing key with yours:

```
API_KEY=YOUR_OWN_API_KEY
PORT=5000
```

✅ **Important**: Without a valid API key, the app will not fetch weather data.

### 3️⃣ Run the entire project using Docker Compose

```bash
docker-compose up --build
```

This command will:

- Build and run the backend on port `5000`
- Build and run the frontend (NGINX) on port `80`

### 4️⃣ Open the web app

Once everything is running, open your browser and go to:

👉 http://localhost

You’ll see the Weather Dashboard UI. Try searching for a city like Cairo, London, or New York 🌤️

## 🧠 How It Works

### 🔹 Backend (Node.js + Express)

- Located in `weather-backend/`
- Handles API requests from frontend at: `GET /api/weather?city=<CITY_NAME>`
- Fetches:
  - Current weather
  - 5-day / 3-hour forecast
- Calls OpenWeatherMap API using your API key from `.env`

### 🔹 Frontend (HTML + JS + CSS + NGINX)

- Located in `weather-frontend/`
- Displays all weather data fetched from the backend
- Dynamically changes background based on weather type
- Served by NGINX inside a container

## 🧩 Example API Test

You can test the backend directly using `curl`:

```bash
curl http://localhost:5000/api/weather?city=Cairo
```

Expected response (shortened):

```json
{
  "city": "Cairo",
  "country": "EG",
  "current": {...},
  "forecast": {...}
}
```

## 🐳 Docker Overview

### `docker-compose.yml`

- Defines two services:
  - `backend`: Node.js server on port `5000`
  - `frontend`: NGINX web server on port `80`

### `weather-backend/Dockerfile`

- Builds Node.js app
- Installs dependencies
- Runs server

### `weather-frontend/Dockerfile`

- Copies static frontend files into NGINX container
- Uses `nginx.conf` to serve content

## 🔑 Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `API_KEY` | Your OpenWeatherMap API key | `2acdba977ba901dc4f0ab87dc9b92766` |
| `PORT` | Backend port | `5000` |

You can get your API key here:\
👉 https://home.openweathermap.org/api_keys

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express, Axios |
| Server | NGINX |
| Containerization | Docker, Docker Compose |
| API | OpenWeatherMap |

## 🧾 License

This project is open-source and available under the MIT License.

## ❤️ Contributing

If you’d like to contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes and push
4. Submit a pull request 🚀
