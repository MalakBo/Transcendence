.PHONY: all build up down restart ps logs install dev backend frontend \
        db-emit db-status db-shell db-migrate db-init wait-db

all: dev

build:
	docker compose build

up: build
	docker compose up -d

dev: build
	docker compose up -d database
	@$(MAKE) wait-db
	@$(MAKE) db-migrate
	docker compose up

wait-db:
	@until docker compose exec -T database pg_isready -U "$${DB_USER}" -d "$${DB_NAME}" > /dev/null 2>&1; do \
		echo "Waiting for PostgreSQL..."; \
		sleep 2; \
	done
	@echo "PostgreSQL is ready!"

down:
	docker compose down

restart:
	docker compose down
	$(MAKE) dev

ps:
	docker compose ps

install: build

backend:
	docker compose up --build backend

frontend:
	docker compose up --build frontend

logs:
	docker compose logs -f

db-emit:
	docker compose run --rm backend npx prisma contract emit

db-status:
	docker compose run --rm backend npx prisma migration status

db-migrate:
	docker compose up -d database
	docker compose run --rm backend npx prisma db init

db-init: db-emit db-migrate

test:
	docker compose exec backend node --test tests/auth.e2e.test.js

db-shell:
	docker compose exec database sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_NAME"'