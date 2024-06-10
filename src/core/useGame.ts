import React from "react";
import Game from "./game";

export function useGame() {
  const game = React.useRef(new Game());
  const [state, setState] = React.useState(game.current.getGameState());

  React.useEffect(() => {
    const lastGame = game.current;

    const observer = () => {
      setState({ ...game.current.getGameState() });
    };

    game.current.subscribe(observer);

    return () => {
      lastGame.unsubscribe(observer);
    };
  }, [game]);

  return [
    state,
    game.current.play.bind(game.current),
    game.current.reset.bind(game.current),
    game.current.getWinner.bind(game.current),
  ] as const;
}
