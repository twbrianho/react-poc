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
} from "./constants";

// This is used EXCLUSIVELY for the hand evaluator.
const HandMap = [
  FOUR_OF_A_KIND,
  STRAIGHT_FLUSH,
  STRAIGHT,
  FLUSH,
  HIGH_CARD,
  PAIR,
  TWO_PAIR,
  ROYAL_FLUSH,
  THREE_OF_A_KIND,
  FULL_HOUSE,
];

// This is used EXCLUSIVELY for the hand evaluator.
const SuitMap = {
  C: 1,
  D: 2,
  H: 4,
  S: 8,
};

export function rankPokerHand(cs, ss) {
  /* 
  Calculates the Rank of a 5 card Poker hand using bit manipulations.
  cs: Array of card values (int: 2-14)
  ss: Array of card suits (char: "C", "D", "H", "S")

  NOTE: This is someone else's code, licensed under The Code Project Open License (CPOL) 1.02
  https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math
  */
  let v,
    i,
    o,
    s =
      (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);
  for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cs[i] * 4)) {
    v += o * (((v / o) & 15) + 1);
  }
  v = (v % 15) - (s / (s & -s) === 31 || s === 0x403c ? 3 : 1);
  v -=
    (SuitMap[ss[0]] ===
      (SuitMap[ss[1]] | SuitMap[ss[2]] | SuitMap[ss[3]] | SuitMap[ss[4]])) *
    (s === 0x7c00 ? -5 : 1);
  return HandMap[v];
}
