import { User } from "../models/user";


export interface UserDao<T> {
  save(user: T): Promise<void>;
  userByMail(email: string): Promise<T | null>;
}


export class UserDaoImpl implements UserDao<User> {
  async save(user: User): Promise<void> {
    await user.save();
  }
  async userByMail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } }); //metodo sequelize 
  }
}