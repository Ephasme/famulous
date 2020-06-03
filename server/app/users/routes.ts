import { Router } from "express";

import {
  Repository,
  USER,
  userCreated,
  isAnyUserState,
  ACTIVE_USER,
} from "../../domain";
import validator from "../middlewares/validator";
import { createUserSchema } from "./validators";
import { hashPassword } from "./security";

export default (repository: Repository): Router => {
  const router = Router();

  router.post("/", validator(createUserSchema), async (req, res) => {
    const state = await repository.fetchOne(USER);
    if (!isAnyUserState(state)) {
      throw new Error("state is not user");
    }

    const { hashedPassword, salt } = hashPassword(req.body.password);

    const event = userCreated(
      req.body.id,
      req.body.email,
      hashedPassword,
      salt
    );
    const newState = state.handleEvent(event);

    if (newState.type !== ACTIVE_USER) {
      throw new Error("user not created");
    }

    await repository.save(event);
    await repository.save(newState);

    res.json({ id: newState.id, email: newState.email });
  });

  return router;
};
