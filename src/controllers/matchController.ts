import { MatchDao } from "../dao/matchDao";
import { MatchDaoImpl } from "../dao/matchDao";
import { Match } from "../models/match";


export class MatchController{
   private matchDao: MatchDao<Match>= new MatchDaoImpl(); //private perché solo il controller conosce il dao
}