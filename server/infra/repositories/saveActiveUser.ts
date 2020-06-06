import { SaveEntityPostgres, UserModel } from "../RepositoryPostgres";
import { ActiveUser, USER } from "../../domain";

export const saveActiveUser: SaveEntityPostgres<ActiveUser> = (knex) => (
  trx
) => async (entity) => {
  await knex<UserModel>(USER).transacting(trx).insert({
    email: entity.email,
    id: entity.id,
    password: entity.password,
    salt: entity.salt,
    state: entity.type,
  });
  console.log(`Saved active user ${entity.id}`);
  return entity.id;
};
