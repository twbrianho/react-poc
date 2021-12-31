import { INVALID_MOVE } from "boardgame.io/core";
import { PLAYER_STATE, PLAYER_MOVE } from "./poker/constants.js";
import { initDeck } from "./poker/deck-of-cards.js";
import { getWinningPlayersIDsAndHands } from "./poker/showdown.js";
import { getNthNextActivePlayerID } from "./utils/players.js";
import { STARTING_CHIPS, SMALL_BLIND, BIG_BLIND } from "./constants.js";

// MOVES
const bet = (G, ctx, amount) => {
  // TODO: Consider consolidating this into raise(), and only show differently on GUI.
  // Only usable in PRE-FLOP(PRE-BET)
  if (!G.preBet) {
    console.log("Invalid move: a bet has already been made.");
    return INVALID_MOVE;
  }
  // The bet has to be at least the current stake (which should be the big blind).
  if (amount < G.currentStake) {
    console.log(
      "Invalid move: the bet amount should be larger than the big blind."
    );
    return INVALID_MOVE;
  }
  G.playerChips[ctx.currentPlayer] -= amount;
  G.playerStakes[ctx.currentPlayer] += amount;
  G.currentStake = amount;
  // When the previous player's turn ends, the phase is over.
  // Note that phaseEndsAt can still change if someone raises again.
  G.phaseEndsAt = getNthNextActivePlayerID(G, ctx, ctx.currentPlayer, -1);
  G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.BET;
  G.preBet = false;
};
const raise = (G, ctx, raiseAmount) => {
  /*
  Match the current stake, and add raiseAmount on top of that.
  The betting ends when it's about to be this player's turn again.
  */
  G.currentStake += raiseAmount;
  const playerStake = G.playerStakes[ctx.currentPlayer];
  const betAmount = G.currentStake - playerStake + raiseAmount;
  G.playerStakes[ctx.currentPlayer] += betAmount;
  G.playerChips[ctx.currentPlayer] -= betAmount;
  // When the previous player's turn ends, the phase is over.
  // Note that phaseEndsAt can still change if someone raises again.
  G.phaseEndsAt = getNthNextActivePlayerID(G, ctx, ctx.currentPlayer, -1);
  G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.RAISE;
  G.preRaise = false;
};
const call = (G, ctx) => {
  /*
  Match the current stake.
  */
  const playerStake = G.playerStakes[ctx.currentPlayer];
  const betAmount = G.currentStake - playerStake;
  G.playerStakes[ctx.currentPlayer] += betAmount;
  G.playerChips[ctx.currentPlayer] -= betAmount;
};
const check = (G, ctx) => {
  // Only usable in FLOP(PRE-RAISE), TURN(PRE-RAISE), and RIVER(PRE-RAISE).
  if (!G.preBet) {
    return INVALID_MOVE;
  }
  // If player is not matching the current stake, then they can't check.
  if (G.playerStakes[ctx.currentPlayer] !== G.currentStake) {
    return INVALID_MOVE;
  }
  G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.CHECK;
};
const fold = (G, ctx) => {
  /*
  Drop out of round. Can no longer do anything.
  */
  G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.FOLD;
  G.playerStates[ctx.currentPlayer] = PLAYER_STATE.OUT;
};

// GAME RESOLUTION
const resolveGame = (G, ctx) => {
  // If any community cards haven't been dealt yet, deal now.
  if (G.flopCards === ["", "", ""]) {
    G.flopCards = G.deck.splice(0, 3);
  }
  if (G.turnCard === "") {
    G.turnCard = G.deck.pop();
  }
  if (G.riverCard === "") {
    G.riverCard = G.deck.pop();
  }
  // Determine the winner(s) of the game.
  const winnersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  // Pay out the stakes to the winner(s).
  for (const [playerIDAndHand] of winnersIDsAndHands) {
    G.playerChips[playerIDAndHand.id] += Math.floor(
      G.currentStake / winnersIDsAndHands.length
    );
  }
  // Temporary solution to undividable pots: give the remainder to the first winner.
  if (winnersIDsAndHands.length > 1) {
    G.playerChips[winnersIDsAndHands[0].id] +=
      G.currentStake % winnersIDsAndHands.length;
  }
  return winnersIDsAndHands;
};
const resetGame = (G, ctx) => {
  // Reset the game state.
  G.deck = initDeck();
  G.flopCards = ["", "", ""];
  G.turnCard = "";
  G.riverCard = "";
  // Reset players that have folded, but not players that are out.
  G.playerStates = G.playerStates.map((state) =>
    state === PLAYER_STATE.FOLDED ? PLAYER_STATE.IN : state
  );
  G.playerLastMoves = Array(ctx.numPlayers).fill(PLAYER_MOVE.NONE);
  G.currentStake = 0;
  G.dealerID = getNthNextActivePlayerID(G, ctx, G.dealerID, 1);
  ctx.events.setPhase("PREFLOP");
};

export const TexasHoldEm = {
  name: "texas-hold-em",
  setup: (ctx) => {
    console.log("Setting up new game...");
    return {
      deck: initDeck(), // An array of all 52 cards, created and shuffled in initDeck().
      flopCards: ["", "", ""], // 3 cards on the flop.
      turnCard: "", // 1 card on the turn.
      riverCard: "", // 1 card on the river.
      playerStates: Array(ctx.numPlayers).fill(PLAYER_STATE.IN), // Current state of each player.
      playerLastMoves: Array(ctx.numPlayers).fill(PLAYER_MOVE.NONE), // Last move made by each player.
      playerCards: Array(ctx.numPlayers).fill([]), // 2D array, representing each player's cards, e.g. [["2H", "3H"], ["2D", "3D"]].
      playerChips: Array(ctx.numPlayers).fill(STARTING_CHIPS), // The amount of chips each player has.
      playerStakes: Array(ctx.numPlayers).fill(0), // The amount each player has bet, including blinds. The sum of this is the pot.
      currentStake: 0, // The amount each player has bet. This is the amount each player has to call.
    };
  },

  minPlayers: 2,
  maxPlayers: 6,

  turn: {
    minMoves: 1,
    maxMoves: 1,
    endIf: (G, ctx) => {
      // If the current player has folded or is already out, then their turn is skipped
      return (
        G.playerStates[ctx.currentPlayer] === PLAYER_STATE.OUT ||
        G.playerStates[ctx.currentPlayer] === PLAYER_STATE.FOLDED
      );
    },
    // onMove is called at the END of each move!
    onMove: (G, ctx) => {
      if (ctx.currentPlayer === G.phaseEndsAt) {
        ctx.events.endPhase();
      }
    },
  },

  phases: {
    PREFLOP: {
      start: true,
      onBegin: (G, ctx) => {
        // Keep track of whether a bet has been made.
        G.preBet = true;
        // Deal cards to players.
        for (let i = 0; i < ctx.numPlayers; i++) {
          G.playerCards[i] = G.deck.splice(0, 2);
        }
        G.dealerID = getNthNextActivePlayerID(G, ctx, ctx.currentPlayer, -3);
        console.log(`Player ${G.dealerID} finished dealing.`);
        // Player after dealer pays small blind.
        G.smallBlindPlayerID = getNthNextActivePlayerID(G, ctx, G.dealerID);
        G.playerStakes[G.smallBlindPlayerID] += SMALL_BLIND;
        G.playerChips[G.smallBlindPlayerID] -= SMALL_BLIND;
        console.log(`Player ${G.smallBlindPlayerID} paid the small blind.`);
        // Player after small blind pays big blind.
        G.bigBlindPlayerID = getNthNextActivePlayerID(G, ctx, G.dealerID, 2);
        G.playerStakes[G.bigBlindPlayerID] += BIG_BLIND;
        G.playerChips[G.bigBlindPlayerID] -= BIG_BLIND;
        G.currentStake = BIG_BLIND;
        console.log(`Player ${G.bigBlindPlayerID} paid the big blind.`);
        ctx.events.endTurn();
        // Actual gameplay starts...
        console.log(`It is Player ${ctx.currentPlayer}'s turn...`);
      },
      moves: {
        bet,
        raise,
        call,
        fold,
      },
      next: "FLOP",
    },
    FLOP: {
      onBegin: (G, ctx) => {
        // Keep track of whether a raise has been made.
        G.preRaise = true;
        // Deal 3 cards to the table.
        G.flopCards = G.deck.splice(0, 3);
      },
      moves: {
        check,
        raise,
        call,
        fold,
      },
      next: "TURN",
    },
    TURN: {
      onBegin: (G, ctx) => {
        // Keep track of whether a raise has been made.
        G.preRaise = true;
        // Deal 1 card to the table.
        G.turnCard = G.deck.pop();
      },
      moves: {
        check,
        raise,
        call,
        fold,
      },
      next: "RIVER",
    },
    RIVER: {
      onBegin: (G, ctx) => {
        // Keep track of whether a raise has been made.
        G.preRaise = true;
        // Deal 1 card to the table.
        G.riverCard = G.deck.pop();
      },
      moves: {
        check,
        raise,
        call,
        fold,
      },
      next: "POSTGAME",
    },
    POSTGAME: {
      // Calculate and display results. Wait before starting a new game.
      onBegin: (G, ctx) => {
        resolveGame(G, ctx);
      },
      onEnd: (G, ctx) => {
        resetGame(G, ctx);
      },
    },
  },

  endIf: (G, ctx) => {
    // Check if all but one player has folded. If so, that player is the winner.
    let activePlayers = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (
        G.playerStates[i] === PLAYER_STATE.IN ||
        G.playerStates[i] === PLAYER_STATE.ALL_IN
      ) {
        activePlayers.push(i);
      }
    }
    if (activePlayers.length === 1) {
      const winnerID = activePlayers[0];
      console.log(`Player ${winnerID} won the game!`);
      // TODO: Distribute chips to winner.
      return true;
    }

    // Check if all active players have gone all-in. Resolve the game, then determine the winner.
    let allInPlayers = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.playerStates[i] === PLAYER_STATE.ALL_IN) {
        allInPlayers.push(i);
      }
    }
    if (allInPlayers === activePlayers) {
      console.log(`All players went all-in!`);
      resolveGame(G, ctx);
      return true;
    }
  },

  playerView: (G, ctx, playerID) => {
    console.log(`Player ${playerID} is viewing the game.`);
    const filteredG = {
      ...G,
      // Only allow player to see their own cards
      playerCards: G.playerCards.map((cards, index) => {
        return parseInt(playerID) === index ? cards : ["", ""];
      }),
    };
    return filteredG;
  },

  events: {
    endGame: false,
  },
};
