import { Router } from "express";
import { MatchController } from "../controllers/matchController";
import { authMiddleware } from "../middleware/autMiddleware";


export function createMatchRoutes(matchController: MatchController): Router {
  const router = Router();
  router.use(authMiddleware); //così tutte le rotte che chiamo controllano l'autenticazione 
  router.post("/matches", matchController.newMatch);//cra una partita 
  router.post("/matches/move", matchController.move);// fai una mossa
  router.get("/matches/stateMatch/:id", matchController.stateMatch);// ritorna stato partita e turno
  router.get("/matches/:id/history", matchController.getHistoryMatch);// ritorna lo storico della partita

  return router;
}