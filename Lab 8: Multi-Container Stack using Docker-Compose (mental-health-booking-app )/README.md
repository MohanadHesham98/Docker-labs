# Lab 8: Multi-Container Deployment with Docker Compose – Mental Health App

This lab demonstrates how to build, orchestrate, and deploy a multi-container Node.js Mental Health Application using **Docker Compose**, **MongoDB database**, and **Nginx** as a reverse proxy.

---

## 📁 Project Structure

```text
mental-health-booking-app/
├── public/                     # Static frontend files served to the browser
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── admin.js
│   │   ├── app.js
│   │   ├── auth.js
│   │   └── booking.js
│   ├── admin-dashboard.html
│   ├── index.html
│   ├── login.html
│   └── patient-dashboard.html
├── src/                        # Backend Node.js / Express logic
│   └── server.js               # Main Express entry point
├── docker/                     # Infrastructure configuration files
│   ├── Dockerfile
│   └── nginx.conf
├── .dockerignore
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
├── docker-compose.yml
├── package.json
└── package-lock.json
```

---

## 🛠️ Step-by-Step Instructions

### Step 1: Clone the Repository

Clone the project repository to your local environment:

```bash
git clone https://github.com/MohanadHesham98/Docker-labs.git
cd Docker-labs/Lab 8: Multi-Container Stack using Docker-Compose (mental-health-booking-app )
```

---

### Step 2: Configure Environment Variables

Copy the example environment configuration file `.env.example` to create `.env`:

```bash
cp .env.example .env
```

Inspect and modify the environment variables if needed:

```bash
nano .env
```

---

### Step 3: Inspect Configuration Files

#### 1. Backend Dockerfile (`docker/Dockerfile`)

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy application files
COPY . .

# Expose app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "src/server.js"]
```

#### 2. Reverse Proxy Configuration (`docker/nginx.conf`)

Nginx routes public requests from port 80 to the internal backend application service on port 3000.

#### 3. Orchestration File (`docker-compose.yml`)

Manages the lifecycle, volume mounting, network bridges, and health checks for three services:
* **`mongo`**: MongoDB database engine (Port 27017).
* **`app`**: Node.js REST API backend (Port 3000).
* **`nginx`**: Web server & Reverse Proxy (Port 80).

---

### Step 4: Build and Launch Containers

Build images and run all services in detached mode:

```bash
docker compose up -d --build
```
<img width="1269" height="479" alt="image" src="https://github.com/user-attachments/assets/335bfed1-612b-4862-95be-48653df26927" />

<img width="1272" height="138" alt="image" src="https://github.com/user-attachments/assets/059861fe-9901-4f17-8ce8-bff3edffd8a5" />

**Command Explanation:**
* `docker compose up`: Starts all stack services defined in `docker-compose.yml`.
* `-d`: Runs containers in detached background mode.
* `--build`: Rebuilds custom Docker images before container initialization.

---

### Step 5: Verify Running Containers & Health Status

Check container runtime states and health check status:

```bash
docker ps -a
```

**Expected Output:**

```text
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                   PORTS                                NAMES
e2f53f7eab44   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Up About a minute        0.0.0.0:80->80/tcp, [::]:80->80/tcp   smallsteps-nginx
1e8379aa4dc5   lab8-app       "docker-entrypoint.s…"   2 minutes ago   Up About a minute (healthy) 3000/tcp                           smallsteps-app
4adb897ddb5a   mongo:7        "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes (healthy)   27017/tcp                            smallsteps-mongo
```
<img width="1410" height="229" alt="image" src="https://github.com/user-attachments/assets/748c247d-ab1e-4477-af39-b57364d9b3fe" />

---

### Step 6: Test Application Endpoints

1. **Access Web Application:**
   Open your browser and navigate to:
   ```text
   http://localhost
   ```

https://github.com/user-attachments/assets/3c902e99-f3b3-4f8f-80b4-f35117c1363f


2. **Verify API Health Check:**
   ```bash
   curl http://localhost/api/health
   ```
   <img width="795" height="74" alt="image" src="https://github.com/user-attachments/assets/b7aed22f-ee80-492e-8777-f0fcadb73705" />

3. **Check Nginx Response Headers:**
   ```bash
   curl -I http://localhost
   ```
   <img width="559" height="333" alt="image" src="https://github.com/user-attachments/assets/4b78992c-5934-43d0-805f-902eb197a3a1" />

---

### Step 7: View Container Logs

Follow real-time output from all services:

```bash
docker compose logs -f
```

To view logs for a specific service (`app` or `nginx`):

```bash
docker compose logs -f app
```

*(Press `Ctrl+C` to exit log streaming)*

---

### Step 8: Cleanup and Shutdown

Stop and remove all running containers and networks:

```bash
docker compose down
```

To stop containers and clear persistent database volumes:

```bash
docker compose down -v
```

---

## 💡 Useful Docker Commands Cheat Sheet

| Command | Purpose |
| :--- | :--- |
| `docker compose up -d --build` | Build custom images and launch stack in background |
| `docker compose ps` | View container status and health checks |
| `docker compose logs -f <service>` | Stream logs for a specific service (`app`, `nginx`, `mongo`) |
| `docker exec -it <container_name> sh` | Open terminal shell inside a running container |
| `docker compose restart <service>` | Restart a specific container service |
| `docker compose down` | Stop and remove stack containers & networks |
| `docker compose down -v` | Stop containers and purge persistent volumes |

---

## 📝 Lab Summary

In this lab, you learned how to:
1. Structure a production-ready application with separated frontend assets, Node.js backend, MongoDB database, and Nginx reverse proxy.
2. Configure `.env` files for secure runtime credential management.
3. Utilize `docker-compose.yml` to manage service dependencies and automated health checks.
4. Route web traffic using Nginx as a reverse proxy on Port 80.
5. Inspect logs and execute debugging commands inside multi-container environments using `docker exec`.
6. Safely tear down containerized infrastructure.
