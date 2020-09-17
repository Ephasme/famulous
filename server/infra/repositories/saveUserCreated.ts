import { UserCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { AsyncResult, InternalError } from "../../domain/interfaces";
import * as dao from "../entities/events/UserCreated";
import { User } from "../entities/User";
import { PersistDependencies } from "./persist";

export const saveUserCreated = ({ em }: PersistDependencies) => (
  event: UserCreated
): AsyncResult<void> =>
  pipe(
    tryCatch(() => em.save(dao.UserCreated.from(event))),
    TE.map(() =>
      User.create({
        id: event.aggregate.id,
        state: "created",
        createdAt: event.createdAt,
        ...event.payload,
      })
    ),
    TE.chain((dao) => tryCatch(() => em.save(dao))),
    TE.mapLeft(InternalError),
    TE.map(constVoid)
  );
