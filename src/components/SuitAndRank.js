import { getSuit, getRank } from "../poker/card.js";
import {
  SUIT_TO_DISPLAY_MAP,
  RANK_TO_DISPLAY_MAP,
  DIAMOND,
  HEART,
} from "../poker/constants.js";

const SuitAndRank = (props) => {
  const suit_str = getSuit(props.card_str);
  const rank_str = getRank(props.card_str);

  const color = [DIAMOND, HEART].includes(suit_str)
    ? "text-poker-red"
    : "text-poker-black";
  const font = "font-poker";
  const pos = "flex flex-col justify-center pb-3";
  const classes = [color, font, pos, props.className].join(" ");

  const suit = SUIT_TO_DISPLAY_MAP.get(suit_str);
  const rank = RANK_TO_DISPLAY_MAP.get(parseInt(rank_str));
  return (
    <div className={classes}>
      <div className="text-xl">{rank}</div>
      <div className="text-3xl">{suit}</div>
    </div>
  );
};

export default SuitAndRank;
