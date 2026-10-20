import { User } from "../models/user";


export interface UserDao<T> {
  save(user: T): Promise<void>;
  userByMail(email: string): Promise<T | null>;
  deleteByMail(email: string): Promise<void>;
  getTokenById(id: number): Promise<number | null>;
    findById(id: number): Promise<T | null>;
  //non faccio modifica utente perché le operazioni CRUD non sono richieste, le altre servono a me che sviluppo
  
}


export class UserDaoImpl implements UserDao<User> {
  async save(user: User): Promise<void> {
    await user.save();
  }
    async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }
  async userByMail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } }); //metodo sequelize 
  }

  async deleteByMail(email: string): Promise<void> {
    await User.destroy({ where: { email } });
  }
  async getTokenById(id:number):Promise<number|null>{
    const user = await User.findByPk(id, { attributes: ["tokens"] });
    return user ? user.tokens : null;
  }
  
  
}