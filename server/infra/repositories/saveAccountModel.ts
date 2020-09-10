import { Dependencies } from "../RepositoryPostgres";
import {
  AccountCreated,
  AccountDeleted,
  ACCOUNT_CREATED,
  AccountModel,
  ACCOUNT_DELETED,
} from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatchNormalize } from "../FpUtils";
import { AccountsToUsersModel } from "../entities/AccountsToUsersModel";
import { map, mapLeft } from "fp-ts/lib/TaskEither";
import { InternalError } from "../../domain/interfaces";

export const saveAccountModel = ({ knex }: Dependencies) => (
  event: AccountCreated | AccountDeleted
) => {
  switch (event.type) {
    case ACCOUNT_CREATED:
      return pipe(
        tryCatchNormalize(() =>
          knex<AccountModel>("account")
            .insert({
              id: event.aggregate.id,
              balance: 0,
              currency: event.payload.currency,
              name: event.payload.name,
              state: "opened",
            })
            .then(() =>
              knex<AccountsToUsersModel>("accounts_to_users").insert({
                account_id: event.aggregate.id,
                user_id: event.payload.userId,
              })
            )
        ),
        mapLeft(InternalError),
        map(constVoid)
      );
    case ACCOUNT_DELETED:
      return pipe(
        tryCatchNormalize(() =>
          knex<AccountsToUsersModel>("accounts_to_users")
            .where({ account_id: event.aggregate.id })
            .delete()
            .then(() =>
              knex<AccountModel>("account")
                .where({ id: event.aggregate.id })
                .delete()
            )
        ),
        mapLeft(InternalError),
        map(constVoid)
      );
  }
};
