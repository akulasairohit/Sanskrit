FROM node:20-slim

# Install Python and build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup Python Environment
# We create a venv and add it to PATH so the app finds 'python' and 'pip' easily
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Setup Node Environment
COPY web/package.json web/package-lock.json ./web/
WORKDIR /app/web
RUN npm ci

# Copy the rest of the application source code
WORKDIR /app
COPY . .

# Build Next.js
WORKDIR /app/web
# Note: GEMINI_API_KEY is needed at build time for static generation if used, 
# but mostly at runtime. We'll pass it as an ARG just in case.
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
