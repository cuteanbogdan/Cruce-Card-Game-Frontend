import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import jwt_decode from "jwt-decode";

function Game() {
  const [players, setPlayers] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null);
  const [myBid, setMyBid] = useState(0);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);
  const user = decoded.user;
  const [userId] = useState("Your User ID"); // Replace with actual user ID
  const gameId = useParams();

  const fetchGameData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/games/${gameId.id}`);
      const data = await response.json();

      setPlayers(data.players);
      setCurrentBid(data.currentBid);
      setCurrentBidder(data.currentBidder);
    } catch (error) {
      console.error("Failed to fetch game data", error);
    }
  };

  console.log(players); //empty!!
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: false,
    });
    setSocket(newSocket);
    fetchGameData();
    newSocket.on("startGame", (game) => {
      setPlayers(game.players);
    });

    newSocket.on("gameUpdate", (data) => {
      setPlayers(data.players);
      setCurrentBid(data.currentBid);
      setCurrentBidder(data.currentBidder);
    });

    newSocket.on("bidPlaced", (data) => {
      setCurrentBid(data.currentBid);
      setCurrentBidder(data.currentBidder);
    });

    newSocket.on("bidStarted", (data) => {
      setCurrentBidder(data.currentBidder);
    });

    // Don't forget to clean up when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleBidChange = (e) => {
    setMyBid(e.target.value);
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    // Emit placeBid event with the current game ID and the user's bid
    if (socket) {
      socket.emit("placeBid", {
        gameId: gameId.id,
        userId: user.id,
        bid: myBid,
      });
    } else {
      console.error("Socket is not connected yet");
    }
  };

  return (
    <div>
      {players.map((player, index) => (
        <div key={index}>
          <h2>{player.name}</h2>
          <img src={player.avatar} alt={player.name} />
          <p>Score: {player.score}</p>
        </div>
      ))}
      <h2>Current bid: {currentBid}</h2>
      {currentBidder === userId && (
        <form onSubmit={handleBidSubmit}>
          <input
            type="number"
            value={myBid}
            onChange={handleBidChange}
            min={currentBid + 1}
          />
          <button type="submit">Place bid</button>
        </form>
      )}
    </div>
  );
}

export default Game;
