#Stage 1
FROM node:10-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install --aot=false
COPY . /app
RUN npm run build --prod --aot=false
