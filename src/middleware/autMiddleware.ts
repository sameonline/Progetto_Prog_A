import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Dati dell'utente autenticato, salvati in res.locals.user
export interface AuthUser {
  id: number;
  email: string;
  admin: boolean;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1) l'header deve essere nella forma "Bearer <token>"
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Autenticazione richiesta" });
    return;
  }
  const token = header.slice(7); // tutto ciò che segue "Bearer "

  // 2) segreto per verificare la firma
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET non configurato");
    res.status(500).json({ error: "Errore del server" });
    return;
  }

  try {
    // 3) verifica firma e scadenza: se non sono valide, lancia un'eccezione
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });

    // il nostro token contiene sempre un oggetto, mai una stringa
    if (typeof payload === "string") {
      res.status(401).json({ error: "Token non valido" });
      return;
    }

    // 4) salvo solo i dati che servono, per i middleware e i controller successivi
    const user: AuthUser = {
      id: Number(payload.id),
      email: String(payload.email),
      admin: payload.admin === true,
    };
    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Token non valido o scaduto" });
  }
}
export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  const user = res.locals.user as AuthUser | undefined;

  // authMiddleware deve essere stato eseguito prima
  if (!user) {
    res.status(401).json({ error: "Autenticazione richiesta" });
    return;
  }

  // l'utente è autenticato ma non è admin
  if (!user.admin) {
    res.status(403).json({ error: "Operazione riservata agli amministratori" });
    return;
  }

  next();
}