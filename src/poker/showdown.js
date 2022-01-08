import { PLAYER_STATE } from "./constants";
import { getHandAndScore } from "./hand-evaluator.js";

export function getWinningPlayersIDsAndHands(G, ctx) {
  /*
  Returns the winning players' IDs and hands in an array.
  This is an array because there may be multiple tied winners.
  */
  const playersHighestHandAndScore = {};
  ctx.playOrder.forEach((playerID) => {
    if (G.players[playerID].state === PLAYER_STATE.IN) {
      // For each active player, get all combinations of hands from the 7 cards, and record their highest hand and score.
      const cards = [...G.players[playerID].cards, ...G.communityCards];
      let hands = kCombinations(cards, 5);
      playersHighestHandAndScore[playerID] = findHighestHandAndScore(hands);
    }
  });

  // Find the highest score and return the corresponding players & their hands.
  let winnersIDsAndHands = [];
  let currHighestScore = 0;
  for (const playerID in playersHighestHandAndScore) {
    let currPlayerHand = playersHighestHandAndScore[playerID].hand;
    let currPlayerScore = playersHighestHandAndScore[playerID].score;
    if (currPlayerScore === currHighestScore) {
      winnersIDsAndHands.push({
        id: playerID,
        hand: currPlayerHand,
      });
    } else if (currPlayerScore > currHighestScore) {
      winnersIDsAndHands = [{ id: playerID, hand: currPlayerHand }];
      currHighestScore = currPlayerScore;
    }
  }
  return winnersIDsAndHands;
}

function findHighestHandAndScore(hands) {
  /*
  Calculate the score of each hand, and return only the highest hand and score
  
  hands: an array of 5-card hands, for example [["2H", "3H", "4H", "5H", "6H"], ["3H", "4H", "5H", "6H", "7H"], ...]
  */
  let handsAndScores = hands.map((hand) => getHandAndScore(hand));
  let highestScore = Math.max(...handsAndScores.map((hand) => hand.score));
  let highestHandAndScore = handsAndScores.find(
    (hand) => hand.score === highestScore
  );
  return highestHandAndScore;
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
