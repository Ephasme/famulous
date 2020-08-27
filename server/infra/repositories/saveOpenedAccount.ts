import { KnexPersist, AccountModel } from "../RepositoryPostgres";
import { InternalError, OpenedAccount, ACCOUNT } from "../../domain";
import { tryCatchNormalize } from "../FpUtils";
import { pipe, constVoid } from "fp-ts/lib/function";
import { map, mapLeft } from "fp-ts/lib/TaskEither";

export const saveOpenedAccount: KnexPersist<OpenedAccount> = ({ knex }) => (
  entity
) =>
  pipe(
    tryCatchNormalize(() =>
      knex<AccountModel>(ACCOUNT).insert({
        id: entity.id,
        balance: entity.balance,
        currency: entity.currency,
        name: entity.name,
        state: entity.type,
      })
    ),
    mapLeft(InternalError),
    map(constVoid)
  );
