import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("user", function (table) {
    table.string("salt").nullable();
  });
  await knex.schema.alterTable("user_events", function (table) {
    table.string("created_salt").nullable();
  });

  await knex("user").update({ salt: "default_salt" });
  await knex("user_events").update({ created_salt: "default_salt" });

  await knex.schema.alterTable("user", function (table) {
    table.string("salt").notNullable().alter();
  });
  await knex.schema.alterTable("user_events", function (table) {
    table.string("created_salt").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("user", function (table) {
    table.dropColumn("salt");
  });
}
