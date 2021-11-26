export function createCard(suit, rank) {
  /*
  Each card is just a 2-3 char string made up of suit + rank.
  e.g. Ace of Spades is "SA", 10 of Clubs is "C10".
  */
  return suit + rank;
}

export function getSuit(card) {
  // Returns the suit of the card from the string that represents it.
  return card.slice(0, 1);
}

export function getRank(card) {
  // Returns the rank of the card from the string that represents it.
  return parseInt(card.slice(1));
}
