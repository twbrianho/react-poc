import React from "react";
import PokerCard from "./PokerCard";
import MoveButton from "./MoveButton";

export class LimitHoldEmBoard extends React.Component {
  checkHandler() {
    this.props.moves.check();
  }
  callHandler() {
    this.props.moves.call();
  }
  raiseHandler() {
    this.props.moves.raise();
  }
  foldHandler() {
    this.props.moves.fold();
  }

  render() {
    return (
      <div className="">
        <div className="m-10 space-y-5">
          <div className="text-center text-poker-white text-2xl font-semibold tracking-wider">
            Community Cards:
          </div>
          <div
            id="community-cards"
            className="flex justify-center items-center space-x-5"
          >
            <PokerCard card_str={this.props.G.flopCards[0]} />
            <PokerCard card_str={this.props.G.flopCards[1]} />
            <PokerCard card_str={this.props.G.flopCards[2]} />
            <PokerCard card_str={this.props.G.turnCard} />
            <PokerCard card_str={this.props.G.riverCard} />
          </div>
        </div>
        <div className="m-10 space-y-5">
          <div className="text-center text-poker-white text-2xl font-semibold tracking-wider">
            Your Hand:
          </div>
          <div className="flex justify-center items-center space-x-5">
            <PokerCard card_str={this.props.G.myCards[0]} />
            <PokerCard card_str={this.props.G.myCards[1]} />
          </div>
        </div>
        <div className="relative mx-20 my-3 px-4 py-3 bg-wavy rounded-xl shadow-xl flex justify-ends items-center space-x-5">
          <div
            id="game-log"
            className="flex-1 h-48 px-4 py-3 rounded-lg shadow-inner bg-poker-soft-white text-poker-black space-y-3 overflow-y-scroll"
          >
            <div className="game-log-item">
              <span className="font-semibold">[Sys]</span> Waiting for game to
              start...
            </div>
          </div>
          <div
            id="stats"
            className="h-48 w-64 px-4 py-3 text-lg tracking-wider text-poker-soft-white overflow-scroll flex flex-col justify-between"
          >
            <div>Chips: {this.props.G.playerChips[0]}</div>
            <div>Games Played: 0</div>
            <div>Wins: 0</div>
            <div>Folds: 0</div>
            <div>Losses: 0</div>
          </div>
          <div
            id="moves"
            className="h-48 flex flex-col justify-between items-start"
          >
            <MoveButton
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              onClick={() => this.checkHandler()}
            >
              Check
            </MoveButton>
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
