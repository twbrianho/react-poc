import { PLAYER_STATE } from "../../poker/constants.js";
import { getNthNextActivePlayerPos } from "../players.js";

test("2 players, get next active player", () => {
  let G = { playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN] };
  const ctx = { numPlayers: 2 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 1)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 1)).toBe(0);
  // Player 0 is out, so player 1 is always next.
  G = { playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.IN] };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 1)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 1)).toBe(1);
  // Both players are out, so the function errors out.
  G = { playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.OUT] };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 1)).toBe(null);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 1)).toBe(null);
});

test("2 players, get prev active player", () => {
  let G = { playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN] };
  const ctx = { numPlayers: 2 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -1)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -1)).toBe(0);
  // Player 0 is out, so player 1 is always prev.
  G = { playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.IN] };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -1)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -1)).toBe(1);
  // Both players are out, so the function errors out.
  G = { playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.OUT] };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -1)).toBe(null);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -1)).toBe(null);
});

test("2 players, get 2nd next active player", () => {
  const G = { playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN] };
  const ctx = { numPlayers: 2 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 2)).toBe(0);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 2)).toBe(1);
});

test("2 players, get 2nd prev active player", () => {
  const G = { playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN] };
  const ctx = { numPlayers: 2 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -2)).toBe(0);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -2)).toBe(1);
});

test("2 players, get 3rd next active player", () => {
  const G = { playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN] };
  const ctx = { numPlayers: 2 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 3)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 3)).toBe(0);
});

test("2 players, get 3rd prev active player", () => {
  const G = { playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN] };
  const ctx = { numPlayers: 2 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -3)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -3)).toBe(0);
});

test("3 players, get next active player", () => {
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  const ctx = { numPlayers: 3 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 1)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 2, 1)).toBe(0);
  // Player 0 is out, so player 1 is next for player 2.
  G = {
    playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 1)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 2, 1)).toBe(1);
  // Player 0 and 1 are both out, so player 2 is always next.
  G = {
    playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.OUT, PLAYER_STATE.IN],
  };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 2, 1)).toBe(2);
});

test("3 players, get prev active player", () => {
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  const ctx = { numPlayers: 3 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -1)).toBe(0);
  expect(getNthNextActivePlayerPos(G, ctx, 2, -1)).toBe(1);
  // Player 0 is out, so player 2 is prev for player 1.
  G = {
    playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 2, -1)).toBe(1);
  // Player 0 and 1 are both out, so player 2 is always prev.
  G = {
    playerStates: [PLAYER_STATE.OUT, PLAYER_STATE.OUT, PLAYER_STATE.IN],
  };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -1)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 2, -1)).toBe(2);
});

test("3 players, get 2nd next active player", () => {
  const G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  const ctx = { numPlayers: 3 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 2)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 2)).toBe(0);
  expect(getNthNextActivePlayerPos(G, ctx, 2, 2)).toBe(1);
});

test("3 players, get 2nd prev active player", () => {
  const G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  const ctx = { numPlayers: 3 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -2)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -2)).toBe(2);
  expect(getNthNextActivePlayerPos(G, ctx, 2, -2)).toBe(0);
});

test("3 players, get 3rd next active player", () => {
  const G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  const ctx = { numPlayers: 3 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, 3)).toBe(0);
  expect(getNthNextActivePlayerPos(G, ctx, 1, 3)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 2, 3)).toBe(2);
});

test("3 players, get 3rd prev active player", () => {
  const G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN, PLAYER_STATE.IN],
  };
  const ctx = { numPlayers: 3 };
  expect(getNthNextActivePlayerPos(G, ctx, 0, -3)).toBe(0);
  expect(getNthNextActivePlayerPos(G, ctx, 1, -3)).toBe(1);
  expect(getNthNextActivePlayerPos(G, ctx, 2, -3)).toBe(2);
});
