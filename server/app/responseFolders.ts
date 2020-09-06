import { Response } from "express";
import { fold } from "fp-ts/lib/TaskEither";
import { identity, constVoid } from "fp-ts/lib/function";
import * as T from "fp-ts/lib/Task";
import { ErrorWithStatus } from "../infra/interfaces/Repository";

const foldToResponse = <Result, T>(code: number, fn: (r: Result) => T) => (
  res: Response
) =>
  fold<ErrorWithStatus, Result, Response>(
    (error) =>
      T.of(
        res
          .status(error.statusCode)
          .json({ message: error.error.message || "no message" })
      ),
    (result) => T.of(res.status(code).json(fn(result)))
  );

export const foldToOk = foldToResponse(200, identity);
export const foldToCreated = foldToResponse(201, constVoid);
export const foldToUpdated = foldToResponse(204, constVoid);
