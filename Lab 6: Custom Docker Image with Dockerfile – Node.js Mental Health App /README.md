# Lab 6: Custom Docker Image with Dockerfile – Node.js Mental Health App

This lab demonstrates how to build and run a custom Docker image for a Node.js mental health awareness application using a `Dockerfile`.

## 📁 Project Structure

```
mental-health-app/
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── app.js
└── public/
    ├── index.html
    ├── style.css
    └── script.js

```

## 🛠️ Step-by-Step Instructions

### Step 1: Create the Project Directory

```
mkdir mental-health-app
cd mental-health-app
mkdir public

```

### Step 2: Create `package.json`

Create a file named `package.json`:

```
nano package.json
```

```
{
  "name": "mental-health-app",
  "version": "1.0.0",
  "description": "A simple mental health awareness web application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "keywords": [
    "mental-health",
    "wellness",
    "nodejs"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  }
}

```

Install the dependencies and generate `package-lock.json`:

```
npm install
```

### Step 3: Create `app.js`

Create a file named `app.js`:

```
nano app.js
```

```
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

```

### Step 4: Create Frontend Files

Create the static web files inside the `public` directory:

```
nano public/index.html
nano public/style.css
nano public/script.js
```

### Step 5 (Optional): Clone the Repository

If the project is already available in a GitHub repository, clone it directly:

```
git clone https://github.com/MohanadHesham98/Docker-labs.git
cd Docker-labs/Lab 6: Custom Docker Image with Dockerfile – Node.js Mental Health App
```

### Step 6: Create the `Dockerfile`

Create a file named `Dockerfile` (with no file extension):

```
nano Dockerfile
```

```
# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to improve Docker layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

```

### Step 7: Create `.dockerignore`

Create a file named `.dockerignore`:

```
node_modules
npm-debug.log
.git
.gitignore
README.md

```

> The `.dockerignore` file prevents unnecessary files from being copied into the Docker image build context.

<img width="638" height="202" alt="image" src="https://github.com/user-attachments/assets/d96f444d-95bb-4f7c-bfcd-733eea6ee91d" />
### Step 8: Build the Custom Docker Image

Build the Docker image:

```
docker build -t mental-health-app:1.0 .
```

**Command Explanation:**

* `docker build`: Builds a Docker image.

* `-t mental-health-app:1.0`: Assigns the image name and tag.

* `.`: Uses the `Dockerfile` in the current directory as the build context.
<img width="970" height="156" alt="image" src="https://github.com/user-attachments/assets/53692de4-f310-4365-bb9b-d6b6e9f2c585" />

### Step 9: Verify the Docker Image

List Docker images and filter for the mental health application:

```
docker images | grep mental-health-app
```

**Expected Output:**

```
mental-health-app   1.0   <IMAGE_ID>   <CREATED>   <SIZE>
```
<img width="978" height="261" alt="image" src="https://github.com/user-attachments/assets/6eb5b6bd-6329-444d-bb17-1d3c0dd39950" />

### Step 10: Run the Container

Run the container in detached mode:

```
docker run -d \
  --name mental-health-container \
  -p 8080:3000 \
  mental-health-app:1.0
```

**Command Explanation:**

* `-d`: Runs the container in detached mode (in the background).

* `--name mental-health-container`: Assigns a custom name to the container.

* `-p 8080:3000`: Maps port `8080` on the host to port `3000` inside the container.

* `mental-health-app:1.0`: Specifies the target image to run.

### Step 11: Test the Application

1. **Check Running Containers:**

   ```
   docker ps
   ```
<img width="971" height="314" alt="image" src="https://github.com/user-attachments/assets/a4494379-f1e2-4f26-b463-331c282f1849" />

2. **Open the Web Application:**
   Navigate to `http://localhost:8080` in your web browser.

3. **Test API Endpoints:**

   * **Get a random wellness tip:**

     ```
     curl http://localhost:8080/api/tips
     ```

   * **Check application health:**

     ```
     curl http://localhost:8080/api/health
     ```

   * **Track a mood:**

     ```
     curl http://localhost:8080/api/mood/happy
     ```

     *(Supported moods: `happy`, `sad`, `anxious`, `stressed`, `calm`, `tired`)*
<img width="969" height="256" alt="image" src="https://github.com/user-attachments/assets/9aaf5e97-b8a7-434d-bb0c-a867f29fbcd7" />

### Step 12: View Container Logs

Display container logs:

```
docker logs mental-health-container
```
<img width="795" height="212" alt="image" src="https://github.com/user-attachments/assets/0cad013c-ad4f-42d8-a87b-143a02364e7f" />

Follow logs in real time:

```
docker logs -f mental-health-container
```

*(Press `Ctrl+C` to exit log stream)*

### Step 13: Debug the Running Container

Enter the shell of the running container:

```
docker exec -it mental-health-container sh
```

Inside the container, inspect the environment:

```
# List files
ls -la

# Check Node.js version
node --version

# Check installed packages
npm list

# View application file
cat app.js

# Exit the container
exit
```

<img width="854" height="493" alt="image" src="https://github.com/user-attachments/assets/98a0572f-1e82-4ae4-bf24-7d8731024898" />
<img width="327" height="71" alt="image" src="https://github.com/user-attachments/assets/a22a19c7-666f-48ca-8aca-ee341109ae13" />
<img width="384" height="115" alt="image" src="https://github.com/user-attachments/assets/69bdc92a-4acc-4c80-8477-add2f29fbef1" />



### Step 14: Cleanup Containers and Images

**Stop and Remove Specific Container:**

```
docker stop mental-health-container
docker rm mental-health-container
```

**Remove Specific Docker Image:**

```
docker rmi mental-health-app:1.0
```

**Remove All Containers and Images (Use with Caution):**

```
# Remove all stopped containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)
```

## 💡 Useful Docker Commands Cheat Sheet

| Command | Purpose | 
 | ----- | ----- | 
| `docker build -t <name>:<tag> .` | Build a custom image from a Dockerfile | 
| `docker images` | List all Docker images | 
| `docker run -d -p <host>:<container> <image>` | Run a container from an image | 
| `docker ps` | List running containers | 
| `docker ps -a` | List all containers (including stopped) | 
| `docker logs <container>` | View container logs | 
| `docker logs -f <container>` | Follow container logs in real-time | 
| `docker exec -it <container> sh` | Enter a running container shell | 
| `docker stop <container>` | Stop a running container | 
| `docker rm <container>` | Remove a stopped container | 
| `docker rmi <image>` | Remove a Docker image | 

## 📝 Lab Summary

In this lab, you learned how to:

1. Create a multi-file Node.js application.

2. Draft a `Dockerfile` and `.dockerignore` file.

3. Install Node.js dependencies inside a Docker image build context.

4. Build custom Docker images using `docker build`.

5. Run containers and map ports between host and container.

6. Access applications via browser and test API endpoints with `curl`.

7. View and stream container logs with `docker logs`.

8. Debug inside a container environment using `docker exec`.

9. Manage container and image lifecycles (stop, remove, clean up).
