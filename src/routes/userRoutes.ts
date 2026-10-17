import { Router } from "express";
import { UserController } from "../controllers/userController";


export function createUserRoutes(userController: UserController): Router {
  const router = Router();
  router.get("/users/:email/tokens", userController.getTokens);
  router.put("/users/tokens", userController.rechargeTokens);
  return router;
}