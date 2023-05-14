import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Game from "../components/Game";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function GameInterface() {
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [games, setGames] = useState([]);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);
  const user = decoded.user;
  const history = useNavigate();

  function joinGame(gameIdToJoin) {
    socket.emit("joinGame", { gameId: gameIdToJoin, _id: user.id });
  }
  function createGame() {
    socket.emit("createGame", { _id: user.id });
  }

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: false,
    });
    setSocket(newSocket);
    newSocket.on("gamesList", (data) => {
      setGames(data);
      console.log(data);
    });
    newSocket.on("error", (data) => {
      // Display the error message to the user
      alert(data.message);
    });
    newSocket.on("gameCreated", (data) => {
      console.log("Game created with ID:", data.gameId);
      setGameId(data.gameId);
      history(`/game/${data.gameId}`);
    });

    newSocket.on("gameJoined", (data) => {
      console.log("Joined game with ID:", data.gameId);
      setGameId(data.gameId);
      history(`/game/${data.gameId}`);
    });

    newSocket.on("error", (data) => {
      console.error(data.message);
    });

    // cleanup the effect
    return () => newSocket.disconnect();
  }, []);

  return (
    <div>
      <button onClick={createGame}>Create Game</button>

      {games &&
        games.map((game) => (
          <Game key={game._id} game={game} joinGame={joinGame} />
        ))}
    </div>
  );
}

export default GameInterface;
