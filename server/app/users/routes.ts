import { Router, Request, Response, RequestHandler } from "express";
import { Repository } from "../../domain";
import validator from "../middlewares/validator";
import { createUserSchema } from "./validators";
import Logger from "../interfaces/Logger";
import { pipe } from "fp-ts/lib/function";
import { foldToResponse } from "../foldToResponse";
import { buildCreateUserFlow } from "./buildCreateUserFlow";
import { buildGetAllUsersFlow } from "./buildGetAllUsersFlow";
import { Authenticator } from "../security/authenticate";

export default (
  repository: Repository,
  logger: Logger,
  authenticate: Authenticator
): Router => {
  const router = Router();

  const createUserFlow = buildCreateUserFlow(repository, logger);
  const createUserTask = (req: Request, res: Response) =>
    pipe(
      createUserFlow(req.body.id, req.body.email, req.body.password),
      foldToResponse(res)
    )();
  router.post("/", validator(createUserSchema, logger), createUserTask);

  const getAllUsersFlow = buildGetAllUsersFlow(repository, logger);
  const getAllUsersTask = (_: Request, res: Response) =>
    pipe(
      getAllUsersFlow,
      (flowResult) => {
        logger.info(JSON.stringify(_.user));
        return flowResult;
      },
      foldToResponse(res)
    )();
  router.get("/", authenticate, getAllUsersTask);

  return router;
};
