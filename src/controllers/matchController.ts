import { MatchDao } from "../dao/matchDao";
import { MatchDaoImpl } from "../dao/matchDao";
import { Match } from "../models/match";
import { User } from "../models/user";
import { UserDao,UserDaoImpl } from "../dao/userDao";
import { MoveDao } from "../dao/moveDao";
import { Move } from "../models/move";

export class MatchController{
   constructor(
    private matchDao: MatchDao<Match>,
    private userDao: UserDao<User>,
    private moveDao: MoveDao<Move>,
  ) {}
}