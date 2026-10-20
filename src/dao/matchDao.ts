import { Match } from "../models/match";


export interface MatchDao<T> {
  save(match: T): Promise<void>;
  findById(id:number): Promise<T|null>;
}


export class MatchDaoImpl implements MatchDao<Match> {
  async save(match: Match): Promise<void> {
    await match.save();
  }
  async findById(id:number): Promise<Match|null>{
    return Match.findByPk(id)
  }
}