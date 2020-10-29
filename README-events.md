# Data Model

The type milicents is a long that holds a thousandth of the account's currency.

# Account

## Read model

Current balance is always the sum of all the account transactions.

- id: uuid
- user_id: uuid
- name: string
- currency: string
- last_reconciliation_date: Date
- current_balance: milicents

## Events

### Account Created

```ts
type AccountCreated = {
  id: uuid;
  user_id: uuid;
  name: string;
  currency: string;
};
```

### Account Deleted

```ts
type AccountDeleted = { id: uuid };
```

### Account Reconcilied

```ts
type AccountReconcilied = { id: uuid };
```

### Account Name Changed

```ts
type AccountNameChanged = { id: uuid; name: string };
```

# User

## ReadModel

- id: uuid
- first_name: string
- last_name: string
- email: string
- password: string
- salt: string

## Event

### User Created

```ts
type UserCreated = {
  id: uuid;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  salt: string;
};
```

### User Deleted

```ts
type UserDeleted = {
  id: uuid;
};
```

### User Profile Changed

```ts
type UserProfileChanged = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};
```

UserPasswordChanged: password, salt
UserConnected: id
UserDisconnected: id

# Enveloppe

## Read Model

Only leaf categories can hold money.

Current balance is the sum of all its children enveloppe balances OR its own current balance if its a leaf.

- id: uuid
- type: "root" | "composite" | "leaf"
- parent_id: uuid
- name: string
- current_balance: milicents

## Events

# Transaction

## Read Model

### Enveloppes

- id: uuid
- account_id: uuid
- amount: cents
- status: "reconcilied" | "entered" | "cleared"
- parent_id: uuid

### EnveloppeSplits

One transaction can be splited to different enveloppes but the sum of all assignations must be equal to the transaction amount.

- id: uuid
- transaction_id: uuid
- enveloppe_id: uuid | null
- account_id: uuid | null
- label: string
- amount: cents

## Events

### Common types

```typescript
type EnveloppeTarget = { enveloppe_id: uuid; amount: Milicents; label: string };
type AccountTarget = { account_id: uuid; amount: Milicents; label: string };
type Target = EnveloppeTarget | AccountTarget;
type Split = { [id: uuid]: Target };
```

### Transaction Created

```typescript
type TransactionCreated = {
  id: uuid;
  account_id: uuid;
  split: Split;
};
```

### Transaction Deleted

```typescript
type TransactionDeleted = { id: uuid };
```

### Transaction Split Changed

```typescript
type TransactionSplitChanged = {
  id: uuid;
  newSplit: Split;
};
```
