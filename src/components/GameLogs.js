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
      className="flex-1 h-48 px-4 py-3 rounded-lg shadow-inner bg-poker-soft-white text-poker-black overflow-y-scroll"
    >
      <div className="space-y-3 border-l-2 pl-3 border-poker-black">
        {props.gameLogs.map((log, i) => (
          <GameLogItem key={i} log={log}></GameLogItem>
        ))}
        <div ref={bottomRef} className="list-bottom"></div>
      </div>
    </div>
  );
};

export default GameLogs;
