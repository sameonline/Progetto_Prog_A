import { MoveDao } from "../dao/moveDao";
import { MoveDaoImpl } from "../dao/moveDao";
import { Move } from "../models/move";

export class MoveController{
   private moveDao: MoveDao<Move>= new MoveDaoImpl(); //private perché solo il controller conosce il dao
}