
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlayersQueue.css";
import avatar1 from "../assets/profile-icon.png"; // Default avatar

const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";
const API_START_GAME = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSession/startGameSession";
const PlayersQueue = ({ onClose }) => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingGame, setStartingGame] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);
    const fetchPlayers = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!result || !result.dataModel) {
          throw new Error("Invalid API response format");
        }

        const formattedPlayers = result.dataModel.map((player) => ({
          name: player.playerName,
          game: player.gameName,
          score: player.highScore,
          avatar: player.avatar !== "string" ? player.avatar : null,
          userId: player.userId,
        }));

        setPlayers(formattedPlayers);
      } catch (error) {
        console.error("Failed to fetch players data:", error);
        setError("Error fetching player queue. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    

  const startGameSession = async () => {
    if (players.length === 0) {
      alert("No players in queue.");
      return;
    }

    const firstPlayer = players[0]; // First player in the queue
    setStartingGame(true);

    try {
      const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId}`);

      if (response.status === 200) {
        alert(`Game session started successfully for ${firstPlayer.name}!`);
        onClose();
      } else {
        throw new Error("Failed to start game session.");
      }
    } catch (error) {
      console.error("Error starting game session:", error);
      alert("Failed to start game session. Please try again.");
    } finally {
      setStartingGame(false);
    }
  };

  return (
    <div className="players-queue-container">
      <div className="modal-overlay" role="presentation"></div>
      <div className="queue-modal">
        <h2>
          While waiting for your turn, feel free to explore the store and
          discover more exciting options.
        </h2>
        <p>You will be notified by email when it's your turn to play!</p>

        {isLoading ? (
          <div className="loading-message">Loading players...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : players.length === 0 ? (
          <div className="empty-message">No players in the queue currently.</div>
        ) : (
          <table className="players-table">
            <thead>
              <tr>
                <th>Players</th>
                <th>Game in Play</th>
                <th>High Score</th>
              </tr>
            </thead>
            <tbody>
              {players.map(({ name, game, score, avatar }, index) => (
                <tr key={index}>
                  <td>
                    <div className="player-info">
                      <img
                        src={
                          avatar && avatar !== "string"
                            ? `data:image/png;base64,${avatar}`
                            : avatar1
                        }
                        alt={`${name}'s avatar`}
                        className="player-avatar"
                      />
                      {name}
                    </div>
                  </td>
                  <td>{game}</td>
                  <td>{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="queue-footer">
          {/* <button onClick={onClose} className="close-button" aria-label="Close Queue">
            Close
          </button> */}
           <button 
            onClick={startGameSession} 
            className="start-button"
            disabled={startingGame || players.length === 0}
          >
            {startingGame ? "Starting..." : "Start"}
          </button>
          <p>Total Players in Queue: {players.length}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayersQueue;

