# Use an official Node.js image that includes a full Debian environment
FROM node:20-bullseye-slim

# Install Python 3 for the ATS Engine
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*
# Ensure 'python' command resolves to python3
RUN ln -s /usr/bin/python3 /usr/bin/python || true

WORKDIR /app

# Copy package files and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy all project files (we need both backend and ats_engine directories)
COPY . .

# Set working directory to backend where the Express server lives
WORKDIR /app/backend

# Expose port and start the server
EXPOSE 5000
CMD ["npm", "start"]
