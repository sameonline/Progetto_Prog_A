import { Sequelize } from "sequelize";

/**
 * Pattern Singleton: esiste una sola istanza di Sequelize,
 * cioè una sola connessione condivisa da tutta l'applicazione.
 */
export class Database {
  // L'unica istanza, condivisa da tutta la classe
  private static instance: Sequelize;

  // Costruttore privato: nessuno può fare "new Database()" dall'esterno
  private constructor() {}

  // Unico punto di accesso alla connessione
  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize(
        process.env.DB_NAME as string,
        process.env.DB_USER as string,
        process.env.DB_PASSWORD as string,
        {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 5432,
          dialect: "postgres",
          logging: false,
        }
      );
    }
    return Database.instance;
  }
}