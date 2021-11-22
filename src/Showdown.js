export function showdown(G, ctx) {
  /*
  If two or more players remain after the final betting round, a showdown occurs. 
  On the showdown, each player plays the best poker hand they can make from the seven cards comprising their two-hole cards and the five community cards. 
  A player may use both of their own two hole cards, only one, or none at all, to form their final five-card hand. 
  If the five community cards form the player's best hand, then the player is said to be playing the board and can only hope to split the pot, because each other player can also use the same five cards to construct the same hand.

  If the best hand is shared by more than one player, then the pot is split equally among them, with any extra chips going to the first players after the button in clockwise order. 
  It is common for players to have closely valued, but not identically ranked hands. 
  Nevertheless, one must be careful in determining the best hand; if the hand involves fewer than five cards, (such as two pair or three of a kind), then kickers are used to settle ties (see the second example below). 
  The card's numerical rank is of sole importance; suit values are irrelevant in hold 'em.
  */
}

function findHighestHand(G, ctx, player) {
  const { holeCards, communityCards } = G;
  const cards = [...holeCards[player], ...communityCards];
  const sortedCards = cards.sort((a, b) => b.rank - a.rank);
  const hand = sortedCards.slice(0, 5);
  const handRank = getHandRank(hand);
  return { hand, handRank };
}

function getHandRank(hand) {
  const handRank = hand.reduce((acc, card) => acc + card.rank, 0);
  return handRank;
}
