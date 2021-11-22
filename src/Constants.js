export const RankToDisplayMap = new Map([
  ["02", "2"],
  ["03", "3"],
  ["04", "4"],
  ["05", "5"],
  ["06", "6"],
  ["07", "7"],
  ["08", "8"],
  ["09", "9"],
  ["10", "10"],
  ["11", "J"],
  ["12", "Q"],
  ["13", "K"],
  ["14", "A"],
]);

export const SuitToDisplayMap = new Map([
  ["C", "♣"],
  ["D", "♦"],
  ["H", "♥"],
  ["S", "♠"],
]);

export const PlayerStates = new Map([
  ["BETTING", 0], // Starting state for each phase.
  ["READY", 1], // Player has bet and is ready to play.
  ["OUT", 2], // Player has folded.
]);

export const PlayerMoves = new Map([
  ["NONE", 0],
  ["BET", 1],
  ["RAISE", 2],
  ["CALL", 3],
  ["FOLD", 4],
  ["CHECK", 5],
  ["ALL_IN", 6],
]);

export const HandValues = new Map([
  ["NONE", 0],
  ["HIGH_CARD", 1],
  ["PAIR", 2],
  ["TWO_PAIRS", 3],
  ["THREE_OF_A_KIND", 4],
  ["STRAIGHT", 5],
  ["FLUSH", 6],
  ["FULL_HOUSE", 7],
  ["FOUR_OF_A_KIND", 8],
  ["STRAIGHT_FLUSH", 9],
  ["ROYAL_FLUSH", 10],
]);
