import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("account", function (table) {
    table.uuid("id").notNullable().unique().index();
    table.string("state").notNullable();
    table.string("name").notNullable();
    table.string("currency").notNullable();
    table.string("balance").notNullable();
  });
  await knex.schema.createTable("account_events", function (table) {
    table.uuid("id").notNullable().unique().index();
    table.string("type").notNullable();
    table.string("aggregate_id").notNullable();
    table.string("aggregate_type").notNullable();
    table.string("created_name");
    table.uuid("created_user_id");
    table.string("created_currency");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("user", function (table) {
    table.dropColumn("salt");
  });
}
