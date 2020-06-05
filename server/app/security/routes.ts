import { Router } from "express";

import { USER } from "../../domain/user/states/UserState";
import { Repository, ActiveUser } from "../../domain";
import validator from "../middlewares/validator";
import Logger from "../interfaces/Logger";
import { checkPassword } from "./password";
import { loginSchema } from "./validators";

export default (repository: Repository, logger: Logger): Router => {
  const router = Router();

  router.post("/login", validator(loginSchema, logger), async (req, res) => {
    const { email, password } = req.body;
    const users = (await repository.find(USER, { email })) as ActiveUser[];

    if (!users.length) {
      logger.info(`Try to login with an unexisting user: ${email}`);
      return res.sendStatus(401);
    }

    const [user] = users;

    if (!checkPassword(password, user.salt, user.password)) {
      logger.info(
        `Try to login to following user with a bad password: ${email}`
      );
      return res.sendStatus(401);
    }

    logger.info(`Successful login with following user: ${email}`);
    return res.sendStatus(200);
  });

  return router;
};
