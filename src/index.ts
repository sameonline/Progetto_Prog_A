import express from "express";
import { Database } from "./config/database";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.get("/", (_req, res) => {
  res.send("progetto di prova");
});

async function start() {
  try { //questo try verifica che il database venga gestito sia se funziona che non.
  
    const sequelize = Database.getInstance();
    await sequelize.authenticate();
    console.log("Connessione andata abuon fine");

    app.listen(PORT, () => {
      console.log(`Server porta: ${PORT}`);
    });
  } catch (error) {
    console.error("connessione fallita del database:", error);
    process.exit(1);
  }
}

start();