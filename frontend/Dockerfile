FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Run dev server (accessible from outside container)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
