import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const newUser = {
    id: 1,
    email: "david.clochard77@gmail.com",
    name: "Clochard",
    firstname: "David",
  };
  res.send(newUser);
});

export default router;
