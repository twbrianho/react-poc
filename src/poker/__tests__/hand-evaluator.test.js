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
} from "../constants";
import { createCard } from "../card.js";
import { getHandAndScore } from "../hand-evaluator.js";

test("Royal Flush hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, A),
      createCard(SPADE, K),
      createCard(SPADE, Q),
      createCard(SPADE, J),
      createCard(SPADE, 10),
    ])
  ).toEqual({ hand: ROYAL_FLUSH, score: 10 * 100 ** 5 });
});

test("Straight Flush hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, 4),
      createCard(SPADE, 5),
      createCard(SPADE, 6),
      createCard(SPADE, 7),
      createCard(SPADE, 8),
    ])
  ).toEqual({ hand: STRAIGHT_FLUSH, score: 9 * 100 ** 5 + 8 * 100 ** 4 });
});

test("Straight Flush (Ace Low) hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, 2),
      createCard(SPADE, 3),
      createCard(SPADE, 4),
      createCard(SPADE, 5),
      createCard(SPADE, A),
    ])
  ).toEqual({ hand: STRAIGHT_FLUSH, score: 9 * 100 ** 5 + 5 * 100 ** 4 });
});

test("Invalid Straight Flush hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, 3),
      createCard(SPADE, 4),
      createCard(SPADE, 5),
      createCard(SPADE, A),
      createCard(SPADE, K),
    ])
  ).toEqual({
    hand: FLUSH,
    score:
      6 * 100 ** 5 + A * 100 ** 4 + K * 100 ** 3 + 5 * 100 ** 2 + 4 * 100 + 3,
  });
});

test("Four of a Kind hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, 3),
      createCard(CLUB, 3),
      createCard(HEART, 3),
      createCard(DIAMOND, 3),
      createCard(SPADE, K),
    ])
  ).toEqual({
    hand: FOUR_OF_A_KIND,
    score: 8 * 100 ** 5 + 3 * 100 ** 4 + K * 100 ** 3,
  });
});

test("Full House hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, 7),
      createCard(CLUB, 7),
      createCard(HEART, 7),
      createCard(DIAMOND, 9),
      createCard(SPADE, 9),
    ])
  ).toEqual({
    hand: FULL_HOUSE,
    score: 7 * 100 ** 5 + 7 * 100 ** 4 + 9 * 100 ** 3,
  });
});

test("Flush hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, A),
      createCard(SPADE, K),
      createCard(SPADE, J),
      createCard(SPADE, 10),
      createCard(SPADE, 9),
    ])
  ).toEqual({
    hand: FLUSH,
    score:
      6 * 100 ** 5 + A * 100 ** 4 + K * 100 ** 3 + J * 100 ** 2 + 10 * 100 + 9,
  });
});

test("Straight (Ace High) hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, A),
      createCard(SPADE, K),
      createCard(SPADE, Q),
      createCard(SPADE, J),
      createCard(DIAMOND, 10),
    ])
  ).toEqual({ hand: STRAIGHT, score: 5 * 100 ** 5 + A * 100 ** 4 });
});

test("Straight hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(SPADE, K),
      createCard(SPADE, Q),
      createCard(SPADE, J),
      createCard(DIAMOND, 10),
      createCard(DIAMOND, 9),
    ])
  ).toEqual({ hand: STRAIGHT, score: 5 * 100 ** 5 + K * 100 ** 4 });
});

test("Straight (Ace Low) hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(CLUB, A),
      createCard(SPADE, 2),
      createCard(SPADE, 3),
      createCard(SPADE, 4),
      createCard(SPADE, 5),
    ])
  ).toEqual({ hand: STRAIGHT, score: 5 * 100 ** 5 + 5 * 100 ** 4 });
});

test("Three of a Kind hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(CLUB, 4),
      createCard(SPADE, 4),
      createCard(DIAMOND, 4),
      createCard(SPADE, 6),
      createCard(SPADE, 5),
    ])
  ).toEqual({
    hand: THREE_OF_A_KIND,
    score: 4 * 100 ** 5 + 4 * 100 ** 4 + 6 * 100 ** 3 + 5 * 100 ** 2,
  });
});

test("Two Pair hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(CLUB, 2),
      createCard(SPADE, 2),
      createCard(CLUB, 3),
      createCard(SPADE, 3),
      createCard(SPADE, 5),
    ])
  ).toEqual({
    hand: TWO_PAIR,
    score: 3 * 100 ** 5 + 3 * 100 ** 4 + 2 * 100 ** 3 + 5 * 100 ** 2,
  });
});

test("Pair hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(CLUB, 2),
      createCard(SPADE, 2),
      createCard(SPADE, 3),
      createCard(SPADE, 4),
      createCard(SPADE, 5),
    ])
  ).toEqual({
    hand: PAIR,
    score: 2 * 100 ** 5 + 2 * 100 ** 4 + 5 * 100 ** 3 + 4 * 100 ** 2 + 3 * 100,
  });
});

test("High Card hand evaluation", () => {
  expect(
    getHandAndScore([
      createCard(CLUB, K),
      createCard(SPADE, 2),
      createCard(SPADE, 3),
      createCard(SPADE, 4),
      createCard(SPADE, 5),
    ])
  ).toEqual({
    hand: HIGH_CARD,
    score:
      1 * 100 ** 5 + K * 100 ** 4 + 5 * 100 ** 3 + 4 * 100 ** 2 + 3 * 100 + 2,
  });
});
