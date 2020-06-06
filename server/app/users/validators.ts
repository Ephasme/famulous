import * as Joi from "@hapi/joi";

export const createUserSchema = Joi.object({
  id: Joi.string().required().guid({ version: "uuidv4" }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
