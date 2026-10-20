import { MoveDao } from "../dao/moveDao";
import { MoveDaoImpl } from "../dao/moveDao";
import { Move } from "../models/move";

export class MoveController{
   constructor(
       private userDao: MoveDao<Move>
     ){}
}