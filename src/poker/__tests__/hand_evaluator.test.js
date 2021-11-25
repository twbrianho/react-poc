import { rankPokerHand } from "../hand_evaluator.js";

const A = 14,
  K = 13,
  Q = 12,
  J = 11,
  SUIT = { "♠": 1, "♣": 2, "♥": 4, "♦": 8 };

test("Royal Flush hand evaluation", () => {
  expect(
    rankPokerHand(
      [10, J, Q, K, A],
      [SUIT["♠"], SUIT["♠"], SUIT["♠"], SUIT["♠"], SUIT["♠"]]
    )
  ).toBe("Royal Flush");
});

test("Straight Flush hand evaluation", () => {
  expect(
    rankPokerHand(
      [4, 5, 6, 7, 8],
      [SUIT["♠"], SUIT["♠"], SUIT["♠"], SUIT["♠"], SUIT["♠"]]
    )
  ).toBe("Straight Flush");
});

test("Straight Flush (Ace low) hand evaluation", () => {
  expect(
    rankPokerHand(
      [2, 3, 4, 5, A],
      [SUIT["♠"], SUIT["♠"], SUIT["♠"], SUIT["♠"], SUIT["♠"]]
    )
  ).toBe("Straight Flush (Ace low)");
});
