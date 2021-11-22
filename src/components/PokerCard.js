import SuitAndRank from "./SuitAndRank.js";

const PokerCard = (props) => {
  if (!props.card_str) {
    return (
      <div className="poker-card">
        <div className="poker-card bg-card-back border-4 border-poker-white"></div>
      </div>
    );
  } else {
    return (
      <div className="poker-card">
        <SuitAndRank card_str={props.card_str} className="" />
      </div>
    );
  }
};

export default PokerCard;
