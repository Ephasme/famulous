FROM node:12.16.3 AS build

WORKDIR /app
COPY . .
RUN yarn build

FROM node:12.16.3 AS web

WORKDIR /famulous
COPY --from=build /app/server/dist                  dist/
COPY --from=build /app/server/package.json          .
COPY --from=build /app/server/yarn.lock             .

RUN yarn --production

EXPOSE 3001

CMD yarn start:production
