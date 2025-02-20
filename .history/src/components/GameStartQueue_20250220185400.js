
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlayersQueue.css";
import avatar1 from "../assets/profile-icon.png"; // Default avatar

import TicTacToeGame from "./TicTacToeGame";
import DiscArcadeModeGame from "./DiscArcadeModeGame";
import AimPointGame from "./AimPointGame";
import LightsOutWorld from "./LightsOutWorld";
import GameofAim from "./GameofAim";

const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";
const API_START_GAME = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSession/startGameSession";

const PlayersQueue = ({ onClose }) => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingGame, setStartingGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Fetch Players
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

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Start Game
  const startGameSession = async () => {
    if (players.length === 0) {
      alert("No players in queue.");
      return;
    }

    const firstPlayer = players[0]; // First player in queue
    setStartingGame(true);

    try {
      const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId}`);

      if (response.status === 200) {
        alert(`Game session started successfully for ${firstPlayer.name}!`);

        const gameName = firstPlayer.game.trim().toLowerCase();
      
      // ✅ Open game in new tab instead of replacing queue
      let gameUrl = "";
      switch (gameName) {
        case "tic tac clash":
          gameUrl = "/tic-tac-toe";
          break;
        case "disc arcade":
          gameUrl = "/disc-arcade";
          break;
        case "aimpoint":
          gameUrl = "/aimpoint";
          break;
        case "lights out":
          gameUrl = "/lights-out";
          break;
        case "game of aim":
          gameUrl = "/game-of-aim";
          break;
        default:
          alert("Unknown game selected.");
          return;
      }

      // ✅ Open new tab for the game
      // window.open(gameUrl, "_blank");
      window.open(`${window.location.origin}${gameUrl}, "_blank");
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

  // Handle Game Exit
  const handleExitGame = () => {
    setSelectedGame(null); // Return to queue list when exiting game
  };

  // Render Game if Selected
  // if (selectedGame) {
  //   switch (selectedGame.name) {
  //     case "tic tac clash":
  //       return <TicTacToeGame navigateToSelection={handleExitGame} />;
  //     case "disc arcade":
  //       return <DiscArcadeModeGame navigateToSelection={handleExitGame} />;
  //     case "aimpoint":
  //       return <AimPointGame navigateToSelection={handleExitGame} />;
  //     case "lights out":
  //       return <LightsOutWorld navigateToSelection={handleExitGame} />;
  //     case "game of aim":
  //       return <GameofAim navigateToSelection={handleExitGame} />;
  //     default:
  //       return <div>Error: Unknown game selected</div>;
  //   }
  // }
  

  return (
    <div className="players-queue-container">
      <div className="queue-modal">
        <h2>
          While waiting for your turn, feel free to explore the store and
          discover more exciting options.
        </h2>
        <p>Total Players in Queue: {players.length}</p>

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
                        src={avatar && avatar !== "string" ? `data:image/png;base64,${avatar}` : avatar1}
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
          <button
            onClick={startGameSession}
            className="start-button"
            disabled={startingGame || players.length === 0}
          >
            {startingGame ? "Starting..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayersQueue;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./PlayersQueue.css";
// import avatar1 from "../assets/profile-icon.png"; // Default avatar

// import TicTacToeGame from "./TicTacToeGame";
// import DiscArcadeModeGame from "./DiscArcadeModeGame";
// import AimPointGame from "./AimPointGame";
// import LightsOutWorld from "./LightsOutWorld";
// import GameofAim from "./GameofAim";

// const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";
// const API_START_GAME = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSession/startGameSession";
// const PlayersQueue = ({ onClose }) => {
//   const [players, setPlayers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [startingGame, setStartingGame] = useState(false);
//   const [selectedGame, setSelectedGame] = useState(null);

  

//     const fetchPlayers = async () => {
//       try {
//         const response = await fetch(API_URL);
//         const result = await response.json();

//         if (!result || !result.dataModel) {
//           throw new Error("Invalid API response format");
//         }

//         const formattedPlayers = result.dataModel.map((player) => ({
//           name: player.playerName,
//           game: player.gameName,
//           score: player.highScore,
//           avatar: player.avatar !== "string" ? player.avatar : null,
//           userId: player.userId,
//         }));

//         setPlayers(formattedPlayers);
//       } catch (error) {
//         console.error("Failed to fetch players data:", error);
//         setError("Error fetching player queue. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     useEffect(() => {
//       fetchPlayers();
//       const interval = setInterval(fetchPlayers, 10000); // Update every 10 seconds

//     return () => clearInterval(interval); 
//     }, []);

//   const startGameSession = async () => {
//     if (players.length === 0) {
//       alert("No players in queue.");
//       return;
//     }

//     const firstPlayer = players[0]; // First player in the queue
//     setStartingGame(true);

//     try {
//       const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId}`);

//       if (response.status === 200) {
//         alert(`Game session started successfully for ${firstPlayer.name}!`);
//         onClose();
//       } else {
//         throw new Error("Failed to start game session.");
//       }
//     } catch (error) {
//       console.error("Error starting game session:", error);
//       alert("Failed to start game session. Please try again.");
//     } finally {
//       setStartingGame(false);
//     }
//   };

//   return (
//     <div className="players-queue-container">
     
//         <div className="queue-modal">
//           <h2>
//             While waiting for your turn, feel free to explore the store and
//             discover more exciting options.
//           </h2>
//           <p>Total Players in Queue: {players.length}</p>

//           {isLoading ? (
//             <div className="loading-message">Loading players...</div>
//           ) : error ? (
//             <div className="error-message">{error}</div>
//           ) : players.length === 0 ? (
//             <div className="empty-message">No players in the queue currently.</div>
//           ) : (
//             <table className="players-table">
//               <thead>
//                 <tr>
//                   <th>Players</th>
//                   <th>Game in Play</th>
//                   <th>High Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {players.map(({ name, game, score, avatar }, index) => (
//                   <tr key={index}>
//                     <td>
//                       <div className="player-info">
//                         <img
//                           src={
//                             avatar && avatar !== "string"
//                               ? `data:image/png;base64,${avatar}`
//                               : avatar1
//                           }
//                           alt={`${name}'s avatar`}
//                           className="player-avatar"
//                         />
//                         {name}
//                       </div>
//                     </td>
//                     <td>{game}</td>
//                     <td>{score}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           <div className="queue-footer">
//             <button 
//               onClick={startGameSession} 
//               className="start-button"
//               disabled={startingGame || players.length === 0}
//             >
//               {startingGame ? "Starting..." : "Start"}
//             </button>
           
//           </div>
      
//         </div>
      
//     </div>

//   );
// };

// export default PlayersQueue;

