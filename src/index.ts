import express from "express";
import { Database } from "./config/database";
import { User } from "./models/user";
import { UserDaoImpl } from "./dao/userDao";
import { MatchDaoImpl } from "./dao/matchDao";
import { MoveDaoImpl } from "./dao/moveDao";
import {createUserRoutes} from "./routes/userRoutes";
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
app.use("/api", createUserRoutes(userController));

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

    // 2) La partita in memoria, con i dati di partenza
    const match = Match.build({
      player1: p1.id,
      player2: p2.id,
      turn: p1.id,
      stato: "Incorso",
      bot: false,
      dimGrid: 10,          // griglia piccola per leggerla bene in console
      navi: [5, 4, 3, 3, 2],
      grid1: [],
      grid2: [],
    });

    // 3) Generazione delle griglie con le navi
    match.creaMatch();

    // 4) Stampa leggibile delle due griglie
    const stampa = (g: string[][]) => g.map((riga) => riga.join(" ")).join("\n");
    console.log("Griglia giocatore 1:\n" + stampa(match.grid1));
    console.log("Griglia giocatore 2:\n" + stampa(match.grid2));

    // 5) Salvataggio e rilettura dal database
    await match.save();
    
    
    console.log(match.shot([0,1],1))
    await match.save();
    console.log("Griglia giocatore 1:\n" + stampa(match.grid1));
    console.log("Griglia giocatore 2:\n" + stampa(match.grid2));
    console.log("Cella [0,1] nel DB:", (await Match.findByPk(match.id))!.grid2[0][1]);

    console.log(match.shot([1,1]))
    await match.save();
    console.log("Griglia giocatore 1:\n" + stampa(match.grid1));
    console.log("Griglia giocatore 2:\n" + stampa(match.grid2));
    console.log("Cella [0,1] nel DB:", (await Match.findByPk(match.id))!.grid2[0][1]);

    // ---------- FINE TEST ----------

    app.listen(PORT, () => {
      console.log(`Server porta: ${PORT}`);
    });
  } catch (error) {
    console.error("connessione fallita del database:", error);
    process.exit(1);
  }
   
  
}

start();