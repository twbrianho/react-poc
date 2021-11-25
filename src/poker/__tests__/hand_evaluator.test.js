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
import { rankPokerHand } from "../hand_evaluator.js";

test("Royal Flush hand evaluation", () => {
  expect(
    rankPokerHand([10, J, Q, K, A], [SPADE, SPADE, SPADE, SPADE, SPADE])
  ).toBe(ROYAL_FLUSH);
});

test("Straight Flush hand evaluation", () => {
  expect(
    rankPokerHand([4, 5, 6, 7, 8], [SPADE, SPADE, SPADE, SPADE, SPADE])
  ).toBe(STRAIGHT_FLUSH);
});

test("Straight Flush (Ace low) hand evaluation", () => {
  expect(
    rankPokerHand([2, 3, 4, 5, A], [SPADE, SPADE, SPADE, SPADE, SPADE])
  ).toBe(STRAIGHT_FLUSH);
});

test("Invalid Straight Flush hand evaluation", () => {
  expect(
    rankPokerHand([3, 4, 5, A, K], [SPADE, SPADE, SPADE, SPADE, SPADE])
  ).toBe(FLUSH);
});

test("Four of a Kind hand evaluation", () => {
  expect(
    rankPokerHand([8, 8, 8, 8, 9], [SPADE, CLUB, HEART, DIAMOND, SPADE])
  ).toBe(FOUR_OF_A_KIND);
});

test("Full House hand evaluation", () => {
  expect(
    rankPokerHand([7, 7, 7, 9, 9], [SPADE, CLUB, HEART, DIAMOND, SPADE])
  ).toBe(FULL_HOUSE);
});

test("Flush hand evaluation", () => {
  expect(
    rankPokerHand([10, J, 6, K, 9], [SPADE, SPADE, SPADE, SPADE, SPADE])
  ).toBe(FLUSH);
});

test("Straight hand evaluation", () => {
  expect(
    rankPokerHand([10, J, Q, K, 9], [SPADE, CLUB, HEART, CLUB, DIAMOND])
  ).toBe(STRAIGHT);
});

test("Straight (Ace low) hand evaluation", () => {
  expect(
    rankPokerHand([2, 3, 4, 5, A], [SPADE, CLUB, HEART, CLUB, DIAMOND])
  ).toBe(STRAIGHT);
});

test("Three of a Kind hand evaluation", () => {
  expect(
    rankPokerHand([3, 3, 3, K, 9], [SPADE, CLUB, HEART, CLUB, DIAMOND])
  ).toBe(THREE_OF_A_KIND);
});

test("Two Pair hand evaluation", () => {
  expect(
    rankPokerHand([3, 3, 9, K, K], [SPADE, CLUB, HEART, CLUB, DIAMOND])
  ).toBe(TWO_PAIR);
});

test("Pair hand evaluation", () => {
  expect(
    rankPokerHand([3, 3, 9, J, K], [SPADE, CLUB, HEART, CLUB, DIAMOND])
  ).toBe(PAIR);
});

test("High Card hand evaluation", () => {
  expect(
    rankPokerHand([10, 3, 9, J, K], [SPADE, CLUB, HEART, CLUB, DIAMOND])
  ).toBe(HIGH_CARD);
});
