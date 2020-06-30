import { Repository } from "../../domain";
import { pipe } from "fp-ts/lib/function";
import { chain } from "fp-ts/lib/TaskEither";
import { isEmptyUser } from "./isEmptyUser";

export const findUserOrCreate = (repository: Repository, id: string) =>
  pipe(repository.findUserById(id), chain(isEmptyUser));
