import { KnexPersist } from "../RepositoryPostgres";
import { AccountCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { InternalError } from "../../domain/interfaces";
import * as dao from "../orm/entities/events/AccountCreated";

export const saveAccountCreated: KnexPersist<AccountCreated> = ({ em }) => (
  event
) =>
  pipe(
    tryCatch(() => em.save(dao.AccountCreated.from(event))),
    mapLeft(InternalError),
    map(constVoid)
  );
