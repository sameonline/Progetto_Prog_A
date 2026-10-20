import { Move } from "../models/move";


export interface MoveDao<T> {
  save(move: T): Promise<void>;
  getHistory(id:number): Promise<T[]>;
  getById(id:number):Promise<T|null>;
}


export class MoveDaoImpl implements MoveDao<Move> {
  async save(move: Move): Promise<void> {
    await move.save();
  }
  async getHistory(id: number): Promise<Move[]>{
    return await Move.findAll({
      where: {matchId: id},
      order: [
        ["createdAt", "ASC"], //ASC è ascendente         
      ["id", "ASC"],
      ],
    });
  }
  async getById(id:number):Promise<Move|null>{
    return await Move.findByPk(id)
  }
}