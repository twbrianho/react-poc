import { Client } from "boardgame.io/client";
import { INVALID_MOVE } from "boardgame.io/core";
import { BIG_BLIND, SMALL_BLIND, STARTING_CHIPS } from "../constants.js";
import { TexasHoldEm } from "../Game.js";
import { PLAYER_MOVE, PLAYER_STATE } from "../poker/constants.js";

it("Game setup", () => {
  /*
  When a new game is initialized, the game should automatically shuffle, 
  deal cards to players, and proceed to the Pre-flop phase.
  */
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  const { G, ctx } = client.store.getState();

  expect(ctx.currentPlayer).toEqual("0");
  expect(ctx.phase).toEqual("PREFLOP");

  expect(G.deck.length).toEqual(46);
  expect(G.flopCards).toEqual(["", "", ""]);
  expect(G.turnCard).toEqual("");
  expect(G.riverCard).toEqual("");
  expect(G.playerCards[0].length).toEqual(2);
  expect(G.playerCards[1].length).toEqual(2);
  expect(G.playerCards[2].length).toEqual(2);

  expect(G.playerStates).toEqual([
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
  ]);
  expect(G.playerLastMoves).toEqual([
    PLAYER_MOVE.NONE,
    PLAYER_MOVE.NONE,
    PLAYER_MOVE.NONE,
  ]);

  expect(G.dealerID).toEqual(0);
  expect(G.smallBlindPlayerID).toEqual(1);
  expect(G.bigBlindPlayerID).toEqual(2);

  expect(G.playerStakes).toEqual([0, SMALL_BLIND, BIG_BLIND]);
  expect(G.playerChips).toEqual([
    STARTING_CHIPS,
    STARTING_CHIPS - SMALL_BLIND,
    STARTING_CHIPS - BIG_BLIND,
  ]);
  expect(G.currentStake).toEqual(10);

  expect(G.preBet).toEqual(true);
});

it("Bet (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.bet(20);

  // Verify new state
  const { G, ctx } = client.store.getState();
  expect(ctx.currentPlayer).toEqual("1");
  expect(G.preBet).toEqual(false);
  expect(G.playerStakes[0]).toEqual(20);
  expect(G.playerChips[0]).toEqual(STARTING_CHIPS - 20);
  expect(G.currentStake).toEqual(20);
});

it("Bet (bet amount too low)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // The bet amount is less than the big blind
  client.moves.bet(BIG_BLIND - 1);

  // Verify new state (assert that the invalid move didn't change anything)
  const { G, ctx } = client.store.getState();
  expect(ctx.currentPlayer).toEqual("0");
  expect(G.preBet).toEqual(true);
  expect(G.playerStakes[0]).toEqual(0);
  expect(G.playerChips[0]).toEqual(STARTING_CHIPS);
  expect(G.currentStake).toEqual(BIG_BLIND);
});

it("Bet (there was already a bet)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // First bet made
  client.moves.bet(20);
  // Second bet attempted (should be ignored)
  client.moves.bet(30);

  // Verify new state (assert that the invalid move didn't change anything)
  const { G, ctx } = client.store.getState();
  expect(ctx.currentPlayer).toEqual("1");
  expect(G.preBet).toEqual(false);
  expect(G.playerStakes[1]).toEqual(SMALL_BLIND);
  expect(G.playerChips[1]).toEqual(STARTING_CHIPS - SMALL_BLIND);
  expect(G.currentStake).toEqual(20);
});
