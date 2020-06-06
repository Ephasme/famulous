import { UserCreatedModel, SaveEntityPostgres } from "../RepositoryPostgres";
import { UserCreated } from "../../domain";

export const saveUserCreated: SaveEntityPostgres<UserCreated> = (knex) => (
  trx
) => async (entity) => {
  await knex<UserCreatedModel>("user_events").transacting(trx).insert({
    id: entity.id,
    type: entity.type,
    aggregate_id: entity.aggregate.id,
    aggregate_type: entity.aggregate.type,
    created_email: entity.payload.email,
    created_password: entity.payload.password,
    created_salt: entity.payload.salt,
  });
  console.log(`Saved event user_created ${entity.aggregate.id}`);
  return entity.id;
};
