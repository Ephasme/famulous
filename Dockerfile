FROM node:12.16.3 AS build

WORKDIR /app
COPY . .
RUN ./scripts/install.sh
RUN ./scripts/build.sh

FROM node:12.16.3-alpine AS run

WORKDIR /main
COPY --from=build /app/server/dist dist/
COPY --from=build /app/client/build dist/client/
COPY --from=build /app/server/package.json .
RUN yarn --production

CMD ["node", "/main/dist/app/index.js"]

