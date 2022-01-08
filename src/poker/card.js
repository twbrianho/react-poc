import { SUIT_TO_DISPLAY_MAP, RANK_TO_DISPLAY_MAP } from "./constants.js";

export function createCard(suit, rank) {
  /*
  Each card is just a 2-3 char string made up of suit + rank.
  e.g. Ace of Spades is "SA", 10 of Clubs is "C10".

  If no string is passed in for suit or rank, the card will be displayed face-down.
  This is useful for representing opponent's cards that are not known yet.
  */
  if (SUIT_TO_DISPLAY_MAP.has(suit) && RANK_TO_DISPLAY_MAP.has(rank)) {
    return suit + rank;
  } else {
    return "";
  }
}

export function getSuit(card) {
  // Returns the suit of the card from the string that represents it.
  return card.slice(0, 1);
}

export function getRank(card) {
  // Returns the rank of the card from the string that represents it.
  return parseInt(card.slice(1));
}
