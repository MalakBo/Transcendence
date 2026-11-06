.PHONY: all up down restart ps install dev backend frontend logs db-emit db-status db-shell

all: up
	$(MAKE) dev

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

ps:
	docker compose ps

install:
	cd backend && npm install
	cd frontend && npm install

dev:
	@trap 'kill 0' INT TERM EXIT; \
	(cd backend && npm run dev) & \
	(cd frontend && npm run dev) & \
	wait

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm run dev

db-emit:
	cd backend && npx prisma contract emit

db-status:
	cd backend && npx prisma migration status

db-shell:
	docker exec -it eventmatch-postgres psql -U eventmatch -d eventmatch

logs:
	docker compose logs -f