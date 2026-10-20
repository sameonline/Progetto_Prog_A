import express from "express";
import { Database } from "./config/database";
import { User } from "./models/user";
import { UserDaoImpl } from "./dao/userDao";
import { MatchDaoImpl } from "./dao/matchDao";
import { MoveDaoImpl } from "./dao/moveDao";
import {createUserRoutes} from "./routes/userRoutes";
import { createMatchRoutes } from "./routes/matchRoutes";
import { Match } from "./models/match";
import { UserController } from "./controllers/userController";
import { MatchController } from "./controllers/matchController";


const app = express();
app.use(express.json());

const userDao = new UserDaoImpl();
const matchDao = new MatchDaoImpl();
const moveDao = new MoveDaoImpl();

const userController = new UserController(userDao);
const matchController = new MatchController(matchDao, userDao, moveDao);

//rotte
app.use("/api", createUserRoutes(userController));//quando arriva una richiesta con api come inzio express lavora
app.use("/api", createMatchRoutes(matchController));

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
 
    const p1 = User.build({ name: 'Jane', email: 'jane@example.com', password: 'password123' });
    const p2 = User.build({ name: 'mario', email: 'mario@example.com', password: 'password123' });
  

    

    await userController.save(p1);
    await userController.save(p2)
    console.log(p1)
    console.log("Dopo il salvataggio, id:", p1.id);

    

    

    
    
    
    //console.log(match.shot([0,1],1))
    //await match.save();
    
  

    app.listen(PORT, () => {
      console.log(`Server porta: ${PORT}`);
    });
  } catch (error) {
    console.error("connessione fallita del database:", error);
    process.exit(1);
  }
   
  
}

start();