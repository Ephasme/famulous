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
  USER_CREATED,
} from "../domain";
import Knex = require("knex");
import Logger from "../app/interfaces/Logger";

type UserModel = {
  id: string;
  state: AnyUserStateType;
  email: string;
  password: string;
  salt: string;
};

type UserCreatedModel = {
  id: string;
  type: string;
  aggregate_id: string;
  aggregate_type: string;
  created_email?: string;
  created_password?: string;
  created_salt?: string;
};

export class RepositoryPostgres implements Repository {
  constructor(private knex: Knex, private logger: Logger) {}

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
  async save(entity: AnyEntity): Promise<string> {
    this.logger.info(`trying to save ${JSON.stringify(entity, null, 4)}`);
    switch (entity.type) {
      case USER_CREATED:
        await this.knex<UserCreatedModel>("user_events").insert({
          id: entity.id,
          type: entity.type,
          aggregate_id: entity.aggregate.id,
          aggregate_type: entity.aggregate.type,
          created_email: entity.payload.email,
          created_password: entity.payload.password,
          created_salt: entity.payload.salt,
        });
        this.logger.info(`Saved event user_created ${entity.aggregate.id}`);
        return entity.id;
      case EMPTY_USER:
        throw new Error("Can't save empty user.");
      case ACTIVE_USER:
        await this.knex<UserModel>(USER).insert({
          email: entity.email,
          id: entity.id,
          password: entity.password,
          salt: entity.salt,
          state: entity.type,
        });
        this.logger.info(`Saved active user ${entity.id}`);
        return entity.id;
    }
    throw new Error("Object unkown");
  }
}
