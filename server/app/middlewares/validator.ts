import * as express from "express";
import * as Joi from "@hapi/joi";
import Logger from "../../infra/interfaces/Logger";

const makeBodyValidatorMiddleware = (schema: Joi.AnySchema, logger: Logger) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (!error) {
    next();
  } else {
    const { details } = error;
    const message = details.map((detail) => detail.message).join(",");

    logger.info(`Server received invalid body from client :${message}`);
    res.send(message).status(403);
  }
};

export default makeBodyValidatorMiddleware;
