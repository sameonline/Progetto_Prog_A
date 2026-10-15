import { Match } from "../models/match";


export interface MatchDao<T> {
  save(match: T): Promise<void>;
}


export class MatchDaoImpl implements MatchDao<Match> {
  async save(match: Match): Promise<void> {
    await match.save();
  }
}