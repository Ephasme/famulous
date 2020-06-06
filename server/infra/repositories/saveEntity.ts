import { SaveAnyEntityPostgres } from "../RepositoryPostgres";
import { USER_CREATED, EMPTY_USER, ACTIVE_USER, AnyEntity } from "../../domain";
import { saveUserCreated } from "./saveUserCreated";
import { saveActiveUser } from "./saveActiveUser";
import Knex = require("knex");

export const persist: SaveAnyEntityPostgres = (knex) => (trx) => async (
  entity
) => {
  console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
  switch (entity.type) {
    case USER_CREATED:
      return saveUserCreated(knex)(trx)(entity);
    case EMPTY_USER:
      throw new Error("Can't save empty user.");
    case ACTIVE_USER:
      return saveActiveUser(knex)(trx)(entity);
  }
  throw new Error("Object unkown");
};

export const saveAll = (knex: Knex) => (...entities: AnyEntity[]) =>
  knex.transaction((trx) => {
    return Promise.all(
      entities.map(async (entity) => {
        try {
          const id = await persist(knex)(trx)(entity);
          trx.commit();
          return id;
        } catch (err) {
          trx.rollback();
          throw err;
        }
      })
    );
  });
