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
  NO_CONTEST,
  HAND_TO_VALUE_MAP,
  A,
} from "./constants";

// This is used EXCLUSIVELY for rankPokerHand().
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

// This is used EXCLUSIVELY for rankPokerHand().
const SuitMap = {
  C: 1,
  D: 2,
  H: 4,
  S: 8,
};

function getPokerHand(cs, ss) {
  /* 
  Calculates the hand of a 5 card Poker hand using bit manipulations.
  cs: Array of card ranks (int: 2-14)
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
  v -= (ss[0] === (ss[1] | ss[2] | ss[3] | ss[4])) * (s === 0x7c00 ? -5 : 1);
  return HandMap[v];
}

export function getHandAndScore(cards) {
  /*
  Convert an array of cards to a format that can be used for getPokerHand(), then return a score for that hand.
  This is a temporary solution until I can write a decent hand evaluation algorithm.
  */
  if (cards.length !== 5) {
    return { hand: NO_CONTEST, score: 0 };
  }
  const suits = cards.map((card) => SuitMap[card.slice(0, 1)]);
  const ranks = cards.map((card) => parseInt(card.slice(1)));
  const hand = getPokerHand(ranks, suits);
  // Tiebreakers for same hands
  let second_comparison = 0,
    third_comparison = 0,
    fourth_comparison = 0,
    fifth_comparison = 0,
    sixth_comparison = 0;
  // Sort ranks by descending order, for easier comparison below
  ranks.sort((a, b) => b - a);
  if (hand === ROYAL_FLUSH) {
    // There is no need for additional tie-breaking.
  } else if (hand === STRAIGHT_FLUSH) {
    // Get the highest card in the straight, with consideration to ace low.
    const highest_card = ranks[0];
    if (highest_card === A) {
      // If the highest card is an Ace, but this is not a Royal Flush, then it must be an Ace low.
      second_comparison = 5;
    } else {
      second_comparison = highest_card;
    }
  } else if (hand === FOUR_OF_A_KIND) {
    // Get the rank of the four of a kind.
    second_comparison = ranks.find(
      (rank) => ranks.filter((r) => r === rank).length === 4
    );
    // Get the rank of the remaining card.
    third_comparison = ranks.find((rank) => rank !== second_comparison);
  } else if (hand === FULL_HOUSE) {
    // Get the rank of the three of a kind.
    second_comparison = ranks.find(
      (rank) => ranks.filter((r) => r === rank).length === 3
    );
    // Get the rank of the two of a kind.
    third_comparison = ranks.find((rank) => rank !== second_comparison);
  } else if (hand === STRAIGHT) {
    // Get the highest card in the straight, with consideration to ace low.
    const highest_card = ranks[0];
    if (highest_card === A) {
      // If the highest card is an Ace but the lowest card is 2, then it must be an Ace low.
      second_comparison = ranks[4] === 2 ? 5 : A;
    } else {
      second_comparison = highest_card;
    }
  } else if (hand === THREE_OF_A_KIND) {
    // Get the rank of the three of a kind.
    second_comparison = ranks.find(
      (rank) => ranks.filter((r) => r === rank).length === 3
    );
    // Get the rank of the highest remaining card.
    third_comparison = ranks.find((rank) => rank !== second_comparison);
    // Get the rank of the second highest remaining card.
    fourth_comparison = ranks.find(
      (rank) => rank !== second_comparison && rank !== third_comparison
    );
  } else if (hand === TWO_PAIR) {
    // Get the rank of the highest pair.
    second_comparison = ranks.find(
      (rank) => ranks.filter((r) => r === rank).length === 2
    );
    // Get the rank of the second highest pair.
    third_comparison = ranks.find(
      (rank) =>
        rank !== second_comparison &&
        ranks.filter((r) => r === rank).length === 2
    );
    // Get the rank of the remaining card.
    fourth_comparison = ranks.find(
      (rank) => rank !== second_comparison && rank !== third_comparison
    );
  } else if (hand === PAIR) {
    // Get the rank of the pair.
    second_comparison = ranks.find(
      (rank) => ranks.filter((r) => r === rank).length === 2
    );
    // Get the rank of the highest remaining card.
    third_comparison = ranks.find((rank) => rank !== second_comparison);
    // Get the rank of the second highest remaining card.
    fourth_comparison = ranks.find(
      (rank) => rank !== second_comparison && rank !== third_comparison
    );
    // Get the rank of the third highest remaining card.
    fifth_comparison = ranks.find(
      (rank) =>
        rank !== second_comparison &&
        rank !== third_comparison &&
        rank !== fourth_comparison
    );
  } else {
    // FLUSH and HIGH_CARD are evaluated in the same way.
    // Get the highest card.
    second_comparison = ranks[0];
    // Get the second highest card.
    third_comparison = ranks[1];
    // Get the third highest card.
    fourth_comparison = ranks[2];
    // Get the fourth highest card.
    fifth_comparison = ranks[3];
    // Get the fifth highest card.
    sixth_comparison = ranks[4];
  }

  let score =
    HAND_TO_VALUE_MAP.get(hand) * 100 ** 5 +
    second_comparison * 100 ** 4 +
    third_comparison * 100 ** 3 +
    fourth_comparison * 100 ** 2 +
    fifth_comparison * 100 +
    sixth_comparison * 1;
  return { hand: hand, score: score };
}
