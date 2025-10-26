# 🧩 Load Balancing Lab (lB-lab)

This project demonstrates **Load Balancing using NGINX and Docker**.  
It shows how NGINX can distribute traffic across multiple backend containers to improve performance, availability, and scalability.

---

## 🚀 Project Overview

The lab contains:
- **NGINX** acting as a reverse proxy and load balancer.
- **Multiple backend containers** (e.g., simple Node.js or Python apps) serving the same content.
- **Docker Compose** to orchestrate all containers easily.

---

## 🧱 Architecture

```
Client --> NGINX Load Balancer --> Backend_1
                                 --> Backend_2
                                 --> Backend_3
```

NGINX receives all client requests and forwards them to backend containers using a **round-robin** load balancing method by default.

---

## ⚙️ Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🧰 Project Structure

```
VM1/
├── lB-lab/
├── Dockerfile
├── index.html
├── second.html
├── nginx-lb/
|    └── nginx.conf   # only on VM1
└── docker-compose.ymal

VM2/
├── lB-lab/
├── Dockerfile
├── index.html
├── second.html
└── docker-compose.ymal
```

---

## 🧩 How to Run the Lab

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohanadHesham98/Docker-labs.git
   cd Docker-labs/lB-lab
   ```

2. **Build and run containers**
   ```bash
   docker-compose up --build -d
   ```

3. **Test the load balancing**
   Open your browser or use curl:
   ```bash
   curl http://localhost:8080
   ```
   You should see responses coming from different backend containers (e.g., Backend 1, Backend 2, ...).

---

## 🧠 How It Works

- Each backend container runs a small web server responding with its container name or ID.  
- NGINX listens on port **8080** and forwards requests to backend containers listed in `nginx.conf`.  
- When multiple requests are made, NGINX distributes them evenly among the available backends.

---

## 📸 Example Output

```
<img width="1445" height="341" alt="image" src="https://github.com/user-attachments/assets/f795c855-6b5f-41bc-bb59-b0736ca9b672" />
<img width="1423" height="461" alt="image" src="https://github.com/user-attachments/assets/70f6b1ef-067e-4987-b31a-a5b5a1bb9f3f" />
<img width="1464" height="361" alt="image" src="https://github.com/user-attachments/assets/e6a4c17b-fc57-4b69-bdf8-77cb024c8151" />
<img width="1452" height="411" alt="image" src="https://github.com/user-attachments/assets/6a283f84-33b9-443b-956c-99c7cb4d6851" />

```

Each refresh or request cycles through the available backends.

---

## 🧹 Stop and Clean Up

To stop all containers:
```bash
docker-compose down
```

---

## 📚 Learning Objectives

✅ Understand how NGINX load balancing works  
✅ Learn Docker Compose networking  
✅ Practice container orchestration  
✅ Build scalable multi-container apps

---
