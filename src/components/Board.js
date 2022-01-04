import React from "react";
import PokerCard from "./PokerCard";
import MoveButton from "./MoveButton";
import { BIG_BLIND } from "../constants";
import { GAME_PHASE } from "../poker/constants";
import GameLogItem from "./GameLogItem";

export class TexasHoldEmBoard extends React.Component {
  checkHandler() {
    this.props.moves.call();
  }
  callHandler() {
    this.props.moves.call();
  }
  betHandler() {
    if (
      this.props.ctx.phase === GAME_PHASE.PREFLOP ||
      this.props.ctx.phase === GAME_PHASE.FLOP
    ) {
      this.props.moves.raise(BIG_BLIND);
    } else {
      this.props.moves.raise(2 * BIG_BLIND);
    }
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
    return (
      <div>
        <div
          id="table"
          className="border-8 border-poker-white bg-green-700 shadow-lg rounded-full w-7/8 h-96 mx-20 my-10 p-5 space-y-5"
        >
          <div className="m-10">
            <div
              id="pot"
              className="text-center text-poker-white text-4xl font-semibold tracking-wider flex justify-center items-center"
            >
              {this.props.G.playerStakes.reduce((a, b) => a + b)}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="m-10">
            <div
              id="community-cards"
              className="flex justify-center items-center space-x-5"
            >
              {this.props.G.communityCards.map((card, index) => (
                <PokerCard key={"community-" + index} card_str={card} />
              ))}
            </div>
          </div>
        </div>
        <div className="m-10 flex justify-center space-x-10">
          {this.props.G.playerCards.map((cards, index) => (
            <div
              key={this.props.ctx.playOrder[index]}
              className="inline-block p-3 space-y-5"
            >
              <div className="text-center text-poker-white text-2xl font-semibold tracking-wider">
                Player {this.props.ctx.playOrder[index]}
              </div>
              <div className="flex justify-center items-center space-x-5">
                <PokerCard card_str={cards[0]} />
                <PokerCard card_str={cards[1]} />
              </div>
            </div>
          ))}
        </div>
        <div className="relative mx-20 my-10 px-4 py-3 bg-wavy rounded-xl shadow-xl flex justify-ends items-center space-x-5">
          <div
            id="game-log"
            className="flex-1 h-48 px-4 py-3 rounded-lg shadow-inner bg-poker-soft-white text-poker-black space-y-3 overflow-y-scroll"
          >
            {this.props.G.gameLogs.map((log, i) => (
              <GameLogItem key={i} log={log}></GameLogItem>
            ))}
          </div>
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
