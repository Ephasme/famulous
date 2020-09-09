import { Router, Request, Response } from "express";
import { UserView } from "../../domain";
import { pipe } from "fp-ts/lib/function";
import { foldToCreated, foldToOk } from "../responseFolders";
import { Authenticator } from "../security/authenticate";
import { CreateUserCommand } from "./validators";
import { AsyncResult } from "../../domain/interfaces/Repository";

export type UserRouteDependencies = {
  createUserFlow: (cmd: CreateUserCommand) => AsyncResult<void>;
  getAllUsersFlow: () => AsyncResult<UserView[]>;
};

export default (
  authenticate: Authenticator,
  deps: UserRouteDependencies
): Router => {
  const router = Router();

  router.post("/", (req: Request, res: Response) =>
    pipe(req.body, deps.createUserFlow, foldToCreated(res))()
  );

  router.get("/", authenticate, (_: Request, res: Response) =>
    pipe({}, deps.getAllUsersFlow, foldToOk(res))()
  );

  return router;
};
