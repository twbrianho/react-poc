const GameLogItem = (props) => {
  return (
    <div className="game-log-item">
      <span className="font-semibold opacity-50">[Sys] </span>
      <span className="">{props.log}</span>
    </div>
  );
};

export default GameLogItem;
