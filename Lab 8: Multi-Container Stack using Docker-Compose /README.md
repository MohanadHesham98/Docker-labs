# Lab 08: Multi-Container Stack using Docker Compose

This repository contains the complete step-by-step guide and commands for **Lab 8: Multi-Container Stack using Docker Compose**.

The purpose of this lab is to familiarize you with:

- Understanding multi-container application orchestration using Docker Compose
- Creating a `docker-compose.yml` file configuring a complete 3-tier architecture: **Web Server (Nginx)**, **Application API (Node.js/Express)**, and **Database (MongoDB)**
- Defining custom bridge networks and named volumes in Docker Compose
- Orchestrating container startup order and health dependencies (`depends_on` with `service_healthy`)
- Managing the full application stack lifecycle using `docker compose up`, `docker compose ps`, `docker compose logs`, and `docker compose down`
- Verifying container-to-container communication and data persistence across stack restarts

---

## What Is Docker Compose?

**Docker Compose** is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file (`docker-compose.yml`) to configure your application's services, networks, and volumes.

Instead of executing long, error-prone `docker run` commands individually for every container, Docker Compose enables you to spin up, configure, and connect your entire infrastructure with a single command:

```bash
docker compose up -d
```

### Key Advantages of Docker Compose

| Feature | Single Container (`docker run`) | Multi-Container Stack (`docker compose`) |
|---|---|---|
| **Configuration** | Long CLI arguments | Declarative YAML file (`docker-compose.yml`) |
| **Service Management** | Must manage each container manually | Single command controls all services simultaneously |
| **Networking** | Requires manual network creation & linking | Automatic dedicated custom network creation |
| **Dependency Order** | Manual start sequence required | Expressed via `depends_on` and health checks |
| **Portability** | Hard to share exact CLI setups | Version-controlled file shareable across teams |

---

## Multi-Container Architecture Overview

In this lab, we build a **3-Tier Architecture Stack**:

```text
               +----------------------------------+
               |        Host Machine / Browser    |
               +----------------------------------+
                                |
                   Port 8080    | (HTTP Requests)
                                v
               +----------------------------------+
               |   Web Server Tier: Nginx         |
               |   (Reverse Proxy & Static Files) |
               +----------------------------------+
                                |
                    Port 3000   | (Internal Network: app-net)
                                v
               +----------------------------------+
               |   App Tier: Node.js / Express    |
               |   (Mental Health API Services)   |
               +----------------------------------+
                                |
                    Port 27017  | (Internal Network: app-net)
                                v
               +----------------------------------+
               |   Database Tier: MongoDB         |
               |   (Persistent Data Storage)      |
               +----------------------------------+
                                |
                                v
                 [Named Volume: mongodb_data]
```

1. **Web Server (Nginx):** Acts as a reverse proxy, listening on host port `8080` and routing client requests to the Node.js backend app.
2. **Application Server (Node.js / Express):** Runs the Mental Health application API (from Lab 6 code), connecting to MongoDB on internal port `27017`.
3. **Database Server (MongoDB):** Provides persistent storage for mood entries and user data, attached to a named Docker volume (`mongodb_data`).

---

## Step 1: Project Directory & Source Code Setup

Navigate to your workspace directory and set up the project folder structure using your code from Lab 6:

```bash
mkdir -p ~/docker-labs/lab-08-docker-compose
cd ~/docker-labs/lab-08-docker-compose
```

Create the following file structure:

```text
lab-08-docker-compose/
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── app.js
├── nginx.conf
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

### Application Code Files (From Lab 6)

#### `package.json`

```json
{
  "name": "mental-health-app",
  "version": "1.0.0",
  "description": "A simple mental health awareness web application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0"
  }
}
```

#### `app.js`

```javascript
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
```

#### `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### `.dockerignore`

```text
node_modules
npm-debug.log
.git
.gitignore
README.md
```

#### `nginx.conf`

Create an `nginx.conf` file to act as the web server reverse proxy:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;

        location / {
            proxy_pass http://app:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## Step 2: Creating the `docker-compose.yml` File

Create a file named `docker-compose.yml` in the root directory:

```bash
touch docker-compose.yml
```

Add the following complete stack specification to `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # --------------------------------------------------------
  # Database Tier: MongoDB
  # --------------------------------------------------------
  mongodb:
    image: mongo:6.0
    container_name: mental-health-db
    restart: always
    environment:
      MONGO_INITDB_DATABASE: mental_health_db
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-net
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # --------------------------------------------------------
  # Application Tier: Node.js Express App
  # --------------------------------------------------------
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: mental-health-api
    restart: always
    environment:
      PORT: 3000
      MONGO_URI: mongodb://mongodb:27017/mental_health_db
    ports:
      - "3000:3000"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - app-net

  # --------------------------------------------------------
  # Web Server Tier: Nginx Reverse Proxy
  # --------------------------------------------------------
  web:
    image: nginx:alpine
    container_name: mental-health-web
    restart: always
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-net

# ----------------------------------------------------------
# Persistent Storage Volumes
# ----------------------------------------------------------
volumes:
  mongodb_data:
    driver: local

# ----------------------------------------------------------
# Custom Isolated Bridge Network
# ----------------------------------------------------------
networks:
  app-net:
    driver: bridge
```

### Breakdown of the Docker Compose Configuration

| Key / Section | Purpose & Description |
|---|---|
| `version: '3.8'` | Specifies the Docker Compose file format version |
| `services` | Defines the containerized components of the application stack |
| `build: context: .` | Tells Compose to build the image locally using the `Dockerfile` in the current folder |
| `image` | Specifies pre-built official Docker Hub images (`mongo:6.0`, `nginx:alpine`) |
| `environment` | Sets environment variables passed into the containers at runtime |
| `volumes` | Mounts host files (e.g. `nginx.conf`) or attaches named persistent volumes (`mongodb_data`) |
| `ports` | Maps host machine ports to container ports (`<host-port>:<container-port>`) |
| `depends_on` | Controls startup sequencing; ensures MongoDB is healthy before starting the Node app |
| `healthcheck` | Periodically checks container readiness to ensure real availability |
| `networks` | Places all 3 services onto a shared private bridge network (`app-net`) |

---

## Step 3: Launching the Stack (`docker compose up`)

Start the multi-container stack in detached mode (`-d`):

```bash
docker compose up -d
```

### Expected Execution Output

```text
[+] Building 1.2s (10/10) FINISHED
 [+] Network lab-08-docker-compose_app-net       Created
 [+] Volume "lab-08-docker-compose_mongodb_data" Created
 [+] Container mental-health-db                  Healthy
 [+] Container mental-health-api                 Started
 [+] Container mental-health-web                 Started
```

### What Happens Behind the Scenes?

1. Docker Compose creates the custom bridge network `lab-08-docker-compose_app-net`.
2. It initializes the named persistent volume `lab-08-docker-compose_mongodb_data`.
3. It starts `mental-health-db` (MongoDB) and runs health checks until it reports `healthy`.
4. It builds and launches `mental-health-api` (Node.js), establishing a connection to MongoDB.
5. It launches `mental-health-web` (Nginx), exposing port `8080` to route incoming traffic.

---

## Step 4: Verifying Stack Status & Logs

### Check Running Containers

List all containers associated with the stack:

```bash
docker compose ps
```

**Expected Output:**

```text
NAME                IMAGE                COMMAND                  SERVICE     CREATED         STATUS                   PORTS
mental-health-api   lab-08..._app        "docker-entrypoint.s…"   app         1 minute ago    Up 1 minute              0.0.0.0:3000->3000/tcp
mental-health-db    mongo:6.0            "docker-entrypoint.s…"   mongodb     1 minute ago    Up 1 minute (healthy)    0.0.0.0:27017->27017/tcp
mental-health-web   nginx:alpine         "/docker-entrypoint.…"   web         1 minute ago    Up 1 minute              0.0.0.0:8080->80/tcp
```

### View Aggregated Container Logs

Inspect the streaming logs across all services:

```bash
docker compose logs
```

To view logs for a specific service (e.g., Node.js app):

```bash
docker compose logs app
```

To tail live logs in real time:

```bash
docker compose logs -f
```

---

## Step 5: Testing the Application Stack

### 1. Test Health Endpoint

Verify overall system status via curl:

```bash
curl http://localhost:8080/api/health
```

**Expected Response:**

```json
{
  "status": "Mental Health Stack is healthy!",
  "database": "Connected",
  "timestamp": "2026-10-03T14:47:25.000Z"
}
```

### 2. Test Wellness Tips Endpoint

```bash
curl http://localhost:8080/api/tips
```

### 3. Test Mood Logging & Data Persistence

Add a new mood entry to MongoDB via the App API through Nginx:

```bash
curl -X POST http://localhost:8080/api/moods \
  -H "Content-Type: application/json" \
  -d '{"mood": "calm", "note": "Completed Lab 8 Docker Compose setup!"}'
```

Retrieve saved mood logs from the database:

```bash
curl http://localhost:8080/api/moods
```

### 4. Test Web UI in Browser

Open your web browser and navigate to:

```text
http://localhost:8080
```

Verify that the application loads smoothly through the Nginx reverse proxy.

---

## Step 6: Testing Data Persistence & Stack Lifecycle

To verify that the named volume preserves database data across container restarts and destruction:

### Stop the Stack

```bash
docker compose stop
```

Confirm that containers are stopped:

```bash
docker compose ps
```

### Restart the Stack

```bash
docker compose start
```

### Destroy Containers (Keep Volumes Intact)

Remove containers and networks while preserving database volumes:

```bash
docker compose down
```

Relaunch the stack:

```bash
docker compose up -d
```

Verify that previously inserted mood entries still exist in MongoDB:

```bash
curl http://localhost:8080/api/moods
```

> **Result:** The data remains intact because named volume `mongodb_data` persists independently of container life cycles.

---

## Step 7: Complete Resource Cleanup

To completely stop and remove all containers, networks, and persistent volumes:

```bash
docker compose down -v
```

**Expected Output:**

```text
[+] Running 4/4
 [+] Container mental-health-web                 Removed
 [+] Container mental-health-api                 Removed
 [+] Container mental-health-db                  Removed
 [+] Volume lab-08-docker-compose_mongodb_data   Removed
 [+] Network lab-08-docker-compose_app-net       Removed
```

To verify that no leftover stack components exist:

```bash
docker compose ps -a
docker volume ls | grep mongodb_data
```

---

## Essential Docker Compose Command Reference

| Command | Description |
|---|---|
| `docker compose up -d` | Build, create, and start containers in detached mode |
| `docker compose up --build -d` | Force rebuilding images before starting stack |
| `docker compose down` | Stop and remove containers and networks |
| `docker compose down -v` | Stop and remove containers, networks, AND volumes |
| `docker compose ps` | List status of stack containers |
| `docker compose logs` | View combined logs from all services |
| `docker compose logs -f <service>` | Tail live logs for a specific service |
| `docker compose exec <service> <cmd>` | Execute a command inside a running service container |
| `docker compose restart` | Restart all service containers |
| `docker compose stop` | Stop services without removing containers |
| `docker compose start` | Start stopped service containers |

---

## Lab Summary

In this lab, you learned how to:

- Understand multi-container architecture and orchestration principles using Docker Compose
- Design a production-style 3-tier web stack (**Nginx + Node.js + MongoDB**)
- Write a clean, declarative `docker-compose.yml` file
- Configure custom bridge networking (`app-net`) for container-to-container service discovery
- Implement health checks and conditional startup order using `depends_on`
- Attach named volumes (`mongodb_data`) to achieve persistent database storage
- Manage stack lifecycles using `docker compose up`, `ps`, `logs`, and `down`
- Verify system behavior and perform complete resource cleanup
