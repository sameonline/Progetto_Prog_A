import express from "express";
import { Database } from "./config/database";
import { User } from "./models/user";
import { UserDaoImpl } from "./dao/userDao";


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

    await sequelize.sync({ force: true });
 
    const jane = User.build({ name: 'Jane', email: 'jane@example.com', password: 'password123' });
    console.log(jane instanceof User); // true
    console.log(jane.name); // "Jane"
    console.log(jane.email); // "jane@example.com"
    console.log(jane.password); // "password123"

    const userDao = new UserDaoImpl();
    await userDao.save(jane);
    console.log("Dopo il salvataggio, id:", jane.id);

    app.listen(PORT, () => {
      console.log(`Server porta: ${PORT}`);
    });
  } catch (error) {
    console.error("connessione fallita del database:", error);
    process.exit(1);
  }
   
  
}

start();