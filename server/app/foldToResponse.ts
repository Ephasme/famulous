import { Response } from "express";
import { ErrorWithStatus } from "../domain";
import { fold } from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";

export const foldToResponse = <Result>(res: Response) =>
  fold<ErrorWithStatus, Result, Response>(
    (error) =>
      T.of(
        res
          .status(error.statusCode)
          .json({ message: error.error?.message || "no message" })
      ),
    (result) => T.of(res.status(200).json(result))
  );
