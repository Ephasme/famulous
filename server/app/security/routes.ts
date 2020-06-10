import { Router } from "express";

import { USER } from "../../domain/user/states/UserState";
import { Repository, ACTIVE_USER } from "../../domain";
import validator from "../middlewares/validator";
import Logger from "../interfaces/Logger";
import { checkPassword } from "./password";
import { loginSchema } from "./validators";
import { generatingJwt } from "./jwt";

export default (repository: Repository, logger: Logger): Router => {
  const router = Router();

  router.post("/login", validator(loginSchema, logger), async (req, res) => {
    const { email, password } = req.body;
    const users = await repository.find(USER, { email });

    if (!users.length) {
      logger.info(`Try to login with an unexisting user: ${email}`);
      return res.sendStatus(401);
    }

    const [user] = users;
    if (user.type !== ACTIVE_USER) {
      logger.info(`Try to login with an inactive user: ${email}`);
      return res.sendStatus(401);
    }

    if (!checkPassword(password, user.salt, user.password)) {
      logger.info(
        `Try to login to following user with a bad password: ${email}`
      );
      return res.sendStatus(401);
    }

    const jwtToken = generatingJwt(user);

    logger.info(`Successful login with following user: ${email}`);
    return res.json({ token: jwtToken }).status(200);
  });

  return router;
};
