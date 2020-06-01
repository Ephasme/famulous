import { Router } from "express";
import {
  Repository,
  USER,
  userCreated,
  isAnyUserState,
  ACTIVE_USER,
} from "../../domain";

export default (repository: Repository): Router => {
  const router = Router();

  router.post("/", async (req, res) => {
    const state = await repository.fetchOne(USER);
    if (!isAnyUserState(state)) {
      throw new Error("state is not user");
    }

    const event = userCreated(req.body.id, req.body.email, req.body.password);
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
