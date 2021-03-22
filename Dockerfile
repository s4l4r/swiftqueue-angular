# Stage 1 - Building the app for production
FROM node:12.8.1 AS compile-image
WORKDIR /opt/app
ENV PATH="./node_modules/.bin:$PATH"
COPY . ./
RUN npm install
RUN npm run build --prod

# Stage 2 - Add it to Nginx
FROM nginx:latest
COPY --from=compile-image /opt/app/dist/swiftqueue-angular /usr/share/nginx/html
EXPOSE 80
