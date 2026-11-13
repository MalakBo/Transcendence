
.PHONY: all up down restart build ps install dev backend frontend logs db-emit db-status db-shell

all: dev

build:
	docker compose build

up:
	docker compose up --build -d

dev:
	docker compose up --build

down:
	docker compose down

restart:
	docker compose down
	docker compose up --build -d

ps:
	docker compose ps

install:
	docker compose build

backend:
	docker compose up --build backend

frontend:
	docker compose up --build frontend

logs:
	docker compose logs -f

db-emit:
	docker compose exec backend npx prisma contract emit

db-status:
	docker compose exec backend npx prisma migration status

db-shell:
	docker compose exec database psql -U $${DB_USER} -d $${DB_NAME}
