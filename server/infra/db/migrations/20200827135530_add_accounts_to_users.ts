import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("accounts_to_users", function (table) {
    table.uuid("account_id").notNullable();
    table.uuid("user_id").notNullable();

    table.foreign("account_id").references("account.id");
    table.foreign("user_id").references("user.id");

    table.index(["account_id", "user_id"]);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("accounts_to_users");
}
