import { KnexPersist } from "../RepositoryPostgres";
import { UserCreated } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { tryCatch } from "../FpUtils";
import { InternalError } from "../../domain/interfaces";
import * as dao from "../orm/entities/events/UserCreated";
import { User } from "../orm/entities/User";

export const saveUserCreated: KnexPersist<UserCreated> = ({ em }) => (event) =>
  pipe(
    tryCatch(() => em.save(dao.UserCreated.from(event))),
    TE.map(() =>
      User.create({
        id: event.aggregate.id,
        state: "created",
        ...event.payload,
      })
    ),
    TE.chain((dao) => tryCatch(() => em.save(dao))),
    TE.mapLeft(InternalError),
    TE.map(constVoid)
  );
