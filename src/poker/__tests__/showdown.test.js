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
  J,
  Q,
  K,
  A,
  SPADE,
  CLUB,
  DIAMOND,
  HEART,
  PLAYER_STATE,
} from "../constants";
import { createCard } from "../card.js";
import { getWinningPlayersIDsAndHands } from "../showdown.js";

test("High Card vs High Card - Base Case", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, Q), createCard(SPADE, J)],
      },
    },
    communityCards: [
      createCard(SPADE, 2),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands).toEqual([{ id: "p1", hand: HIGH_CARD }]);
});

test("High Card vs High Card - Tie", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, K)],
      },
    },
    communityCards: [
      createCard(SPADE, 2),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands).toEqual([
    { id: "p1", hand: HIGH_CARD },
    { id: "p2", hand: HIGH_CARD },
  ]);
});

test("High Card vs High Card - Tiebreaker", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
    },
    communityCards: [
      createCard(SPADE, 2),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(HIGH_CARD);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p1");
});

test("Pair vs High Card", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
    },
    communityCards: [
      createCard(DIAMOND, K),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(PAIR);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p1");
});

test("Pair vs Pair - Base Case", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
    },
    communityCards: [
      createCard(DIAMOND, K),
      createCard(CLUB, Q),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(PAIR);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p1");
});

test("Pair vs Pair - Tiebreaker", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
    },
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(PAIR);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p1");
});

test("Pair vs Pair - Tie", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, Q)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
    },
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, 4),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands).toEqual([
    { id: "p1", hand: PAIR },
    { id: "p2", hand: PAIR },
  ]);
});

test("Two Pair vs Pair", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
    },
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(TWO_PAIR);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p1");
});

test("Two Pair vs Two Pair - Tiebreaker", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
    },
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, Q),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(TWO_PAIR);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p1");
});

test("Two Pair vs Two Pair - Tie", () => {
  let ctx = {
    numPlayers: 2,
    playOrder: ["p1", "p2"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, K)],
      },
    },
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, Q),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands).toEqual([
    { id: "p1", hand: TWO_PAIR },
    { id: "p2", hand: TWO_PAIR },
  ]);
});

test("Two Pair vs Pair vs Straight", () => {
  let ctx = {
    numPlayers: 3,
    playOrder: ["p1", "p2", "p3"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.IN,
        cards: [createCard(HEART, A), createCard(HEART, Q)],
      },
      p3: {
        state: PLAYER_STATE.IN,
        cards: [createCard(DIAMOND, Q), createCard(DIAMOND, J)],
      },
    },
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, 6),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(STRAIGHT);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p3");
});

test("Win by Default", () => {
  let ctx = {
    numPlayers: 3,
    playOrder: ["p1", "p2", "p3"],
  };
  let G = {
    players: {
      p1: {
        state: PLAYER_STATE.IN,
        cards: [createCard(SPADE, A), createCard(SPADE, K)],
      },
      p2: {
        state: PLAYER_STATE.FOLDED,
        cards: [createCard(HEART, A), createCard(HEART, K)],
      },
      p3: {
        state: PLAYER_STATE.OUT,
        cards: [createCard(DIAMOND, A), createCard(DIAMOND, K)],
      },
    },
    communityCards: [
      createCard(DIAMOND, A),
      createCard(CLUB, K),
      createCard(DIAMOND, Q),
      createCard(HEART, 8),
      createCard(SPADE, 10),
    ],
  };

  const winningPlayersIDsAndHands = getWinningPlayersIDsAndHands(G, ctx);
  expect(winningPlayersIDsAndHands.length).toEqual(1);
  expect(winningPlayersIDsAndHands[0].hand).toEqual(TWO_PAIR);
  expect(winningPlayersIDsAndHands[0].id).toEqual("p1");
});
