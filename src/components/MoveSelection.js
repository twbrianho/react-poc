import React from "react";
import { BIG_BLIND } from "../constants";
import { GAME_PHASE } from "../poker/constants";

import MoveButton from "./MoveButton";

export class MoveSelection extends React.Component {
  constructor(props) {
    super(props);
    this.playerCallHandler = this.playerCallHandler.bind(this);
    this.playerRaiseHandler = this.playerRaiseHandler.bind(this);
    this.playerFoldHandler = this.playerFoldHandler.bind(this);
  }

  playerCallHandler() {
    this.props.moves.call();
  }
  playerRaiseHandler() {
    if (
      this.props.ctx.phase === GAME_PHASE.PREFLOP ||
      this.props.ctx.phase === GAME_PHASE.FLOP
    ) {
      this.props.moves.raise(BIG_BLIND);
    } else {
      this.props.moves.raise(2 * BIG_BLIND);
    }
  }
  playerFoldHandler() {
    this.props.moves.fold();
  }

  render() {
    return (
      <div id="moves" className="space-y-5">
        <MoveButton d="M5 13l4 4L19 7" onClick={() => this.playerCallHandler()}>
          Call
        </MoveButton>
        <MoveButton
          d="M5 11l7-7 7 7M5 19l7-7 7 7"
          onClick={() => this.playerRaiseHandler()}
        >
          Raise
        </MoveButton>
        <MoveButton
          d="M6 18L18 6M6 6l12 12"
          onClick={() => this.playerFoldHandler()}
        >
          Fold
        </MoveButton>
      </div>
    );
  }
}

export default MoveSelection;
