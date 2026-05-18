# Use Node.js for production
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy backend dependencies and install
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source
COPY backend/server.js ./backend/

# Copy frontend built files
COPY frontend/dist ./frontend/dist

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "backend/server.js"]
