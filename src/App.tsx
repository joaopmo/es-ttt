import { useGame } from "./core/useGame";
import type { Position } from "./core/game";
import "./App.css";

function App() {
  const [state, play, reset, getWinner] = useGame();

  const winner = getWinner();

  return (
    <>
      <div className="game-container">
        <div className="winner">
          {winner && <h2>{`O vencedor é: ${winner}`}</h2>}
        </div>
        <div className="board">
          {Object.entries(state).map(([position, symbol]) => (
            <Cell
              key={position}
              symbol={symbol}
              position={position as Position}
              onClick={(position) => play(position)}
            />
          ))}
        </div>
        <div>{winner && <button onClick={() => reset()}>Resetar</button>}</div>
      </div>
    </>
  );
}

interface CellProps {
  position: Position;
  symbol: null | "x" | "o";
  onClick: (arg: Position) => void;
}

function Cell({ symbol, position, onClick }: CellProps) {
  return (
    <div className="cell" onClick={() => onClick(position)}>
      {symbol && (
        <img src="src/assets/symbols.png" alt={symbol} className={symbol} />
      )}
    </div>
  );
}

export default App;
