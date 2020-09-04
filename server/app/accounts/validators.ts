import * as D from "io-ts/lib/Decoder";
import { pipe, flow, constant } from "fp-ts/lib/function";
import { mapLeft } from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import {
  chain,
  fromEither,
  right,
  map,
  left,
  fromOption,
} from "fp-ts/lib/TaskEither";
import {
  UnprocessableEntity,
  Repository,
  Forbidden,
  NotFound,
  AccountCreated,
  accountCreated,
  AccountDeleted,
  accountDeleted,
} from "../../domain";
import { uuid } from "../helpers/validators";

const deleteAccountCommandValidator = D.type({
  id: uuid,
});

const createAccountCommandValidator = D.type({
  id: uuid,
  user_id: uuid,
  name: D.string,
  currency: D.string,
});

export type CreateAccountCommand = D.TypeOf<
  typeof createAccountCommandValidator
>;

export const Commands = {
  deleteToEvent({ id }: DeleteAccountCommand): AccountDeleted {
    return accountDeleted(id);
  },
  createToEvent(command: CreateAccountCommand): AccountCreated {
    return accountCreated(
      command.id,
      command.name,
      command.user_id,
      command.currency
    );
  },
};

export type DeleteAccountCommand = D.TypeOf<
  typeof deleteAccountCommandValidator
>;

export const validateCreateAccountCommand = (repository: Repository) =>
  flow(
    createAccountCommandValidator.decode,
    mapLeft(flow(D.draw, UnprocessableEntity)),
    fromEither,
    chain((command) =>
      pipe(
        repository.findAccountById(command.id),
        chain(
          O.fold(
            () => right(command),
            (_) => left(Forbidden(`Account ${command.id} not exists`))
          )
        )
      )
    )
  );

export const validateDeleteAccountCommand = (repository: Repository) =>
  flow(
    deleteAccountCommandValidator.decode,
    mapLeft(flow(D.draw, UnprocessableEntity)),
    fromEither,
    chain((command) =>
      pipe(
        repository.findAccountById(command.id),
        chain(fromOption(() => NotFound("can't delete unexisting account"))),
        map(constant(command))
      )
    )
  );
