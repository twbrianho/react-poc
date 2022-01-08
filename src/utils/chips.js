export const getPotTotal = (G) => {
  /*
  This helper method returns the total amount of chips in the pot.
  */
  return Object.keys(G.players).reduce(function (previous, key) {
    return previous + G.players[key].stake;
  }, 0);
};
