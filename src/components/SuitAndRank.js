import {
  SuitToDisplayMap,
  RankToDisplayMap,
  DIAMOND,
  HEART,
} from "../poker/constants.js";

const SuitAndRank = (props) => {
  const suit_str = props.card_str.slice(0, 1);
  const rank_str = props.card_str.slice(1);

  const color = [DIAMOND, HEART].includes(suit_str)
    ? "text-poker-red"
    : "text-poker-black";
  const font = "font-poker";
  const pos = "flex flex-col justify-center pb-2";
  const classes = [color, font, pos, props.className].join(" ");

  const suit = SuitToDisplayMap.get(suit_str);
  const rank = RankToDisplayMap.get(rank_str);
  return (
    <div className={classes}>
      <div className="text-2xl">{rank}</div>
      <div className="text-5xl">{suit}</div>
    </div>
  );
};

export default SuitAndRank;
