import { UserCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { AsyncResult } from "../../domain/interfaces";
import { UserCreatedDao, UserDao } from "../entities/User";
import { PersistDependencies } from "./persist";

export const saveUserCreated = ({ em }: PersistDependencies) => (
  event: UserCreated
): AsyncResult<void> =>
  pipe(
    tryCatch(() => em.save(UserCreatedDao.from(event))),
    TE.map(() =>
      UserDao.create({
        id: event.aggregate.id,
        state: "created",
        createdAt: event.createdAt,
        ...event.payload,
      })
    ),
    TE.chain((dao) => tryCatch(() => em.save(dao))),
    TE.map(constVoid)
  );
