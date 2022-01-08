import PokerCard from "./PokerCard";

const PlayerBoardArea = (props) => {
  let outline = "";
  let clientLabel = "";
  if (props.isCurrentPlayer) {
    outline = "outline-dashed outline-2 outline-soft-white rounded-lg ";
  }
  if (props.isClient) {
    clientLabel = <span className="text-sm">(you)</span>;
  }
  return (
    <div className={outline + "p-3"}>
      <div className="text-poker-white text-lg font-semibold tracking-wider mb-1">
        {props.playerID} {clientLabel}
      </div>
      <div className="flex items-center mb-3">
        <div className="flex-grow text-center rounded-full bg-poker-black text-poker-soft-white text-sm tracking-wider">
          ${props.playerChips}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        <div className="px-3 rounded-full bg-black-op50 text-poker-soft-white text-sm tracking-wider">
          ${props.playerStake}
        </div>
      </div>
      <div className="flex justify-center items-center space-x-3">
        <PokerCard card_str={props.playerCards[0]} />
        <PokerCard card_str={props.playerCards[1]} />
      </div>
    </div>
  );
};

export default PlayerBoardArea;
