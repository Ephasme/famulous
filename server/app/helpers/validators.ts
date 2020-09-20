import * as Joi from "@hapi/joi";
import * as D from "io-ts/lib/Decoder";
import { pipe } from "fp-ts/lib/function";

export const uuid = pipe(
  D.string,
  D.parse((s) => {
    const { error, value } = Joi.string()
      .required()
      .guid({ version: "uuidv4" })
      .validate(s);
    return error ? D.failure(value, error.message) : D.success(value as string);
  })
);

export const date = pipe(
  D.string,
  D.parse((s) => {
    const { error, value } = Joi.date().required().validate(s);
    return error ? D.failure(value, error.message) : D.success(value as Date);
  })
);
