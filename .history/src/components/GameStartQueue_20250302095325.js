

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { notification} from "antd";
import "./PlayersQueue.css";
import avatar1 from "../assets/profile-icon.png";
import { Modal, Input, Button } from "antd"; 

const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";
const API_START_GAME = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSession/startGameSession";
const API_AUTH_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Auth/Login";
const Clear_RFID_Queue_API = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Webhook/ClearRfidQueue";


const PlayersQueue = ({ onClose }) => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingGame, setStartingGame] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const showPopup = (message, description) => {
      notification.open({
        message,
        description,
        placement: "top",
        duration: 5,
        className: "custom-notification-aim",
      });
    };

  // Fetch Players in Queue
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
        email: player.email,
        guestName: player.guestName,
        guestId: player.guestId || null,
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
    const interval = setInterval(fetchPlayers, 10000);
    return () => clearInterval(interval);
  }, []);

  // Open & Close Login Modal
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setAuthEmail("");
    setAuthPassword("");
    setAuthError(null);
  };

  // ✅ Authenticate User & Check userId
  const authenticateUser = async () => {
    if (!authEmail || !authPassword) {
      setAuthError("Please enter both email and password.");
      return;
    }

   
    const firstPlayer = players[0];
    // if (firstPlayer.guestId) {
    //   console.log("🚀 Guest detected, starting game without authentication...");
    //   startGameSession();
    //   return;
    // }

    

    
    if (!firstPlayer ) {
      setAuthError("The email entered does not match the player at the top of the queue.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("email", authEmail);
      formData.append("password", authPassword);

      const response = await axios.post(API_AUTH_URL, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

     // console.log("Login Response:", response.data); // Debugging
      if (response.data && response.data.dataModel && response.data.dataModel.user) {
        const loggedInUserId = response.data.dataModel.user.id;
       
  
        // ✅ Compare `userId` from login API with `userId` of the first player in the queue
        if (loggedInUserId === firstPlayer.userId) {
          closeLoginModal();
          startGameSession();
      // if (response.data && response.data.dataModel) {
      //   const { userId } = response.data.dataModel; // Extract userId from response

      //   // ✅ Check if the authenticated user's ID matches the first player in the queue
      //   if (userId === firstPlayer.userId) {
      //     closeLoginModal();
      //     startGameSession(); // Start game only if userId matches
        } else {
          setAuthError("Authentication failed. You are not the assigned player.");
        }
      } else {
        setAuthError("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setAuthError("Authentication failed. Please try again.");
    }
  };


  const gameScreenUrl = "https://flingdisc-egcyacbxcfewfadc.canadacentral-01.azurewebsites.net/game-screen";
  
  const startGameSession = async () => {
    let gameWindow = null;
    if (players.length === 0) {
      showPopup("No players in queue.");
      return;
    }

    const firstPlayer = players[0];
    setStartingGame(true);
    console.log("🚀 First Player Data (Before Processing):", firstPlayer);
    try {
      // const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId || firstPlayer.guestId}`);
      // const userId = firstPlayer.userId != null && firstPlayer.userId !== 0 ? firstPlayer.userId : firstPlayer.guestId;


      // const response = await axios.post(`${API_START_GAME}?userId=${userId}`);
      console.log("🚀 First Player Data (Before Processing):", firstPlayer);

      // ✅ Construct correct API query string
      let apiUrl = `${API_START_GAME}`;
      if (firstPlayer.userId != null && firstPlayer.userId !== 0) {
          apiUrl += `?userId=${firstPlayer.userId}`;  // ✅ Send userId if it exists
      } else {
          apiUrl += `?guestId=${firstPlayer.guestId}`;  // ✅ Send guestId as guestID if userId is missing
      }

      console.log("🚀 API Request URL:", apiUrl);

      const response = await axios.post(apiUrl);

      if (response.status === 200) {
        const gameName = firstPlayer.game.trim().toLowerCase().replace(/\s+/g, "-");
      localStorage.setItem("selectedGame", JSON.stringify({ name: gameName }));

      // window.location.href = gameScreenUrl;
      let gameWindow = window.open("", "gameScreenTab"); // Try to access the tab by name

      if (!gameWindow || gameWindow.closed) {
        // ❌ If the tab is not open, DO NOT open a new one. Just alert the user.
        showPopup("Please open the Game Screen tab manually and keep it open.");
      } else {
        // ✅ If the tab is open, refresh it with the latest game
        gameWindow.location.href = gameScreenUrl; // Load the game screen
        gameWindow.focus(); // Bring it to the front
      }

      // ✅ Trigger an event to notify the game screen about the new game
      localStorage.setItem("gameUpdate", Date.now()); 

      } else {
        throw new Error("Failed to start game session.");
      }
    } catch (error) {
      console.error("Error starting game session:", error);
      showPopup("Failed to start game session. Please try again.");
    } finally {
      setStartingGame(false);
    }
  };

  return (
    <div className="players-queue-container">
      <div className="queue-modal">
        <h2>While waiting for your turn, feel free to explore the store and discover more exciting options.</h2>
        <p>Total Players in Queue: {players.length}</p>
        <div className="queue-footer">
          {/* <button onClick={openLoginModal} className="start-button" disabled={players.length === 0}>
            {showLoginModal ? "Verify & Start" : "Verify to Start"}
          </button> */}

          <button 
            onClick={() => {
              if (players.length > 0 && players[0].guestId) {
                // ✅ Guest detected, start the game without authentication
                console.log("🚀 Guest detected, starting game without authentication...");
                startGameSession();
              } else {
                // ✅ No guestId, require authentication
                openLoginModal();
              }
            }} 
            className="start-button" 
            disabled={players.length === 0}
          >
            {showLoginModal ? "Verify & Start" : "Start"}
          </button>


        </div>

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

       
      </div>

      {/* Login Modal */}
      <Modal title="Authentication Required" visible={showLoginModal} onCancel={closeLoginModal} footer={null} centered zIndex={9999} className="custom-modal">
        <p>Only the assigned player can start the game.</p>
        <Input type="email" placeholder="Enter email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={{ marginBottom: 10 }} />
        <Input type="password" placeholder="Enter password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} style={{ marginBottom: 10 }} />
        {authError && <p style={{ color: "red" }}>{authError}</p>}
        <Button type="primary" onClick={authenticateUser} style={{ width: "100%", marginBottom: 10, background: "rgb(66, 199, 51)" }} className="Button1">
          Verify & Start
        </Button>
        {/* <Button 
            type="primary" 
            onClick={() => {
              authenticateUser(); // Existing function call

              // API call to Clear_RFID_Queue_API
              axios.get(Clear_RFID_Queue_API)
                  .then(response => {
                      console.log("✅ RFID Queue Cleared Successfully:", response.data);
                  })
                  .catch(error => {
                      console.error("🚨 Error clearing RFID queue:", error);
                  });
              }} 
              style={{ width: "100%", marginBottom: 10, background: "rgb(66, 199, 51)" }} 
              className="Button1"
        >
              Verify & Start
        </Button> */}

      </Modal>
    </div>
  );
};

export default PlayersQueue;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; 
// import "./PlayersQueue.css";
// import avatar1 from "../assets/profile-icon.png"; // Default avatar
// import { Modal, Input, Button } from "antd"; // Import necessary components from Ant Design
//  // Don't forget to import the Ant Design styles

// const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";
// const API_START_GAME = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSession/startGameSession";
// const API_AUTH_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Auth/Login";

// const PlayersQueue = ({ onClose }) => {
//   const [players, setPlayers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [startingGame, setStartingGame] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false); // Modal starts as false
//   const [authEmail, setAuthEmail] = useState("");
//   const [authPassword, setAuthPassword] = useState("");
//   const [authError, setAuthError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch Players
//   const fetchPlayers = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (!result || !result.dataModel) {
//         throw new Error("Invalid API response format");
//       }

//       const formattedPlayers = result.dataModel.map((player) => ({
//         name: player.playerName,
//         game: player.gameName,
//         score: player.highScore,
//         avatar: player.avatar !== "string" ? player.avatar : null,
//         userId: player.userId,
//         email: player.email,
//       }));

//       setPlayers(formattedPlayers);
//     } catch (error) {
//       console.error("Failed to fetch players data:", error);
//       setError("Error fetching player queue. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPlayers();
//     const interval = setInterval(fetchPlayers, 10000); // Update every 10 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Open login modal
//   const openLoginModal = () => setShowLoginModal(true);
//   const closeLoginModal = () => {
//     setShowLoginModal(false);
//     setAuthEmail("");
//     setAuthPassword("");
//     setAuthError(null);
//   };

//   // Authenticate user before starting the game
//   const authenticateUser = async () => {
//     if (!authEmail || !authPassword) {
//       setAuthError("Please enter both email and password.");
//       return;
//     }

//     const firstPlayer = players[0];
//     if (!firstPlayer || firstPlayer.email !== authEmail) {
//       setAuthError("The email entered does not match the player at the top of the queue.");
//       return;
//     }

//     try {
//       const formData = new URLSearchParams();
//       formData.append("email", authEmail);
//       formData.append("password", authPassword);

//       const response = await axios.post(API_AUTH_URL, formData, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       });

//       if (response.data && response.data.dataModel) {
//         closeLoginModal(); // Close modal on successful authentication
//         startGameSession();
//       } else {
//         setAuthError("Invalid credentials, please try again.");
//       }
//     } catch (error) {
//       console.error("Login failed:", error.response?.data || error.message);
//       setAuthError("Authentication failed. Please try again.");
//     }
//   };

//   const startGameSession = async () => {
//     if (players.length === 0) {
//       alert("No players in queue.");
//       return;
//     }
  
//     const firstPlayer = players[0];
//     setStartingGame(true);
  
//     try {
//       const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId}`);
  
//       if (response.status === 200) {
//         alert(`Game session started successfully for ${firstPlayer.name}!`);
  
//         // Convert game name to match component routes
//         const gameName = firstPlayer.game.trim().toLowerCase().replace(/\s+/g, "-"); 
  
//         // Navigate to the GameScreen component with gameName as a route parameter
//         navigate(`/game-screen/${gameName}`);
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

//   // Start Game
//   // const startGameSession = async () => {
//   //   if (players.length === 0) {
//   //     alert("No players in queue.");
//   //     return;
//   //   }

//   //   const firstPlayer = players[0];
//   //   setStartingGame(true);

//   //   try {
//   //     const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId}`);

//   //     if (response.status === 200) {
//   //       alert(`Game session started successfully for ${firstPlayer.name}!`);
//   //       // Open game in new tab
//   //       const gameName = firstPlayer.game.trim().toLowerCase();
//   //       let gameUrl = "";
//   //       switch (gameName) {
//   //         case "tic tac clash":
//   //           gameUrl = "/tic-tac-toe";
//   //           break;
//   //         case "disc arcade":
//   //           gameUrl = "/disc-arcade";
//   //           break;
//   //         case "aimpoint":
//   //           gameUrl = "/aimpoint";
//   //           break;
//   //         case "lights out":
//   //           gameUrl = "/lights-out";
//   //           break;
//   //         case "game of aim":
//   //           gameUrl = "/game-of-aim";
//   //           break;
//   //         default:
//   //           alert("Unknown game selected.");
//   //           return;
//   //       }

//   //       window.open(`${window.location.origin}${gameUrl}`, "_blank");
//   //     } else {
//   //       throw new Error("Failed to start game session.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error starting game session:", error);
//   //     alert("Failed to start game session. Please try again.");
//   //   } finally {
//   //     setStartingGame(false);
//   //   }
//   // };

//   return (
//     <div className="players-queue-container">
//       <div className="queue-modal">
//         <h2>While waiting for your turn, feel free to explore the store and discover more exciting options.</h2>
//         <p>Total Players in Queue: {players.length}</p>

//         {isLoading ? (
//           <div className="loading-message">Loading players...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
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
//                         src={avatar && avatar !== "string" ? `data:image/png;base64,${avatar}` : avatar1}
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
//           <button
//             onClick={openLoginModal}
//             className="start-button"
//             disabled={players.length === 0}
//           >
//             {showLoginModal ? "Verify & Start" : "Verify to Start"}
//           </button>
//         </div>
//       </div>

//       {/* Login Modal */}
//       {showLoginModal && (
//         // <div className="modal-overlay">
//         //   <div className="modal-content">
//         //     <h3>Authentication Required</h3>
//         //     <p>Only the assigned player can start the game.</p>
//         //     <input type="email" placeholder="Enter email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
//         //     <input type="password" placeholder="Enter password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
//         //     {authError && <p className="error-message">{authError}</p>}
//         //     <button onClick={authenticateUser}>Verify & Start</button>
//         //     <button onClick={closeLoginModal}>Cancel</button>
//         //   </div>
//         // </div>
//         <Modal
//       title="Authentication Required"
//       visible={showLoginModal}
//       onCancel={closeLoginModal}
//       footer={null}
//       centered
//       zIndex={9999} 
//        className="custom-modal"
//     >
//       <p>Only the assigned player can start the game.</p>

//       <Input
//         type="email"
//         placeholder="Enter email"
//         value={authEmail}
//         onChange={(e) => setAuthEmail(e.target.value)}
//         style={{ marginBottom: 10 }}
//       />
//       <Input
//         type="password"
//         placeholder="Enter password"
//         value={authPassword}
//         onChange={(e) => setAuthPassword(e.target.value)}
//         style={{ marginBottom: 10 }}
//       />
//       {authError && <p style={{ color: "red" }}>{authError}</p>}
//       <Button
//         type="primary"
//         onClick={authenticateUser}
//         style={{ width: "100%", marginBottom: 10,  background:"rgb(66, 199, 51)"}}
//         className="Button1"
//       >
//         Verify & Start
//       </Button>
//       <Button
//         onClick={closeLoginModal}
//         style={{ width: "100%" }}
//          className="Button1"
//       >
//         Cancel
//       </Button>
//     </Modal>
//       )}
//     </div>
//   );
// };

// export default PlayersQueue;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./PlayersQueue.css";
// import avatar1 from "../assets/profile-icon.png"; // Default avatar

// const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/playersInQueue/GetAll";
// const API_START_GAME = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSession/startGameSession";
// const API_AUTH_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Auth/Login";

// const PlayersQueue = ({ onClose }) => {
//   const [players, setPlayers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [startingGame, setStartingGame] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [authEmail, setAuthEmail] = useState("");
//   const [authPassword, setAuthPassword] = useState("");
//   const [authError, setAuthError] = useState(null);

//   // Fetch Players
//   const fetchPlayers = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (!result || !result.dataModel) {
//         throw new Error("Invalid API response format");
//       }

//       const formattedPlayers = result.dataModel.map((player) => ({
//         name: player.playerName,
//         game: player.gameName,
//         score: player.highScore,
//         avatar: player.avatar !== "string" ? player.avatar : null,
//         userId: player.userId,
//         email: player.email, // Ensure this is provided in the API response
//       }));

//       setPlayers(formattedPlayers);
//     } catch (error) {
//       console.error("Failed to fetch players data:", error);
//       setError("Error fetching player queue. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPlayers();
//     const interval = setInterval(fetchPlayers, 10000); // Update every 10 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Open login modal
//   const openLoginModal = () => setShowLoginModal(true);
//   const closeLoginModal = () => {
//     setShowLoginModal(false);
//     setAuthEmail("");
//     setAuthPassword("");
//     setAuthError(null);
//   };

//   // Authenticate user before starting the game
//   const authenticateUser = async () => {
//     if (!authEmail || !authPassword) {
//       setAuthError("Please enter both email and password.");
//       return;
//     }

//     const firstPlayer = players[0];
//     if (!firstPlayer || firstPlayer.email !== authEmail) {
//       setAuthError("The email entered does not match the player at the top of the queue.");
//       return;
//     }

//     try {
//       const formData = new URLSearchParams();
//       formData.append("email", authEmail);
//       formData.append("password", authPassword);

//       const response = await axios.post(API_AUTH_URL, formData, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       });

//       if (response.data && response.data.dataModel) {
//         closeLoginModal(); // Close modal on successful authentication
//         startGameSession();
//       } else {
//         setAuthError("Invalid credentials, please try again.");
//       }
//     } catch (error) {
//       console.error("Login failed:", error.response?.data || error.message);
//       setAuthError("Authentication failed. Please try again.");
//     }
//   };

//   // Start Game
//   const startGameSession = async () => {
//     if (players.length === 0) {
//       alert("No players in queue.");
//       return;
//     }

//     const firstPlayer = players[0];
//     setStartingGame(true);

//     try {
//       const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId}`);

//       if (response.status === 200) {
//         alert(`Game session started successfully for ${firstPlayer.name}!`);

//         // Open game in new tab
//         const gameName = firstPlayer.game.trim().toLowerCase();
//         let gameUrl = "";
//         switch (gameName) {
//           case "tic tac clash":
//             gameUrl = "/tic-tac-toe";
//             break;
//           case "disc arcade":
//             gameUrl = "/disc-arcade";
//             break;
//           case "aimpoint":
//             gameUrl = "/aimpoint";
//             break;
//           case "lights out":
//             gameUrl = "/lights-out";
//             break;
//           case "game of aim":
//             gameUrl = "/game-of-aim";
//             break;
//           default:
//             alert("Unknown game selected.");
//             return;
//         }

//         window.open(`${window.location.origin}${gameUrl}`, "_blank");
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
//   console.log("Show Login Modal:", showLoginModal);
//   return (

   

//     <div className="players-queue-container">
//       <div className="queue-modal">
//         <h2>While waiting for your turn, feel free to explore the store and discover more exciting options.</h2>
//         <p>Total Players in Queue: {players.length}</p>

//         {isLoading ? (
//           <div className="loading-message">Loading players...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
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
//                         src={avatar && avatar !== "string" ? `data:image/png;base64,${avatar}` : avatar1}
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
//         <button
//           onClick={() => {
//             console.log("Opening Modal..."); // Debugging log
//             openLoginModal();
//           }}
//           className="start-button"
//           disabled={players.length === 0}
//         >
//           {showLoginModal ? "Verify & Start" : "Verify to Start"}
//         </button>

//         {/* <button onClick={openLoginModal} className="start-button" disabled={players.length === 0}>
//           {showLoginModal ? "Verify & Start" : "Verify to Start"}
//         </button> */}
//         </div>
//       </div>

//       {/* Login Modal */}
//       {showLoginModal && (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <h3>Authentication Required</h3>
//           <p>Only the assigned player can start the game.</p>
//           <input type="email" placeholder="Enter email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
//           <input type="password" placeholder="Enter password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
//           {authError && <p className="error-message">{authError}</p>}
//           <button onClick={authenticateUser}>Verify & Start</button>
//           <button onClick={closeLoginModal}>Cancel</button>
//         </div>
//       </div>
//     )}
//     </div>
//   );
// };

// export default PlayersQueue;



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

//   // Fetch Players
//   const fetchPlayers = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (!result || !result.dataModel) {
//         throw new Error("Invalid API response format");
//       }

//       const formattedPlayers = result.dataModel.map((player) => ({
//         name: player.playerName,
//         game: player.gameName,
//         score: player.highScore,
//         avatar: player.avatar !== "string" ? player.avatar : null,
//         userId: player.userId,
//       }));

//       setPlayers(formattedPlayers);
//     } catch (error) {
//       console.error("Failed to fetch players data:", error);
//       setError("Error fetching player queue. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPlayers();
//     const interval = setInterval(fetchPlayers, 10000); // Update every 10 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Start Game
//   const startGameSession = async () => {
//     if (players.length === 0) {
//       alert("No players in queue.");
//       return;
//     }

//     const firstPlayer = players[0]; // First player in queue
//     setStartingGame(true);
// // window.post.messge(, data: {player: game: })
//     try {
//       const response = await axios.post(`${API_START_GAME}?userId=${firstPlayer.userId}`);

//       if (response.status === 200) {
//         alert(`Game session started successfully for ${firstPlayer.name}!`);
//         // setSelectedGame(firstPlayer.game.trim().toLowerCase());
//         const gameName = firstPlayer.game.trim().toLowerCase();
    
//       let gameUrl = "";
//       switch (gameName) {
//         case "tic tac clash":
//           gameUrl = "/tic-tac-toe";
//           break;
//         case "disc arcade":
//           gameUrl = "/disc-arcade";
//           break;
//         case "aimpoint":
//           gameUrl = "/aimpoint";
//           break;
//         case "lights out":
//           gameUrl = "/lights-out";
//           break;
//         case "game of aim":
//           gameUrl = "/game-of-aim";
//           break;
//         default:
//           alert("Unknown game selected.");
//           return;
//       }
    
//       window.open(`${window.location.origin}${gameUrl}`, "_blank");
//       // window.open(`${window.location.origin}${gameUrl}, "_blank");
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
  
//   const handleExitGame = () => {
//     setSelectedGame(null); 
//   };
 
//   // if (selectedGame) {
//   //   switch (selectedGame) {
//   //     case "tic tac clash":
//   //       return <TicTacToeGame navigateToSelection={handleExitGame} />;
//   //     case "disc arcade":
//   //       return <DiscArcadeModeGame navigateToSelection={handleExitGame} />;
//   //     case "aimpoint":
//   //       return <AimPointGame navigateToSelection={handleExitGame} />;
//   //     case "lights out":
//   //       return <LightsOutWorld navigateToSelection={handleExitGame} />;
//   //     case "game of aim":
//   //       return <GameofAim navigateToSelection={handleExitGame} />;
//   //     default:
//   //       return <div>Error: Unknown game selected</div>;
//   //   }
//   // }
  

//   return (
//     <div className="players-queue-container">
//       <div className="queue-modal">
//         <h2>
//           While waiting for your turn, feel free to explore the store and
//           discover more exciting options.
//         </h2>
//         <p>Total Players in Queue: {players.length}</p>

//         {isLoading ? (
//           <div className="loading-message">Loading players...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
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
//                         src={avatar && avatar !== "string" ? `data:image/png;base64,${avatar}` : avatar1}
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
//           <button
//             onClick={startGameSession}
//             className="start-button"
//             disabled={startingGame || players.length === 0}
//           >
//             {startingGame ? "Starting..." : "Start"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayersQueue;



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

