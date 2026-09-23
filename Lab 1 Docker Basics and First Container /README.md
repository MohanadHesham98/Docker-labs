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
<img width="837" height="617" alt="image" src="https://github.com/user-attachments/assets/8c9f7e21-a9f7-419b-b4fb-683cf0f616a4" />

## Step 2: Running Your First Container

Test the Docker installation by running the `hello-world` image:

```bash
docker run hello-world
```
<img width="835" height="191" alt="image" src="https://github.com/user-attachments/assets/6e58b76b-85bc-4888-9155-46586fd79598" />

List all containers, including active and exited containers:

```bash
docker ps -a
```
<img width="844" height="156" alt="image" src="https://github.com/user-attachments/assets/cfa742ec-b089-424c-b1e3-b750c160b5f5" />

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
<img width="842" height="612" alt="image" src="https://github.com/user-attachments/assets/db4fe217-f0e1-47d5-87f9-b41f1e352ebc" />

### Exit the Container

```bash
exit
```
<img width="848" height="201" alt="image" src="https://github.com/user-attachments/assets/5c7c92c8-4ba1-4820-81b2-d7456155b936" />

### Restart and Re-enter the Container

Start the stopped container:

```bash
docker start my-ubuntu
```
<img width="846" height="119" alt="image" src="https://github.com/user-attachments/assets/081f78a6-f0e2-44bd-8502-897dd990b4b7" />

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
<img width="840" height="289" alt="image" src="https://github.com/user-attachments/assets/9c881e60-2418-4d06-b718-914d0e33d6ea" />

### Check Running Containers

```bash
docker ps
```
<img width="1443" height="99" alt="image" src="https://github.com/user-attachments/assets/1551e2ca-5a80-4b33-84cf-230e4db948ba" />

### Test the Local Web Server

```bash
curl http://localhost:8080
```
<img width="738" height="527" alt="image" src="https://github.com/user-attachments/assets/8b4c70d3-4e4a-4ba3-b5c3-7efdde205a17" />

You can also open the following URL in your web browser:

[http://localhost:8080](http://localhost:8080)

<img width="1101" height="390" alt="image" src="https://github.com/user-attachments/assets/705752d5-cb51-4429-82fd-4e476a44e8b1" />

## Step 5: Logs Management and Cleanup

### View Container Logs

```bash
docker logs my-web-server
```
<img width="1430" height="453" alt="image" src="https://github.com/user-attachments/assets/23e78dd5-a1ef-4c73-9b8b-a7ba7c92059a" />

### Follow Logs in Real Time

```bash
docker logs -f my-web-server
```
<img width="1232" height="616" alt="image" src="https://github.com/user-attachments/assets/ade4c9f0-3484-4757-9f67-632a5c75d6b8" />

Press `Ctrl+C` to stop following the logs.

### Stop the Web Server

```bash
docker stop my-web-server
```

### Remove Containers

```bash
docker rm my-web-server my-ubuntu
```
<img width="1178" height="334" alt="image" src="https://github.com/user-attachments/assets/ecd95adf-bfa8-4e80-9ee5-7c74301084a0" />

### Remove Pulled Images

```bash
docker rmi nginx ubuntu hello-world
```
<img width="748" height="168" alt="image" src="https://github.com/user-attachments/assets/0c57619b-ed7e-4d5c-9efa-c7117a317b17" />

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
