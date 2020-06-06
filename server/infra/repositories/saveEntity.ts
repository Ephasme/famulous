import { SaveAnyEntityPostgres } from "../RepositoryPostgres";
import { USER_CREATED, EMPTY_USER, ACTIVE_USER, AnyEntity } from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import { saveActiveUser } from "./saveActiveUser";
import Knex = require("knex");
import Logger from "../../app/interfaces/Logger";
import { isError, isString } from "util";

export const persist: SaveAnyEntityPostgres = (knex, logger) => (trx) => async (
  entity
) => {
  console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
  switch (entity.type) {
    case USER_CREATED:
      return saveUserCreated(knex, logger)(trx)(entity);
    case EMPTY_USER:
      throw new Error("Can't save empty user.");
    case ACTIVE_USER:
      return saveActiveUser(knex, logger)(trx)(entity);
  }
  throw new Error("Object unkown");
};

export const saveAll = (knex: Knex, logger: Logger) => (
  ...entities: AnyEntity[]
) =>
  knex.transaction(async (trx) => {
    try {
      const results = await Promise.all(
        entities.map(async (entity) => await persist(knex, logger)(trx)(entity))
      );
      trx.commit();
      results.map((id) => logger.info(`entity ${id} persisted to database`));
      return results;
    } catch (err) {
      trx.rollback();
      if (isError(err)) {
        logger.error(err.message);
      } else if (isString(err)) {
        logger.error(err);
      } else {
        logger.error("can't display error message");
      }
      throw err;
    }
  });
