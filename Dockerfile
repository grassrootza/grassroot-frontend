FROM keymetrics/pm2:latest-alpine

WORKDIR /app

COPY package.json /app/

COPY ./ /app/

ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT 4200

ARG env=prod
ARG NODE_ENV=production

RUN npm install --production

EXPOSE 4200

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]
