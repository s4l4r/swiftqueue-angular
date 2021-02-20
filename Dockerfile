#Stage 1
FROM node:10.13.0-stretch as build-step
WORKDIR /app
COPY package*.json /app/
RUN npm install --aot=false
COPY ./ /app/
ARG configuration=production
RUN npm run build --prod --aot=false --build-optimizer=false
ENTRYPOINT ["node_modules/.bin/ng", "serve", "--prod", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
