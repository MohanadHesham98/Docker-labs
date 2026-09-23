# Lab 02: Persistent Data with Named Volumes

This repository contains the complete step-by-step guide and commands for **Lab 2: Persistent Data with Named Volumes**.

The purpose of this lab is to familiarize you with:

- Understanding data persistence in Docker
- Creating and managing Docker named volumes
- Inspecting volume details
- Locating the default volume storage path on the host
- Attaching named volumes to database containers
- Using named volumes with PostgreSQL
- Verifying data persistence after container deletion and recreation
- Cleaning up Docker volumes and containers

## Default Volume Storage Location

By default, Docker manages named volumes on the host filesystem in the following directory:

```text
/var/lib/docker/volumes/
```

On Linux, the actual data for the `dbdata` volume is stored at:

```text
/var/lib/docker/volumes/dbdata/_data/
```

> **Note for Linux users:** Accessing `/var/lib/docker/volumes/` usually requires root privileges. Use `sudo` when necessary.

> **Note for Windows and macOS users:** Docker runs inside a lightweight virtual machine, so this path exists inside Docker Desktop's internal virtual machine rather than directly in the normal host filesystem.

## Step 1: Creating and Managing Docker Volumes

### Create a Named Volume

Create a new Docker named volume called `dbdata`:

```bash
docker volume create dbdata
```
<img width="567" height="114" alt="image" src="https://github.com/user-attachments/assets/2324b735-7fcb-4373-ade3-374bf67b3bc2" />

### List All Volumes

List all Docker volumes on the system:

```bash
docker volume ls
```
<img width="441" height="121" alt="image" src="https://github.com/user-attachments/assets/ac49068f-a409-4fd5-be54-2e5459a7a233" />

### Inspect the Volume

Inspect the volume metadata and display its mount point:

```bash
docker volume inspect dbdata
```

The output will contain information similar to:

```json
[
    {
        "Name": "dbdata",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/dbdata/_data"
    }
]
```
<img width="654" height="297" alt="image" src="https://github.com/user-attachments/assets/73e4d8ea-14e7-46ea-bf98-dd55c89a1b71" />


## Step 2: Running PostgreSQL with a Named Volume

Start a PostgreSQL container and attach the `dbdata` volume to PostgreSQL's default data directory:

```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v dbdata:/var/lib/postgresql \
  -p 5432:5432 \
  postgres
```
<img width="721" height="166" alt="image" src="https://github.com/user-attachments/assets/718b4c88-1a6c-4717-8225-35edabf40ccc" />

### Volume Syntax Breakdown

The volume option follows this syntax:

```text
-v <volume-name>:<container-path>
```

In this example:

```text
-v dbdata:/var/lib/postgresql/data
```

| Part | Description |
|---|---|
| `dbdata` | The Docker named volume |
| `/var/lib/postgresql/data` | The directory inside the PostgreSQL container |
| `-v` | The option used to mount a volume |

### How the Volume Works

- `dbdata` is managed by Docker.
- PostgreSQL writes its database files to `/var/lib/postgresql/data` inside the container.
- Docker stores that data in the `dbdata` named volume.
- On Linux, the volume data is usually located at `/var/lib/docker/volumes/dbdata/_data/`.
- The data remains available even if the PostgreSQL container is deleted.

> The named volume is not a regular host directory that you manually manage. Docker manages the volume and mounts it into the container.

### Verify the Container Status

Check that the PostgreSQL container is running:

```bash
docker ps
```
<img width="1047" height="290" alt="image" src="https://github.com/user-attachments/assets/ea7fef2e-dcfc-4d38-8de9-12891a02246f" />

## Step 3: Generating and Writing Data to the Volume

Connect to the PostgreSQL database inside the running container:

```bash
docker exec -it my-postgres psql -U postgres
```

### Create a Table and Insert Sample Records

Inside the `psql` prompt, run the following SQL commands:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL
);

INSERT INTO users (username)
VALUES ('Mohanad'), ('DevOps_User');

SELECT * FROM users;
```

Expected output:

```text
 id |  username
----+------------
  1 | Mohanad
  2 | DevOps_User
```
<img width="676" height="491" alt="image" src="https://github.com/user-attachments/assets/026f5757-f077-4b62-87c8-6cc25a5c0ab7" />

### Exit the PostgreSQL Shell

```sql
\q
```

## Step 4: Testing Data Persistence

To verify that the data persists independently of the container lifecycle, stop and remove the PostgreSQL container.

### Stop and Remove the Container

```bash
docker stop my-postgres
docker rm my-postgres
```
<img width="523" height="98" alt="image" src="https://github.com/user-attachments/assets/604e3066-176c-4aef-9907-53bb6607fc2e" />

### Confirm That the Container Was Deleted

```bash
docker ps -a
```
<img width="741" height="49" alt="image" src="https://github.com/user-attachments/assets/79619b3d-7d6e-4f20-bfe6-bc05c45fa9e7" />

The `my-postgres` container should no longer appear in the list.

### Verify That the Volume Still Exists

```bash
docker volume ls
```

The `dbdata` volume should still be listed.
<img width="815" height="137" alt="image" src="https://github.com/user-attachments/assets/c58d0650-838a-4cee-8981-3484b0f9be6a" />

## Launch a New Container Using the Same Volume

Start a new PostgreSQL container and attach the existing `dbdata` volume:

```bash
docker run -d \
  --name my-new-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v dbdata:/var/lib/postgresql \
  -p 5432:5432 \
  postgres
```
Wait a few seconds for PostgreSQL to finish starting before running the next command.

<img width="686" height="162" alt="image" src="https://github.com/user-attachments/assets/bddb5a73-47c6-4333-8e6e-14e22744a81f" />

### Verify Data Integrity

Query the `users` table inside the new container:

```bash
docker exec -it my-new-postgres \
  psql -U postgres -c "SELECT * FROM users;"
```

Expected output:

```text
 id |  username
----+------------
  1 | Mohanad
  2 | DevOps_User
```

The previously inserted records are still available. This proves that the data persisted even after the original container was deleted.
<img width="630" height="202" alt="image" src="https://github.com/user-attachments/assets/0f7763ed-daa8-4890-988d-dd3046a09bac" />

## Step 5: Resource Cleanup

### Stop and Remove the New Container

```bash
docker stop my-new-postgres
docker rm my-new-postgres
```

### Remove the Named Volume

Remove the `dbdata` volume:

```bash
docker volume rm dbdata
```
<img width="490" height="145" alt="image" src="https://github.com/user-attachments/assets/aa17f0d0-d263-46e1-8df3-bbb6ccfd9c93" />

> Make sure that no containers are using the volume before removing it.
<img width="785" height="171" alt="image" src="https://github.com/user-attachments/assets/f7f99506-7cc8-447a-9105-bca96cf3d142" />

### Remove Unused Volumes

To remove all unused and dangling Docker volumes:

```bash
docker volume prune
```

Docker will ask for confirmation before deleting the unused volumes.

<img width="935" height="281" alt="image" src="https://github.com/user-attachments/assets/84181f80-6be7-4398-8562-cc4bdd825357" />

## Useful Docker Volume Commands

| Command | Description |
|---|---|
| `docker volume create <volume>` | Create a new named volume |
| `docker volume ls` | List all existing volumes |
| `docker volume inspect <volume>` | Display detailed volume information |
| `docker volume rm <volume>` | Remove a specific volume |
| `docker volume prune` | Remove all unused volumes |
| `docker run -v <volume>:<path> <image>` | Mount a named volume into a container |

## Lab Summary

In this lab, you learned how to:

- Create and manage Docker named volumes
- Locate the default Docker volume directory
- Understand the syntax of Docker volume mounts
- Distinguish between the volume name and the container path
- Attach a named volume to a PostgreSQL container
- Store database data in a persistent volume
- Verify that data survives container deletion
- Reuse the same volume with a new container
- Clean up Docker volumes and containers
````
