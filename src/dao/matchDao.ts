import { Op } from "sequelize";
import { Match } from "../models/match";


export interface MatchDao<T> {
  save(match: T): Promise<void>;
  findById(id:number): Promise<T|null>;
    noActiveMatch(playerIds: number[]): Promise<boolean>;
}


export class MatchDaoImpl implements MatchDao<Match> {
  async save(match: Match): Promise<void> {
    await match.save();
  }
  async findById(id:number): Promise<Match|null>{
    return Match.findByPk(id)
  }
    // true se nessuno dei giocatori indicati ha una partita con stato "Incorso"
  async noActiveMatch(playerIds: number[]): Promise<boolean> {
    const attive = await Match.count({
      where: {
        stato: "Incorso",
        [Op.or]: [
          { player1: { [Op.in]: playerIds } },
          { player2: { [Op.in]: playerIds } },
        ],
      },
    });
    return attive === 0;
  }
}