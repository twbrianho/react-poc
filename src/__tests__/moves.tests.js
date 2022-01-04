import { Client } from "boardgame.io/client";
import { BIG_BLIND, SMALL_BLIND, STARTING_CHIPS } from "../constants.js";
import { TexasHoldEm } from "../Game.js";
import { PLAYER_MOVE, PLAYER_STATE } from "../poker/constants.js";

it("Game setup", () => {
  /*
  When a new game is initialized, the game should automatically shuffle a new deck,
  deal cards to players, and proceed to the Pre-flop phase.
  */
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  const { G, ctx } = client.store.getState();

  expect(ctx.playOrderPos).toEqual(2);
  expect(ctx.phase).toEqual("PREFLOP");

  expect(G.deck.length).toEqual(46);
  expect(G.communityCards).toEqual([]);
  expect(G.playerCards[0].length).toEqual(2);
  expect(G.playerCards[1].length).toEqual(2);
  expect(G.playerCards[2].length).toEqual(2);

  expect(G.playerStates).toEqual([
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
  ]);
  expect(G.playerLastMoves).toEqual([
    PLAYER_MOVE.SMALL_BLIND,
    PLAYER_MOVE.BIG_BLIND,
    PLAYER_MOVE.NONE,
  ]);

  expect(G.dealerPos).toEqual(2);
  expect(G.smallBlindPlayerPos).toEqual(0);
  expect(G.bigBlindPlayerPos).toEqual(1);

  expect(G.playerStakes).toEqual([SMALL_BLIND, BIG_BLIND, 0]);
  expect(G.playerChips).toEqual([
    STARTING_CHIPS - SMALL_BLIND,
    STARTING_CHIPS - BIG_BLIND,
    STARTING_CHIPS,
  ]);
  expect(G.currentStake).toEqual(10);
  expect(G.phaseEndsAfter).toEqual(1);
});

it("Call (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.call(); // Player 2

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND;
  expect(G.playerStates[2]).toEqual(PLAYER_STATE.IN);
  expect(G.playerLastMoves[2]).toEqual(PLAYER_MOVE.CALL);
  expect(ctx.playOrderPos).toEqual(0); // Turn has gone to next player
  expect(G.playerStakes[2]).toEqual(expectedStake);
  expect(G.playerChips[2]).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.currentStake).toEqual(expectedStake);
  expect(G.phaseEndsAfter).toEqual(1);
});

it("Bet (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.raise(20); // Player 2

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND + 20;
  expect(G.playerStates[2]).toEqual(PLAYER_STATE.IN);
  expect(G.playerLastMoves[2]).toEqual(PLAYER_MOVE.BET);
  expect(ctx.playOrderPos).toEqual(0); // Turn has gone to next player
  expect(G.playerStakes[2]).toEqual(expectedStake);
  expect(G.playerChips[2]).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.currentStake).toEqual(expectedStake);
  expect(G.phaseEndsAfter).toEqual(1);
});

it("Raise (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.raise(10); // Player 2
  client.moves.raise(20); // Player 0

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND + 10 + 20;
  expect(G.playerStates[0]).toEqual(PLAYER_STATE.IN);
  expect(G.playerLastMoves[0]).toEqual(PLAYER_MOVE.RAISE);
  expect(ctx.playOrderPos).toEqual(1); // Turn has gone to next player
  expect(G.playerStakes[0]).toEqual(expectedStake);
  expect(G.playerChips[0]).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.currentStake).toEqual(expectedStake);
  expect(G.phaseEndsAfter).toEqual(2);
});

it("Fold (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.fold(); // Player 2

  // Verify new state
  const { G, ctx } = client.store.getState();
  expect(G.playerStates[2]).toEqual(PLAYER_STATE.OUT);
  expect(G.playerLastMoves[2]).toEqual(PLAYER_MOVE.FOLD);
  expect(ctx.playOrderPos).toEqual(0); // Turn has gone to next player
  expect(G.playerStakes[2]).toEqual(0);
  expect(G.playerChips[2]).toEqual(STARTING_CHIPS);
  expect(G.currentStake).toEqual(BIG_BLIND);
  expect(G.phaseEndsAfter).toEqual(1);
});
