# Student Swap

Campus-to-campus peer-to-peer marketplace where university students buy, sell, and swap items.

## Tech Stack

- **Backend**: Python 3.11+, FastAPI (async)
- **Database**: PostgreSQL + SQLAlchemy (async)
- **Cache/Sessions**: Redis
- **Frontend**: React + Tailwind (separate, imported later)

## Quick Start

### Run everything with Docker

```bash
docker-compose up --build
```

This starts:
- **API** on `http://localhost:8000`
- **PostgreSQL** on `localhost:5433`
- **Redis** on `localhost:6379`

The `--build` flag rebuilds the API image if code changed.

### Alternative: Local development (with hot-reload)

If you prefer hot-reload while coding:

```bash
# Start just the database and Redis
docker-compose up -d db redis

# Run the API locally
source venv/bin/activate
uvicorn main:app --reload
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start Postgres + Redis |
| `docker-compose down` | Stop containers |
| `docker-compose logs -f db` | View database logs |
| `uvicorn main:app --reload` | Run API with hot-reload |
| `pytest` | Run tests |

## Docker Build & Run

To build and run the API as a Docker container:

```bash
# Build the image
docker build -t studentswap .

# Run the container
docker run -p 8000:8000 --env-file .env studentswap
```

## Project Structure

```
campus/
├── main.py           # FastAPI app, routes mounted here
├── config.py         # Settings from environment variables
├── database.py       # Async SQLAlchemy setup
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

More folders will be added as we build:
- `models/` - SQLAlchemy ORM models
- `schemas/` - Pydantic request/response schemas
- `routes/` - API route handlers
- `services/` - Business logic
