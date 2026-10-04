# Small Steps — Deployment Guide

Mental health therapy session booking system built with Node.js, Express, and Nginx.

## Quick Start (Docker Compose)

### 1. Clone and enter the project

```bash
cd /path/to/small-steps
```

### 2. Create environment file

```bash
cp .env.example .env
# Edit .env and change JWT_SECRET and MongoDB credentials
nano .env
```

### 3. Build and start all services

```bash
docker compose up -d --build
```

### 4. Verify services are running

```bash
docker compose ps
docker compose logs -f
```

The app will be available at `http://localhost` (port 80).

---

## Deploy on AWS EC2 (Fresh Instance)

### Step 1: Launch EC2 Instance

- AMI: Ubuntu Server 22.04 LTS or Amazon Linux 2023
- Instance type: t2.micro (free tier) or t3.small for production
- Security Group inbound rules:
  - HTTP (port 80) — 0.0.0.0/0
  - HTTPS (port 443) — 0.0.0.0/0 (if using SSL later)
  - SSH (port 22) — your IP only

### Step 2: Connect and Install Docker

```bash
# SSH into the instance
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt-get install docker-compose-plugin -y

# Log out and back in for group changes
exit
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### Step 3: Deploy the Application

```bash
# Clone or upload your project files
# If using git:
git clone <your-repo-url> small-steps
cd small-steps

# Or SCP files from local:
# scp -i your-key.pem -r ./* ubuntu@<EC2-PUBLIC-IP>:~/small-steps/

# Create environment file
cp .env.example .env
nano .env  # Update secrets!

# Build and start
docker compose up -d --build

# Check status
docker compose ps
```

### Step 4: Configure Firewall

```bash
# Ubuntu UFW (if enabled)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# Verify
sudo ufw status
```

### Step 5: Verify Deployment

```bash
# Test health endpoint
curl http://localhost/api/health

# Test nginx
curl http://localhost/nginx-health

# View logs if needed
docker compose logs app
docker compose logs nginx
docker compose logs mongo
```

---

## Deploy on Local VM

### Prerequisites

- Linux VM (Ubuntu/Debian/CentOS) with SSH access
- At least 1GB RAM

### Steps

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $user
# Log out and back in

# Upload project or clone repo
cd small-steps

# Create env
cp .env.example .env

# Start
docker compose up -d --build

# Access at http://<VM-IP>
```

---

## Service Architecture

```
                    Port 80
                      |
                   [Nginx]
                  /       \
          Static files    /api/* (proxy)
          (HTML/CSS/JS)      |
                         [Node.js]
                         port 3000
                             |
                         [MongoDB]
                         port 27017
```

| Service  | Container           | Port  |
|----------|---------------------|-------|
| Nginx    | smallsteps-nginx    | 80    |
| Node API | smallsteps-app      | 3000  |
| MongoDB  | smallsteps-mongo    | 27017 |

---

## Admin Access

Default admin credentials (change in production):
- Email: `admin@smallsteps.com`
- Password: `admin123`

Access admin portal at: `http://<your-host>/login.html` and toggle to "Admin" mode.

---

## Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Rebuild after code changes
docker compose up -d --build

# View logs
docker compose logs -f
docker compose logs -f app

# Restart a single service
docker compose restart app

# Check resource usage
docker stats

# Access MongoDB shell
docker compose exec mongo mongosh -u smallsteps -p smallsteps_pass smallsteps
```

---

## Production Checklist

- [ ] Change `JWT_SECRET` in `.env` to a strong random string
- [ ] Change MongoDB credentials in `.env`
- [ ] Set up SSL/TLS with Let's Encrypt (add certbot container or use ALB)
- [ ] Configure regular MongoDB backups
- [ ] Set up monitoring (optional: add Prometheus/Grafana containers)
- [ ] Enable Docker log rotation
- [ ] Review Nginx rate limiting for API endpoints
