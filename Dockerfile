# Specify the base image
FROM node:24-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the frontend (Vite)
RUN npm run build

# Expose the port the app runs on (Cloud Run expects PORT environment variable, defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Ensure the server knows it's running in production mode
ENV NODE_ENV=production

# Start the Node.js Express server
CMD ["tsx", "server.ts"]
