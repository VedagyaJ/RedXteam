# Step 1: Build React frontend
FROM node:18 AS frontend

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build


# Step 2: Build backend and serve frontend
FROM node:18

# Create app directory
WORKDIR /app

# Copy backend files
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy server source code
COPY server/ ./server

# Copy built frontend
COPY --from=frontend /app/client/dist ./server/public

# Set working dir to server
WORKDIR /app/server

# Set environment variables (optional)
ENV PORT=8080

# Start the backend (serves both API and frontend)
CMD ["npm", "start"]
