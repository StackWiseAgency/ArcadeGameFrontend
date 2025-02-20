

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PlayersQueue.css";
import avatar1 from "../assets/profile-icon.png"; // Default avatar

const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";

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

    

  

  return (
    <div className="players-queue-container">
      <div className="modal-overlay" role="presentation"></div>
      <div className="queue-modal">
        <h2>
        Payment Successful!
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
           <Link to="/GameSelect" className="start-button">Back to Games</Link>
          {/* <button onClick={onClose} className="close-button" aria-label="Close Queue">
            Close
          </button> */}
           {/* <button 
            onClick={startGameSession} 
            className="start-button"
            disabled={startingGame || players.length === 0}
          >
            {startingGame ? "Starting..." : "Start"}
          </button> */}
          <br />
          <p>Total Players in Queue: {players.length}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayersQueue;



// import React, { useState, useEffect } from "react";
// import "./PlayersQueue.css";

// import avatar1 from "../assets/profile-icon.png"; // Default avatar

// const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";

// const PlayersQueue = ({ onClose }) => {
//   const [players, setPlayers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const response = await fetch(API_URL);
//         const data = await response.json();
//         setPlayers(data);
//       } catch (error) {
//         console.error("Failed to fetch players data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlayers();
//   }, []);

//   return (
//     <div className="players-queue-container">
//       <div className="modal-overlay" role="presentation"></div>
//       <div className="queue-modal">
//         <h2>
//           While waiting for your turn, feel free to explore the store and
//           discover more exciting options.
//         </h2>
//         <p>You will be notified by email when it's your turn to play!</p>

//         {isLoading ? (
//           <div className="loading-message">Loading players...</div>
//         ) : players.length === 0 ? (
//           <div className="empty-message">No players in the queue currently.</div>
//         ) : (
//           <table className="players-table">
//             <thead>
//               <tr>
//                 <th>Players</th>
//                 <th>Game in Play</th>
//                 <th>High Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {players.map(({ name, game, score, avatar }, index) => (
//                 <tr key={index}>
//                   <td>
//                     <div className="player-info">
//                       <img
//                         src={
//                           avatar
//                             ? `data:image/png;base64,${avatar}` // Use Base64 image if available
//                             : avatar1 // Fallback to default avatar
//                         }
//                         alt={`${name}'s avatar`}
//                         className="player-avatar"
//                       />
//                       {name}
//                     </div>
//                   </td>
//                   <td>{game}</td>
//                   <td>{score}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         <div className="queue-footer">
//           <button onClick={onClose} className="close-button" aria-label="Close Queue">
//             Close
//           </button>
//           <p>Total Players in Queue: {players.length}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayersQueue;



// import React from "react";
// import "./PlayersQueue.css";

// import avatar1 from "../assets/profile-icon.png";

// const PlayersQueue = ({ onClose }) => {
//   const players = [
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 245464 },
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 154656 },
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 15454 },
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 2211 },
//   ];
  
//   return (
//     <div className="queue-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="queue-modal">
//         <h2>
//           While waiting for your turn, feel free to explore the store and
//           discover more exciting options.
//         </h2>
//         <p>You will be notified by email when it's your turn to play!</p>

//         <table className="players-table">
//           <thead>
//             <tr>
//               <th>Players</th>
//               <th>Game in Play</th>
//               <th>High Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {players.map((player, index) => (
//               <tr key={index}>
//                 <td>
//                   <div className="player-info">
//                     <img
//                       src={avatar1}
//                       alt={player.name}
//                       className="player-avatar"
//                     />
//                     {player.name}
//                   </div>
//                 </td>
//                 <td>{player.game}</td>
//                 <td>{player.score}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="queue-footer">
//           <button onClick={onClose} className="close-button">
//             <p>Total Players in Queue: {players.length}</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayersQueue;


// import React, { useState, useEffect } from "react";
// import "./PlayersQueue.css";

// import avatar1 from "../assets/profile-icon.png"; // Default avatar

// const PlayersQueue = ({ onClose }) => {
//   const [players, setPlayers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const response = await fetch("https://api.example.com/players");
//         const data = await response.json();
//         setPlayers(data);
//       } catch (error) {
//         console.error("Failed to fetch players data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlayers();
//   }, []);

//   return (
//     <div className="players-queue-container">
//       <div className="modal-overlay" role="presentation"></div>
//       <div className="queue-modal">
//         <h2>
//           While waiting for your turn, feel free to explore the store and
//           discover more exciting options.
//         </h2>
//         <p>You will be notified by email when it's your turn to play!</p>

//         {isLoading ? (
//           <div className="loading-message">Loading players...</div>
//         ) : players.length === 0 ? (
//           <div className="empty-message">No players in the queue currently.</div>
//         ) : (
//           <table className="players-table">
//             <thead>
//               <tr>
//                 <th>Players</th>
//                 <th>Game in Play</th>
//                 <th>High Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {players.map(({ name, game, score, avatar }, index) => (
//                 <tr key={index}>
//                   <td>
//                     <div className="player-info">
//                       <img
//                         src={
//                           avatar
//                             ? `data:image/png;base64,${avatar}` // Use Base64 image if available
//                             : avatar1 // Fallback to default avatar
//                         }
//                         alt={`${name}'s avatar`}
//                         className="player-avatar"
//                       />
//                       {name}
//                     </div>
//                   </td>
//                   <td>{game}</td>
//                   <td>{score}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         <div className="queue-footer">
//           <button onClick={onClose} className="close-button" aria-label="Close Queue">
//             Close
//           </button>
//           <p>Total Players in Queue: {players.length}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayersQueue;



// import React from "react";
// import "./PlayersQueue.css";

// import avatar1 from "../assets/profile-icon.png";

// const PlayersQueue = ({ onClose }) => {
//   const players = [
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 245464 },
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 154656 },
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 15454 },
//     { name: "azeemsmart1777", game: "Tic Tac Toe", score: 2211 },
//   ];
  
//   return (
//     <div className="queue-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="queue-modal">
//         <h2>
//           While waiting for your turn, feel free to explore the store and
//           discover more exciting options.
//         </h2>
//         <p>You will be notified by email when it's your turn to play!</p>

//         <table className="players-table">
//           <thead>
//             <tr>
//               <th>Players</th>
//               <th>Game in Play</th>
//               <th>High Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {players.map((player, index) => (
//               <tr key={index}>
//                 <td>
//                   <div className="player-info">
//                     <img
//                       src={avatar1}
//                       alt={player.name}
//                       className="player-avatar"
//                     />
//                     {player.name}
//                   </div>
//                 </td>
//                 <td>{player.game}</td>
//                 <td>{player.score}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="queue-footer">
//           <button onClick={onClose} className="close-button">
//             <p>Total Players in Queue: {players.length}</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayersQueue;
