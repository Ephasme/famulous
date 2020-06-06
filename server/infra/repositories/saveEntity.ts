import { SaveAnyEntityPostgres } from "../RepositoryPostgres";
import { USER_CREATED, EMPTY_USER, ACTIVE_USER, AnyEntity } from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import { saveActiveUser } from "./saveActiveUser";
import Knex = require("knex");
import Logger from "../../app/interfaces/Logger";

export const persist: SaveAnyEntityPostgres = (knex, logger) => async (
  entity
) => {
  console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
  switch (entity.type) {
    case USER_CREATED:
      return saveUserCreated(knex, logger)(entity);
    case EMPTY_USER:
      throw new Error("Can't save empty user.");
    case ACTIVE_USER:
      return saveActiveUser(knex, logger)(entity);
  }
  throw new Error("Object unkown");
};

export const saveAll = (knex: Knex<AnyEntity>, logger: Logger) => (
  ...entities: AnyEntity[]
) =>
  knex.transaction((trx) =>
    Promise.all(entities.map(persist(trx, logger))).then(() => {})
  );
