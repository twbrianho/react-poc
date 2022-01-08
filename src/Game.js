import {
  PLAYER_STATE,
  PLAYER_MOVE,
  GAME_PHASE,
  HAND_TO_DISPLAY_MAP,
} from "./poker/constants.js";
import { initDeck } from "./poker/deck-of-cards.js";
import { getWinningPlayersIDsAndHands } from "./poker/showdown.js";
import { getNthNextActivePlayerPos } from "./utils/players.js";
import { STARTING_CHIPS, SMALL_BLIND, BIG_BLIND } from "./constants.js";
import { createCard } from "./poker/card.js";
import { getPotTotal } from "./utils/chips.js";

// MOVES
const raise = (G, ctx, raiseAmount) => {
  /*
  Match the current stake, and add raiseAmount on top of that.
  The betting ends when it's about to be this player's turn again.
  This encapsulates both "Bet" and "Raise".
  */
  if (ctx.phase === GAME_PHASE.PREFLOP && G.currentStake === BIG_BLIND) {
    // Bet (essentially the first raise of the game, only different in name)
    G.players[ctx.currentPlayer].lastMove = PLAYER_MOVE.BET;
  } else {
    // Raise
    G.players[ctx.currentPlayer].lastMove = PLAYER_MOVE.RAISE;
  }
  // Up the current stake, then make the player match the current stake.
  G.currentStake += raiseAmount;
  const playerStake = G.players[ctx.currentPlayer].stake;
  const betAmount = G.currentStake - playerStake;
  G.players[ctx.currentPlayer].stake += betAmount;
  G.players[ctx.currentPlayer].chips -= betAmount;
  // When the previous player's turn ends, the phase is over.
  // Note that phaseEndsAfter can still change if someone raises again.
  G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, ctx.playOrderPos, -1);
  G.gameLogs.push(
    `${ctx.currentPlayer} raises $${raiseAmount}, bringing the stake to $${G.currentStake}`
  );
};
const call = (G, ctx) => {
  /*
  Match the current stake and stay in the game.
  This encapsulates both "Check" and "Call".
  */
  const playerStake = G.players[ctx.currentPlayer].stake;
  const amountToMatch = G.currentStake - playerStake;
  G.players[ctx.currentPlayer].stake += amountToMatch;
  G.players[ctx.currentPlayer].chips -= amountToMatch;
  if (amountToMatch === 0) {
    G.players[ctx.currentPlayer].lastMove = PLAYER_MOVE.CHECK;
    G.gameLogs.push(`${ctx.currentPlayer} checks.`);
  } else {
    G.players[ctx.currentPlayer].lastMove = PLAYER_MOVE.CALL;
    G.gameLogs.push(`${ctx.currentPlayer} calls.`);
  }
};
const fold = (G, ctx) => {
  /*
  Drop out of round. Can no longer do anything.
  */
  G.players[ctx.currentPlayer].lastMove = PLAYER_MOVE.FOLD;
  G.players[ctx.currentPlayer].state = PLAYER_STATE.OUT;
  G.gameLogs.push(`${ctx.currentPlayer} folds.`);
};

// GAME RESOLUTION
const resolveGame = (G, ctx) => {
  // Determine the winner(s) of the game.
  const winnersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  G.gameLogs.push(
    "Winner(s): " +
      winnersIDsAndHands
        .map(
          (winner) => `${winner.id} (${HAND_TO_DISPLAY_MAP.get(winner.hand)})`
        )
        .join(", ")
  );
  // Pay out the stakes to the winner(s).
  const potTotal = getPotTotal(G);
  winnersIDsAndHands.map(
    (winner) =>
      (G.players[winner.id].chips += Math.floor(
        potTotal / winnersIDsAndHands.length
      ))
  );
  // Temporary solution to undividable pots: give the remainder to the first winner.
  // TODO: Figure out what the actual rules are and implement them.
  if (winnersIDsAndHands.length > 1) {
    G.players[winnersIDsAndHands[0].id].chips +=
      G.currentStake % winnersIDsAndHands.length;
  }
  G.gameLogs.push(`$${potTotal} in the pot paid to winner(s).`);
  return winnersIDsAndHands;
};

// RESET GAME (prep for next round)
const resetGame = (G, ctx) => {
  // Reset the game state.
  G.deck = initDeck();
  G.communityCards = [];
  let newPlayers = {};
  for (const [playerID, oldData] of Object.entries(G.players)) {
    // If a player is out of chips, they're out of the game.
    newPlayers[playerID].state =
      oldData.chips === 0 ? PLAYER_STATE.OUT : PLAYER_STATE.IN;
    newPlayers[playerID].lastMove = PLAYER_MOVE.NONE;
    newPlayers[playerID].cards = [];
    newPlayers[playerID].chips = oldData.chips;
    newPlayers[playerID].stake = 0;
  }
  G.players = newPlayers;
  G.currentStake = 0;
  G.gameLogs.push("Ready for new game.");
  ctx.events.setPhase("PREFLOP");
};

export const TexasHoldEm = {
  name: "texas-hold-em",
  setup: (ctx) => {
    // TODO: Currently all player data is generated from hard-coded values, but we need to let the chip counts be passed in for existing players.
    let players = {};
    ctx.playOrder.forEach(
      (playerID) =>
        (players[playerID] = {
          state: PLAYER_STATE.IN, // Current state of each player.
          lastMove: PLAYER_MOVE.NONE, // Last move made by each player.
          cards: [], // An array of 2 strings, representing each player's cards
          chips: STARTING_CHIPS, // The amount of chips each player has.
          stake: 0, // The amount each player has bet, including blinds. The sum of this is the pot.
        })
    );
    return {
      gameLogs: ["Setting up new game..."],
      deck: initDeck(), // An array of all 52 cards, created and shuffled in initDeck().
      communityCards: [], // None are dealt yet, but eventually includes 3 cards for Flop, 1 for Turn, 1 for River.
      players: players, // An object of all players' data, with their IDs as keys.
      currentStake: 0, // The amount each player has bet. This is the amount each player has to call.
    };
  },

  minPlayers: 2,
  maxPlayers: 6,

  turn: {
    order: {
      // Get the initial value of playOrderPos.
      // This is called at the beginning of the phase.
      first: (G, ctx) => {
        // TODO: Deal with the edgecase where the 0th player is already out / folded.
        if (ctx.phase === GAME_PHASE.PREFLOP) {
          // Pre-flop starts with the player after Big Blind, which is 2 players after the Small Blind.
          // We designate the Small Blind as the first player (index 0), since that makes subsquent phases naturally start with them.
          return getNthNextActivePlayerPos(G, ctx, 0, 2);
        } else {
          return 0;
        }
      },
      // Get the next value of playOrderPos.
      // This is called at the end of each turn.
      // The phase ends if this returns undefined.
      next: (G, ctx) => getNthNextActivePlayerPos(G, ctx, ctx.playOrderPos, 1),
    },
    minMoves: 1,
    maxMoves: 1,
    endIf: (G, ctx) => {
      // If the current player has folded or is already out, then their turn is skipped.
      // Usually it should never come to this, since getNthNextActivePlayerPos determines who goes next and skips such players.
      // TODO: Remove this once we have better testing to ensure it doesn't come to this.
      return (
        G.players[ctx.currentPlayer].state === PLAYER_STATE.OUT ||
        G.players[ctx.currentPlayer].state === PLAYER_STATE.FOLDED
      );
    },
    onBegin: (G, ctx) => {
      // TODO: Pre-turn checks.
    },
    // onMove is called at the END of the turn, after the move has been made.
    onMove: (G, ctx) => {
      // TODO: Make sure the player's stake matches the current stake, if they are still in the game.
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
        for (const playerData of Object.values(G.players)) {
          if (playerData.state === PLAYER_STATE.IN) {
            playerData.cards = G.deck.splice(0, 2);
          }
        }

        // I want the player before player 0 to be the dealer — that way
        // each phase after this will start with player 0 naturally.
        const dealerPos = getNthNextActivePlayerPos(
          G,
          ctx,
          ctx.playOrderPos,
          -1
        );
        G.gameLogs.push(`${ctx.playOrder[dealerPos]} is the dealer.`);

        // The player after the dealer has to pay the small blind.
        // TODO: Deal with the edge case where the 0th player is out of the game!
        const smallBlindPlayerPos = 0;
        G.players[smallBlindPlayerPos].chips -= SMALL_BLIND;
        G.players[smallBlindPlayerPos].stake += SMALL_BLIND;
        G.currentStake = SMALL_BLIND;
        G.players[smallBlindPlayerPos].lastMove = PLAYER_MOVE.SMALL_BLIND;
        G.gameLogs.push(
          `${ctx.playOrder[smallBlindPlayerPos]} pays the small blind.`
        );
        G.phaseEndsAfter = smallBlindPlayerPos;

        // The player after the small blind has to pay the big blind.
        const bigBlindPlayerPos = getNthNextActivePlayerPos(G, ctx, 0, 1);
        G.players[bigBlindPlayerPos].chips -= BIG_BLIND;
        G.players[bigBlindPlayerPos].stake += BIG_BLIND;
        G.currentStake = BIG_BLIND;
        G.players[bigBlindPlayerPos].lastMove = PLAYER_MOVE.BIG_BLIND;
        G.gameLogs.push(
          `${ctx.playOrder[bigBlindPlayerPos]} pays the big blind.`
        );

        G.phaseEndsAfter = bigBlindPlayerPos;
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
        const flopCards = G.deck.splice(0, 3);
        G.communityCards.push(...flopCards);
        // The turn has been passed to the first player, who should be the player after the dealer.
        // When their previous player's turn ends, the phase is over and the next phase begins.
        // Note that phaseEndsAfter will change whenever someone raises.
        G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, 0, -1);
        G.gameLogs.push(`Here comes the Flop: ${flopCards.join(", ")}`);
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
        const turnCard = G.deck.pop();
        G.communityCards.push(turnCard);
        // The turn has been passed to the first player, who should be the player after the dealer.
        // When their previous player's turn ends, the phase is over and the next phase begins.
        // Note that phaseEndsAfter will change whenever someone raises.
        G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, 0, -1);
        G.gameLogs.push(`Here comes the Turn: ${turnCard}`);
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
        const riverCard = G.deck.pop();
        G.communityCards.push(riverCard);
        // The turn has been passed to the first player, who should be the player after the dealer.
        // When their previous player's turn ends, the phase is over and the next phase begins.
        // Note that phaseEndsAfter will change whenever someone raises.
        G.phaseEndsAfter = getNthNextActivePlayerPos(G, ctx, 0, -1);
        G.gameLogs.push(`Here comes the River: ${riverCard}`);
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
    let allInPlayers = [];
    ctx.playOrder.forEach((playerID) => {
      if (G.players[playerID].state === PLAYER_STATE.IN) {
        activePlayers.push(playerID);
      } else if (G.players[playerID].state === PLAYER_STATE.ALL_IN) {
        activePlayers.push(playerID);
        allInPlayers.push(playerID);
      }
    });

    if (activePlayers.length === 1) {
      const winnerID = activePlayers[0];
      G.gameLogs.push(
        `${winnerID} is the only player still in the game, winning by default.`
      );
      G.players[winnerID].chips += getPotTotal(G);
      // TODO: Distribute chips to winner.
      return true;
    }

    // If all active players have gone all-in, resolve the game right away.
    if (allInPlayers === activePlayers) {
      G.gameLogs.push(`All players went all-in!`);
      resolveGame(G, ctx);
      return true;
    }
  },

  // TODO: Definitely should figure out how to test this.
  playerView: (G, ctx, playerID) => {
    // Players should not be able to see each other's cards.
    // However, they should be able to see all other data (e.g. chips, last move, etc).
    const filteredPlayers = {};
    for (const [currID, originalData] of Object.entries(G.players)) {
      filteredPlayers[currID] = {
        ...originalData,
        cards:
          playerID === currID
            ? originalData.cards
            : [createCard("", ""), createCard("", "")],
      };
    }
    const filteredG = {
      ...G,
      // Opponents' cards are hidden until showdown.
      players: ctx.phase === GAME_PHASE.SHOWDOWN ? G.players : filteredPlayers,
      // We always need to hide the deck.
      deck: [],
    };
    return filteredG;
  },

  // ...shit, why did I do this? I forgot what this does.
  events: {
    endGame: false,
  },
};
