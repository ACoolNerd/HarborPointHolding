# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install clean production dependencies
RUN npm ci --only=production

# Copy codebase
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
