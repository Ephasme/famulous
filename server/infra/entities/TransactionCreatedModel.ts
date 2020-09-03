export type TransactionCreatedModel = {
  id: string;
  type: string;
  aggregate_id: string;
  aggregate_type: string;
  account_id: string;
  targets: string;
};
