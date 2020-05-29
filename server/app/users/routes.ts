import { Router } from "express";
import * as Knex from "knex";
import { buildModel } from "./model";

export default (knex: Knex): Router => {
  const router = Router();
  const model = buildModel(knex);

  router.post("/", (req, res) => {
    const newUser = model.createUser({
      id: 1,
      email: "david.clochard77@gmail.com",
      name: "Clochard",
      firstname: "David",
    });
    res.send(newUser);
  });

  return router;
};
