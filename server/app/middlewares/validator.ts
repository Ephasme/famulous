import * as express from "express";
import * as Joi from "@hapi/joi";

const makeBodyValidatorMiddleware = (schema: Joi.AnySchema) => (
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

    console.log(`Server received invalid body from client :${message}`);
    res.send(message).status(403);
  }
};

export default makeBodyValidatorMiddleware;
