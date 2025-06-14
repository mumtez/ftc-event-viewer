# FTC Event Viewer

A web application for viewing FIRST Tech Challenge event teams and their OPRs (Offensive Power Rating).

## Features

- View teams participating in FTC events
- Sort teams by number, name, or OPR
- View detailed team information
- Links to FTCScout and Orange Alliance
- Responsive design
- Docker support

## Quick Start

### Using Docker

1. Pull the image:
```bash
docker pull mumtez/ftc-event-viewer:latest
```

2. Run the container:
```bash
docker run -d -p 80:80 mumtez/ftc-event-viewer:latest
```

### Using Docker Compose

1. Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  ftc-event-viewer:
    image: mumtez/ftc-event-viewer:latest
    container_name: ftc-event-viewer
    expose:
      - "80"
    restart: always
    networks:
      - ftc-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  ftc-network:
    driver: bridge
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## API

The application uses the FTCScout API to fetch event and team data.

## License

MIT License
