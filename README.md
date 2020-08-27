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

## Environment variables

| Name         | Exemple                                          | Required | Description                        |
| :----------- | :----------------------------------------------- | :------- | ---------------------------------- |
| DATABASE_URL | postgres://admin:example@localhost:5432/famulous | true     | Database connection string         |
| JWT_SECRET   | jwt_famulous_secret_key                          | true     | Secret key used to sign JWT tokens |

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

# Data Model

# Account

## Read model

id: uuid
user_id: uuid
name: string
last_reconciliation_date: Date
// sum of all transaction in Famulous for this account
current_balance: milicents

## Events

AccountCreated: id, user_id, name
AccountDeleted: id
AccountReconcilied: id, reconciliationDate
AccountNameChanged: id, name

# User

## ReadModel

id: uuid
first_name: string
last_name: string
email: string
password: string
salt: string

## Event

UserCreated: id, first_name, last_name, email, password, salt
UserDeleted: id
UserProfileChanged: first_name?, last_name?, email?
UserPasswordChanged: password, salt
UserConnected: id
UserDisconnected: id

# Enveloppe

## Read Model

// Only leaf categories can hold money
id: uuid
type: "root" | "composite" | "leaf"
parent_id: uuid
name: string
current_balance: milicents // sum of all child enveloppe OR current balance if leaf

## Events

# Transaction

## Read Model

### Main

id: uuid
account_id: uuid
amount: cents
status: "reconcilied" | "entered" | "cleared"
parent_id: uuid

### EnveloppeMapping

// 1 transaction can be assigned to multiple enveloppe but
// the sum of all assignation must be equal to the transaction amount

id: uuid
transaction_id: uuid
enveloppe_id: uuid
amount: cents

## Events

```typescript
type TransactionCreated = {
  id: uuid;
  account_id: uuid;
  targets: [
    | {
        enveloppe_id: uuid;
        amount: cents;
      }
    | {
        account_id: uuid;
        amount: cents;
      }
  ];
};
```

TransactionDeleted: id
