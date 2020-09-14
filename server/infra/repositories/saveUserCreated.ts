import { KnexPersist } from "../RepositoryPostgres";
import { UserCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { mapLeft, map } from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { InternalError } from "../../domain/interfaces";
import * as dao from "../orm/entities/events/UserCreated";

export const saveUserCreated: KnexPersist<UserCreated> = ({ em }) => (event) =>
  pipe(
    tryCatch(() => em.save(dao.UserCreated.from(event))),
    mapLeft(InternalError),
    map(constVoid)
  );
