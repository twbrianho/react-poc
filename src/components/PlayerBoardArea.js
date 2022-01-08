import PokerCard from "./PokerCard";

const PlayerBoardArea = (props) => {
  return (
    <div key={props.playerID} className="inline-block p-3 space-y-5">
      <div className="text-center text-poker-white text-2xl font-semibold tracking-wider">
        Player {props.playerID}
      </div>
      <div className="flex justify-center items-center space-x-5">
        <PokerCard card_str={props.playerCards[0]} />
        <PokerCard card_str={props.playerCards[1]} />
      </div>
    </div>
  );
};

export default PlayerBoardArea;
