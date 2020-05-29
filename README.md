# Famulous

Famulous is an application that helps you manage your personnal fincance. It is in very early development stages.

## Prerequisites

- Node `>= 10.x`
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [docker-compose](https://docs.docker.com/compose/install/)

## Installation

```
yarn
```

## Setup locally

- Start local stack:

  ```sh
  yarn run local:setup
  ```

- Stop local stack :

  ```sh
  yarn run local:teardown
  ```

- Database initialization :

  ```sh
  yarn run database:init
  ```

- Database update :

  ```sh
  yarn run knex migrate:latest
  ```

### PgAdmin (with default environment variables)

#### Access to PgAdmin:

- **URL:** `http://localhost:5050`
- **Username:** pgadmin4@pgadmin.org
- **Password:** admin

#### Add a new server in PgAdmin:

- **Host name/address** `postgres`
- **Port** `5432`
- **Username** `admin`
- **Password** `example`
