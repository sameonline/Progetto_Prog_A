import { Match } from "../models/match";

// Partita contro il bot: player2 è null, il bot spara su grid1 (quella di player1).
// La nave "A" di player1 è in [0,0] e [0,1].
function partitaControBot(): Match {
  return Match.build({
    player1: 1,
    player2: null,
    turn: 1,
    stato: "Incorso",
    grid1: [["A","A",".","."],[".",".",".","."],
            [".",".",".","."],[".",".",".","."]],
    grid2: [[".",".",".","."],[".",".",".","."],
            [".",".",".","."],[".",".",".","."]],
    bot: true,
    dimGrid: 4,
    navi: [2],
  });
}

describe("shotBot", () => {
  let match: Match;

  beforeEach(() => {
    match = partitaControBot();
  });

  test("spara su una cella dentro la griglia e la segna con X o O", () => {
    const [coordinate, esito] = match.shotBot();
    const [riga, colonna] = coordinate;

    expect(riga).toBeGreaterThanOrEqual(0);
    expect(riga).toBeLessThan(match.dimGrid);
    expect(colonna).toBeGreaterThanOrEqual(0);
    expect(colonna).toBeLessThan(match.dimGrid);

    const cella = match.grid1[riga][colonna];
    expect(["X", "O"]).toContain(cella);
    expect(["water", "colpito"]).toContain(esito);
  });

  test("non spara mai su una cella già colpita", () => {
    // tutte le celle sono già state colpite tranne [3,3]: il bot deve scegliere quella
    match.grid1 = [["X","X","O","O"],["O","O","O","O"],
                   ["O","O","O","O"],["O","O","O","."]];

    const [coordinate, esito] = match.shotBot();

    expect(coordinate).toEqual([3, 3]);
    expect(esito).toBe("water");
  });

  test("dopo il tiro del bot il turno torna a player1", () => {
    match.turn = null; // come dopo il tiro del giocatore contro il bot
    match.shotBot();

    expect(match.turn).toBe(1);
  });
});