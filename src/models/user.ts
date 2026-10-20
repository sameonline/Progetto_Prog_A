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

/**
 * Model User: rappresenta la tabella "users".
 * Ogni istanza di User corrisponde a una riga della tabella.
 */
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // "declare": la proprietà esiste per TypeScript, ma il valore lo gestisce Sequelize.
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string; // da salvare già cifrata (hash), mai in chiaro
  declare tokens: CreationOptional<number>;
  declare admin: CreationOptional<boolean>;

  

  rechargeToken(token: number): void {
    this.tokens+=token
  }
  removeToken(token:number):void{
    this.tokens-=token
  }
}

//definisco le colonne
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokens: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
      
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "users", // nome tabella
    timestamps: true, // vengono create e gestite 2 colonne, createdAt e updatedAt
  }
);