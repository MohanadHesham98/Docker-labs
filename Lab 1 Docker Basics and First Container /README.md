# Lab 01: Docker Basics & First Container

This repository contains the complete step-by-step guide and commands for **Lab 1: Docker Basics & First Container**.

The purpose of this lab is to familiarize you with:

- Docker installation
- Containerization concepts
- Running your first Docker container
- Interactive containers
- Port mapping
- Container logs
- Docker resource cleanup

## Step 1: Installing Docker

### On Linux (Ubuntu/Debian)

Update the package list and install the required packages:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release
```

Download and install Docker Engine:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Add your user to the Docker group:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Verify the Installation

Confirm that Docker is installed and the Docker daemon is running:

```bash
docker --version
docker info
```

## Step 2: Running Your First Container

Test the Docker installation by running the `hello-world` image:

```bash
docker run hello-world
```

List all containers, including active and exited containers:

```bash
docker ps -a
```

## Step 3: Running an Interactive Container

Interactive containers allow you to enter a shell inside the container environment.

### Run an Interactive Ubuntu Container

```bash
docker run -it --name my-ubuntu ubuntu bash
```

### Run Commands Inside the Container

Inside the container, update the package list, install `curl`, and test the connection:

```bash
apt update
apt install -y curl
curl https://www.google.com
```

### Exit the Container

```bash
exit
```

### Restart and Re-enter the Container

Start the stopped container:

```bash
docker start my-ubuntu
```

Open a new interactive shell inside the running container:

```bash
docker exec -it my-ubuntu bash
```

Exit the container again when finished:

```bash
exit
```

## Step 4: Running a Web Server

Docker can be used to host services such as web servers. In this step, an Nginx container is started with port mapping.

The following command maps port `8080` on the host machine to port `80` inside the container:

```bash
docker run -d --name my-web-server -p 8080:80 nginx
```

### Check Running Containers

```bash
docker ps
```

### Test the Local Web Server

```bash
curl http://localhost:8080
```

You can also open the following URL in your web browser:

[http://localhost:8080](http://localhost:8080)

## Step 5: Logs Management and Cleanup

### View Container Logs

```bash
docker logs my-web-server
```

### Follow Logs in Real Time

```bash
docker logs -f my-web-server
```

Press `Ctrl+C` to stop following the logs.

### Stop the Web Server

```bash
docker stop my-web-server
```

### Remove Containers

```bash
docker rm my-web-server my-ubuntu
```

### Remove Pulled Images

```bash
docker rmi nginx ubuntu hello-world
```

## Useful Docker Commands

| Command | Description |
|---|---|
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker images` | List downloaded images |
| `docker start <container>` | Start a stopped container |
| `docker stop <container>` | Stop a running container |
| `docker restart <container>` | Restart a container |
| `docker exec -it <container> bash` | Open a shell inside a running container |
| `docker logs <container>` | Display container logs |
| `docker rm <container>` | Remove a container |
| `docker rmi <image>` | Remove an image |

## Lab Summary

In this lab, you learned how to:

- Install Docker on Ubuntu/Debian
- Verify a Docker installation
- Run the `hello-world` container
- Create and manage an interactive Ubuntu container
- Install packages inside a container
- Run an Nginx web server
- Map container ports to host ports
- View container logs
- Stop and remove containers and images
