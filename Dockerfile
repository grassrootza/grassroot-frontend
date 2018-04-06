FROM node:9.4.0-alpine as node

WORKDIR /app

COPY package.json /app/

#RUN npm install

COPY ./ /app/

ARG env=prod
ARG NODE_ENV=production

#RUN ng build --environment=prod --target=production --output-hashing none
#RUN npm run build -- --aot --build-optimizer --environment=$env

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13.8-alpine

COPY --from=node /app/dist/ /usr/share/nginx/html

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
