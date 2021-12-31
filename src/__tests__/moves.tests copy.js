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
});

it("Call (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.call();

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND;
  expect(G.playerStates[0]).toEqual(PLAYER_STATE.IN);
  expect(G.playerLastMoves[0]).toEqual(PLAYER_MOVE.CALL);
  expect(ctx.currentPlayer).toEqual("1"); // Turn has gone to next player
  expect(G.playerStakes[0]).toEqual(expectedStake);
  expect(G.playerChips[0]).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.currentStake).toEqual(expectedStake);
});

it("Bet (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.raise(20);

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND + 20;
  expect(G.playerStates[0]).toEqual(PLAYER_STATE.IN);
  expect(G.playerLastMoves[0]).toEqual(PLAYER_MOVE.BET);
  expect(ctx.currentPlayer).toEqual("1"); // Turn has gone to next player
  expect(G.playerStakes[0]).toEqual(expectedStake);
  expect(G.playerChips[0]).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.currentStake).toEqual(expectedStake);
});

it("Raise (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.raise(10); // Player 0
  client.moves.raise(20); // Player 1

  // Verify new state
  const { G, ctx } = client.store.getState();
  const expectedStake = BIG_BLIND + 10 + 20;
  expect(G.playerStates[1]).toEqual(PLAYER_STATE.IN);
  expect(G.playerLastMoves[1]).toEqual(PLAYER_MOVE.RAISE);
  expect(ctx.currentPlayer).toEqual("2"); // Turn has gone to next player
  expect(G.playerStakes[1]).toEqual(expectedStake);
  expect(G.playerChips[1]).toEqual(STARTING_CHIPS - expectedStake);
  expect(G.currentStake).toEqual(expectedStake);
});

it("Fold (base case)", () => {
  // Normal starting state
  const client = Client({
    game: TexasHoldEm,
    numPlayers: 3,
  });

  // Make move
  client.moves.fold();

  // Verify new state
  const { G, ctx } = client.store.getState();
  expect(G.playerStates[0]).toEqual(PLAYER_STATE.OUT);
  expect(G.playerLastMoves[0]).toEqual(PLAYER_MOVE.FOLD);
  expect(ctx.currentPlayer).toEqual("1"); // Turn has gone to next player
  expect(G.playerStakes[0]).toEqual(0);
  expect(G.playerChips[0]).toEqual(STARTING_CHIPS);
  expect(G.currentStake).toEqual(BIG_BLIND);
});
