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
  expect(G.players["0"].cards.length).toEqual(2);
  expect(G.players["1"].cards.length).toEqual(2);
  expect(G.players["2"].cards.length).toEqual(2);

  expect(G.players["0"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["1"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["2"].state).toEqual(PLAYER_STATE.IN);

  expect(G.players["0"].lastMove).toEqual(PLAYER_MOVE.SMALL_BLIND);
  expect(G.players["1"].lastMove).toEqual(PLAYER_MOVE.BIG_BLIND);
  expect(G.players["2"].lastMove).toEqual(PLAYER_MOVE.NONE);

  expect(G.players["0"].stake).toEqual(SMALL_BLIND);
  expect(G.players["1"].stake).toEqual(BIG_BLIND);
  expect(G.players["2"].stake).toEqual(0);

  expect(G.players["0"].chips).toEqual(STARTING_CHIPS - SMALL_BLIND);
  expect(G.players["1"].chips).toEqual(STARTING_CHIPS - BIG_BLIND);
  expect(G.players["2"].chips).toEqual(STARTING_CHIPS);

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
  expect(ctx.playOrderPos).toEqual(0); // Turn has gone to next player
  expect(G.players["2"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["2"].lastMove).toEqual(PLAYER_MOVE.CALL);
  expect(G.players["2"].stake).toEqual(expectedStake);
  expect(G.players["2"].chips).toEqual(STARTING_CHIPS - expectedStake);
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
  expect(ctx.playOrderPos).toEqual(0); // Turn has gone to next player
  expect(G.players["2"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["2"].lastMove).toEqual(PLAYER_MOVE.BET);
  expect(G.players["2"].stake).toEqual(expectedStake);
  expect(G.players["2"].chips).toEqual(STARTING_CHIPS - expectedStake);
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
  expect(ctx.playOrderPos).toEqual(1); // Turn has gone to next player
  expect(G.players["0"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["0"].lastMove).toEqual(PLAYER_MOVE.RAISE);
  expect(G.players["0"].stake).toEqual(expectedStake);
  expect(G.players["0"].chips).toEqual(STARTING_CHIPS - expectedStake);
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
  expect(ctx.playOrderPos).toEqual(0); // Turn has gone to next player
  expect(G.players["2"].state).toEqual(PLAYER_STATE.OUT);
  expect(G.players["2"].lastMove).toEqual(PLAYER_MOVE.FOLD);
  expect(G.players["2"].stake).toEqual(0);
  expect(G.players["2"].chips).toEqual(STARTING_CHIPS);
  expect(G.currentStake).toEqual(BIG_BLIND);
  expect(G.phaseEndsAfter).toEqual(1);
});
