export type Player = "x" | "o";

export type Position =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "middleLeft"
  | "middleCenter"
  | "middleRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

export type GameState = Record<Position, null | Player>;

export default class Game {
  static POS_MTX = [
    ["topLeft", "topCenter", "topRight"],
    ["middleLeft", "middleCenter", "middleRight"],
    ["bottomLeft", "bottomCenter", "bottomRight"],
  ] as const;

  private gameState: GameState;

  private nextPlayer: Player;

  private lastPosition: Position;

  private observers: (() => void)[] = [];

  constructor() {
    this.reset();
  }

  private static getCoordinates(position: Position) {
    for (let i = 0; i < Game.POS_MTX.length; i++) {
      for (let j = 0; j < Game.POS_MTX[i].length; j++) {
        if (Game.POS_MTX[i][j] === position) {
          return [i, j];
        }
      }
    }

    return [-1, -1];
  }

  private notify() {
    this.observers.forEach((observer) => observer());
  }

  subscribe(observer: () => void) {
    this.observers.push(observer);
  }

  unsubscribe(observer: () => void) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  reset() {
    this.gameState = Object.fromEntries(
      Game.POS_MTX.flat().map((key) => [key, null])
    ) as GameState;
    this.nextPlayer = "x";
    this.lastPosition = "middleCenter";
    this.notify();
  }

  getGameState() {
    return this.gameState;
  }

  setPlayer(player: Player) {
    this.nextPlayer = player;
  }

  play(position: Position) {
    console.log("play", position);

    if (this.gameState[position]) {
      return;
    }

    this.lastPosition = position;
    this.gameState[position] = this.nextPlayer;
    this.nextPlayer = this.nextPlayer === "x" ? "o" : "x";
    this.notify();
  }

  getWinner(): Player | null {
    const lastPlayer = this.gameState[this.lastPosition];
    const [row, col] = Game.getCoordinates(this.lastPosition);

    // Check column
    for (let i = 0; i < 3; i++) {
      if (this.gameState[Game.POS_MTX[row][i]] !== lastPlayer) {
        break;
      }

      if (i === 2) {
        return lastPlayer;
      }
    }

    // Check row
    for (let i = 0; i < 3; i++) {
      if (this.gameState[Game.POS_MTX[i][col]] !== lastPlayer) {
        break;
      }

      if (i === 2) {
        return lastPlayer;
      }
    }

    // Check diagonal
    if (row === col) {
      for (let i = 0; i < 3; i++) {
        if (this.gameState[Game.POS_MTX[i][i]] !== lastPlayer) {
          break;
        }

        if (i === 2) {
          return lastPlayer;
        }
      }
    }

    // Check anti-diagonal
    if (row + col === 2) {
      for (let i = 0; i < 3; i++) {
        if (this.gameState[Game.POS_MTX[i][2 - i]] !== lastPlayer) {
          break;
        }

        if (i === 2) {
          return lastPlayer;
        }
      }
    }

    return null;
  }
}
