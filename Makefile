up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

ps:
	docker compose ps

backend:
	cd backend && npm run dev

install:
	cd backend && npm install

db-emit:
	cd backend && npx prisma contract emit

db-status:
	cd backend && npx prisma migration status

db-shell:
	docker exec -it eventmatch-postgres psql -U eventmatch -d eventmatch

logs:
	docker compose logs -f