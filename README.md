# CourseDemy

## Docker local build

The Docker setup is intended to run after a fresh pull on Windows, macOS, and Linux. It does not require Java, Maven, Node, npm, or PostgreSQL to be installed on the host machine. Docker builds those inside containers.

### Quick Start

Build from source:

```bash
docker compose up -d --build
```

Run from pushed Docker Hub images:

```bash
docker compose -f docker-compose.pull.yml pull
docker compose -f docker-compose.pull.yml up -d
```

Open:

```text
http://localhost:3000
```

Backend API:

```text
http://localhost:8080
```

PostgreSQL is exposed on host port `5434` and container port `5432`.

### Windows

Use Docker Desktop with the WSL 2 backend enabled. After pulling the repo, run this in PowerShell from the project root:

```powershell
docker compose up -d --build
```

If you only want to use the published Docker Hub images:

```powershell
docker compose -f docker-compose.pull.yml pull
docker compose -f docker-compose.pull.yml up -d
```

If you want to customize ports or secrets, copy the example env first:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` and rebuild:

```powershell
docker compose down
docker compose up -d --build
```

### macOS / Linux

The same quick start works:

```bash
docker compose up -d --build
```

To run from Docker Hub images:

```bash
docker compose -f docker-compose.pull.yml pull
docker compose -f docker-compose.pull.yml up -d
```

To customize ports or secrets:

```bash
cp .env.example .env
docker compose down
docker compose up -d --build
```

If login/register shows a browser network error, make sure you are opening the frontend with `localhost` or `127.0.0.1` on port `3000`, then rebuild the containers:

```bash
docker compose down
docker compose up -d --build
```
