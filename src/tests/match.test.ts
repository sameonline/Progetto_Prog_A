import { Match } from "../models/match";

function partitaDiProva(): Match{
 return Match.build({
    player1: 1,
    player2: 2,
    turn: 1,
    stato:"Incorso",
    grid1: [[".",".",".","."],[".",".",".","."],
            [".",".",".","."],[".",".",".","."]],
    grid2: [["A","A",".","."],[".",".",".","."],
            [".",".",".","."],[".",".",".","."]],
    bot: false,
    dimGrid: 4,
    navi: [2],

})
}
describe ("shot",()=>{
    let match: Match;
    //prima di ogni test ripristino il match
    beforeEach(() => {
    match = partitaDiProva();
  });

  test ("se colpisco la nave la cella diventa X", ()=>{
    const esito = match.shot([0, 0], 1);
    expect(esito).toBe("colpito");
    expect(match.grid2[0][0]).toBe("X");
  });

  test ("se colpisco l'acqua la cella diventa O e l'esito è: water", ()=>{
    const esito = match.shot([2, 0], 1);
    expect(esito).toBe("water");
    expect(match.grid2[2][0]).toBe("O");
  });

  

  test("affondando l'ultima nave la partita termina e player1 vince", () => {
    match.shot([0, 0], 1);
    const esito = match.shot([0, 1], 1);

    expect(esito).toBe("abbiamo un vincitore");
    expect(match.stato).toBe("terminata");
    expect(match.winner).toBe(1);
  });
});