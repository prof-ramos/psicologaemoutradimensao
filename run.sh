#!/bin/bash

# Astrologer API Development Runner
# This script starts the FastAPI development server with hot reload

echo "🚀 Starting Astrologer API Development Server..."
echo "📍 Server will be available at: http://localhost:8000"
echo "📖 API Documentation at: http://localhost:8000/docs"
echo ""

# Check if pipenv is installed
if ! command -v pipenv &> /dev/null; then
    echo "❌ Error: pipenv is not installed. Please install it first:"
    echo "   pip install pipenv"
    exit 1
fi

# Check if Pipfile exists
if [ ! -f "Pipfile" ]; then
    echo "❌ Error: Pipfile not found. Are you in the correct directory?"
    exit 1
fi

# Run the development server
pipenv run dev