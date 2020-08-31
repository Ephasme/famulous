import { KnexPersist } from "../RepositoryPostgres";
import { InternalError, EmptyAccount } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";
import { map, mapLeft } from "fp-ts/lib/TaskEither";

export const saveEmptyAccount: KnexPersist<EmptyAccount> = ({ knex }) => (
  entity
) =>
  pipe(
    tryCatchNormalize(() =>
      knex(entity.model).delete().where({ id: entity.id })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
