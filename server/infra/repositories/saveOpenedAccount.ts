import { InternalError, OpenedAccount, ACCOUNT } from "../../domain";
import { tryCatchNormalize } from "../FpUtils";
import { pipe, constVoid } from "fp-ts/lib/function";
import { map, mapLeft, chain } from "fp-ts/lib/TaskEither";
import { KnexPersist } from "../RepositoryPostgres";
import { AccountsToUsersModel } from "../entities/AccountsToUsersModel";
import { AccountWithUsersModel } from "../entities/AccountWithUsersModel";

export const saveOpenedAccount: KnexPersist<OpenedAccount> = ({ knex }) => (
  entity: OpenedAccount
) =>
  pipe(
    tryCatchNormalize(async () => {
      await knex<AccountWithUsersModel>("account").insert({
        id: entity.id,
        balance: entity.balance,
        currency: entity.currency,
        name: entity.name,
        state: entity.type,
      });

      await Promise.all(
        entity.usersId.map((userId) =>
          knex<AccountsToUsersModel>("accounts_to_users").insert({
            account_id: entity.id,
            user_id: userId,
          })
        )
      );
    }),
    mapLeft(InternalError),
    map(constVoid)
  );
