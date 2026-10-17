import { User } from "../models/user";


export interface UserDao<T> {
  save(user: T): Promise<void>;
  userByMail(email: string): Promise<T | null>;
  deleteByMail(email: string): Promise<void>;
  //non faccio modifica utente perché le operazioni CRUD non sono richieste, le altre servono a me che sviluppo
  returnTokens(email: string, tokens: number): Promise<void>; //aggiungo tokens all'utente
}


export class UserDaoImpl implements UserDao<User> {
  async save(user: User): Promise<void> {
    await user.save();
  }
  async userByMail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } }); //metodo sequelize 
  }
  async deleteByMail(email: string): Promise<void> {
    await User.destroy({ where: { email } });
  }
  async returnTokens(email: string, tokens: number): Promise<void> {

  }
}