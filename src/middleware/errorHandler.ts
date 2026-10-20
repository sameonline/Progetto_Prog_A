import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/ErrorFactory";


/**
 * Middleware di gestione degli errori: va registrato per ultimo in index.ts.
 * Riceve qualsiasi errore lanciato da middleware e controller e costruisce la risposta.
 * Express lo riconosce come gestore di errori perché ha 4 parametri.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // errore previsto, creato con la ErrorFactory: uso il suo status e il suo messaggio
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // errore imprevisto (bug, errore di Sequelize...): lo registro nel log
  // e al client mando un messaggio generico, senza dettagli interni
  console.error(err);
  res.status(500).json({ error: "Errore interno del server" });
}