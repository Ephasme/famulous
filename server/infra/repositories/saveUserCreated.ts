import { UserCreatedModel, KnexPersist } from "../RepositoryPostgres";
import { UserCreated } from "../../domain";

export const saveUserCreated: KnexPersist<UserCreated> = ({ knex }) => async (
  entity
) =>
  knex<UserCreatedModel>("user_events").insert({
    id: entity.id,
    type: entity.type,
    aggregate_id: entity.aggregate.id,
    aggregate_type: entity.aggregate.type,
    created_email: entity.payload.email,
    created_password: entity.payload.password,
    created_salt: entity.payload.salt,
  });
