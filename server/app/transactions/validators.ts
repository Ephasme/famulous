import * as D from "io-ts/lib/Decoder";
import { flow } from "fp-ts/lib/function";
import { mapLeft } from "fp-ts/lib/Either";
import { UnprocessableEntity } from "../../domain";
import { uuid } from "../helpers/validators";

const createTransactionCommandValidator = D.type({
  id: uuid,
  account_id: uuid,
  targets: D.array(
    D.type({
      account_id: D.string,
      amount: D.number,
    })
  ),
});

export type CreateTransactionCommand = D.TypeOf<
  typeof createTransactionCommandValidator
>;

export const validateCreateTransactionCommand = flow(
  createTransactionCommandValidator.decode,
  mapLeft(flow(D.draw, UnprocessableEntity))
);
