import { PLAYER_STATE } from "../poker/constants.js";

export const getNthNextActivePlayerID = (G, ctx, currID, n = 1) => {
  /*
  This helper method skips players that are already out or have folded.
  If n is negative, it will go backwards (i.e. look for the previous player).
  */
  if (n === 0) {
    return currID;
  }
  currID = parseInt(currID);
  for (let i = 0; i < Math.abs(n); i++) {
    const startingID = currID;
    currID = (currID + Math.sign(n) + ctx.numPlayers) % ctx.numPlayers;
    while (
      G.playerStates[currID] === PLAYER_STATE.OUT ||
      G.playerStates[currID] === PLAYER_STATE.FOLDED
    ) {
      // If we've looped back to the starting player, then everyone is out. This should never be triggered.
      if (currID === startingID) {
        // TODO: Error logging
        return null;
      }
      currID = (currID + Math.sign(n) + ctx.numPlayers) % ctx.numPlayers;
    }
  }
  return currID;
};
