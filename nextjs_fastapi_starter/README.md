# Next.js + FastAPI Starter

A local development setup with a Next.js frontend and FastAPI backend.

## Project Structure

```
nextjs_fastapi_starter/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── .venv/           # Python virtual environment
└── frontend/
    ├── pages/
    │   └── index.tsx     # Main page
    ├── package.json      # Node.js dependencies
    └── node_modules/     # Node.js packages
```

## Features

- **Backend (FastAPI)**:
  - `GET /hello?name=<name>` - Returns a greeting message
  - `POST /send?msg=<message>` - Adds message to in-memory list
  - `GET /messages` - Returns all stored messages
  - CORS enabled for localhost:3000

- **Frontend (Next.js)**:
  - Input field for text entry
  - "Greet" button - calls `/hello` endpoint
  - "Send Message" button - calls `/send` endpoint
  - Displays greeting message and list of all messages

## Running the Application

### Prerequisites
- Python 3.7+ installed
- Node.js 18+ installed

### Start Backend (Port 8000)
```powershell
cd backend
& "C:\Users\SOKKER\Desktop\PY project 1\.venv\Scripts\python.exe" -m uvicorn main:app --reload --port 8000
```

### Start Frontend (Port 3000)
```powershell
cd frontend
npm run dev
```

### Access the Application
Open your browser and go to: http://localhost:3000

## Usage

1. Enter text in the input field
2. Click "Greet" to get a greeting from the backend
3. Click "Send Message" to add the text to the message list
4. The page automatically loads existing messages on startup

## API Endpoints

- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:3000
- API documentation: http://localhost:8000/docs (FastAPI automatic docs)

## Development Notes

- Backend uses in-memory storage (messages reset on server restart)
- Frontend includes error handling for API calls
- CORS is configured to allow frontend-backend communication
- Both servers support hot reload for development
