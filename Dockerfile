#Stage 1
FROM node:10.13.0-stretch as build-step
WORKDIR /app
COPY package*.json /app/
RUN npm install --aot=false
COPY ./ /app/
ARG configuration=production
RUN npm ng build --prod --aot=false --build-optimizer=false
ENTRYPOINT["npm", "run", "prod"]
