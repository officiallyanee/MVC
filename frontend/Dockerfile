# Use Node.js official image (using LTS version)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy source code
COPY . .

# Create vite cache directory with proper permissions
RUN mkdir -p node_modules/.vite && chmod -R 755 node_modules/.vite

# Expose Vite development port
EXPOSE 5173

# Start development server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]