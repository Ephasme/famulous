import * as D from "io-ts/lib/Decoder";
import { flow } from "fp-ts/lib/function";
import { mapLeft } from "fp-ts/lib/Either";
import { uuid } from "../helpers/validators";
import { UnprocessableEntity } from "../../domain/interfaces";
import { pipe } from "fp-ts/lib/function";

interface PositiveBrand {
  readonly Positive: unique symbol;
}

export type Positive = number & PositiveBrand;

export const positive: D.Decoder<unknown, Positive> = pipe(
  D.number,
  D.refine((n): n is Positive => n > 0, "Positive")
);

const createTransactionCommandValidator = D.type({
  id: uuid,
  accountId: uuid,
  amount: positive,
  label: D.string,
});

export type CreateTransactionCommand = D.TypeOf<
  typeof createTransactionCommandValidator
>;

export const validateCreateTransactionCommand = flow(
  createTransactionCommandValidator.decode,
  mapLeft(flow(D.draw, UnprocessableEntity))
);
