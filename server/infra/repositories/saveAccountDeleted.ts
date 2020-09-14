import { KnexPersist } from "../RepositoryPostgres";
import { AccountDeletedModel } from "../entities/AccountDeletedModel";
import { AccountDeleted } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatch } from "../FpUtils";
import { map, mapLeft } from "fp-ts/lib/TaskEither";
import { InternalError } from "../../domain/interfaces";
import * as dao from "../orm/entities/events/AccountDeleted";

export const saveAccountDeleted: KnexPersist<AccountDeleted> = ({ em }) => (
  event
) =>
  pipe(
    tryCatch(() => em.save(dao.AccountDeleted.from(event))),
    mapLeft(InternalError),
    map(constVoid)
  );
