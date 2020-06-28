import {
  Repository,
  USER,
  AnyUserStateType,
  ACTIVE_USER,
  ActiveUser,
  AnyEntity,
  EMPTY_USER,
  AnyUserState,
  AsyncResult,
  ErrorWithStatus,
  InternalError,
  NotFound,
  EmptyUser,
} from "../domain";
import Knex = require("knex");
import Logger from "../app/interfaces/Logger";
import { saveAll } from "./repositories/saveEntity";
import { mapLeft, map, chain, right, left } from "fp-ts/lib/TaskEither";
import { fold } from "fp-ts/lib/Option";
import { pipe, flow, constant } from "fp-ts/lib/function";
import { head, map as arrayMap } from "fp-ts/lib/Array";
import { tryCatchNormalize } from "./FpUtils";

export type UserFindParameters = Partial<{
  id: string;
  email: string;
}>;

export type FindParameters = UserFindParameters;

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

export type PersistAny = (entity: AnyEntity) => AsyncResult<void>;
export type Persist<T extends AnyEntity> = (entity: T) => AsyncResult<void>;
export type KnexPersistAny = (dependencies: Dependencies) => PersistAny;
export type KnexPersist<T extends AnyEntity> = (
  dependencies: Dependencies
) => Persist<T>;

export type SaveAll = (...entities: AnyEntity[]) => AsyncResult<void>;

export class RepositoryPostgres implements Repository {
  private dependencies: Dependencies;

  constructor(private knex: Knex, private logger: Logger) {
    this.dependencies = { knex, logger };
    this.saveAll = saveAll(this.dependencies);
  }

  saveAll: SaveAll;

  private modelToState = (user: UserModel): AnyUserState => {
    switch (user.state) {
      case ACTIVE_USER:
        this.logger.info(`Fetched active user ${user.id}`);
        return new ActiveUser(user.id, user.email, user.password, user.salt);
      case EMPTY_USER:
        throw new Error(
          "User state is corrupted, should not be empty in database."
        );
      default:
        throw new Error("Object unkown");
    }
  };

  private findUserBy = (params: { id: string } | { email: string }) =>
    pipe(
      tryCatchNormalize(() => this.knex<UserModel>(USER).where(params)),
      mapLeft(InternalError),
      map(head),
      chain(
        fold(
          constant(right(new EmptyUser() as AnyUserState)),
          flow(this.modelToState, right)
        )
      )
    );

  findUserById = (id: string) => this.findUserBy({ id });

  findUserByEmail = (email: string) => this.findUserBy({ email });

  findAllUsers = pipe(
    tryCatchNormalize(() => this.knex<UserModel>(USER)),
    mapLeft(InternalError),
    map(arrayMap(this.modelToState))
  );
}
