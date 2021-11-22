import { PlayerStates, PlayerMoves } from "./Constants.js";
import { initDeck } from "./DeckOfCards.js";

const SmallBlind = 2;
const BigBlind = 4;

function check(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMoves.get("CHECK");
}

function call(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMoves.get("CALL");
  let bet = SmallBlind;
  if (["TURN", "RIVER"].includes(ctx.phase)) {
    bet = BigBlind;
  }
  G.playerChips[currPlayer] -= bet;
  G.pot += bet;
}

function raise(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMoves.get("RAISE");
  let bet = SmallBlind * 2;
  if (["TURN", "RIVER"].includes(ctx.phase)) {
    bet = BigBlind * 2;
  }
  G.playerChips[currPlayer] -= bet;
  G.pot += bet;
}

function fold(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMoves.get("FOLD");
  G.playerStates[currPlayer] = PlayerStates.get("OUT");
}

export const LimitHoldEm = {
  name: "limit-hold-em",
  setup: (ctx) => {
    let deck = initDeck();
    let playerCards = Array(ctx.numPlayers).fill([]);
    for (let i = 0; i < ctx.numPlayers; i++) {
      playerCards[i] = deck.splice(0, 2);
    }
    return {
      deck: deck,
      flopCards: ["", "", ""],
      turnCard: "",
      riverCard: "",
      potChips: 0,
      playerStates: Array(ctx.numPlayers).fill(PlayerStates.get("BETTING")),
      playerLastMoves: Array(ctx.numPlayers).fill(PlayerMoves.get("NONE")),
      playerCards: playerCards,
      playerChips: Array(ctx.numPlayers).fill(100),
    };
  },

  minPlayers: 2,
  maxPlayers: 2, // Temporary limit

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    check,
    call,
    raise,
    fold,
  },

  phases: {
    // Deal cards to players.
    PREFLOP: {
      next: "FLOP",
      start: true,
    },
    // Deal 3 cards to the table.
    FLOP: {
      onBegin: (G, ctx) => {
        G.flopCards = G.deck.splice(0, 3);
        for (let i = 0; i < ctx.numPlayers; i++) {
          if (G.playerStates[i] === PlayerStates.get("OUT")) {
            G.playerLastMoves[i] = PlayerMoves.get("FOLD");
          } else {
            G.playerLastMoves[i] = PlayerMoves.get("NONE");
          }
        }
      },
      next: "TURN",
    },
    // Deal 1 card to the table.
    TURN: {
      onBegin: (G, ctx) => {
        G.turnCard = G.deck.pop();
      },
      next: "RIVER",
    },
    // Deal 1 card to the table.
    RIVER: {
      onBegin: (G, ctx) => {
        G.riverCard = G.deck.pop();
      },
    },
  },

  playerView: (G, ctx, playerID) => {
    return {
      deck: G.deck,
      flopCards: G.flopCards,
      turnCard: G.turnCard,
      riverCard: G.riverCard,
      potChips: G.potChips,
      playerStates: G.playerStates,
      playerLastMoves: G.playerLastMoves,
      myCards: G.playerCards[playerID], // Only allow player to see their own cards
      playerChips: G.playerChips,
    };
  },

  endIf: (G, ctx) => {
    return G.playerStates.every((state) => state === PlayerStates.OUT);
  },
};
