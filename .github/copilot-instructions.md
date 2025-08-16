Agent Tasks: Local Next.js + FastAPI Starter Setup
1. Initialize Project Structure

Create a root project folder: my-app/

Inside it, create:

frontend/ (Next.js)

backend/ (FastAPI)

2. Setup Backend (FastAPI)

Tasks:

In backend/, create a Python virtual environment.

Install dependencies:

pip install fastapi uvicorn


Create main.py with:

A FastAPI app

CORS middleware allowing http://localhost:3000

Routes:

GET /hello → returns greeting message

POST /send → adds message to in-memory list and returns all messages

GET /messages → returns all messages

Add a requirements.txt file:

fastapi
uvicorn


Ensure backend runs with:

uvicorn main:app --reload --port 8000

3. Setup Frontend (Next.js)

Tasks:

In frontend/, initialize Next.js:

npx create-next-app@latest .


Remove boilerplate styles.

In pages/index.js:

Add an input for user text.

Add buttons:

Greet → calls backend /hello?name=...

Send Message → calls backend /send?msg=...

Display:

Single greeting message

List of all messages

Store backend URL in a constant:

const backendUrl = "http://localhost:8000";

4. Run & Test Locally

Tasks:

Open Terminal 1 in backend/:

uvicorn main:app --reload --port 8000


Open Terminal 2 in frontend/:

npm run dev


Open browser at http://localhost:3000 and:

Type name → click Greet → should display greeting from backend.

Type text → click Send Message → should append to list.

5. (Optional) Add Agent Enhancements

Task: Add .env support for backend URL in frontend.

Task: Add TypeScript support in frontend.

Task: Add hot reload for backend.

Task: Create shared API types for type safety between frontend and backend.