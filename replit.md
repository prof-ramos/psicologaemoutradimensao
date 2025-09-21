# Astrologer API

## Overview
The Astrologer API is a RESTful service providing extensive astrology calculations, designed for seamless integration into projects. Built with FastAPI and Kerykeion library, it offers a rich set of astrological charts and data.

## Current State
- **Status**: ✅ Fully configured and running
- **Environment**: Development mode with debug enabled
- **Port**: 5000 (configured for Replit environment)
- **Language**: Python 3.11
- **Framework**: FastAPI with Uvicorn server

## Recent Changes
- 2025-09-19: Initial setup from GitHub import
- Installed Python 3.11 and all dependencies from Pipfile
- Configured development environment with ENV_TYPE=dev
- Created complete UX/UI interface in Portuguese Brazilian
- Integrated frontend with API using CORS and static file serving
- Set up workflow to run FastAPI server + frontend on port 5000
- Configured deployment for autoscale target
- All endpoints and interface tested and working correctly

## Project Architecture
- **Framework**: FastAPI with Uvicorn ASGI server
- **Main dependencies**: kerykeion (astrology calculations), pydantic (data validation)
- **Structure**:
  - `app/main.py` - FastAPI application entry point
  - `app/routers/` - API route handlers
  - `app/config/` - Configuration files (dev/prod)
  - `app/types/` - Request/response models
  - `app/utils/` - Utility functions
  - `app/middleware/` - Custom middleware

## Key Features
- **Web Interface**: Modern, responsive UI in Portuguese Brazilian
- **Birth chart generation**: Complete SVG charts with planetary data
- **Interactive forms**: User-friendly data input with validation
- **Real-time generation**: Instant chart creation and display
- **Multiple themes**: Light, dark, and classic chart themes
- **API Integration**: Seamless frontend-backend communication
- **Responsive design**: Works on desktop and mobile devices
- **RESTful API**: Complete backend API with comprehensive documentation

## API Endpoints
- `/` - Interface web frontend
- `/api/v4/status` - Status da API
- `/api/v4/health` - Health check
- `/api/v4/now` - Current astrological data
- `/api/v4/birth-chart` - Generate birth charts
- `/api/v4/synastry-chart` - Relationship compatibility charts
- `/api/v4/transit-chart` - Current planetary influences
- `/docs` - Interactive API documentation
- `/redoc` - Alternative documentation format

## Configuration
- Development: Uses config.dev.toml with debug enabled
- Production: Uses config.prod.toml with security middleware
- Environment variables: ENV_TYPE controls configuration loading
- Optional: RAPID_API_SECRET_KEY, GEONAMES_USERNAME for enhanced features

## Deployment
- Configured for Replit autoscale deployment
- Production-ready with uvicorn server
- Port 5000 binding for Replit environment compatibility