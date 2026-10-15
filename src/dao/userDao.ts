import { User } from "../models/user";


export interface UserDao<T> {
  save(user: T): Promise<void>;
}


export class UserDaoImpl implements UserDao<User> {
  async save(user: User): Promise<void> {
    await user.save();
  }
}