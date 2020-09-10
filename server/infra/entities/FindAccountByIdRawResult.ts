export type FindAccountByIdRawResult = {
  "account.id": string;
  "account.state": "opened" | "closed";
  "account.name": string;
  "account.balance": number;
  "account.currency": string;
  "transaction.id": string;
  "transaction_to_target.transaction_id": string;
  "transaction_to_target.account_id": string;
  "transaction_to_target.amount": number;
};
