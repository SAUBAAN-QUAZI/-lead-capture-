# Deployment Guide

This guide covers deployment configuration for both the backend and frontend components of the Lead Capture application.

## Backend Deployment (Render)

### Environment Variables

Set the following environment variables in your Render dashboard:

```
OPENAI_API_KEY=your_api_key_here
ENVIRONMENT=production
ALLOWED_ORIGINS=https://lead-capture-gamma.vercel.app,http://localhost:3000
```

### Build Command

```
pip install -r requirements.txt
```

### Start Command

```
cd lead_capture_app && python run.py
```

### Health Check

Once deployed, verify your backend is working by visiting:
- `/health` - Should return server health status
- `/test-openai` - Should test the OpenAI connection

## Frontend Deployment (Vercel)

### Environment Variables

Set these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://lead-capture-9mnb.onrender.com
```

### Build Settings

Use the default Next.js build settings in Vercel.

## Troubleshooting

### CORS Issues

If experiencing CORS errors:
1. Verify the backend's CORS settings include the frontend domain
2. Check the request is going to the correct backend URL
3. Try clearing browser cache and cookies

### API Connection Issues

If the backend can't connect to OpenAI:
1. Run `python test_api_key.py` to verify your API key
2. Check if the API key has regional restrictions
3. Verify Render's outbound connections aren't blocked

### Frontend/Backend Mismatch

If the frontend and backend versions are out of sync:
1. Deploy both with matching versions
2. Check the API URLs in the frontend code
3. Verify the frontend is connecting to the correct backend

## Local Development

Run the backend locally:
```
cd lead_capture_app
python run.py
```

Run the frontend locally:
```
cd lead-capture-frontend
npm install
npm run dev
```

## Multi-Environment Support

The application is designed to work in both development and production environments:

- The frontend detects if it's running on localhost and adjusts API URLs accordingly
- The backend allows connections from both local and production frontends
- Error handling and fallbacks ensure graceful degradation 