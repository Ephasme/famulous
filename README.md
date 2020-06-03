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

- Start application locally (implicitly start local stack) :

  ```sh
  yarn dev:start
  ```

- Start local stack:

  ```sh
  yarn dev:setup
  ```

- Stop local stack :

  ```sh
  yarn dev:teardown
  ```

- Database initialization :

  ```sh
  yarn database:init
  ```

- Database update :

  ```sh
  yarn migrate
  ```

### PgAdmin (with default environment variables)

#### Access to PgAdmin:

- **URL:** `http://localhost:5050`
- **Username:** admin@famulous.app
- **Password:** admin

#### Add a new server in PgAdmin:

- **Host name/address** `postgres`
- **Port** `5432`
- **Username** `admin`
- **Password** `example`

### Maintenance

- Add database migration:

  ```sh
  yarn knex migrate:make {{MIGRATION_NAME}} -x ts
  ```
