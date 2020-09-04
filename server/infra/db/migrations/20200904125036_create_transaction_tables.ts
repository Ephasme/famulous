import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transaction", function (table) {
    table.uuid("id").notNullable().unique().index();
    table.uuid("account_id").notNullable();

    table.foreign("account_id").references("account.id");
  });
  await knex.schema.createTable("transaction_to_target", function (table) {
    table.uuid("transaction_id").notNullable();
    table.uuid("account_id").notNullable();
    table.bigInteger("amount").notNullable();

    table.foreign("transaction_id").references("transaction.id");
    table.foreign("account_id").references("account.id");

    table.index(["account_id", "transaction_id"]);
  });
  await knex.schema.createTable("transaction_events", function (table) {
    table.uuid("id").notNullable().unique().index();
    table.string("type").notNullable();
    table.string("aggregate_id").notNullable();
    table.string("aggregate_type").notNullable();
    table.uuid("account_id").notNullable();
    table.jsonb("targets").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transaction");
  await knex.schema.dropTable("transaction_to_target");
  await knex.schema.dropTable("transaction_events");
}
