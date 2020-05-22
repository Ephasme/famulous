import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("email").notNullable();
    table.string("name").notNullable();
    table.string("firstanme").notNullable();
    table.string("password").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
