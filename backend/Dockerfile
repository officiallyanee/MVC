
FROM golang:1.24 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/main.go

FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata

RUN adduser -D -s /bin/sh appuser

WORKDIR /home/appuser

COPY --from=builder --chown=appuser:appuser /app/server .

COPY --chown=appuser:appuser database/migration ./database/migration

USER appuser

EXPOSE 8080

CMD ["./server"]