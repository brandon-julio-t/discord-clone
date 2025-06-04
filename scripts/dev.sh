#!/bin/bash

# Function to handle cleanup on script termination
cleanup() {
    echo "Shutting down services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Check if required commands exist
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is not installed"
        exit 1
    fi
}

# Check dependencies
check_command caddy
check_command docker
check_command docker-compose
check_command bun

echo "Starting development environment..."

# Start Caddy
echo "Starting Caddy..."
caddy run &
CADDY_PID=$!

# Start Docker Compose
echo "Starting Docker Compose services..."
docker compose up &
DOCKER_PID=$!

# Start Bun dev server
echo "Starting Bun development server..."
bun dev &
BUN_PID=$!

# Function to check if a process is still running
check_process() {
    if ! kill -0 "$1" 2>/dev/null; then
        echo "Error: Process $2 failed to start"
        cleanup
        exit 1
    fi
}

# Wait a moment to ensure processes start
sleep 2

# Check if all processes started successfully
check_process $CADDY_PID "Caddy"
check_process $DOCKER_PID "Docker Compose"
check_process $BUN_PID "Bun"

echo "All services started successfully!"
echo "Press Ctrl+C to stop all services"

# Wait for all background processes
wait
