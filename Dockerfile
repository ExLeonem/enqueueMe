# Dockerfile to build & deploy the discord bot
FROM node:14

# Create app directory
WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

CMD ["npm", "start"]