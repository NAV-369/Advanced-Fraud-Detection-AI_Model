# Deployment Guide for Fraud Detection System

This guide explains how to deploy the Fraud Detection System to Render.com.

## Prerequisites

1. A [Render.com](https://render.com) account
2. Git repository with your codebase

## Deployment Steps

### 1. Push your code to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Render

#### Option 1: Using the render.yaml Blueprint

1. Log in to your Render dashboard
2. Click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and create both services:
   - Backend API (Flask server)
   - Frontend Dashboard (React app)

#### Option 2: Manual Deployment

If the Blueprint method doesn't work, you can deploy services individually:

##### Backend API:

1. From Render dashboard, click "New" > "Web Service"
2. Connect your GitHub repository
3. Use the following settings:
   - Name: `fraud-detection-api`
   - Environment: `Python`
   - Build Command: `python -m pip install --upgrade pip && pip install -r api/requirements.txt`
   - Start Command: `cd api && gunicorn app:app`
   - Add these environment variables:
     - `FLASK_ENV`: `production`
     - `PYTHONPATH`: `./api`

##### Frontend Dashboard:

1. From Render dashboard, click "New" > "Static Site"
2. Connect your GitHub repository
3. Use these settings:
   - Name: `fraud-detection-frontend`
   - Build Command: `cd fraud-dashboard && npm install && npm run build`
   - Publish Directory: `fraud-dashboard/dist`
   - Add these environment variables:
     - `NODE_ENV`: `production`
     - `VITE_API_URL`: (URL of your deployed API service)

### 3. Configure Frontend to Connect with Backend

After deployment, update the frontend configuration to point to your API:

1. Go to the Static Site settings in Render
2. Add environment variable `VITE_API_URL` with the URL of your deployed API service
3. Trigger a new deployment

## Troubleshooting

If you encounter deployment issues:

1. Check Render logs for both services
2. Verify environment variables are set correctly
3. Ensure all dependencies are included in requirements.txt and package.json
4. Check that the model file is correctly loaded in the API

## Post-Deployment Verification

After successful deployment:

1. Visit your frontend URL to verify the dashboard loads
2. Test the API health endpoint (usually `/health`)
3. Verify that predictions work correctly

For questions or issues, refer to the [Render documentation](https://render.com/docs) or open an issue in the GitHub repository. 