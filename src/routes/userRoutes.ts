import { Router } from "express";
import { userController } from "../controllers/userController";

// Un router è un gruppo di rotte, che poi verrà collegato all'app in index.ts
const userRoutes = Router();

//rotta per ottenere i token dell'utente
userRoutes.get("/users/:email/tokens", userController.getTokens);


//rotta per ricaricare i token all'utente
userRoutes.put("/users/tokens", userController.rechargeTokens); // esempio body:{"email: jane@gamil.com,"tokens": 145"}

export default userRoutes;