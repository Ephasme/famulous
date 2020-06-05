import {
  Repository,
  FindParameters,
  USER,
  ACCOUNT,
  AnyUserState,
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

export type Dependencies = {
  knex: Knex<AnyEntity>;
  logger: Logger;
};

export type PersistAny = (entity: AnyEntity) => Promise<void>;
export type Persist<T extends AnyEntity> = (entity: T) => Promise<void>;
export type KnexPersistAny = (dependencies: Dependencies) => PersistAny;
export type KnexPersist<T extends AnyEntity> = (
  dependencies: Dependencies
) => Persist<T>;

export type SaveAll = (...entities: AnyEntity[]) => Promise<void>;

export class RepositoryPostgres implements Repository {
  private dependencies: Dependencies;

  constructor(private knex: Knex, private logger: Logger) {
    this.dependencies = { knex, logger };
    this.saveAll = saveAll(this.dependencies);
  }

  saveAll: SaveAll;

  private checkUserState = (user: UserModel): AnyState => {
    switch (user.state) {
      case ACTIVE_USER:
        this.logger.info(`Fetched active user ${user.id}`);
        return new ActiveUser(user.id, user.email, user.password, user.salt);
      case EMPTY_USER:
        throw new Error("User state is corrupted, should not be empty.");
      default:
        throw new Error("Object unkown");
    }
  };

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
        return this.checkUserState(user);
      case ACCOUNT:
    }
    throw new Error("Object unkown");
  }

  async find(
    domainType: AnyDomainType,
    parameters: FindParameters
  ): Promise<AnyState[]> {
    switch (domainType) {
      case USER:
        const users = await this.knex<UserModel>(USER).where(parameters);
        return users.map((user) => this.checkUserState(user));
      case ACCOUNT:
    }
    throw new Error("Object unkown");
  }
}
