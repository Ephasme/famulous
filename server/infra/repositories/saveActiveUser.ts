import { SaveEntityPostgres, UserModel } from "../RepositoryPostgres";
import { ActiveUser, USER } from "../../domain";

export const saveActiveUser: SaveEntityPostgres<ActiveUser> = (knex) => async (
  entity
) =>
  knex<UserModel>(USER).insert({
    email: entity.email,
    id: entity.id,
    password: entity.password,
    salt: entity.salt,
    state: entity.type,
  });
