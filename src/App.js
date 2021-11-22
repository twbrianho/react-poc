import "./App.css";

import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { LimitHoldEm } from "./Game";
import { LimitHoldEmBoard } from "./Board";

const LimitHoldEmClient = Client({
  game: LimitHoldEm,
  numPlayers: 2,
  board: LimitHoldEmBoard,
  multiplayer: Local(),
});

const App = () => (
  <div>
    <LimitHoldEmClient playerID="0" />
    {/* <LimitHoldEmClient playerID="1" /> */}
  </div>
);

export default App;
