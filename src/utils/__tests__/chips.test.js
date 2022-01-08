import { getPotTotal } from "../chips.js";

test("3 players with stakes", () => {
  let G = {
    players: {
      p1: { stake: 10 },
      p2: { stake: 10 },
      p3: { stake: 10 },
    },
  };
  expect(getPotTotal(G)).toBe(30);
});

test("2 players with stakes", () => {
  let G = {
    players: {
      p1: { stake: 5 },
      p2: { stake: 10 },
    },
  };
  expect(getPotTotal(G)).toBe(15);
});
