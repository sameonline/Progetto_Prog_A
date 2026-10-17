import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Database } from "../config/database";

// connessione al db(Singleton)
const sequelize = Database.getInstance();


export class Move extends Model<InferAttributes<Move>, InferCreationAttributes<Move>> {
  // "declare": la proprietà esiste per TypeScript, ma il valore lo gestisce Sequelize.
  declare id: CreationOptional<number>;
  declare matchId: number;
  declare playerId: number;
  declare coordinate:number;
  declare stato: string;;

  
}

//definisco le colonne
Move.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coordinate: {
      type: DataTypes.ENUM,
      allowNull: false,
      
    },
    stato: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["colpito", "colpito e affondato", "mancato", "silenzio"]
    },
  },
  {
    sequelize,
    tableName: "moves", // nome tabella
    timestamps: true, // vengono create e gestite 2 colonne, createdAt e updatedAt
  }
);