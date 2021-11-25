import { PlayerState, PlayerMove } from "./poker/constants.js";
import { initDeck } from "./poker/deck_of_cards.js";

const SmallBlind = 2;
const BigBlind = 4;

function check(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMove.CHECK;
}

function call(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMove.CALL;
  let bet = SmallBlind;
  if (["TURN", "RIVER"].includes(ctx.phase)) {
    bet = BigBlind;
  }
  G.playerChips[currPlayer] -= bet;
  G.pot += bet;
}

function raise(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMove.RAISE;
  let bet = SmallBlind * 2;
  if (["TURN", "RIVER"].includes(ctx.phase)) {
    bet = BigBlind * 2;
  }
  G.playerChips[currPlayer] -= bet;
  G.pot += bet;
}

function fold(G, ctx) {
  const currPlayer = ctx.currentPlayer;
  G.playerLastMoves[currPlayer] = PlayerMove.FOLD;
  G.playerStates[currPlayer] = PlayerState.OUT;
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
      playerStates: Array(ctx.numPlayers).fill(PlayerState.BETTING),
      playerLastMoves: Array(ctx.numPlayers).fill(PlayerMove.NONE),
      playerCards: playerCards,
      playerChips: Array(ctx.numPlayers).fill(100),
    };
  },

  minPlayers: 2,
  maxPlayers: 10,

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
          if (G.playerStates[i] === PlayerState.OUT) {
            G.playerLastMoves[i] = PlayerMove.FOLD;
          } else {
            G.playerLastMoves[i] = PlayerMove.NONE;
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
    return G.playerStates.every((state) => state === PlayerState.OUT);
  },
};
