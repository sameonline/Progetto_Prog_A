import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Database } from "../config/database";
import { randint } from "../functions";

// connessione al db(Singleton)
const sequelize = Database.getInstance();
const navi_totali = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L"];//non usare "O", "X" oppure "."


export class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
    declare id: CreationOptional<number>;
    declare player1: number;
    declare player2: CreationOptional<number | null>;
    declare turn: number|null;
    declare winner: CreationOptional<number|null>;
    declare stato: string;
    declare grid1: Array<Array<string>>;
    declare grid2: Array<Array<string>>;
    declare bot: boolean;
    declare dimGrid: number;
    declare navi: Array<number>;
    declare silenceP1: CreationOptional<number>;
    declare silenceP2:CreationOptional<number>;
    
    getGrid(id: number|null): Array<Array<string>>{
      if (id===this.player1){
        return this.grid1;
      }
      else{
        return this.grid2;        
      } 
    }
    
    addShip(id: number | null): void {
      const grid = this.getGrid(id);
      const ships = this.navi.toSorted((a, b) => b - a); // toSorted è di node24, il sort semplice tratta gli el. come stringhe
      const index: string[] = navi_totali.slice(0, this.navi.length);
      const MAX_TENTATIVI = 1000;
      let ind_ship: number = 0;

      for (const ship of ships) {
        // restituisce le posizioni di partenza libere per una nave lunga "ship" nel vettore r
        const spot = (r: string[]): number[] => {
          const free_spot: number[] = [];
          for (let i = 0; i <= r.length - ship; i++) {
            let valida = true;
            for (let j = 0; j < ship; j++) {
              if (r[i + j] !== ".") {
                valida = false;
                break;
              }
            }
            if (valida) {
              free_spot.push(i);
            }
          }
          return free_spot;
        };

        let direction: boolean;
        let n: number;
        let posizioni: number[];
        let tentativi = 0;

        // riprova finché non trova una riga/colonna con spazio sufficiente
        do {
          tentativi++;
          if (tentativi > MAX_TENTATIVI) {
            throw new Error(`Impossibile posizionare la nave di lunghezza ${ship}`);
          }

          direction = Math.random() < 0.5;
          n = randint(0, this.dimGrid - 1);

          const vector: string[] = [];
          if (direction) {
            vector.push(...grid[n]);
          } else {
            for (const riga of grid) {
              vector.push(riga[n]);
            }
          }

          posizioni = spot(vector);
        } while (posizioni.length === 0);

        const partenza = posizioni[Math.floor(Math.random() * posizioni.length)];
        if (direction) {
          for (let i = partenza; i < partenza + ship; i++) {
            grid[n][i] = index[ind_ship];
          }
        } else {
          for (let i = partenza; i < partenza + ship; i++) {
            grid[i][n] = index[ind_ship];
          }
        }
        ind_ship += 1;
      }
    }

    creaMatch(): void{
      for (let i=0;i<this.dimGrid;i++){
        let riga: string[]=[]
        this.grid1.push(riga)
        for (let j=0;j<this.dimGrid;j++){
          this.grid1[i].push(".")
        }
      }
      for (let i=0;i<this.dimGrid;i++){
        let riga: string[]=[]
        this.grid2.push(riga)
        for (let j=0;j<this.dimGrid;j++){
          this.grid2[i].push(".")
        }
      }
      
      this.addShip(this.player1);
      this.addShip(this.player2);
    }
    changeTurn(id:number|null):void{
      if (id===this.player1){
        this.turn=this.player2
      }
      else{
        this.turn=this.player1
      }
    }
    shotBot(): string{
      let fake_shot:boolean=true
      let decision:number[]=[]
      while (fake_shot){
        let x = randint(0,this.dimGrid-1);
        let y = randint(0,this.dimGrid-1);
        if(this.grid1[x][y] !== "X" && this.grid1[x][y] !== "O"){
          fake_shot=false
          decision.push(x);
          decision.push(y);
        }
      }
      return this.shot(decision,this.player2);
    }

    shot(position:number[],id: number | null = null): string{//id non is passa se gioca il bot
      let grid;  
      let colonnaGriglia: "grid1" | "grid2";
      if(id===this.player1){
        grid=this.grid2;
        colonnaGriglia = "grid2";
      }
      else{
        grid=this.grid1;
        colonnaGriglia = "grid1";
      }
      const cella=grid[position[0]][position[1]];
      switch(cella){
        case ".":
          grid[position[0]][position[1]]="O";
          this.changeTurn(id);
          this.changed(colonnaGriglia, true); //metodo di Model sequelize
          return "water"

        case "X":
          this.changeTurn(id);
          return "gia_colpita"

        case "O":
          this.changeTurn(id);
          return "gia_a_vuoto"
        default: {
          let risp: "abbiamo un vincitore"|"colpito e affondato"|"colpito";
          grid[position[0]][position[1]]="X";
          this.changed(colonnaGriglia, true);
          if (this.controlShip(cella,grid)){
            if(this.controlWinner(grid)){
              risp= "abbiamo un vincitore";
              this.stato="terminata";
              this.winner=id;
              return risp;
            }
            else{
              risp= "colpito e affondato";
            }
         }
         else{
          risp= "colpito"
         }
         this.changeTurn(id);

         return risp
        }

      }
         
    }
    controlWinner(grid:Array<Array<string>>): boolean{
        const flotta = navi_totali.slice(0, this.navi.length);
        for (const nave of flotta){
          if(!this.controlShip(nave,grid)){
            return false;
          }
        }
        return true;
    }
    controlShip(name: string,grid:Array<Array<string>>): boolean{
      for (let i=0;i<this.dimGrid;i++){
        for(let j=0;j<this.dimGrid;j++){
          if(grid[i][j]===name){
            return false
          }
        }
      }
      return true
    }

}
//definisco le colonne
Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    player1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player2: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    turn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    winner: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stato: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["Incorso", "terminata"]
    },
    grid1: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    grid2: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    bot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dimGrid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    navi: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    silenceP1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },
    silenceP2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },

  },
  {
    sequelize,
    tableName: "matches", // nome tabella
    timestamps: true, // vengono create e gestite 2 colonne, createdAt e updatedAt
  }
);

