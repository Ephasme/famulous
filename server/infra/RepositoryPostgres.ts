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
  InternalError,
  EmptyUser,
  ErrorWithStatus,
} from "../domain";
import Knex = require("knex");
import Logger from "../app/interfaces/Logger";
import { saveAll } from "./repositories/saveEntity";
import {
  mapLeft,
  map,
  chain,
  right,
  fromEither,
  flatten,
} from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe, flow, constant } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
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

const modelToState = (
  user: UserModel
): E.Either<ErrorWithStatus, AnyUserState> => {
  switch (user.state) {
    case ACTIVE_USER:
      return E.right(
        new ActiveUser(user.id, user.email, user.password, user.salt)
      );
    case EMPTY_USER:
      return E.left(
        InternalError(
          "User state is corrupted, should not be empty in database."
        )
      );
    default:
      return E.left(InternalError("Object unkown"));
  }
};

const modelsToStates = (
  users: UserModel[]
): E.Either<ErrorWithStatus, AnyUserState[]> =>
  pipe(users, A.map(modelToState), A.sequence(E.either));

export class RepositoryPostgres implements Repository {
  private dependencies: Dependencies;

  constructor(private knex: Knex, private logger: Logger) {
    this.dependencies = { knex, logger };
    this.saveAll = saveAll(this.dependencies);
  }

  private findUserBy = (params: { id: string } | { email: string }) =>
    pipe(
      tryCatchNormalize(() => this.knex<UserModel>(USER).where(params)),
      mapLeft(InternalError),
      map(A.head),
      chain(
        O.fold(
          constant(right(new EmptyUser() as AnyUserState)),
          flow(modelToState, fromEither)
        )
      )
    );

  saveAll: SaveAll;
  findUserById = (id: string) => pipe({ id }, this.findUserBy);
  findUserByEmail = (email: string) => pipe({ email }, this.findUserBy);
  findAllUsers = pipe(
    tryCatchNormalize(() => this.knex<UserModel>(USER)),
    mapLeft(InternalError),
    map(modelsToStates),
    map(fromEither),
    flatten
  );
}
