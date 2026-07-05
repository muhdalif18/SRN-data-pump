FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy test files and data
COPY . .

# Run tests
CMD ["npx", "playwright", "test", "login.spec.ts"]
