import { AnyUserEvent, USER_CREATED, USER_DELETED } from "../../domain";
import { pipe, constVoid } from "fp-ts/lib/function";
import { tryCatch } from "../FpUtils";
import { ErrorWithStatus, InternalError } from "../../domain/interfaces";
import * as TE from "fp-ts/TaskEither";
import { TaskEither } from "fp-ts/TaskEither";
import { EntityManager } from "typeorm";
import { User } from "../orm/entities/User";

export const saveUserModel = ({ em }: { em: EntityManager }) => (
  event: AnyUserEvent
): TaskEither<ErrorWithStatus, void> => {
  switch (event.event_type) {
    case USER_CREATED:
      return pipe(
        User.create({
          id: event.aggregate.id,
          state: "created",
          ...event.payload,
        }),
        (dao) => tryCatch(() => em.save(dao)),
        TE.mapLeft(InternalError),
        TE.map(constVoid)
      );
    case USER_DELETED:
      return pipe(
        tryCatch(() => em.delete(User, event.aggregate.id)),
        TE.mapLeft(InternalError),
        TE.map(constVoid)
      );
  }
};
