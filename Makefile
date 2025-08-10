include .env
export

run-migrations:
	migrate -path ${MIGRATIONS_DIR} -database "${DB_DSN}" up

run-app:
	go run ./cmd/main.go

setup: run-migrations run-app

test:
	go test -v MVC/pkg/controller
