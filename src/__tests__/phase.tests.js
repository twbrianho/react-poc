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
  expect(G.flopCards.length).toEqual(3);
  expect(G.flopCards[0]).toBeTruthy();
  expect(G.flopCards[1]).toBeTruthy();
  expect(G.flopCards[2]).toBeTruthy();
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
    PLAYER_MOVE.CALL,
    PLAYER_MOVE.CHECK,
    PLAYER_MOVE.CALL,
  ]);

  expect(G.dealerPos).toEqual(2);
  expect(G.smallBlindPlayerPos).toEqual(0);
  expect(G.bigBlindPlayerPos).toEqual(1);

  expect(G.playerStakes).toEqual([BIG_BLIND, BIG_BLIND, BIG_BLIND]);
  expect(G.playerChips).toEqual([
    STARTING_CHIPS - BIG_BLIND,
    STARTING_CHIPS - BIG_BLIND,
    STARTING_CHIPS - BIG_BLIND,
  ]);
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

  expect(G.playerStates).toEqual([
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
  ]);
  expect(G.playerLastMoves).toEqual([
    PLAYER_MOVE.CALL,
    PLAYER_MOVE.CALL,
    PLAYER_MOVE.BET,
  ]);

  expect(G.playerStakes).toEqual([expectedStake, expectedStake, expectedStake]);
  expect(G.playerChips).toEqual([
    STARTING_CHIPS - expectedStake,
    STARTING_CHIPS - expectedStake,
    STARTING_CHIPS - expectedStake,
  ]);
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

  expect(G.playerStates).toEqual([
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
    PLAYER_STATE.IN,
  ]);
  expect(G.playerLastMoves).toEqual([
    PLAYER_MOVE.CALL,
    PLAYER_MOVE.BET,
    PLAYER_MOVE.CALL,
  ]);

  expect(G.playerStakes).toEqual([expectedStake, expectedStake, expectedStake]);
  expect(G.playerChips).toEqual([
    STARTING_CHIPS - expectedStake,
    STARTING_CHIPS - expectedStake,
    STARTING_CHIPS - expectedStake,
  ]);
  expect(G.currentStake).toEqual(expectedStake);
  expect(G.phaseEndsAfter).toEqual(2);
});
