# Lab 03: Live Development with Bind Mounts

This repository contains the complete step-by-step guide and commands for **Lab 3: Live Development with Bind Mounts**.

The purpose of this lab is to familiarize you with:

- Understanding the difference between named volumes and bind mounts
- Creating a multi-file static web project
- Using separate `index.html`, `style.css`, and `script.js` files
- Mounting a local host directory into an Nginx container
- Achieving live reloading without rebuilding images
- Understanding bind mount syntax across operating systems
- Cleaning up Docker container resources

## What Is a Bind Mount?

A bind mount links a specific directory on your local host machine directly to a directory inside a Docker container.

When files in the local directory are modified, the changes become immediately available inside the container. This makes bind mounts ideal for local web development because you do not need to rebuild the Docker image or restart the container after every code change.

### Bind Mount Syntax

```text
-v <host-path>:<container-path>
```

Example:

```text
-v $(pwd):/usr/share/nginx/html
```

| Part | Description |
|---|---|
| `$(pwd)` | The current absolute directory on the host machine |
| `/usr/share/nginx/html` | The directory inside the Nginx container |
| `-v` | The Docker option used to create a bind mount |

## Bind Mounts vs. Named Volumes

| Feature | Bind Mount | Named Volume |
|---|---|---|
| Storage location | A specific host directory | Managed by Docker |
| Common use | Local development | Persistent application data |
| File access | Directly accessible from the host | Managed through Docker |
| Live file updates | Immediately reflected in the container | Not usually used for source-code editing |
| Example | `-v $(pwd):/usr/share/nginx/html` | `-v dbdata:/var/lib/postgresql/data` |

## Step 1: Project Setup

Create a dedicated workspace directory for the lab:

```bash
mkdir -p ~/docker-labs/lab-03-bind-mounts/html
cd ~/docker-labs/lab-03-bind-mounts/html
```

Create the following project files:

```text
html/
├── index.html
├── style.css
└── script.js
```

### Create the HTML File

Create a file named `index.html`:

```bash
touch index.html
```

Add your website HTML code to this file.

### Create the CSS File

Create a file named `style.css`:

```bash
touch style.css
```

Add your website styling to this file.

### Create the JavaScript File

Create a file named `script.js`:

```bash
touch script.js
```

Add your website JavaScript code to this file.

> Make sure that all three files are located in the same directory before starting the container.

### Optional: Clone the Repository

If the project is already available in a GitHub repository, clone the repository using its main repository URL:

```bash
git clone https://github.com/MohanadHesham98/Docker-labs.git
```

Then navigate to the Lab 03 directory:

```bash
cd Docker-labs/lab-03-bind-mounts/html
```
<img width="700" height="149" alt="image" src="https://github.com/user-attachments/assets/2fbf991e-48b3-4a84-a80b-ee54966d4d34" />

## Step 2: Running Nginx with a Bind Mount

Launch an Nginx container and mount the local `html` directory to Nginx's default web directory:

```bash
docker run -d \
  --name mental-health-app \
  -p 8080:80 \
  -v "$(pwd):/usr/share/nginx/html" \
  nginx
```
<img width="880" height="465" alt="image" src="https://github.com/user-attachments/assets/7e8fa607-1e54-481e-9234-c9537a111caa" />

The command performs the following actions:

- Runs the container in detached mode using `-d`
- Names the container `mental-health-app`
- Maps host port `8080` to container port `80`
- Mounts the current local directory into Nginx's web root
- Uses the official `nginx` image

### Bind Mount Syntax Breakdown

```text
-v "$(pwd):/usr/share/nginx/html"
```

#### `$(pwd)` — Host Side

The `$(pwd)` command returns the current absolute directory path on Linux .

This directory should contain:

```text
index.html
style.css
script.js
```

#### `/usr/share/nginx/html` — Container Side

This is the default directory where Nginx looks for static website files.

#### How It Works

Docker mounts the local directory over the Nginx web root inside the container.
<img width="1047" height="98" alt="image" src="https://github.com/user-attachments/assets/30974246-c6b1-417b-a841-d0a0ab14d07f" />

As a result:

- Nginx serves the files directly from your local directory.
- Changes made to local files are immediately available in the container.
- The container does not need to be rebuilt.
- The container does not need to be restarted after code changes.

### Using an Absolute Host Path

You can also use the full path to your local project directory:

```bash
docker run -d \
  --name mental-health-app \
  -p 8080:80 \
  -v "/absolute/path/to/html:/usr/share/nginx/html" \
  nginx
```

Example:

```bash
docker run -d \
  --name mental-health-app \
  -p 8080:80 \
  -v "ّ~/Desktop/docker-labs/lab-03-bind-mounts/html:/usr/share/nginx/html" \
  nginx
```

## Step 3: Verifying the Web Application

### Check the Running Container

```bash
docker ps
```
<img width="1040" height="138" alt="image" src="https://github.com/user-attachments/assets/cbda7e4b-8257-4131-a6ca-8f456b843541" />

The `mental-health-app` container should appear in the list of running containers.

### Test the Web Application with `curl`

```bash
curl http://localhost:8080
```

The command should return the HTML content from `index.html`.

<img width="1046" height="416" alt="image" src="https://github.com/user-attachments/assets/4e4f03db-608d-4dc8-881e-ccb341d9d7c6" />

### Open the Application in a Browser

Open the following URL:

```text
http://localhost:8080
```

https://github.com/user-attachments/assets/59e19484-d62e-42e8-9ce3-6d9dd8c1ad1a


Verify that:

- The HTML structure is displayed correctly.
- The CSS styling is applied.
- The JavaScript button or other interactive features work correctly.
- The page loads through the Nginx container.

### Inspect the Bind Mount

Use the following command to inspect the container mount configuration:

```bash
docker inspect mental-health-app --format='{{json .Mounts}}'
```

The output should show:

- The local host source directory
- The container destination directory
- The mount type, which should be `bind`

For formatted output:

```bash
docker inspect mental-health-app \
  --format='{{range .Mounts}}{{println "Type:" .Type}}{{println "Source:" .Source}}{{println "Destination:" .Destination}}{{end}}'
```
<img width="1189" height="265" alt="image" src="https://github.com/user-attachments/assets/be90a1f1-6c06-4cab-98dd-dc912633e389" />

## Step 4: Testing Live Development

A bind mount allows you to modify the website files locally while the Nginx container continues running.

### Update `style.css`

Open `style.css` in your code editor and change the background color to soft mint green:

```css
body {
  background-color: #38bdf8;
}
```
<img width="434" height="199" alt="image" src="https://github.com/user-attachments/assets/a90f825f-0f35-43f2-8d5f-e136eeca0941" />

<img width="426" height="149" alt="image" src="https://github.com/user-attachments/assets/ff1cf417-0fdc-4e42-ba89-4bc00246f6cd" />

Save the file and refresh the browser:

```text
http://localhost:8080
```
<img width="1286" height="770" alt="image" src="https://github.com/user-attachments/assets/2a2fc043-b15b-4efb-aae4-ba0a51a9b2b7" />

The changes should appear immediately without:

- Rebuilding a Docker image
- Restarting the container
- Creating a new container

### Update `index.html`

Modify the text or structure in `index.html`, save the file, and refresh the browser.

### Update `script.js`

Modify the JavaScript functionality in `script.js`, save the file, and refresh the browser to test the changes.

## Step 5: Resource Cleanup

Stop the running container:

```bash
docker stop mental-health-app
```

Remove the container:

```bash
docker rm mental-health-app
```

You can confirm that the container has been removed:

```bash
docker ps -a
```
<img width="904" height="197" alt="image" src="https://github.com/user-attachments/assets/27cec24c-ace2-44f2-84e4-67b996abd025" />

> Removing the container does not remove the local project files. The files `index.html`, `style.css`, and `script.js` remain safely on the host machine.
<img width="689" height="164" alt="image" src="https://github.com/user-attachments/assets/a8cb08c9-1d00-4877-ad85-7e5e9708aecf" />

## Useful Docker Bind Mount Commands

| Command | Description |
|---|---|
| `docker run -v $(pwd):<path> <image>` | Mount the current directory into a container |
| `docker run -v /host/path:/container/path <image>` | Mount a specific host directory |
| `docker run -v /host/path:/container/path:ro <image>` | Mount a directory as read-only |
| `docker inspect <container>` | Display detailed container configuration |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker stop <container>` | Stop a running container |
| `docker rm <container>` | Remove a container |

## Read-Only Bind Mounts

A bind mount can be mounted as read-only by adding `:ro`:

```bash
docker run -d \
  --name mental-health-app \
  -p 8080:80 \
  -v "$(pwd):/usr/share/nginx/html:ro" \
  nginx
```

With a read-only bind mount, the container can read the files but cannot modify them.

## Lab Summary

In this lab, you learned how to:

- Create and organize a multi-file static web application
- Separate HTML, CSS, and JavaScript files
- Understand how Docker bind mounts work
- Map local host files to directories inside containers
- Use platform-specific bind mount syntax
- Serve static web content with Nginx
- Achieve live development without rebuilding images
- Verify Docker mount configuration
- Clean up containers without deleting local source files
