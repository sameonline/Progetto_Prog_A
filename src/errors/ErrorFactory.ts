
/*
  in questo file definisco i tipi di errori con enum,
  la classe AppError estende la classe nativa js Error che gestisce 
  un messaggio di errore, definisce lo stato
  la classe ErrorFactory riceve l'errore e crea il giusto AppError
*/
export enum ErrorType {
    
  BAD_REQUEST = "BAD_REQUEST",                 // dati mancanti o non validi
  UNAUTHORIZED = "UNAUTHORIZED",               // JWT mancante/non valido, credenziali errate
  INSUFFICIENT_CREDIT = "INSUFFICIENT_CREDIT", // saldo token insufficiente
  FORBIDDEN = "FORBIDDEN",                     // autenticato ma senza permesso
  NOT_FOUND = "NOT_FOUND",                     // utente o partita inesistente
  CONFLICT = "CONFLICT",                       // partita già in corso
  INTERNAL = "INTERNAL",                       // errore del server
}
//Error è un una classe nativa di js
export class AppError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);         // messaggio che error deve gestire
    this.status = status;   // status
    this.name = "AppError"; // nome dell'errore
  }
}
// Factory degli errori: dato un tipo, crea l'AppError con lo status e il messaggio giusti.
// Chi lancia l'errore indica solo il tipo; lo status lo decide la factory.
export class ErrorFactory {
  static createError(type: ErrorType, message?: string): AppError {
    switch (type) {
      case ErrorType.BAD_REQUEST:
        return new AppError(message ?? "Richiesta non valida", 400);

      case ErrorType.UNAUTHORIZED:
        return new AppError(message ?? "Autenticazione richiesta", 401);

      case ErrorType.INSUFFICIENT_CREDIT:
        return new AppError(message ?? "Credito insufficiente", 401);

      case ErrorType.FORBIDDEN:
        return new AppError(message ?? "Operazione non consentita", 403);

      case ErrorType.NOT_FOUND:
        return new AppError(message ?? "Risorsa non trovata", 404);

      case ErrorType.CONFLICT:
        return new AppError(message ?? "Conflitto con lo stato attuale", 409);

      case ErrorType.INTERNAL:
      default:
        return new AppError(message ?? "Errore interno del server", 500);
    }
  }
}