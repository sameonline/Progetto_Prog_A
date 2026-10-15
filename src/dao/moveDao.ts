import { Move } from "../models/move";


export interface MoveDao<T> {
  save(move: T): Promise<void>;
}


export class MoveDaoImpl implements MoveDao<Move> {
  async save(move: Move): Promise<void> {
    await move.save();
  }
}