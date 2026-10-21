import { MatchDao } from "../dao/matchDao";
import { MatchDaoImpl } from "../dao/matchDao";
import { Match } from "../models/match";
import { User } from "../models/user";
import { UserDao,UserDaoImpl } from "../dao/userDao";
import { MoveDao } from "../dao/moveDao";
import { Move } from "../models/move";

import { Request, Response } from "express";
import { AuthUser } from "../middleware/autMiddleware";
import { ErrorFactory, ErrorType } from "../errors/ErrorFactory";
const COSTO_PARTITA:number=0.35;
const COSTO_MOSSA:number=0.015

export class MatchController{
   constructor(
    private matchDao: MatchDao<Match>,
    private userDao: UserDao<User>,
    private moveDao: MoveDao<Move>,
  ) {}



  newMatch=async (req:Request, res:Response): Promise<void>=>{
    
      const user = res.locals.user as AuthUser;
      const {  player2, dimGrid, ships, silence,bot } = req.body ?? {};
      let p2=null;
      let token =await this.userDao.getTokenById(user.id);
      if (token===null){
        token=0
      }
      if (token<COSTO_PARTITA){
        throw ErrorFactory.createError(ErrorType.INSUFFICIENT_CREDIT);
      }
       if ((bot && player2 !== undefined) || (!bot && player2 === undefined)) {
      throw ErrorFactory.createError(
        ErrorType.BAD_REQUEST,
        "Indica player2 solo nelle partite tra giocatori (bot: false); omettilo contro il bot (bot: true)"
        );
      }
      if (bot===false){
        p2= await this.userDao.userByMail(player2)
        if (p2 ===null){
          throw ErrorFactory.createError(ErrorType.CONFLICT,"giocatore non trovato");
        }
        
      }

      //i giocatori non possono avere partite ancora in corso
      const giocatori = p2 ? [user.id, p2.id] : [user.id];
      if (!(await this.matchDao.noActiveMatch(giocatori))) {
        throw ErrorFactory.createError(ErrorType.CONFLICT, "Uno dei giocatori ha già una partita in corso");
      }
      
     
      
      if (silence>5||silence<0){
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST,"silence deve essere compreso tra 0 e 5");
      }
      if (this.isPossibleToPlay(ships,dimGrid)){
          const match:Match= await this.creaMatch(user.id,p2?.id ?? null,dimGrid,ships,silence,bot);
          await this.matchDao.save(match);
          // la partita è stata creata: scalo il costo a chi l'ha creata
          const utente = await this.userDao.findById(user.id);
          if (utente === null) {
          throw ErrorFactory.createError(ErrorType.NOT_FOUND,"utente non trovato");
          }
          utente.removeToken(COSTO_PARTITA);
          await this.userDao.save(utente);
          res.status(201).json({
          message: "Partita creata, id: "+ match.id,});
          return;
          
      
      }
      else{
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST,"impossibile creare la partita");
      }
      
      

    
    
  }
  async creaMatch(p1:number, p2:number|null,dimGrid:number,ships:number[],silence:number,bot:boolean): Promise<Match>{
       
    
    const match = Match.build({
      player1: p1,
      player2: p2,
      turn: p1,
      stato: "Incorso",
      bot: bot,
      dimGrid: dimGrid,          
      navi: ships,
      grid1: [],
      grid2: [],
      silenceP1: silence,
      silenceP2: silence
    });

    // 3) Generazione delle griglie con le navi
    match.creaMatch();
    
    this.printTable(match)
    return match
  }

  

  async applySilence(id:number):Promise<void>{
    const move= await this.moveDao.getById(id);
    if (move===null){
      throw ErrorFactory.createError(ErrorType.NOT_FOUND, "mossa non trovata");
    }
    
    move.setSilence();
    const match = await this.matchDao.findById(move.matchId);
     if (match===null){
      throw ErrorFactory.createError(ErrorType.NOT_FOUND, "partita non trovata");
    }
    if(match.player1===move.playerId){
      if(match.silenceP1>0){
        match.silenceP1-=1;
      }
      else{
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST, "Hai già usato tutti i 5 silenzi");
      }
    }
    else{
        if(match.silenceP2>0){
        match.silenceP2-=1;
      }
      else{
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST, "Hai già usato tutti i 5 silenzi");
      }
    }
    await this.moveDao.save(move);
    await this.matchDao.save(match);  

    return

  }
  move=async(req: Request, res: Response): Promise<void>=>{
    
      const user = res.locals.user as AuthUser;
      const { shot, idMatch } = req.body ?? {};

     // 1) validazione dell'id della partita (l'id del giocatore viene dal token ed è già valido)
      const playerId = user.id;
      const matchId = Number(idMatch);
      if (!Number.isInteger(matchId) || matchId <= 0) {
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST, "idMatch deve essere un intero positivo");
      }

      // 2) forma delle coordinate: array di 2 interi
      if (!Array.isArray(shot) || shot.length !== 2 || !shot.every((c) => Number.isInteger(c))) {
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST, "shot deve essere un array di 2 interi [riga, colonna]");
      }

      // 3) la partita esiste
      const match = await this.matchDao.findById(matchId);
      if (match === null) {
        throw ErrorFactory.createError(ErrorType.NOT_FOUND, "Partita non trovata");
      }

      // 4) la partita è in corso
      if (match.stato !== "Incorso") {
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST, "La partita è terminata");
      }

      // 5) il giocatore fa parte della partita
      if (playerId !== match.player1 && playerId !== match.player2) {
        throw ErrorFactory.createError(ErrorType.FORBIDDEN, "Non fai parte di questa partita");
      }

      // 6) è il suo turno
      if (match.turn !== playerId) {
        throw ErrorFactory.createError(ErrorType.FORBIDDEN, "Non è il tuo turno");
      }

      // 7) coordinate dentro la griglia
      const [riga, colonna] = shot;
      if (riga < 0 || riga >= match.dimGrid || colonna < 0 || colonna >= match.dimGrid) {
        throw ErrorFactory.createError(
          ErrorType.BAD_REQUEST,
          `Coordinate fuori dalla griglia (da 0 a ${match.dimGrid - 1})`
        );
      }
      const utente = await this.userDao.findById(playerId);
      if (utente === null) {
        throw ErrorFactory.createError(ErrorType.UNAUTHORIZED, "Utente non trovato");
      }
      

      let esito: string=match.shot(shot,playerId)
      await this.matchDao.save(match);
      const move = Move.build({
        matchId: match.id,
        playerId: playerId,
        coordinate: shot,
        stato: esito,
        silence: false,
      });
      await this.moveDao.save(move);
      utente.removeToken(COSTO_MOSSA);//costo mossa
      await this.userDao.save(utente);
      // shot del bot
      if (match.bot && match.stato==="Incorso"){

        const [shot_bot,esito_bot]=match.shotBot();
        await this.matchDao.save(match);

        const move_bot = Move.build({
        matchId: match.id,
        playerId: null,//è il bot
        coordinate: shot_bot,
        stato: esito_bot,
        silence: false,
      });
      await this.moveDao.save(move_bot);
        res.status(200).json({message:"mossa eseguita e bot risponde: "+ shot_bot})
        return;
      }
      res.status(200).json({message:"mossa eseguita"})
    }
    
  stateMatch=async(req:Request,res:Response):Promise<void>=>{
    
        const id =Number(req.params.id) ;
        if (!Number.isInteger(id) || id <= 0) {
        throw ErrorFactory.createError(ErrorType.BAD_REQUEST);
        
        }
        const match=await this.matchDao.findById(id);
        if (match === null) {
           throw ErrorFactory.createError(ErrorType.NOT_FOUND,"partita non trovata");
        }
        this.printTable(match);
        res.status(200).json({
          match_Id: match.id,
          turno: match.turn,
          stato: match.stato,
          winner: match.winner,
          silenzi_giocatore_1:match.silenceP1,
          silenzi_giocatore_2:match.silenceP2
        })
    
      
    
  }
  getHistoryMatch = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw ErrorFactory.createError(ErrorType.BAD_REQUEST, "Id partita non valido");
    }

    // 1) la partita deve esistere
    const match = await this.matchDao.findById(id);
    if (match === null) {
      throw ErrorFactory.createError(ErrorType.NOT_FOUND, "Partita non trovata");
    }

    // 2) recupero delle mosse e costruzione del CSV
    const moves = await this.moveDao.getHistory(id);

    const intestazione = "mossa,giocatore,riga,colonna,esito,data";
    const righe = moves.map((m, i) => {
      const giocatore = m.playerId === null ? "bot" : m.playerId;
      const esito = m.silence ? "silenzio" : m.stato;
      const data = m.get("createdAt") as Date;
      return [i + 1, giocatore, m.coordinate[0], m.coordinate[1], esito, data.toISOString()].join(",");
    });
    const csv = [intestazione, ...righe].join("\n");

    res.status(200);
    res.type("text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="partita_${id}_storico.csv"`);
    res.send(csv);
  };
  printTable(match:Match):void{
    // 4) Stampa leggibile delle due griglie
    const stampa = (g: string[][]) => g.map((riga) => riga.join(" ")).join("\n");
    console.log("Griglia giocatore 1:\n" + stampa(match.grid1));
    console.log("Griglia giocatore 2:\n" + stampa(match.grid2));
    console.log("id partita: "+ match.id)
  }
  isPossibleToPlay(ships:number[],dimGrid:number):boolean{
      if (ships.length < 1 || ships.length > 8){
        return false;
      }
      
      let somma = 0;
      for (const n of ships) {
        if (n<1||n>dimGrid-2){
          return false
        }
        somma += n;
      }
      if (somma>dimGrid * dimGrid/2){
        return false
      }
      return true; 
    }
}