// RANKS
export const J = 11,
  Q = 12,
  K = 13,
  A = 14;
export const RankToDisplayMap = new Map([
  [2, "2"],
  [3, "3"],
  [4, "4"],
  [5, "5"],
  [6, "6"],
  [7, "7"],
  [8, "8"],
  [9, "9"],
  [10, "10"],
  [J, "J"],
  [Q, "Q"],
  [K, "K"],
  [A, "A"],
]);

// SUITS
export const CLUB = "C",
  DIAMOND = "D",
  HEART = "H",
  SPADE = "S";
export const SuitToDisplayMap = new Map([
  [CLUB, "♣"],
  [DIAMOND, "♦"],
  [HEART, "♥"],
  [SPADE, "♠"],
]);

// GAME PHASES
export const GamePhase = {
  BETTING: "BET",
  FLOP: "FLP",
  TURN: "TRN",
  RIVER: "RVR",
  SHOWDOWN: "SHW",
};
export const GamePhaseToDisplayMap = new Map([
  [GamePhase.BETTING, "Betting"],
  [GamePhase.FLOP, "Flop"],
  [GamePhase.TURN, "Turn"],
  [GamePhase.RIVER, "River"],
  [GamePhase.SHOWDOWN, "Showdown"],
]);

// PLAYER MOVES
export const PlayerMove = {
  NONE: "NONE",
  BET: "BET",
  RAISE: "RAISE",
  CALL: "CALL",
  FOLD: "FOLD",
  CHECK: "CHECK",
  ALL_IN: "ALLIN",
};
export const PlayerMoveToDisplayMap = new Map([
  [PlayerMove.NONE, ""],
  [PlayerMove.BET, "Bet"],
  [PlayerMove.RAISE, "Raise"],
  [PlayerMove.CALL, "Call"],
  [PlayerMove.FOLD, "Fold"],
  [PlayerMove.CHECK, "Check"],
  [PlayerMove.ALL_IN, "All In"],
]);

// PLAYER STATES
export const PlayerState = {
  IN: "IN",
  FOLDED: "FOLDED",
  OUT: "OUT",
};
export const PlayerStateToDisplayMap = new Map([
  [PlayerState.IN, "In"],
  [PlayerState.FOLDED, "Folded"],
  [PlayerState.OUT, "Out"],
]);

// HANDS
export const NO_CONTEST = "NO_CONTEST",
  HIGH_CARD = "HIGH_CARD",
  PAIR = "PAIR",
  TWO_PAIR = "TWO_PAIR",
  THREE_OF_A_KIND = "THREE_OF_A_KIND",
  STRAIGHT = "STRAIGHT",
  FLUSH = "FLUSH",
  FULL_HOUSE = "FULL_HOUSE",
  FOUR_OF_A_KIND = "FOUR_OF_A_KIND",
  STRAIGHT_FLUSH = "STRAIGHT_FLUSH",
  ROYAL_FLUSH = "ROYAL_FLUSH";
export const HandToValueMap = new Map([
  [NO_CONTEST, 0], // For players that aren't participating in the hand.
  [HIGH_CARD, 1],
  [PAIR, 2],
  [TWO_PAIR, 3],
  [THREE_OF_A_KIND, 4],
  [STRAIGHT, 5],
  [FLUSH, 6],
  [FULL_HOUSE, 7],
  [FOUR_OF_A_KIND, 8],
  [STRAIGHT_FLUSH, 9],
  [ROYAL_FLUSH, 10],
]);
export const HandToDisplayMap = new Map([
  [NO_CONTEST, "No Contest"], // For players that aren't participating in the hand.
  [HIGH_CARD, "High Card"],
  [PAIR, "Pair"],
  [TWO_PAIR, "Two Pair"],
  [THREE_OF_A_KIND, "Three of a Kind"],
  [STRAIGHT, "Straight"],
  [FLUSH, "Flush"],
  [FULL_HOUSE, "Full House"],
  [FOUR_OF_A_KIND, "Four of a Kind"],
  [STRAIGHT_FLUSH, "Straight Flush"],
  [ROYAL_FLUSH, "Royal Flush"],
]);
export const ALL_HANDS = HandToDisplayMap.keys();
