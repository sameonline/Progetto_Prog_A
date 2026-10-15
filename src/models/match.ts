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

export class Match extends Model<InferAttributes<Match>, InferCreationAttributes<Match>> {
    declare id: CreationOptional<number>;
    declare player1: number;
    declare player2: number;
    declare turno: number;
    declare winner: CreationOptional<number>;
    declare stato: string;
    declare griglia1: Array<Array<number>>;
    declare griglia2: Array<Array<number>>;
    declare bot: boolean;
    declare dimGriglia: number;
    declare navi: Array<number>;
    
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
    turno: {
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
    griglia1: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    griglia2: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    bot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dimGriglia: {
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

