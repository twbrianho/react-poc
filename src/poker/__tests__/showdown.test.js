import {
  FOUR_OF_A_KIND,
  STRAIGHT,
  STRAIGHT_FLUSH,
  FLUSH,
  HIGH_CARD,
  PAIR,
  TWO_PAIR,
  ROYAL_FLUSH,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  J,
  Q,
  K,
  A,
  SPADE,
  CLUB,
  DIAMOND,
  HEART,
  PLAYER_STATE,
} from "../constants";
import { createCard } from "../card.js";
import { getWinningPlayersPosAndHands } from "../showdown.js";

test("High Card vs High Card - Base Case", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(SPADE, Q), createCard(SPADE, J)],
    ],
    communityCards: [
      createCard(SPADE, 2),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands).toEqual([{ pos: 0, hand: HIGH_CARD }]);
});

test("High Card vs High Card - Tie", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, K)],
    ],
    communityCards: [
      createCard(SPADE, 2),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands).toEqual([
    { pos: 0, hand: HIGH_CARD },
    { pos: 1, hand: HIGH_CARD },
  ]);
});

test("High Card vs High Card - Tiebreaker", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, Q)],
    ],
    communityCards: [
      createCard(SPADE, 2),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands.length).toEqual(1);
  expect(winningPlayersPosAndHands[0].hand).toEqual(HIGH_CARD);
  expect(winningPlayersPosAndHands[0].pos).toEqual(0);
});

test("Pair vs High Card", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, Q)],
    ],
    communityCards: [
      createCard(DIAMOND, K),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands.length).toEqual(1);
  expect(winningPlayersPosAndHands[0].hand).toEqual(PAIR);
  expect(winningPlayersPosAndHands[0].pos).toEqual(0);
});

test("Pair vs Pair - Base Case", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, Q)],
    ],
    communityCards: [
      createCard(DIAMOND, K),
      createCard(CLUB, Q),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands.length).toEqual(1);
  expect(winningPlayersPosAndHands[0].hand).toEqual(PAIR);
  expect(winningPlayersPosAndHands[0].pos).toEqual(0);
});

test("Pair vs Pair - Tiebreaker", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, Q)],
    ],
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands.length).toEqual(1);
  expect(winningPlayersPosAndHands[0].hand).toEqual(PAIR);
  expect(winningPlayersPosAndHands[0].pos).toEqual(0);
});

test("Pair vs Pair - Tie", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, Q)],
      [createCard(HEART, A), createCard(HEART, Q)],
    ],
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands).toEqual([
    { pos: 0, hand: PAIR },
    { pos: 1, hand: PAIR },
  ]);
});

test("Two Pair vs Pair", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, Q)],
    ],
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands.length).toEqual(1);
  expect(winningPlayersPosAndHands[0].hand).toEqual(TWO_PAIR);
  expect(winningPlayersPosAndHands[0].pos).toEqual(0);
});

test("Two Pair vs Two Pair - Tiebreaker", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, Q)],
    ],
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, Q),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands.length).toEqual(1);
  expect(winningPlayersPosAndHands[0].hand).toEqual(TWO_PAIR);
  expect(winningPlayersPosAndHands[0].pos).toEqual(0);
});

test("Two Pair vs Two Pair - Tie", () => {
  let ctx = {
    numPlayers: 2,
  };
  let G = {
    playerStates: [PLAYER_STATE.IN, PLAYER_STATE.IN],
    playerCards: [
      [createCard(SPADE, A), createCard(SPADE, K)],
      [createCard(HEART, A), createCard(HEART, K)],
    ],
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, Q),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersPosAndHands = getWinningPlayersPosAndHands(G, ctx);
  expect(winningPlayersPosAndHands).toEqual([
    { pos: 0, hand: TWO_PAIR },
    { pos: 1, hand: TWO_PAIR },
  ]);
});
