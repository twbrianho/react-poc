import { NO_CONTEST, PLAYER_STATE } from "./constants";
import { getHandAndScore } from "./hand-evaluator.js";

export function getWinningPlayersIDsAndHands(G, ctx) {
  /*
  Returns the winning players' IDs and hands in an array. For example:
  [
    {id: 2, hand: ["2H", "3H", "4H", "5H", "6H"]}, 
    {id: 4, hand: ["2D", "3D", "4D", "5D", "6D"]}
  ]
  */
  const playersHighestHandAndScore = [];
  for (let playerID = 0; playerID < ctx.numPlayers; playerID++) {
    if (G.playerStates[playerID] === PLAYER_STATE.IN) {
      // For each active player, get all combinations of hands from the 7 cards, and record their highest hand and score.
      const cards = [...G.playerCards[playerID], ...G.communityCards];
      let hands = kCombinations(cards, 5);
      playersHighestHandAndScore.push(findHighestHandAndScore(hands));
    } else {
      // Players that have folded or are already out of the game don't get a score.
      playersHighestHandAndScore.push({ hand: NO_CONTEST, score: 0 });
    }
  }

  let maxScore = Math.max.apply(
    null,
    playersHighestHandAndScore.map(function (handAndScore) {
      return handAndScore.score;
    })
  );

  let winnersIDsAndHands = [];
  for (let i = 0; i < playersHighestHandAndScore.length; i++) {
    if (playersHighestHandAndScore[i].score === maxScore) {
      winnersIDsAndHands.push({
        id: i,
        hand: playersHighestHandAndScore[i].hand,
      });
    }
  }
  return winnersIDsAndHands;
}

function findHighestHandAndScore(hands) {
  /*
  Calculate the score of each hand, and return only the highest hand and score
  
  hands: an array of 5-card hands, for example [["2H", "3H", "4H", "5H", "6H"], ["3H", "4H", "5H", "6H", "7H"], ...]
  */
  let ranks_and_scores = hands.map((hand) => getHandAndScore(hand));
  let highest_score = Math.max(...ranks_and_scores.map((hand) => hand.score));
  let highest_hand = ranks_and_scores.find(
    (hand) => hand.score === highest_score
  );
  return { highest_hand, highest_score };
}

function kCombinations(set, k) {
  /*
  Returns all combinations of 5 cards from a set of 7 cards.
  Code taken from Github: https://gist.github.com/axelpale/3118596
   */
  let i, j, combs, head, tailcombs;

  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }

  // K-sized set has only one K-sized subset.
  if (k === set.length) {
    return [set];
  }

  // There are N 1-sized subsets in a N-sized set.
  if (k === 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = kCombinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}
