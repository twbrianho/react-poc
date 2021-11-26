import "./App.css";

import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { TexasHoldEm } from "./Game";
import { TexasHoldEmBoard } from "./components/Board";

const TexasHoldEmClient = Client({
  game: TexasHoldEm,
  numPlayers: 2,
  board: TexasHoldEmBoard,
  multiplayer: Local(),
});

const App = () => (
  <div>
    <TexasHoldEmClient playerID="0" />
    <TexasHoldEmClient playerID="1" />
  </div>
);

export default App;
