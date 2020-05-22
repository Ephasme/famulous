# Famulous

Famulous is an application that helps you manage your personnal fincance. It is in very early development stages.

## Prerequisites

- Node `>= 10.x`
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [docker-compose](https://docs.docker.com/compose/install/)

## Installation

Run `yarn` into each following folders : `core`, `domain`, `infra`

## Setup locally

- Start local stack:

  ```sh
  cd infra
  yarn run local:setup
  ```

- Stop local stack :

  ```sh
  cd infra
  yarn run local:teardown
  ```

- Database initialization :

  ```sh
  cd infra
  yarn run database:init
  ```

### PgAdmin

#### Access to PgAdmin:

- **URL:** `http://localhost:5050`
- **Username:** pgadmin4@pgadmin.org
- **Password:** admin

#### Add a new server in PgAdmin:

- **Host name/address** `postgres`
- **Port** `5432`
- **Username** `admin`
- **Password** `example`
