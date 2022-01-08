import { Client } from "boardgame.io/client";
import { BIG_BLIND, SMALL_BLIND, STARTING_CHIPS } from "../constants.js";
import { TexasHoldEm } from "../Game.js";
import { PLAYER_MOVE, PLAYER_STATE } from "../poker/constants.js";

it("Everyone calls", () => {
  /*
  When a new game is initialized, the game should automatically shuffle a new deck,
  deal cards to players, and proceed to the Pre-flop phase.
  */
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.call(); // Player 2
  client.moves.call(); // Player 0
  client.moves.call(); // Player 1

  // Verify that the game has moved to the next phase correctly
  const { G, ctx } = client.store.getState();

  expect(ctx.playOrderPos).toEqual(0);
  expect(ctx.phase).toEqual("FLOP");

  expect(G.deck.length).toEqual(43);
  expect(G.communityCards.length).toEqual(3);
  expect(G.players["0"].cards.length).toEqual(2);
  expect(G.players["1"].cards.length).toEqual(2);
  expect(G.players["2"].cards.length).toEqual(2);

  expect(G.players["0"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["1"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["2"].state).toEqual(PLAYER_STATE.IN);

  expect(G.players["0"].lastMove).toEqual(PLAYER_MOVE.CALL);
  expect(G.players["1"].lastMove).toEqual(PLAYER_MOVE.CHECK);
  expect(G.players["2"].lastMove).toEqual(PLAYER_MOVE.CALL);

  expect(G.players["0"].stake).toEqual(BIG_BLIND);
  expect(G.players["1"].stake).toEqual(BIG_BLIND);
  expect(G.players["2"].stake).toEqual(BIG_BLIND);

  expect(G.players["0"].chips).toEqual(STARTING_CHIPS - BIG_BLIND);
  expect(G.players["1"].chips).toEqual(STARTING_CHIPS - BIG_BLIND);
  expect(G.players["2"].chips).toEqual(STARTING_CHIPS - BIG_BLIND);

  expect(G.currentStake).toEqual(10);
  expect(G.phaseEndsAfter).toEqual(2);
});

it("Only first player raises", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.raise(10); // Player 2
  client.moves.call(); // Player 0
  client.moves.call(); // Player 1

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND + 10;

  expect(ctx.playOrderPos).toEqual(0);
  expect(ctx.phase).toEqual("FLOP");

  expect(G.players["0"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["1"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["2"].state).toEqual(PLAYER_STATE.IN);

  expect(G.players["0"].lastMove).toEqual(PLAYER_MOVE.CALL);
  expect(G.players["1"].lastMove).toEqual(PLAYER_MOVE.CALL);
  expect(G.players["2"].lastMove).toEqual(PLAYER_MOVE.BET);

  expect(G.players["0"].stake).toEqual(expectedStake);
  expect(G.players["1"].stake).toEqual(expectedStake);
  expect(G.players["2"].stake).toEqual(expectedStake);

  expect(G.players["0"].chips).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.players["1"].chips).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.players["2"].chips).toEqual(STARTING_CHIPS - expectedStake);

  expect(G.currentStake).toEqual(expectedStake);
  expect(G.phaseEndsAfter).toEqual(2);
});

it("Last player raises", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.call(); // Player 2
  client.moves.call(); // Player 0
  client.moves.raise(10); // Player 1
  client.moves.call(); // Player 2
  client.moves.call(); // Player 0

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND + 10;

  expect(ctx.playOrderPos).toEqual(0);
  expect(ctx.phase).toEqual("FLOP");

  expect(G.players["0"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["1"].state).toEqual(PLAYER_STATE.IN);
  expect(G.players["2"].state).toEqual(PLAYER_STATE.IN);

  expect(G.players["0"].lastMove).toEqual(PLAYER_MOVE.CALL);
  expect(G.players["1"].lastMove).toEqual(PLAYER_MOVE.BET);
  expect(G.players["2"].lastMove).toEqual(PLAYER_MOVE.CALL);

  expect(G.players["0"].stake).toEqual(expectedStake);
  expect(G.players["1"].stake).toEqual(expectedStake);
  expect(G.players["2"].stake).toEqual(expectedStake);

  expect(G.players["0"].chips).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.players["1"].chips).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.players["2"].chips).toEqual(STARTING_CHIPS - expectedStake);

  expect(G.currentStake).toEqual(expectedStake);
  expect(G.phaseEndsAfter).toEqual(2);
});
