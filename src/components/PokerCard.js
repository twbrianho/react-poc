import SuitAndRank from "./SuitAndRank.js";
import Card from "./Card.js";

const PokerCard = (props) => {
  return (
    <Card className="w-32 h-40 m-4 flex justify-center items-center">
      <SuitAndRank suit={props.suit} rank={props.rank} className="text-5xl" />
    </Card>
  );
};

export default PokerCard;
