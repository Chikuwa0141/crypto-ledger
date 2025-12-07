FROM golang:1.23-alpine

WORKDIR /app

# Install air for live reload
RUN go install github.com/air-verse/air@v1.61.0

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["air", "-c", ".air.toml"]
