#!/bin/bash
VPS_IP="49.13.237.226"

echo "Deploying to $VPS_IP..."

# 1. Copy files
echo "Syncing files..."
rsync -av --exclude 'node_modules' --exclude 'venv' --exclude '.next' --exclude '.git' --exclude '.gemini' \
  ./ root@$VPS_IP:/opt/sanskrit-app/

# 2. Start Docker
echo "Starting Application..."
# Note: We assume GEMINI_API_KEY is available in the current shell. 
# If not, you might need to edit this line or export it before running.
ssh root@$VPS_IP "cd /opt/sanskrit-app && echo \"GEMINI_API_KEY=${GEMINI_API_KEY}\" > .env && docker compose up -d --build"

echo "Deployment Complete!"
