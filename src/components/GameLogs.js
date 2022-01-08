import { useEffect, useRef } from "react";
import GameLogItem from "./GameLogItem";

const GameLogs = (props) => {
  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div
      id="game-log"
      className="flex-grow max-w-2xl h-72 px-4 py-3 shadow-inner text-poker-soft-white border-double border-t-4 border-b-4 border-poker-soft-white overflow-y-scroll"
    >
      <div className="space-y-2">
        {props.gameLogs.map((log, i) => (
          <GameLogItem key={i} log={log}></GameLogItem>
        ))}
        <div ref={bottomRef} className="list-bottom"></div>
      </div>
    </div>
  );
};

export default GameLogs;
