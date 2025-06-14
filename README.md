# FTC Event Viewer

A modern web application for viewing FIRST Tech Challenge (FTC) event teams and their details. Built with React, TypeScript, and Node.js.

## Features

- 🔍 Search teams by event code
- 📱 Responsive design for all devices
- 🎨 Modern UI with Material-UI components
- 🔄 Real-time data fetching from FTC API
- 🚀 Fast and efficient performance
- 🔒 Secure API communication

## Quick Start

### Using Docker

The easiest way to run the application is using Docker:

```bash
# Pull the latest image
docker pull mumtez/ftc-event-viewer:latest

# Run the container
docker run -d -p 3000:3000 --name ftc-event-viewer mumtez/ftc-event-viewer:latest
```

The application will be available at `http://localhost:3000`

### Using Docker Compose

Alternatively, you can use Docker Compose:

```bash
# Clone the repository
git clone https://github.com/mumtez/ftc-event-viewer.git
cd ftc-event-viewer

# Start the application
docker-compose up -d
```

### Behind Nginx Proxy Manager

If you're running the application behind Nginx Proxy Manager:

1. Start the container using one of the methods above
2. In Nginx Proxy Manager:
   - Create a new Proxy Host
   - Set the Forward Hostname/IP to `ftc-event-viewer` (or your container name)
   - Set the Forward Port to `3000`
   - Configure your domain and SSL settings

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/mumtez/ftc-event-viewer.git
cd ftc-event-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Usage

The application uses the FTC API to fetch team data. To use the application:

1. Enter an event code in the search box
2. Click the search button or press Enter
3. View the list of teams and their details

## Building for Production

To build the application for production:

```bash
npm run build
```

The build output will be in the `build` directory.

## Docker Image

The application is available as a Docker image on Docker Hub:
```
docker.io/mumtez/ftc-event-viewer:latest
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
