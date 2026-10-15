import { UserDao, UserDaoImpl } from "../dao/userDao";
import { User } from "../models/user";

import { Request, Response } from "express";

export class UserController{
   private userDao: UserDao<User>= new UserDaoImpl(); //private perché solo il controller conosce il dao
    
   
   login = async (req: Request, res: Response): Promise<void> => {
    
  };

    getTokens = async (req: Request, res: Response): Promise<void> => {
    try{
      
      
    
      const email = req.params.email;
        //devo assicurarmi che email sia una stringa, sennò const user va in errore
      if (typeof email !== "string" || email.trim() === "") { //.trim restituisce la stringa senza spazi
        res.status(400).json({ error: "email obbligatoria" });
        return;
        }
      const user = await this.userDao.userByMail(email);

      if (!user) {
        
        res.status(404).json({ error: "non trovo l'utente" });
        return;
      }

      
      res.status(200).json({ email: user.email, tokens: user.tokens });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore del server" });
    }
  };
}