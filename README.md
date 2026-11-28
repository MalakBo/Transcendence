# Transcendence
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/da071443-0d96-423f-8faa-da566227dc13" />


docker compose up -d database     
make db-migrate

feed org: /services
feed providers: /events

---------commands for changing the db-----------
# EventMatch (Transcendence) - Setup Guide

Everything runs in Docker. You don't need Node, Postgres, or Prisma installed on your machine.

## Requirements

### Reset the database

```bash
docker compose down
docker volume ls | grep postgres        # find the volume name
docker volume rm transcendence_postgres_data
```

If the volume name printed by `docker volume ls` is different, use that name in the `docker volume rm` command.

### Start the app

```bash
make up
make ps
```

`make ps` should show three running containers: `eventmatch-postgres`, `transcendence-backend-1`, and `transcendence-frontend-1`.

### Check the database

```bash
make db-status
```

You should see `Up to date`. If you see pending migrations, run:

```bash
docker compose run --rm backend npx prisma db migrate --to 22a33fad166540f47d9117be4d78ffb07300eb0b66097015a321a580f6624ee3
```

### Open the app

| Service  | URL / Address             |
|----------|---------------------------|
| Frontend | http://localhost:5173     |
| Backend  | http://localhost:3000     |
| Postgres | localhost:5433 (host port)|

## Useful commands

| Command          | What it does                          |
|------------------|---------------------------------------|
| `make up`        | Start all containers                  |
| `make down`      | Stop all containers                   |
| `make restart`   | Restart all containers                |
| `make ps`        | Show container status                 |
| `make logs`      | Show container logs                   |
| `make db-status` | Show migration status                 |
| `make db-shell`  | Open a `psql` shell in the database   |
| `make db-emit`   | Regenerate the Prisma contract        |

## Working with the database schema

The schema lives in `backend/prisma/` (single file, starts with `// use prisma-8`). Migrations live in `backend/migrations/`.

When you change the schema:

```bash
make db-emit                                                   # note the new storageHash
docker compose run --rm backend npx prisma migration plan --name <short_name>
docker compose run --rm backend npx prisma db migrate --to <new-hash>
make db-status                                                 # should say "Up to date"
```

Commit the new files in `backend/migrations/` together with the schema change.

Never edit or delete files in `backend/migrations/` by hand. Teammates depend on that history.

## Troubleshooting

**`DRIVER.CONNECTION_FAILED` / `getaddrinfo EAI_AGAIN database`**
The containers aren't running. Run `make up`, then `make ps`.

**`Database schema does not satisfy contract` or missing tables**
Your database volume is out of date. Follow step 2 to reset it, then run `make up` again.

**`Prisma agent skills are out of date`**
You can ignore this message. It doesn't affect the project.

**Nothing works after pulling new changes**
Run `make down`, then `make up`. If the database errors continue, follow step 2.

**Do not install anything on your host machine to fix errors.** All fixes go through the Dockerfiles or `docker-compose.yml`.