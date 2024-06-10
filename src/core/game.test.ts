import Game from "./game";

describe("Game class test", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  test("Game state is initialized with null", () => {
    const gameState = game.getGameState();

    expect(gameState.topLeft).toBeNull();
    expect(gameState.topCenter).toBeNull();
    expect(gameState.topRight).toBeNull();
    expect(gameState.middleLeft).toBeNull();
    expect(gameState.middleCenter).toBeNull();
    expect(gameState.middleRight).toBeNull();
    expect(gameState.bottomLeft).toBeNull();
    expect(gameState.bottomCenter).toBeNull();
    expect(gameState.bottomRight).toBeNull();
  });

  test("Game state is updated when a player plays", () => {
    game.play("topLeft");

    const gameState = game.getGameState();

    expect(gameState.topLeft).toBe("x");
  });

  test("The next player is updated after a play", () => {
    game.play("topLeft");

    expect(game.getGameState().topLeft).toBe("x");

    game.play("topCenter");

    expect(game.getGameState().topCenter).toBe("o");
  });

  test("The first player can be set", () => {
    game.setPlayer("o");

    game.play("topLeft");

    expect(game.getGameState().topLeft).toBe("o");
  });

  test("The game state is not updated when a player plays in an occupied position", () => {
    game.play("topLeft");

    const gameState = game.getGameState();

    expect(gameState.topLeft).toBe("x");

    game.play("topLeft");

    expect(gameState.topLeft).toBe("x");
  });

  test("The game state is reset", () => {
    game.play("topLeft");
    game.play("topCenter");

    expect(game.getGameState().topLeft).toBe("x");
    expect(game.getGameState().topCenter).toBe("o");

    game.reset();

    const gameState = game.getGameState();

    expect(gameState.topLeft).toBeNull();
    expect(gameState.topCenter).toBeNull();
  });

  test("Every observer is notified when the game state changes", () => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();

    game.subscribe(observer1);
    game.subscribe(observer2);

    game.play("topLeft");

    expect(observer1).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
  });

  test("An observer can unsubscribe", () => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();

    game.subscribe(observer1);
    game.subscribe(observer2);

    game.play("topLeft");

    expect(observer1).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();

    game.unsubscribe(observer1);

    game.play("topCenter");

    expect(observer1).toHaveBeenCalledTimes(1);
    expect(observer2).toHaveBeenCalledTimes(2);
  });

  test("Can find the winner in a row", () => {
    game.play("topLeft");
    game.play("middleLeft");
    game.play("topCenter");
    game.play("middleCenter");
    game.play("topRight");

    expect(game.getWinner()).toBe("x");
  });

  test("Can find the winner in a column", () => {
    game.play("topLeft");
    game.play("topCenter");
    game.play("middleLeft");
    game.play("middleCenter");
    game.play("bottomLeft");

    expect(game.getWinner()).toBe("x");
  });

  test("Can find the winner in a diagonal", () => {
    game.play("topLeft");
    game.play("topCenter");
    game.play("middleCenter");
    game.play("middleRight");
    game.play("bottomRight");

    expect(game.getWinner()).toBe("x");
  });

  test("Can find the winner in a reverse diagonal", () => {
    game.play("topRight");
    game.play("topCenter");
    game.play("middleCenter");
    game.play("middleRight");
    game.play("bottomLeft");

    expect(game.getWinner()).toBe("x");
  });

  test("There is no winner when the game is not finished", () => {
    game.play("topLeft");
    game.play("topCenter");
    game.play("middleCenter");
    game.play("middleRight");

    expect(game.getWinner()).toBeNull();
  });
});
