import { Router } from "express";
import { Repository, USER, EMPTY_USER, userCreated } from "../../domain";

export default (repository: Repository): Router => {
  const router = Router();

  router.post("/", async (req, res) => {
    const state = await repository.fetchOne(USER);
    if (state.type !== EMPTY_USER) throw new Error("");

    const ev = userCreated(req.body.id, req.body.email, req.body.password);
    const newState = state.handleEvent(ev);
    repository.save(ev);
    repository.save(newState);
  });

  return router;
};
