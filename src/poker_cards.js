const PokerSuit = {
  CLUBS: 0,
  DIAMONDS: 1,
  HEARTS: 2,
  SPADES: 3,
};

const PokerRank = {
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14,
};

class PokerCard {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
}

class PokerDeck {
  constructor() {
    this.cards = [];
    this.build();
  }
  build() {
    if (this.cards.length > 0) {
      alert("Deck already built!");
      return;
    }
    for (const suit in PokerSuit) {
      for (const rank in PokerRank) {
        this.cards.push(new PokerCard(suit, rank));
      }
    }
  }
  shuffle() {
    // Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }
  deal(numCards = 1) {
    let dealtCards = [];
    for (let i = 0; i < numCards; i++) {
      dealtCards.push(this.cards.pop());
    }
    return dealtCards;
  }
}

export default PokerDeck;
