import React, { useState, useEffect, useRef } from "react";
import Square from "./Square";
import Swal from "sweetalert2";
import WaitingPage from "./WaitingPage";
import StartPage from "./StartPage";
import io from "socket.io-client";
import ScoreBox from "./ScoreBox";
import NameBox from "./NameBox";

function Board() {
  const [state, setState] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("O");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPlayerFound, setIsPlayerFound] = useState(false);
  const [playerName, setPlayerName] = useState(null);
  const [secondPlayerName, setSecondPlayerName] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [playerXscore, setPlayerXscore] = useState(0);
  const [playerOscore, setPlayerOscore] = useState(0);

  const socket = useRef(null);

  useEffect(() => {
    if (!playerName) return;
    socket.current = io("http://localhost:4000");

    socket.current.emit("player-name", playerName);

    socket.current.on("symbol", (symbol) => {
      console.log("You are ", symbol);
      setPlayerSymbol(symbol);
    });

    socket.current.on("player-matched", (data) => {
      playerIsFound();
      setRoomId(data.room_id);
      setSecondPlayerName(data.playerName[1]);
      console.log("starting...");
    });

    socket.current.on("move-reply", ({ index, symb, state }) => {
      let newArr = [...state];
      newArr[index] = symb;
      setState(newArr);

      if (symb == "X") {
        setTurn("O");
      } else {
        setTurn("X");
      }
    });

    return () => {};
  }, [playerName]);

  function playerIsFound() {
    setIsPlayerFound((prev) => !prev);
  }

  // Change start screen to searching for opponent
  function startTheGame() {
    askUserName();
  }
  //   check winner logic
  const checkWinner = () => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (state[a] != null && state[a] === state[b] && state[a] === state[c]) {
        setIsGameOver(true);
        setWinner(state[a]);
        setScore(state[a]);
        setWinningCells([a, b, c]);

        resetBoard();
        break;
      } else if (state.every((cell) => cell !== null)) {
        setTimeout(() => setState(Array(9).fill(null)), 1500);
      }
    }

    return null;
  };

  function setScore(player) {
    if (player == "X") {
      setPlayerXscore((prev) => prev + 1);
    } else {
      setPlayerOscore((prev) => prev + 1);
    }
  }

  // reset board game function
  function resetBoard(delay = 1500) {
    setTimeout(() => {
      setState(Array(9).fill(null));
      setIsGameOver(false);
      setWinner(null);
      setWinningCells([]);
    }, delay);
  }

  //   click handler
  const clickHandler = (index) => {
    if (playerSymbol != turn) return;
    if (state[index] == null && !isGameOver) {
      if (turn == playerSymbol) {
        socket.current.emit("player-moved", {
          index: index,
          roomID: roomId,
          symb: playerSymbol,
          state: state,
        });
      }
    }
  };

  //   check for winner everytime when the state is updated
  useEffect(() => {
    checkWinner();
  }, [state]);

  // ask name to user
  async function askUserName() {
    const ipAPI = "//api.ipify.org?format=json";
    const response = await fetch(ipAPI);
    const data = await response.json();
    const inputValue = data.ip;
    const { value: ipAddress } = await Swal.fire({
      title: "Enter Your Name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Enter Name First";
        }
      },
    });
    if (ipAddress) {
      setPlayerName(ipAddress);
      setIsGameStarted(true);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-evenly h-screen relative">
      {isGameStarted ? (
        isPlayerFound ? (
          <>
            {/* main game board */}
            <div className="main-board">
              <div className="flex items-center gap-10 w-full justify-between mb-10">
                <NameBox name={playerName} />
                <p className="text-4xl">VS</p>
                <NameBox name={secondPlayerName} />
              </div>
              <div className="flex">
                {[0, 1, 2].map((element, key) => (
                  <Square
                    key={key}
                    value={state[element]}
                    clickHandler={() => clickHandler(element)}
                    isWinningCell={winningCells.includes(element)}
                    winner={winner}
                  />
                ))}
              </div>
              <div className="flex">
                {[3, 4, 5].map((element, key) => (
                  <Square
                    key={key}
                    value={state[element]}
                    clickHandler={() => clickHandler(element)}
                    isWinningCell={winningCells.includes(element)}
                    winner={winner}
                  />
                ))}
              </div>
              <div className="flex">
                {[6, 7, 8].map((element, key) => (
                  <Square
                    key={key}
                    value={state[element]}
                    clickHandler={() => clickHandler(element)}
                    isWinningCell={winningCells.includes(element)}
                    winner={winner}
                  />
                ))}
              </div>

              {/* score boxes */}
              <div className="flex items-center gap-10 w-full justify-between mt-10">
                <ScoreBox playerSymb={"X"} score={playerXscore} />
                <ScoreBox playerSymb={"O"} score={playerOscore} />
              </div>
            </div>
          </>
        ) : (
          <WaitingPage />
        )
      ) : (
        <StartPage onClick={() => startTheGame()} />
      )}
    </div>
  );
}

export default Board;
