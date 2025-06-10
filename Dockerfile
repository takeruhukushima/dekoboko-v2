FROM node:22

# Install Firebase CLI
RUN npm install -g firebase-tools

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose ports
EXPOSE 3000 8080 9099 9199 5001 9000

# Start the application
CMD ["npm", "run", "dev"]