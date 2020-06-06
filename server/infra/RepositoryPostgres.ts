import {
  Repository,
  USER,
  ACCOUNT,
  AnyUserStateType,
  ACTIVE_USER,
  ActiveUser,
  AnyState,
  AnyDomainType,
  AnyEntity,
  EmptyUser,
  EMPTY_USER,
} from "../domain";
import Knex = require("knex");
import Logger from "../app/interfaces/Logger";
import { saveAll } from "./repositories/saveEntity";

export type UserModel = {
  id: string;
  state: AnyUserStateType;
  email: string;
  password: string;
  salt: string;
};

export type UserCreatedModel = {
  id: string;
  type: string;
  aggregate_id: string;
  aggregate_type: string;
  created_email?: string;
  created_password?: string;
  created_salt?: string;
};

export type SaveAnyEntity = (entity: AnyEntity) => Promise<void>;
export type SaveEntity<T extends AnyEntity> = (entity: T) => Promise<void>;
export type SaveAnyEntityPostgres = (
  knex: Knex<AnyEntity>,
  logger: Logger
) => SaveAnyEntity;
export type SaveEntityPostgres<T extends AnyEntity> = (
  knex: Knex<AnyEntity>,
  logger: Logger
) => SaveEntity<T>;

export class RepositoryPostgres implements Repository {
  constructor(private knex: Knex, private logger: Logger) {}

  saveAll: (...entities: AnyEntity[]) => Promise<void> = saveAll(
    this.knex,
    this.logger
  );

  async fetchOne(
    domainType: AnyDomainType,
    id?: string | undefined
  ): Promise<AnyState> {
    switch (domainType) {
      case USER:
        if (!id) {
          return new EmptyUser();
        }
        const [user] = await this.knex<UserModel>(USER).where({ id });
        switch (user.state) {
          case ACTIVE_USER:
            this.logger.info(`Fetched active user ${user.id}`);
            return new ActiveUser(
              user.id,
              user.email,
              user.password,
              user.salt
            );
          case EMPTY_USER:
            throw new Error("User state is corrupted, should not be empty.");
        }
      case ACCOUNT:
    }
    throw new Error("Object unkown");
  }
}
