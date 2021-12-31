import { INVALID_MOVE } from "boardgame.io/core";
import { PLAYER_STATE, PLAYER_MOVE, GAME_PHASE } from "./poker/constants.js";
import { initDeck } from "./poker/deck-of-cards.js";
import { getWinningPlayersIDsAndHands } from "./poker/showdown.js";
import { getNthNextActivePlayerID } from "./utils/players.js";
import { STARTING_CHIPS, SMALL_BLIND, BIG_BLIND } from "./constants.js";

// MOVES
const raise = (G, ctx, raiseAmount) => {
  /*
  Match the current stake, and add raiseAmount on top of that.
  The betting ends when it's about to be this player's turn again.
  This encapsulates both "Bet" and "Raise".
  */
  if (G.currentStake === BIG_BLIND && ctx.phase === GAME_PHASE.PREFLOP) {
    G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.BET;
  } else {
    G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.RAISE;
  }
  // Up the current stake, then make the player match the current stake.
  G.currentStake += raiseAmount;
  const playerStake = G.playerStakes[ctx.currentPlayer];
  const betAmount = G.currentStake - playerStake;
  G.playerStakes[ctx.currentPlayer] += betAmount;
  G.playerChips[ctx.currentPlayer] -= betAmount;
  // When the previous player's turn ends, the phase is over.
  // Note that phaseEndsAt can still change if someone raises again.
  G.phaseEndsAt = getNthNextActivePlayerID(G, ctx, ctx.currentPlayer, -1);
};
const call = (G, ctx) => {
  /*
  Match the current stake and stay in the game.
  This encapsulates both "Check" and "Call".
  */
  const playerStake = G.playerStakes[ctx.currentPlayer];
  const amountToMatch = G.currentStake - playerStake;
  G.playerStakes[ctx.currentPlayer] += amountToMatch;
  G.playerChips[ctx.currentPlayer] -= amountToMatch;
  if (amountToMatch === 0) {
    G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.CHECK;
  } else {
    G.playerLastMoves[ctx.currentPlayer] = PLAYER_MOVE.CALL;
  }
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
    return {
      gameLogs: ["Setting up new game..."],
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
        // Deal cards to players.
        for (let i = 0; i < ctx.numPlayers; i++) {
          G.playerCards[i] = G.deck.splice(0, 2);
        }
        G.dealerID = getNthNextActivePlayerID(G, ctx, ctx.currentPlayer, -3);
        G.gameLogs.push(`Player ${G.dealerID} finished dealing.`);
        // Player after dealer pays small blind.
        G.smallBlindPlayerID = getNthNextActivePlayerID(G, ctx, G.dealerID);
        G.playerStakes[G.smallBlindPlayerID] += SMALL_BLIND;
        G.playerChips[G.smallBlindPlayerID] -= SMALL_BLIND;
        G.gameLogs.push(`Player ${G.smallBlindPlayerID} paid the small blind.`);
        // Player after small blind pays big blind.
        G.bigBlindPlayerID = getNthNextActivePlayerID(G, ctx, G.dealerID, 2);
        G.playerStakes[G.bigBlindPlayerID] += BIG_BLIND;
        G.playerChips[G.bigBlindPlayerID] -= BIG_BLIND;
        G.currentStake = BIG_BLIND;
        G.gameLogs.push(`Player ${G.bigBlindPlayerID} paid the big blind.`);
        ctx.events.endTurn();
        // Actual gameplay starts...
        G.gameLogs.push(`It is Player ${ctx.currentPlayer}'s turn...`);
      },
      moves: {
        raise,
        call,
        fold,
      },
      next: GAME_PHASE.FLOP,
    },
    FLOP: {
      onBegin: (G, ctx) => {
        // Deal 3 cards to the table.
        G.flopCards = G.deck.splice(0, 3);
      },
      moves: {
        raise,
        call,
        fold,
      },
      next: GAME_PHASE.TURN,
    },
    TURN: {
      onBegin: (G, ctx) => {
        // Deal 1 card to the table.
        G.turnCard = G.deck.pop();
      },
      moves: {
        raise,
        call,
        fold,
      },
      next: GAME_PHASE.RIVER,
    },
    RIVER: {
      onBegin: (G, ctx) => {
        // Deal 1 card to the table.
        G.riverCard = G.deck.pop();
      },
      moves: {
        raise,
        call,
        fold,
      },
      next: GAME_PHASE.SHOWDOWN,
    },
    SHOWDOWN: {
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
      G.gameLogs.push(`Player ${winnerID} won the game!`);
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
      G.gameLogs.push(`All players went all-in!`);
      resolveGame(G, ctx);
      return true;
    }
  },

  playerView: (G, ctx, playerID) => {
    const filteredG = {
      ...G,
      // Only allow player to see their own cards
      playerCards: G.playerCards.map((cards, index) => {
        return parseInt(playerID) === index ? cards : ["", ""];
      }),
      // Obviously, we also need to hide the deck
      deck: [],
    };
    return filteredG;
  },

  events: {
    endGame: false,
  },
};
