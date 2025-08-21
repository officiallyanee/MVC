include .env
export

run-migrations:
	migrate -path ${MIGRATIONS_DIR} -database "${DB_DSN}" up

down-migrations:
	migrate -path ${MIGRATIONS_DIR} -database "${DB_DSN}" down

run-app:
	go run ./backend/cmd/main.go

setup: run-migrations run-app

test:
	go test -v ./backend/pkg/controller
