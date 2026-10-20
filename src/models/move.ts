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
  declare playerId:CreationOptional<number | null>;//se il bot fa la mossa non si passa l'id che idventa quindi null
  declare coordinate:number[];
  declare stato: string;
  declare silence: CreationOptional<boolean>;

  
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
      allowNull: true,
    },
    coordinate: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      
    },
    stato: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    silence:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false,
      
    },
  },
  {
    sequelize,
    tableName: "moves", // nome tabella
    timestamps: true, // vengono create e gestite 2 colonne, createdAt e updatedAt
  }
);