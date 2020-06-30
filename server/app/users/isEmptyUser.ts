import { Forbidden, EmptyUser, isNotEmptyUser } from "../../domain";
import { left, right } from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";

export const isEmptyUser = flow(
  isNotEmptyUser,
  fold(
    () => right(new EmptyUser()),
    ({ id, email }) =>
      left(
        Forbidden(`tried to create a user with an existing id ${id} ${email}`)
      )
  )
);
