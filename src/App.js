import PokerDeck from "./poker_cards.js";
import PokerCard from "./components/PokerCard";
import "./App.css";

const App = () => {
  const deck = new PokerDeck();
  deck.shuffle();
  const [card1, card2] = deck.deal(2);
  return (
    <div className="">
      <PokerCard suit={card1.suit} rank={card1.rank} />
      <PokerCard suit={card2.suit} rank={card2.rank} />
    </div>
  );
};

export default App;
