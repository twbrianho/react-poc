import React from "react";

import PokerCard from "./PokerCard.js";
import MoveButton from "./MoveButton.js";
import GameLogs from "./GameLogs.js";
import PlayerBoardArea from "./PlayerBoardArea.js";

import { BIG_BLIND } from "../constants.js";
import { GAME_PHASE } from "../poker/constants.js";
import TableArea from "./TableArea.js";

export class TexasHoldEmBoard extends React.Component {
  callHandler() {
    this.props.moves.call();
  }
  raiseHandler() {
    if (
      this.props.ctx.phase === GAME_PHASE.PREFLOP ||
      this.props.ctx.phase === GAME_PHASE.FLOP
    ) {
      this.props.moves.raise(BIG_BLIND);
    } else {
      this.props.moves.raise(2 * BIG_BLIND);
    }
  }
  foldHandler() {
    this.props.moves.fold();
  }

  render() {
    const playerID = this.props.playerID;

    const halfPlayers = Math.ceil(this.props.ctx.playOrder.length / 2);
    return (
      <div>
        <div className="m-10 flex justify-center space-x-10">
          {this.props.G.playerCards.map((cards, index) => (
            <PlayerBoardArea
              key={index}
              playerID={this.props.ctx.playOrder[index]}
              playerCards={this.props.G.playerCards[index]}
            ></PlayerBoardArea>
          ))}
        </div>
        <TableArea
          potTotal={this.props.G.playerStakes.reduce((a, b) => a + b)}
          communityCards={this.props.G.communityCards}
        ></TableArea>
        <div className="relative max-w-5xl mx-auto my-10 px-4 py-3 bg-wavy rounded-xl shadow-xl flex justify-ends items-center space-x-5">
          <GameLogs gameLogs={this.props.G.gameLogs}></GameLogs>
          <div
            id="stats"
            className="h-48 w-64 px-4 py-3 text-lg tracking-wider text-poker-soft-white overflow-scroll flex flex-col justify-between"
          >
            <div>Chips: ${this.props.G.playerChips[playerID]}</div>
            <div>Games Played: 0</div>
            <div>Wins: 0</div>
            <div>Folds: 0</div>
            <div>Losses: 0</div>
          </div>
          <div id="moves" className="h-48 flex flex-col items-start">
            <MoveButton d="M5 13l4 4L19 7" onClick={() => this.callHandler()}>
              Call
            </MoveButton>
            <MoveButton
              d="M5 11l7-7 7 7M5 19l7-7 7 7"
              onClick={() => this.raiseHandler()}
            >
              Raise
            </MoveButton>
            <MoveButton
              d="M6 18L18 6M6 6l12 12"
              onClick={() => this.foldHandler()}
            >
              Fold
            </MoveButton>
          </div>
        </div>
      </div>
    );
  }
}
