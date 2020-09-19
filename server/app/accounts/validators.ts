import * as D from "io-ts/lib/Decoder";
import { pipe, flow, constant } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import {
  AccountCreated,
  accountCreated,
  AccountDeleted,
  accountDeleted,
} from "../../domain";
import { uuid } from "../helpers/validators";
import {
  Repository,
  UnprocessableEntity,
  Forbidden,
  NotFound,
  AsyncResult,
} from "../../domain/interfaces";

const deleteAccountCommandValidator = D.type({
  id: uuid,
});

const createAccountCommandValidator = D.type({
  id: uuid,
  userId: uuid,
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
      command.userId,
      command.currency
    );
  },
};

export type DeleteAccountCommand = D.TypeOf<
  typeof deleteAccountCommandValidator
>;

export const validateCreateAccountCommand = (
  repository: Repository
): ((i: unknown) => AsyncResult<CreateAccountCommand>) =>
  flow(
    createAccountCommandValidator.decode,
    E.mapLeft(flow(D.draw, UnprocessableEntity)),
    TE.fromEither,
    TE.chain((command) =>
      pipe(
        repository.findAccountById(command.id),
        TE.chain(
          O.fold(
            () => TE.right(command),
            (_) => TE.left(Forbidden(`Account ${command.id} not exists`))
          )
        )
      )
    )
  );

export const validateDeleteAccountCommand = (
  repository: Repository
): ((i: unknown) => AsyncResult<DeleteAccountCommand>) =>
  flow(
    deleteAccountCommandValidator.decode,
    E.mapLeft(flow(D.draw, UnprocessableEntity)),
    TE.fromEither,
    TE.chain((command) =>
      pipe(
        repository.findAccountById(command.id),
        TE.chain(
          TE.fromOption(() => NotFound("can't delete unexisting account"))
        ),
        TE.map(constant(command))
      )
    )
  );
