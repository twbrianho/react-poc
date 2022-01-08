import React from "react";

import GameLogs from "./GameLogs.js";
import PlayerBoardArea from "./PlayerBoardArea.js";

import TableArea from "./TableArea.js";
import { getPotTotal } from "../utils/chips.js";
import MoveSelection from "./MoveSelection.js";

export class TexasHoldEmBoard extends React.Component {
  render() {
    const clientPlayerID = this.props.playerID;
    const currentPlayerID = this.props.ctx.currentPlayer;

    const halfPlayers = Math.ceil(this.props.ctx.playOrder.length / 2);
    const topHalfPlayers = this.props.ctx.playOrder.slice(0, halfPlayers);
    // Reverse bottom order so that the turn order goes clockwise around the table.
    const bottomHalfPlayers = this.props.ctx.playOrder
      .slice(halfPlayers)
      .reverse();
    return (
      <div className="flex justify-center space-x-10">
        <div className="m-8">
          <div className="flex justify-center items-center space-x-8">
            {topHalfPlayers.map((playerID, index) => {
              return (
                <PlayerBoardArea
                  key={index}
                  isClient={playerID === clientPlayerID}
                  isCurrentPlayer={playerID === currentPlayerID}
                  playerID={playerID}
                  playerCards={this.props.G.players[playerID].cards}
                  playerStake={this.props.G.players[playerID].stake}
                  playerChips={this.props.G.players[playerID].chips}
                ></PlayerBoardArea>
              );
            })}
          </div>
          <TableArea
            potTotal={getPotTotal(this.props.G)}
            communityCards={this.props.G.communityCards}
          ></TableArea>
          <div className="flex justify-center space-x-8">
            {bottomHalfPlayers.map((playerID, index) => {
              return (
                <PlayerBoardArea
                  key={index}
                  isClient={playerID === clientPlayerID}
                  isCurrentPlayer={playerID === currentPlayerID}
                  playerID={playerID}
                  playerCards={this.props.G.players[playerID].cards}
                  playerStake={this.props.G.players[playerID].stake}
                  playerChips={this.props.G.players[playerID].chips}
                ></PlayerBoardArea>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col w-80 m-8 p-8 bg-poker-black rounded-xl shadow-xl space-y-5">
          <GameLogs gameLogs={this.props.G.gameLogs}></GameLogs>
          <MoveSelection
            moves={this.props.moves}
            ctx={this.props.ctx}
          ></MoveSelection>
        </div>
      </div>
    );
  }
}
