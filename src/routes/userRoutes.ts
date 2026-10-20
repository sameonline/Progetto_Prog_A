import { Router } from "express";
import { UserController } from "../controllers/userController";
import { adminMiddleware, authMiddleware } from "../middleware/autMiddleware";

export function createUserRoutes(userController: UserController): Router {
  const router = Router();
  router.post("/login", userController.login);
  router.get("/users/:email/tokens", authMiddleware, userController.getTokens);
  router.put("/users/tokens",  authMiddleware,adminMiddleware,userController.rechargeTokens);
  
  return router;
}