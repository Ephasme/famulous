import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", function (table) {
    table.uuid("id").notNullable().unique().index();
    table.string("state").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
  });
  await knex.schema.createTable("user_events", function (table) {
    table.uuid("id").notNullable().unique().index();
    table.string("type").notNullable();
    table.string("aggregate_id").notNullable();
    table.string("aggregate_type").notNullable();
    table.string("created_email");
    table.string("created_password");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user");
  await knex.schema.dropTable("user_events");
}
