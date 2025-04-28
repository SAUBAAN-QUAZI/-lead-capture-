# Charity Lead Capture Agent

A lead capturing agent for charity foundations that uses OpenAI GPT for natural conversations with potential donors/volunteers and captures lead information.

## Project Structure

- **Backend**: Python FastAPI application with OpenAI integration
- **Frontend**: Next.js with TypeScript and Tailwind CSS

## Backend Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the `lead_capture_app` directory:
```bash
cp lead_capture_app/env.example lead_capture_app/.env
```

3. Edit the `.env` file to add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key
```

4. Run the FastAPI backend:
```bash
cd lead_capture_app
python run.py
```

The API will be available at `http://localhost:8000`

- API documentation: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## Frontend Setup

Follow the instructions in `frontend_setup.txt` to create and run the Next.js frontend.

## API Endpoints

- `GET /`: Welcome message
- `POST /chat`: Chat with the lead capture agent
- `GET /leads`: Get all captured leads
- `GET /leads/{lead_id}`: Get a specific lead by ID

## Deployment

- Backend: Deploy to Render
- Frontend: Deploy to Vercel

## Environment Variables

### Backend
- `OPENAI_API_KEY`: Your OpenAI API key
- `HOST`: Host for the FastAPI server (default: 0.0.0.0)
- `PORT`: Port for the FastAPI server (default: 8000)

### Frontend
- `NEXT_PUBLIC_API_URL`: URL of the backend API 