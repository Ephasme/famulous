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
  constructor(private knex: Knex) {}

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
            console.log(`Fetched active user ${user.id}`);
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
    console.log(`trying to save ${JSON.stringify(entity, null, 4)}`);
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
        console.log(`Saved event user_created ${entity.aggregate.id}`);
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
        console.log(`Saved active user ${entity.id}`);
        return entity.id;
    }
    throw new Error("Object unkown");
  }
}
