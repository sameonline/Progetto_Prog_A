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
    declare player2: number;
    declare turn: number;
    declare winner: CreationOptional<number>;
    declare stato: string;
    declare grid1: Array<Array<string>>;
    declare grid2: Array<Array<string>>;
    declare bot: boolean;
    declare dimGrid: number;
    declare navi: Array<number>;
    
    getGrid(id: number): Array<Array<string>>{
      if (id===this.player1){
        return this.grid1;
      }
      else{
        return this.grid2;        
      } 
    }
    addShip(id:number): void{
      let grid=this.getGrid(id)
      let ships = this.navi.toSorted((a, b) => b - a); //toSorted è di node24, il sort semplice tratta gli el. come stringhe
      let index: string[]= navi_totali.slice(0, this.navi.length);
      let ind_ship:number=0;
      for (const ship of ships){
          
          const direction: boolean=Math.random()<0.5;
          const n= randint(0,this.dimGrid-1);
          let vector: string[]=[];
          if (direction){
              
              vector= grid[n];
            }
          else{
              for (const riga of grid){
                vector.push(riga[n])
              }
          }
              const spot = (r:string[]): number[]=>{
                let free_spot: number[]=[];
                for (let i = 0; i <=r.length-ship; i++){
                  let valida=true;

                  for (let j = 0; j < ship; j++){
                      if (r[i+j]!== "."){
                        valida=false;
                        break;
                      }
                  }
                  if(valida){
                    free_spot.push(i)
                  }
                }
                return free_spot;
              }
        const posizioni = spot(vector);
        const partenza = posizioni[Math.floor(Math.random() * posizioni.length)];
        if (direction){
          for(let i=partenza; i<partenza+ship; i++){
            grid[n][i]=index[ind_ship]
          }
        }
        else{
          for(let i=partenza; i<partenza+ship; i++){
            grid[i][n]=index[ind_ship]
          }
        }
        ind_ship+=1;      
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

    shot(position:number[],id?:number): string{//id non is passa se gioca il bot
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
          this.changed(colonnaGriglia, true); //metodo di Model sequelize
          return "water"

        case "X":
          return "gia_colpita"

        case "O":
          return "gia_a_vuoto"
        default: {
          let risp: "abbiamo un vincitore"|"colpito e affondato"|"colpito";
          grid[position[0]][position[1]]="X";
          this.changed(colonnaGriglia, true);
          if (this.controlShip(cella,grid)){
            if(this.controlWinner(grid)){
              risp= "abbiamo un vincitore"
            }
            else{
              risp= "colpito e affondato"
            }
         }
         else{
          risp= "colpito"
         }

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
      allowNull: false,
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
    }
  },
  {
    sequelize,
    tableName: "matches", // nome tabella
    timestamps: true, // vengono create e gestite 2 colonne, createdAt e updatedAt
  }
);

