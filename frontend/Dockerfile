FROM node:20

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies cleanly
RUN rm -rf node_modules && npm install

# Now copy the rest of the project
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
