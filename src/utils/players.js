import { PLAYER_STATE } from "../poker/constants.js";

export const getPlayerIDfromPosition = (ctx, pos) => {
  return ctx.playOrder[pos];
};

export const getNthNextActivePlayerPos = (G, ctx, currPos, n = 1) => {
  /*
  This helper method skips players that are already out or have folded to find the next active player.
  If n is negative, it will go backwards (i.e. look for the nth previous player).
  */
  if (n === 0) {
    // TODO: If n is 0, we should also check if the current player is active, and if not, return the next active player.
    return currPos;
  }
  // Find the next active player (or previous, if n < 0), and repeat this process abs(n) times.
  for (let i = 0; i < Math.abs(n); i++) {
    const startingPos = currPos;
    currPos = (currPos + Math.sign(n) + ctx.numPlayers) % ctx.numPlayers;
    while (
      G.players[getPlayerIDfromPosition(ctx, currPos)].state ===
        PLAYER_STATE.OUT ||
      G.players[getPlayerIDfromPosition(ctx, currPos)].state ===
        PLAYER_STATE.FOLDED
    ) {
      // If we've looped back to the starting player, then everyone is out.
      // This may need to trigger ending a game, but maybe that should be triggered before we even get to this step?
      if (currPos === startingPos) {
        // TODO: This is probably not the safest way to do this. Figure out a better standard.
        return null;
      }
      // Some wacky math to allow negative numbers for n.
      currPos = (currPos + Math.sign(n) + ctx.numPlayers) % ctx.numPlayers;
    }
  }
  return currPos;
};
