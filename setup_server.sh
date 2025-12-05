#!/bin/bash

# Update system
echo "Updating system..."
apt update && apt upgrade -y

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
echo "Installing Docker Compose..."
apt install -y docker-compose-plugin

# Setup Firewall (UFW)
echo "Configuring Firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create App Directory
mkdir -p /opt/sanskrit-app

echo "Server setup complete! Docker is ready."
