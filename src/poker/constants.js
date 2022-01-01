// RANKS
export const J = 11,
  Q = 12,
  K = 13,
  A = 14;
export const RANK_TO_DISPLAY_MAP = new Map([
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
export const SUIT_TO_DISPLAY_MAP = new Map([
  [CLUB, "♣"],
  [DIAMOND, "♦"],
  [HEART, "♥"],
  [SPADE, "♠"],
]);

// GAME PHASES
export const GAME_PHASE = {
  PREFLOP: "PREFLOP",
  FLOP: "FLOP",
  TURN: "TURN",
  RIVER: "RIVER",
  SHOWDOWN: "SHOWDOWN",
};
export const GAME_PHASE_TO_DISPLAY_MAP = new Map([
  [GAME_PHASE.BETTING, "Betting"],
  [GAME_PHASE.FLOP, "Flop"],
  [GAME_PHASE.TURN, "Turn"],
  [GAME_PHASE.RIVER, "River"],
  [GAME_PHASE.SHOWDOWN, "Showdown"],
]);

// PLAYER MOVES
// Note: Not sure how this will be used yet, but I have a feeling it will be handy.
export const PLAYER_MOVE = {
  NONE: "NONE",
  SMALL_BLIND: "SMALL_BLIND",
  BIG_BLIND: "BIG_BLIND",
  BET: "BET",
  RAISE: "RAISE",
  CALL: "CALL",
  FOLD: "FOLD",
  CHECK: "CHECK",
  ALL_IN: "ALLIN",
};
export const PLAYER_MOVE_TO_DISPLAY_MAP = new Map([
  [PLAYER_MOVE.NONE, ""],
  [PLAYER_MOVE.BET, "Bet"],
  [PLAYER_MOVE.RAISE, "Raise"],
  [PLAYER_MOVE.CALL, "Call"],
  [PLAYER_MOVE.FOLD, "Fold"],
  [PLAYER_MOVE.CHECK, "Check"],
  [PLAYER_MOVE.ALL_IN, "All In"],
]);

// PLAYER STATES
export const PLAYER_STATE = {
  IN: "IN",
  ALL_IN: "ALLIN",
  FOLDED: "FOLDED",
  OUT: "OUT",
};
export const PLAYER_STATE_TO_DISPLAY_MAP = new Map([
  [PLAYER_STATE.IN, "In"],
  [PLAYER_STATE.ALL_IN, "All In"],
  [PLAYER_STATE.FOLDED, "Folded"],
  [PLAYER_STATE.OUT, "Out"],
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
export const HAND_TO_VALUE_MAP = new Map([
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
export const HAND_TO_DISPLAY_MAP = new Map([
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
