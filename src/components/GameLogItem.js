const GameLogItem = (props) => {
  return (
    <div className="game-log-item">
      <span className="font-semibold">[Sys] </span>
      <span>{props.log}</span>
    </div>
  );
};

export default GameLogItem;
