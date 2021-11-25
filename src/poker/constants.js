// RANKS
export const RANK_2 = "02",
  RANK_3 = "03",
  RANK_4 = "04",
  RANK_5 = "05",
  RANK_6 = "06",
  RANK_7 = "07",
  RANK_8 = "08",
  RANK_9 = "09",
  RANK_10 = "10",
  RANK_J = "J",
  RANK_Q = "Q",
  RANK_K = "K",
  RANK_A = "A";
export const RankToDisplayMap = new Map([
  [RANK_2, "2"],
  [RANK_3, "3"],
  [RANK_4, "4"],
  [RANK_5, "5"],
  [RANK_6, "6"],
  [RANK_7, "7"],
  [RANK_8, "8"],
  [RANK_9, "9"],
  [RANK_10, "10"],
  [RANK_J, "J"],
  [RANK_Q, "Q"],
  [RANK_K, "K"],
  [RANK_A, "A"],
]);
export const ALL_RANKS = RankToDisplayMap.keys();

// SUITS
export const CLUBS = "C",
  DIAMONDS = "D",
  HEARTS = "H",
  SPADES = "S";
export const SuitToDisplayMap = new Map([
  [CLUBS, "♣"],
  [DIAMONDS, "♦"],
  [HEARTS, "♥"],
  [SPADES, "♠"],
]);
export const ALL_SUITS = SuitToDisplayMap.keys();

// GAME PHASES
export const BETTING = "BET",
  FLOP = "FLP",
  TURN = "TRN",
  RIVER = "RVR",
  SHOWDOWN = "SHW";
export const GamePhaseToDisplayMap = new Map([
  [BETTING, "Betting"],
  [FLOP, "Flop"],
  [TURN, "Turn"],
  [RIVER, "River"],
  [SHOWDOWN, "Showdown"],
]);

// PLAYER MOVES
export const NONE = "NONE",
  BET = "BET",
  RAISE = "RAISE",
  CALL = "CALL",
  FOLD = "FOLD",
  CHECK = "CHECK",
  ALL_IN = "ALLIN";
export const PlayerMoves = new Map([
  [NONE, 0],
  [BET, 1],
  [RAISE, 2],
  [CALL, 3],
  [FOLD, 4],
  [CHECK, 5],
  [ALL_IN, 6],
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
