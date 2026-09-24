# Lab 04: Custom Docker Networks

This repository contains the complete step-by-step guide and commands for **Lab 4: Custom Docker Networks using Bridge Mode**.

The purpose of this lab is to familiarize you with:

- Understanding Docker's default bridge network
- Creating user-defined bridge networks
- Inspecting custom Docker networks
- Using automatic DNS service discovery between containers
- Communicating between containers using container names
- Isolating application tiers with dedicated Docker networks
- Dynamically connecting and disconnecting running containers
- Cleaning up Docker networks and container resources

## Default Bridge vs. User-Defined Bridge Networks

| Feature | Default Bridge Network | User-Defined Bridge Network |
|---|---|---|
| DNS resolution | Containers communicate using IP addresses | Containers communicate using container names |
| Network isolation | Containers are less isolated | Only connected containers communicate directly |
| Dynamic connection | Limited network management | Containers can connect and disconnect dynamically |
| Service discovery | No automatic container-name DNS resolution | Built-in DNS service discovery |
| Recommended usage | Basic or legacy scenarios | Multi-container applications |

## Step 1: Creating and Managing Custom Networks

### List Existing Docker Networks

List all networks managed by the Docker daemon:

```bash
docker network ls
```

Docker usually provides the following default networks:

- `bridge`
- `host`
- `none`

<img width="451" height="133" alt="image" src="https://github.com/user-attachments/assets/589c0761-a23d-4056-a5f6-d5f719aec9b2" />

### Create a Custom Bridge Network

Create a user-defined bridge network called `custom-app-net`:

```bash
docker network create --driver bridge custom-app-net
```
<img width="808" height="239" alt="image" src="https://github.com/user-attachments/assets/b1442507-a186-490f-bca8-451f42d0c535" />

### Inspect the Custom Network

Inspect the network configuration:

```bash
docker network inspect custom-app-net
```

The output includes information such as:

- Network name
- Network driver
- IP subnet
- Gateway address
- Connected containers
- Container IP addresses
<img width="879" height="488" alt="image" src="https://github.com/user-attachments/assets/a914f16f-231d-4b0a-9495-3523047281ce" />

## Step 2: Deploying Containers on a Custom Network

In this step, two containers will be launched on the same custom bridge network:

- A PostgreSQL database container
- An Nginx web server container

### Launch the PostgreSQL Container

Run the PostgreSQL container on `custom-app-net`:

```bash
docker run -d \
  --name db-backend \
  --network custom-app-net \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres
```

### Launch the Nginx Web Server

Run the Nginx container on the same network:

```bash
docker run -d \
  --name web-frontend \
  --network custom-app-net \
  -p 8080:80 \
  nginx
```

The `-p 8080:80` option maps port `8080` on the host machine to port `80` inside the Nginx container.
<img width="1043" height="439" alt="image" src="https://github.com/user-attachments/assets/db3af162-56c3-4b0e-b5cc-66ba915b4017" />

### Verify Connected Containers

Inspect the custom network again:

```bash
docker network inspect custom-app-net
```

Both containers should appear in the `Containers` section:

- `db-backend`
- `web-frontend`

Each container should also have an IP address assigned by Docker.
<img width="1008" height="345" alt="image" src="https://github.com/user-attachments/assets/27218bd3-625b-46fb-8d78-47cca3dadd7a" />

You can also verify that both containers are running:

```bash
docker ps
```

## Step 3: Testing Automatic DNS Service Discovery

User-defined bridge networks provide automatic DNS resolution between containers.

This means that containers can communicate using container names instead of manually assigned IP addresses.

### Install Network and PostgreSQL Client Tools

The official Nginx image is based on Debian and does not include tools such as `ping` or `pg_isready` by default.

Install the required tools inside the `web-frontend` container:

```bash
docker exec -it web-frontend bash -c \
  "apt update && apt install -y iputils-ping postgresql-client"
```
<img width="949" height="246" alt="image" src="https://github.com/user-attachments/assets/0fa80309-9690-41ba-96b2-3f2e718ed712" />

### Ping the Database Container by Name

Test name resolution and network connectivity:

```bash
docker exec -it web-frontend ping -c 3 db-backend
```
<img width="913" height="226" alt="image" src="https://github.com/user-attachments/assets/26f532f2-5539-4760-8107-61259e1929a2" />
<img width="884" height="245" alt="image" src="https://github.com/user-attachments/assets/547c7453-5e07-4f1f-9991-39be7ab762df" />

A successful response confirms that `web-frontend` can resolve the container name `db-backend`.

### Test PostgreSQL Port Connectivity

Use `pg_isready` to check whether PostgreSQL is accepting connections:

```bash
docker exec -it web-frontend \
  pg_isready -h db-backend -p 5432 -U postgres
```

Expected output:

```text
db-backend:5432 - accepting connections
```
<img width="587" height="115" alt="image" src="https://github.com/user-attachments/assets/63bb4541-448f-4ce6-a023-21729185ee56" />

This confirms that:

- `db-backend` was resolved through Docker's internal DNS
- The PostgreSQL container is reachable
- Port `5432` is open and accepting connections

## Step 4: Network Isolation and Dynamic Connections

This step demonstrates how user-defined networks isolate containers and how a running container can be connected to another network dynamically.

### Create an Isolated Container

Start an Alpine container on Docker's default bridge network:

```bash
docker run -d \
  --name isolated-app \
  alpine \
  sleep 3600
```
<img width="859" height="298" alt="image" src="https://github.com/user-attachments/assets/484b298d-6bf5-4cbe-86c2-361702fa4aa1" />

The `isolated-app` container is not connected to `custom-app-net`.

### Verify Network Isolation

Try to ping the database container from `isolated-app`:

```bash
docker exec -it isolated-app ping -c 2 db-backend
```

The command should fail because `isolated-app` is not connected to `custom-app-net`.

A typical error may look similar to:

```text
ping: bad address 'db-backend'
```
<img width="767" height="74" alt="image" src="https://github.com/user-attachments/assets/0a0adb5e-1485-438a-9f1d-e484ae94f2c7" />

This happens because the Docker DNS name `db-backend` is only available to containers connected to the same user-defined network.

### Connect the Running Container to the Custom Network

Connect `isolated-app` to `custom-app-net` while it is running:

```bash
docker network connect custom-app-net isolated-app
```
<img width="797" height="222" alt="image" src="https://github.com/user-attachments/assets/f6f423a7-3d70-46d9-bd33-d4862bdb5130" />

Inspect the network to confirm the connection:

```bash
docker network inspect custom-app-net
```

The `isolated-app` container should now appear in the list of connected containers.

### Test Connectivity Again

Ping the database container again:

```bash
docker exec -it isolated-app ping -c 2 db-backend
```
<img width="797" height="222" alt="image" src="https://github.com/user-attachments/assets/41bde432-a38f-479d-aaab-86b3ff6f03c9" />

This time, the command should succeed because both containers are connected to `custom-app-net`.

### Disconnect the Container from the Network

Disconnect `isolated-app` from the custom network:

```bash
docker network disconnect custom-app-net isolated-app
```
<img width="780" height="92" alt="image" src="https://github.com/user-attachments/assets/c98417bd-617b-40ca-ba27-cdaf217f3848" />

Verify that it has been removed from the network:

```bash
docker network inspect custom-app-net
```

## Step 5: Resource Cleanup

### Stop the Containers

Stop all containers created during the lab:

```bash
docker stop web-frontend db-backend isolated-app
```

### Remove the Containers

Remove the stopped containers:

```bash
docker rm web-frontend db-backend isolated-app
```

### Remove the Custom Network

Remove `custom-app-net`:

```bash
docker network rm custom-app-net
```

<img width="785" height="402" alt="image" src="https://github.com/user-attachments/assets/725d087f-6bfa-48ec-bc18-490ca2a28ec3" />

### Remove Unused Networks

To remove all unused Docker networks:

```bash
docker network prune
```

Docker will ask for confirmation before deleting unused networks.

## Useful Docker Network Commands

| Command | Description |
|---|---|
| `docker network ls` | List all Docker networks |
| `docker network create --driver bridge <network>` | Create a user-defined bridge network |
| `docker network inspect <network>` | Display network configuration and connected containers |
| `docker network connect <network> <container>` | Connect a container to a network |
| `docker network disconnect <network> <container>` | Disconnect a container from a network |
| `docker network rm <network>` | Remove a specific network |
| `docker network prune` | Remove all unused networks |

## Lab Summary

In this lab, you learned how to:

- Create and manage user-defined Docker bridge networks
- Understand the differences between default and custom bridge networks
- Use Docker's built-in DNS service discovery
- Communicate between containers using container names
- Deploy multiple containers on the same network
- Isolate containers from one another
- Dynamically connect and disconnect running containers
- Inspect Docker network configuration
- Clean up Docker networks and container resources
