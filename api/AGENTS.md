# Agent Guidelines for Astrologer API

## Build/Test Commands
- **Development server**: `pipenv run dev` (uvicorn with reload)
- **Run all tests**: `pipenv run test` (pytest -v)
- **Run single test**: `pytest tests/test_main.py::test_function_name -v`
- **Type checking**: `pipenv run quality` (mypy with ignore-missing-imports)
- **Code formatting**: `pipenv run format` (black with line-length 200)
- **Generate schema**: `pipenv run schema` (python dump_schema.py)

## Code Style Guidelines
- **Language**: Python 3.11+ with FastAPI framework
- **Formatting**: Black formatter (line length 200), 4-space indentation
- **Type hints**: Required for all function parameters and return values
- **Imports**: Use relative imports with dots (e.g., `from .routers import main_router`)
- **Docstrings**: Use triple quotes with descriptive explanations
- **Naming**: snake_case for variables/functions, PascalCase for classes
- **Error handling**: Use Pydantic validators for input validation
- **Testing**: pytest with FastAPI TestClient, descriptive test function names
- **Logging**: Use logging.config.dictConfig with structured logging
- **Middleware**: Implement custom middleware classes inheriting from BaseHTTPMiddleware