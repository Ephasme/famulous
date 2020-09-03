import * as Joi from "@hapi/joi";
import * as D from "io-ts/lib/Decoder";
import { pipe, flow } from "fp-ts/lib/function";
import { mapLeft } from "fp-ts/lib/Either";
import { UnprocessableEntity } from "../../domain";
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

export type DeleteAccountCommand = D.TypeOf<
  typeof deleteAccountCommandValidator
>;

export const validateCreateAccountCommand = flow(
  createAccountCommandValidator.decode,
  mapLeft(flow(D.draw, UnprocessableEntity))
);

export const validateDeleteAccountCommand = flow(
  deleteAccountCommandValidator.decode,
  mapLeft(flow(D.draw, UnprocessableEntity))
);
