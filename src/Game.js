import { INVALID_MOVE } from "boardgame.io/core";
import { PLAYER_STATE, PLAYER_MOVE, GAME_PHASE } from "./poker/constants.js";
import { initDeck } from "./poker/deck-of-cards.js";
import { getWinningPlayersIDsAndHands } from "./poker/showdown.js";
import { getNthNextActivePlayerPos } from "./utils/players.js";
import { STARTING_CHIPS, SMALL_BLIND, BIG_BLIND } from "./constants.js";

// MOVES
const raise = (G, ctx, raiseAmount) => {
  /*
  Match the current stake, and add raiseAmount on top of that.
  The betting ends when it's about to be this player's turn again.
  This encapsulates both "Bet" and "Raise".
  */
  if (ctx.phase === GAME_PHASE.PREFLOP && G.currentStake === BIG_BLIND) {
    // Bet (essentially the first raise of the game, only different in name)
    G.playerLastMoves[ctx.playOrderPos] = PLAYER_MOVE.BET;
  } else {
    // Raise
    G.playerLastMoves[ctx.playOrderPos] = PLAYER_MOVE.RAISE;
  }
  // Up the current stake, then make the player match the current stake.
  G.currentStake += raiseAmount;
  const playerStake = G.playerStakes[ctx.playOrderPos];
  const betAmount = G.currentStake - playerStake;
  G.playerStakes[ctx.playOrderPos] += betAmount;
  G.playerChips[ctx.playOrderPos] -= betAmount;
  // When the previous player's turn ends, the phase is over.
  // Note that phaseEndsAfter can still change if someone raises again.
  G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, ctx.playOrderPos, -1);
  G.gameLogs.push(
    `Player ${ctx.currentPlayer} raises $${raiseAmount}, bringing the stake to $${G.currentStake}`
  );
};
const call = (G, ctx) => {
  /*
  Match the current stake and stay in the game.
  This encapsulates both "Check" and "Call".
  */
  const playerStake = G.playerStakes[ctx.playOrderPos];
  const amountToMatch = G.currentStake - playerStake;
  G.playerStakes[ctx.playOrderPos] += amountToMatch;
  G.playerChips[ctx.playOrderPos] -= amountToMatch;
  if (amountToMatch === 0) {
    G.playerLastMoves[ctx.playOrderPos] = PLAYER_MOVE.CHECK;
    G.gameLogs.push(`Player ${ctx.currentPlayer} checks.`);
  } else {
    G.playerLastMoves[ctx.playOrderPos] = PLAYER_MOVE.CALL;
    G.gameLogs.push(`Player ${ctx.currentPlayer} calls.`);
  }
};
const fold = (G, ctx) => {
  /*
  Drop out of round. Can no longer do anything.
  */
  G.playerLastMoves[ctx.playOrderPos] = PLAYER_MOVE.FOLD;
  G.playerStates[ctx.playOrderPos] = PLAYER_STATE.OUT;
  G.gameLogs.push(`Player ${ctx.currentPlayer} folds.`);
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
  G.dealerPos = getNthNextActivePlayerPos(G, ctx, G.dealerPos, 1);
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
    order: {
      // Get the initial value of playOrderPos.
      // This is called at the beginning of the phase.
      first: (G, ctx) => 0,
      // Get the next value of playOrderPos.
      // This is called at the end of each turn.
      // The phase ends if this returns undefined.
      next: (G, ctx) => getNthNextActivePlayerPos(G, ctx, ctx.playOrderPos, 1),
    },
    // NOTE: Cannot enforce minMoves because the small and big blinds do not count as moves.
    maxMoves: 1,
    endIf: (G, ctx) => {
      // If the current player has folded or is already out, then their turn is skipped
      // Usually it shouldn't come to this, since getNthNextActivePlayerPos determines who goes next, and skips such players.
      // TODO: Remove this once we have better testing to ensure it doesn't come to this.
      return (
        G.playerStates[ctx.playOrderPos] === PLAYER_STATE.OUT ||
        G.playerStates[ctx.playOrderPos] === PLAYER_STATE.FOLDED
      );
    },
    onBegin: (G, ctx) => {
      // Force the small blind and big blind.
      if (ctx.phase === "PREFLOP" && G.currentStake === 0) {
        // At the start of the game, the player after the dealer has to pay the small blind.
        // This is effectively a forced move.
        G.playerChips[ctx.playOrderPos] -= SMALL_BLIND;
        G.playerStakes[ctx.playOrderPos] += SMALL_BLIND;
        G.currentStake = SMALL_BLIND;
        G.playerLastMoves[ctx.playOrderPos] = PLAYER_MOVE.SMALL_BLIND;
        G.gameLogs.push(`Player ${ctx.currentPlayer} pays the small blind.`);
        G.smallBlindPlayerPos = ctx.playOrderPos;
        G.phaseEndsAfter = G.smallBlindPlayerPos;
        ctx.events.endTurn();
      } else if (ctx.phase === "PREFLOP" && G.currentStake === SMALL_BLIND) {
        // At the start of the game, the player after the small blind has to pay the big blind.
        // This is effectively a forced move.
        G.playerChips[ctx.playOrderPos] -= BIG_BLIND;
        G.playerStakes[ctx.playOrderPos] += BIG_BLIND;
        G.currentStake = BIG_BLIND;
        G.playerLastMoves[ctx.playOrderPos] = PLAYER_MOVE.BIG_BLIND;
        G.gameLogs.push(`Player ${ctx.currentPlayer} pays the big blind.`);
        G.bigBlindPlayerPos = ctx.playOrderPos;
        G.phaseEndsAfter = G.bigBlindPlayerPos;
        ctx.events.endTurn();
      }
    },
    // onMove is called at the END of each move!
    onMove: (G, ctx) => {
      if (parseInt(ctx.playOrderPos) === G.phaseEndsAfter) {
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
        // I want the player before player 0 to be the dealer — that way
        // each phase after this will start with player 0 naturally.
        G.dealerPos = getNthNextActivePlayerPos(G, ctx, ctx.playOrderPos, -1);
        G.gameLogs.push(`Player ${ctx.playOrder[G.dealerPos]} is the dealer.`);
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
        // The turn has been passed to the first player, who should be the player after the dealer.
        // When their previous player's turn ends, the phase is over and the next phase begins.
        // Note that phaseEndsAfter will change whenever someone raises.
        G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, 0, -1);
        G.gameLogs.push(`Here comes the Flop: ${G.flopCards.join(", ")}`);
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
        // The turn has been passed to the first player, who should be the player after the dealer.
        // When their previous player's turn ends, the phase is over and the next phase begins.
        // Note that phaseEndsAfter will change whenever someone raises.
        G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, 0, -1);
        G.gameLogs.push(`Here comes the Turn: ${G.turnCard}`);
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
        // The turn has been passed to the first player, who should be the player after the dealer.
        // When their previous player's turn ends, the phase is over and the next phase begins.
        // Note that phaseEndsAfter will change whenever someone raises.
        G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, 0, -1);
        G.gameLogs.push(`Here comes the River: ${G.riverCard}`);
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
      G.gameLogs.push(`Player ${ctx.playOrder[winnerID]} won the game!`);
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
