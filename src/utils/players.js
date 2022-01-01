import { PLAYER_STATE } from "../poker/constants.js";

export const getNthNextActivePlayerPos = (G, ctx, currPos, n = 1) => {
  /*
  This helper method skips players that are already out or have folded.
  If n is negative, it will go backwards (i.e. look for the previous player).
  */
  if (n === 0) {
    return currPos;
  }
  for (let i = 0; i < Math.abs(n); i++) {
    const startingID = currPos;
    currPos = (currPos + Math.sign(n) + ctx.numPlayers) % ctx.numPlayers;
    while (
      G.playerStates[currPos] === PLAYER_STATE.OUT ||
      G.playerStates[currPos] === PLAYER_STATE.FOLDED
    ) {
      // If we've looped back to the starting player, then everyone is out. This should never be triggered.
      if (currPos === startingID) {
        // TODO: Error logging
        return null;
      }
      currPos = (currPos + Math.sign(n) + ctx.numPlayers) % ctx.numPlayers;
    }
  }
  return currPos;
};
