const RankDisplay = {
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
  TEN: "10",
  JACK: "J",
  QUEEN: "Q",
  KING: "K",
  ACE: "A",
};

const SuitAndRank = (props) => {
  const color = ["DIAMONDS", "HEARTS"].includes(props.suit)
    ? "text-red-500"
    : "text-gray-800";
  const font = "font-poker";
  const classes = [color, font, props.className].join(" ");

  let suit = "?";
  if (props.suit === "CLUBS") {
    suit = "♣";
  } else if (props.suit === "DIAMONDS") {
    suit = "♦";
  } else if (props.suit === "HEARTS") {
    suit = "♥";
  } else if (props.suit === "SPADES") {
    suit = "♠";
  }
  let rank = RankDisplay[props.rank];
  return (
    <div className={classes}>
      {rank}
      {suit}
    </div>
  );
};

export default SuitAndRank;
