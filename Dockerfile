# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built assets from build stage
COPY --from=build /app/build .

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["serve", "-s", ".", "-l", "3000"] 