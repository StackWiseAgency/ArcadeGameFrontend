
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./../styles/GameSelectionPage.css";
import PaymentTran from "./../components/PaymentTran";
import PlayersQueue from "./../components/PlayersQueue";
import TicTacToeGame from "./../components/TicTacToeGame";
import DiscArcadeModeGame from "./../components/DiscArcadeModeGame";
import AimPointGame from "./../components/AimPointGame";
import LightsOutWorld from "./../components/LightsOutWorld";
import GameofAim from "./../components/GameofAim";


import DiscGolf from "../assets/disc-golf.png";
import TicTacToe from "../assets/tic-tac-toe.png";
import LightsOut from "../assets/lights-out.png";
import RetroGolf from "../assets/retro-golf.png";

import TrophyIcon from "../assets/trophy.png";
import ProfileIcon from "../assets/profile-icon.png";

const API_GAMES_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Game/getAllGames";

const GameSelectionPage = () => {
  const [games, setGames] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paidPrice, setPaidPrice] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
     
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    // Ensure localStorage is read after component mounts
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (Object.keys(parsedUser).length > 0) {
          setUser(parsedUser);
        } else {
          console.warn("authUser is empty!");
        }
       
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
   
  }, []);

  const profilePicture = user.profilePicturePath || ProfileIcon;
  const userName = user.name || "Guest User";
  const userUsername = user.username || "Guest";
 

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token from storage
        if (!token) throw new Error("No auth token found");

        const response = await fetch(API_GAMES_URL, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch games");

        const result = await response.json();
        if (result.isError) {
          console.error("API Error:", result.responseMessage);
          return;
        }

        const fetchedGames = result.dataModel.map(game => ({
          name: game.name,
          description: game.description || "No description available",
          price: game.price ? `$${game.price.toFixed(2)}` : "N/A",  // ✅ Ensures proper formatting
          numericPrice: game.price || 0,       
          image: game.image 
        }));

        setGames(fetchedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handlePlayClick = (game) => {
    setSelectedGame(game);
    if (hasPaid && game.numericPrice === paidPrice) {
      setIsQueueOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQueueOpen(true);
    setHasPaid(true);
    setPaidPrice(selectedGame.numericPrice);
  };

  const handleQueueCompletion = () => {
    setIsQueueOpen(false);
    setIsGameStarted(true);
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
    setIsGameStarted(false);
    setIsQueueOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("profilePicture");
    navigate("/signin");
  };

  if (loading) {
    return <p>Loading games...</p>;
  }

  return (
    <div className="game-selection-container">
      {isQueueOpen ? (
        <PlayersQueue onClose={handleQueueCompletion} />
      ) : !isGameStarted ? (
        <>
          <div className="header">
            <div className="reward-points">
              <img src={TrophyIcon} alt="Trophy" className="trophy-icon" />
              <div className="reward-text">
                <span className="reward-title">REWARD POINTS</span>
                <span className="reward-value">200PTS</span>
              </div>
            </div>

            <div className="game-points-info">
              <p>EARN 1 POINT PER GAME</p>
              <p>5 POINTS = 1 FREE GAME</p>
            </div>

            <div className="logged-in-user">
              <img
                src={profilePicture}
                alt="User"
                className="profile-icon"
                onClick={toggleDropdown}
              />
              <div className="user-text">
                <span className="user-name">{userName}</span>
                <span className="user-username">{userUsername}</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <h1 className="select-games-title">Select Games</h1>
          <div className="games-grid">
            {games.map((game, index) => (
              <div className="game-card" key={index}>
                <img src={game.image} alt={game.name} className="game-image" />
                <div className="game-info">
                  <p className="game-price">{game.price}</p>
                  <h3 className="game-title-selection">{game.name}</h3>
                  <p className="game-description">{game.description}</p>
                  <button className="play-button" onClick={() => handlePlayClick(game)}>
                    Tap to Play
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <PaymentTran selectedGame={selectedGame} onClose={closeModal} />
          )}
        </>
      ) : (
        <>
          {selectedGame.name === "Tic Tac Toe" && (
            <TicTacToeGame navigateToSelection={handleBackToSelection} />
          )}
          {selectedGame.name === "Retro Disc Golf" && (
            <DiscArcadeModeGame navigateToSelection={handleBackToSelection} />
          )} 
          {selectedGame.name === "AimPoint" && (
            <AimPointGame navigateToSelection={handleBackToSelection} />
          )} 
          {selectedGame.name === "Lights Out Worlds" && (
            <LightsOutWorld navigateToSelection={handleBackToSelection} />
          )} 
          {selectedGame.name === "Game Of AIM" && (
            <GameofAim navigateToSelection={handleBackToSelection} />
          )}
        </>
      )}
    </div>
  );
};

export default GameSelectionPage;


// import React, { useState, useEffect, lazy, Suspense } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import "./../styles/GameSelectionPage.css";
// import PaymentTran from "./../components/PaymentTran";
// import PlayersQueue from "./../components/PlayersQueue";

// // **✅ Import known game components normally (faster)**
// import TicTacToeGame from "./../components/TicTacToeGame";
// import DiscArcadeModeGame from "./../components/DiscArcadeModeGame";
// import AimPointGame from "./../components/AimPointGame";
// import LightsOutWorld from "./../components/LightsOutWorld";
// import GameofAim from "./../components/GameofAim";

// import TrophyIcon from "../assets/trophy.png";
// import ProfileIcon from "../assets/profile-icon.png";

// const API_GAMES_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Game/getAllGames";

// // **✅ Known game components mapping**
// const gameComponents = {
//   "Tic Tac Toe": TicTacToeGame,
//   "Retro Disc Golf": DiscArcadeModeGame,
//   "AimPoint": AimPointGame,
//   "Lights Out Worlds": LightsOutWorld,
//   "Game Of AIM": GameofAim
// };

// const GameSelectionPage = () => {
//   const [games, setGames] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isQueueOpen, setIsQueueOpen] = useState(false);
//   const [hasPaid, setHasPaid] = useState(false);
//   const [paidPrice, setPaidPrice] = useState(null);
//   const [isGameStarted, setIsGameStarted] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [dynamicComponents, setDynamicComponents] = useState({});

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGames = async () => {
//       try {
//         const response = await fetch(API_GAMES_URL);
//         if (!response.ok) throw new Error("Failed to fetch games");

//         const result = await response.json();
//         if (result.isError) {
//           console.error("API Error:", result.responseMessage);
//           return;
//         }

//         const fetchedGames = result.dataModel.map(game => ({
//           name: game.name,
//           description: game.description,
//           price: `$${game.numericPrice}`,
//           numericPrice: game.numericPrice,
//           image: game.image,
//           componentName: game.componentName 
//         }));

//         setGames(fetchedGames);
        
//         // **✅ Import dynamically only for new games not in our known list**
//         const newComponents = {};
//         for (const game of fetchedGames) {
//           if (!gameComponents[game.name]) {
//             try {
//               newComponents[game.name] = lazy(() =>
//                 import(`./../components/${game.componentName}`).catch(() => {
//                   console.error(`Component ${game.componentName} not found`);
//                   return { default: () => <p>Game Component Not Found</p> };
//                 })
//               );
//             } catch (error) {
//               console.error(`Error loading component ${game.componentName}`);
//             }
//           }
//         }

//         setDynamicComponents(newComponents);

//       } catch (error) {
//         console.error("Error fetching games:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGames();
//   }, []);

//   const handlePlayClick = (game) => {
//     setSelectedGame(game);
//     if (hasPaid && game.numericPrice === paidPrice) {
//       setIsQueueOpen(true);
//     } else {
//       setIsModalOpen(true);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setIsQueueOpen(true);
//     setHasPaid(true);
//     setPaidPrice(selectedGame.numericPrice);
//   };

//   const handleQueueCompletion = () => {
//     setIsQueueOpen(false);
//     setIsGameStarted(true);
//   };

//   const handleBackToSelection = () => {
//     setSelectedGame(null);
//     setIsGameStarted(false);
//     setIsQueueOpen(false);
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     console.log("User logged out.");
//     navigate("/signin");
//   };

//   if (loading) {
//     return <p>Loading games...</p>;
//   }

//   return (
//     <div className="game-selection-container">
//       {selectedGame ? (
//         <Suspense fallback={<p>Loading game...</p>}>
//           {gameComponents[selectedGame.name] ? (
//             React.createElement(gameComponents[selectedGame.name], { navigateToSelection: handleBackToSelection })
//           ) : dynamicComponents[selectedGame.name] ? (
//             React.createElement(dynamicComponents[selectedGame.name], { navigateToSelection: handleBackToSelection })
//           ) : (
//             <p>Game Component Not Found</p>
//           )}
//         </Suspense>
//       ) : (
//         <>
//           <h1 className="select-games-title">Select Games</h1>
//           <div className="games-grid">
//             {games.map((game, index) => (
//               <div className="game-card" key={index}>
//                 <img src={game.image} alt={game.name} className="game-image" />
//                 <div className="game-info">
//                   <p className="game-price">{game.price}</p>
//                   <h3 className="game-title-selection">{game.name}</h3>
//                   <p className="game-description">{game.description}</p>
//                   <button className="play-button" onClick={() => handlePlayClick(game)}>
//                     Tap to Play
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default GameSelectionPage;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import "./../styles/GameSelectionPage.css";
// import PaymentTran from "./../components/PaymentTran";
// import PlayersQueue from "./../components/PlayersQueue";
// import TicTacToeGame from "./../components/TicTacToeGame";
// import DiscArcadeModeGame from "./../components/DiscArcadeModeGame";
// import AimPointGame from "./../components/AimPointGame";
// import LightsOutWorld from "./../components/LightsOutWorld";
// import GameofAim from "./../components/GameofAim";

// import TrophyIcon from "../assets/trophy.png";
// import ProfileIcon from "../assets/profile-icon.png";

// const API_GAMES_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Game/getAllGames";

// const GameSelectionPage = () => {
//   const [games, setGames] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isQueueOpen, setIsQueueOpen] = useState(false);
//   const [hasPaid, setHasPaid] = useState(false);
//   const [paidPrice, setPaidPrice] = useState(null);
//   const [isGameStarted, setIsGameStarted] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGames = async () => {
//       try {
//         const response = await fetch(API_GAMES_URL);
//         if (!response.ok) throw new Error("Failed to fetch games");

//         const result = await response.json();
//         if (result.isError) {
//           console.error("API Error:", result.responseMessage);
//           return;
//         }

//         const fetchedGames = result.dataModel.map(game => ({
//           name: game.name,
//           description: game.description,
//           price: `$${game.numericPrice}`,
//           numericPrice: game.numericPrice,
//           image: game.image 
//         }));

//         setGames(fetchedGames);
//       } catch (error) {
//         console.error("Error fetching games:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGames();
//   }, []);

//   const handlePlayClick = (game) => {
//     setSelectedGame(game);
//     if (hasPaid && game.numericPrice === paidPrice) {
//       setIsQueueOpen(true);
//     } else {
//       setIsModalOpen(true);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setIsQueueOpen(true);
//     setHasPaid(true);
//     setPaidPrice(selectedGame.numericPrice);
//   };

//   const handleQueueCompletion = () => {
//     setIsQueueOpen(false);
//     setIsGameStarted(true);
//   };

//   const handleBackToSelection = () => {
//     setSelectedGame(null);
//     setIsGameStarted(false);
//     setIsQueueOpen(false);
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     console.log("User logged out.");
//     navigate("/signin");
//   };

//   if (loading) {
//     return <p>Loading games...</p>;
//   }

//   return (
//     <div className="game-selection-container">
//       {isQueueOpen ? (
//         <PlayersQueue onClose={handleQueueCompletion} />
//       ) : !isGameStarted ? (
//         <>
//           <div className="header">
//             <div className="reward-points">
//               <img src={TrophyIcon} alt="Trophy" className="trophy-icon" />
//               <div className="reward-text">
//                 <span className="reward-title">REWARD POINTS</span>
//                 <span className="reward-value">200PTS</span>
//               </div>
//             </div>

//             <div className="game-points-info">
//               <p>EARN 1 POINT PER GAME</p>
//               <p>5 POINTS = 1 FREE GAME</p>
//             </div>

//             <div className="logged-in-user">
//               <img
//                 src={ProfileIcon}
//                 alt="User"
//                 className="profile-icon"
//                 onClick={toggleDropdown}
//               />
//               <div className="user-text">
//                 <span className="user-name">AZEEM KHALID</span>
//                 <span className="user-username">AZEEMSMART1777</span>
//               </div>
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <button className="dropdown-item" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <h1 className="select-games-title">Select Games</h1>
//           <div className="games-grid">
//             {games.map((game, index) => (
//               <div className="game-card" key={index}>
//                 <img src={game.image} alt={game.name} className="game-image" />
//                 <div className="game-info">
//                   <p className="game-price">{game.price}</p>
//                   <h3 className="game-title-selection">{game.name}</h3>
//                   <p className="game-description">{game.description}</p>
//                   <button className="play-button" onClick={() => handlePlayClick(game)}>
//                     Tap to Play
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {isModalOpen && (
//             <PaymentTran selectedGame={selectedGame} onClose={closeModal} />
//           )}
//         </>
//       ) : (
//         <>
//           {selectedGame && selectedGame.name === "Tic Tac Toe" && (
//             <TicTacToeGame navigateToSelection={handleBackToSelection} />
//           )}
//           {selectedGame && selectedGame.name === "Retro Disc Golf" && (
//             <DiscArcadeModeGame navigateToSelection={handleBackToSelection} />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default GameSelectionPage;

//this one is working

// import React, { useState } from "react";
// // eslint-disable-next-line
// import { Link, useNavigate } from "react-router-dom";

// import "./../styles/GameSelectionPage.css";
// import PaymentTran from "./../components/PaymentTran";
// import PlayersQueue from "./../components/PlayersQueue";
// import TicTacToeGame from "./../components/TicTacToeGame";
// import DiscArcadeModeGame from "./../components/DiscArcadeModeGame";
// import AimPointGame from "./../components/AimPointGame";
// import LightsOutWorld from "./../components/LightsOutWorld";
// import GameofAim from "./../components/GameofAim";

// import DiscGolf from "../assets/disc-golf.png";
// import TicTacToe from "../assets/tic-tac-toe.png";
// import LightsOut from "../assets/lights-out.png";
// import RetroGolf from "../assets/retro-golf.png";

// import TrophyIcon from "../assets/trophy.png"; // Trophy icon
// import ProfileIcon from "../assets/profile-icon.png"; // Profile icon

// const API_games_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Game/getAllGames";

// const games = [
//   {
//     name: "AimPoint",
//     description: "Play matches in different stadiums",
//     price: "$10",
//     numericPrice: 10,
//     image: DiscGolf,
//   },
//   {
//     name: "Tic Tac Toe",
//     description: "The ultimate arcade game with retro theme",
//     price: "$10",
//     numericPrice: 10,
//     image: TicTacToe,
//   },
//   {
//     name: "Retro Disc Golf",
//     description: "The ultimate arcade game with retro theme",
//     price: "$10",
//     numericPrice: 10,
//     image: RetroGolf,
//   },
//   {
//     name: "Lights Out Worlds",
//     description: "The ultimate arcade game with retro theme",
//     price: "$20",
//     numericPrice: 20,
//     image: LightsOut,
//   },
//   {
//     name: "Game Of AIM",
//     description: "The ultimate AIM game",
//     price: "$50",
//     numericPrice: 50,
//     image: TicTacToe,
//   },
// ];

// const GameSelectionPage = () => {
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isQueueOpen, setIsQueueOpen] = useState(false);
//   const [hasPaid, setHasPaid] = useState(false); // Tracks if the user has paid
//   const [paidPrice, setPaidPrice] = useState(null); // Tracks the price of the paid game
//   const [isGameStarted, setIsGameStarted] = useState(false); // Tracks if a game has started

//   const handlePlayClick = (game) => {
//     setSelectedGame(game);

//     if (hasPaid && game.numericPrice === paidPrice) {
//       // If already paid for this price, skip payment
//       setIsQueueOpen(true);
//     } else {
//       // If not paid, open payment modal
//       setIsModalOpen(true);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setIsQueueOpen(true);
//     setHasPaid(true); // Set payment as completed
//     setPaidPrice(selectedGame.numericPrice); // Track the price of the paid game
//   };

//   const handleQueueCompletion = () => {
//     setIsQueueOpen(false);
//     setIsGameStarted(true); // Start the selected game
//   };

//   const handleBackToSelection = () => {
//     setSelectedGame(null);
//     setIsGameStarted(false);
//     setIsQueueOpen(false);
//   };

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     console.log("User logged out.");
//     navigate("/signin"); // Redirect to login page
//   };

//   return (
//     <div className="game-selection-container">
//       {isQueueOpen ? ( 
//         // Show queue modal separately (blocking rest of the UI)
//         <PlayersQueue onClose={handleQueueCompletion} />
//       ) : !isGameStarted ? (
//         <>
//           <div className="header">
//             <div className="reward-points">
//               <img src={TrophyIcon} alt="Trophy" className="trophy-icon" />
//               <div className="reward-text">
//                 <span className="reward-title">REWARD POINTS</span>
//                 <span className="reward-value">200PTS</span>
//               </div>
//             </div>
            
//             <div className="game-points-info">
//               <p>EARN 1 POINT PER GAME</p>
//               <p>5 POINTS = 1 FREE GAME</p>
//             </div>
         
//             <div className="logged-in-user">
//               <img
//                 src={ProfileIcon}
//                 alt="User"
//                 className="profile-icon"
//                 onClick={toggleDropdown}
//               />
//               <div className="user-text">
//                 <span className="user-name">AZEEM KHALID</span>
//                 <span className="user-username">AZEEMSMART1777</span>
//               </div>
//               {dropdownOpen && (
//                 <div className="dropdown-menu">
//                   <button className="dropdown-item" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
  
//           <h1 className="select-games-title">Select Games</h1>
//           <div className="games-grid">
//             {games.map((game, index) => (
//               <div className="game-card" key={index}>
//                 <img src={game.image} alt={game.name} className="game-image" />
//                 <div className="game-info">
//                   {!(hasPaid && game.numericPrice === paidPrice) && (
//                     <p className="game-price">{game.price}</p>
//                   )}
//                   <h3 className="game-title-selection">{game.name}</h3>
//                   <p className="game-description">{game.description}</p>
//                   <button
//                     className="play-button"
//                     onClick={() => handlePlayClick(game)}
//                   >
//                     Tap to Play
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
  
//           {isModalOpen && (
//             <PaymentTran selectedGame={selectedGame} onClose={closeModal} />
//           )}
//         </>
//       ) : (
//         <>
//           {selectedGame.name === "Tic Tac Toe" && (
//             <TicTacToeGame navigateToSelection={handleBackToSelection} />
//           )}
//           {selectedGame.name === "Retro Disc Golf" && (
//             <DiscArcadeModeGame navigateToSelection={handleBackToSelection} />
//           )} 
//           {selectedGame.name === "AimPoint" && (
//             <AimPointGame navigateToSelection={handleBackToSelection} />
//           )} 
//           {selectedGame.name === "Lights Out Worlds" && (
//             <LightsOutWorld navigateToSelection={handleBackToSelection} />
//           )} 
//           {selectedGame.name === "Game Of AIM" && (
//             <GameofAim navigateToSelection={handleBackToSelection} />
//           )} 
//         </>
//       )}
//     </div>
//   );
  
// };

// export default GameSelectionPage;


// copy 
// import React, { useState } from "react";
// import "./../styles/GameSelectionPage.css";
// import PaymentTran from "./../components/PaymentTran";
// import PlayersQueue from "./../components/PlayersQueue";
// import TicTacToeGame from "./../components/TicTacToeGame";
// import DiscArcadeModeGame from "./../components/DiscArcadeModeGame";
// import AimPointGame from "./../components/AimPointGame";
// import LightsOutWorld from "./../components/LightsOutWorld";
// import GameofAim from "./../components/GameofAim";

// import DiscGolf from "../assets/disc-golf.png";
// import TicTacToe from "../assets/tic-tac-toe.png";
// import LightsOut from "../assets/lights-out.png";
// import RetroGolf from "../assets/retro-golf.png";

// import TrophyIcon from "../assets/trophy.png"; // Trophy icon
// import ProfileIcon from "../assets/profile-icon.png"; // Profile icon

// const games = [
//   {
//     name: "AimPoint",
//     description: "Play matches in different stadiums",
//     price: "$10",
//     numericPrice: 10,
//     image: DiscGolf,
//   },
//   {
//     name: "Tic Tac Toe",
//     description: "The ultimate arcade game with retro theme",
//     price: "$10",
//     numericPrice: 10,
//     image: TicTacToe,
//   },
//   {
//     name: "Retro Disc Golf",
//     description: "The ultimate arcade game with retro theme",
//     price: "$10",
//     numericPrice: 10,
//     image: RetroGolf,
//   },
//   {
//     name: "Lights Out Worlds",
//     description: "The ultimate arcade game with retro theme",
//     price: "$20",
//     numericPrice: 20,
//     image: LightsOut,
//   },
//   {
//     name: "Game Of AIM",
//     description: "The ultimate AIM game",
//     price: "$50",
//     numericPrice: 50,
//     image: TicTacToe,
//   },
// ];

// const GameSelectionPage = () => {
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isQueueOpen, setIsQueueOpen] = useState(false);
//   const [hasPaid, setHasPaid] = useState(false); // Tracks if the user has paid
//   const [paidPrice, setPaidPrice] = useState(null); // Tracks the price of the paid game
//   const [isGameStarted, setIsGameStarted] = useState(false); // Tracks if a game has started

//   const handlePlayClick = (game) => {
//     setSelectedGame(game);

//     if (hasPaid && game.numericPrice === paidPrice) {
//       // If already paid for this price, skip payment
//       setIsQueueOpen(true);
//     } else {
//       // If not paid, open payment modal
//       setIsModalOpen(true);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setIsQueueOpen(true);
//     setHasPaid(true); // Set payment as completed
//     setPaidPrice(selectedGame.numericPrice); // Track the price of the paid game
//   };

//   const handleQueueCompletion = () => {
//     setIsQueueOpen(false);
//     setIsGameStarted(true); // Start the selected game
//   };

//   const handleBackToSelection = () => {
//     setSelectedGame(null);
//     setIsGameStarted(false);
//     setIsQueueOpen(false);
//   };

//   return (
//     <div className="game-selection-container">
//       {!isGameStarted ? (
//         <>
//           <div className="header">
//             <div className="reward-points">
//               <img src={TrophyIcon} alt="Trophy" className="trophy-icon" />
//               <p>Reward Points: 200pts</p>
//             </div>
//             <div className="logged-in-user">
//               <img src={ProfileIcon} alt="User" className="profile-icon" />
//               <p>Azeem Khalid</p>
//               <span>azeemsmart1777</span>
//             </div>
//           </div>
//           <h1 className="select-games-title">Select Games</h1>
//           <div className="games-grid">
//             {games.map((game, index) => (
//               <div className="game-card" key={index}>
//                 <img src={game.image} alt={game.name} className="game-image" />
//                 <div className="game-info">
//                   {/* Hide the price if it matches the paid price */}
//                   {!(hasPaid && game.numericPrice === paidPrice) && (
//                     <p className="game-price">{game.price}</p>
//                   )}
//                   <h3 className="game-title">{game.name}</h3>
//                   <p className="game-description">{game.description}</p>
//                   <button
//                     className="play-button"
//                     onClick={() => handlePlayClick(game)}
//                   >
//                     Tap to Play
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {isModalOpen && (
//             <PaymentTran selectedGame={selectedGame} onClose={closeModal} />
//           )}

//           {isQueueOpen && (
//             <PlayersQueue onClose={handleQueueCompletion} />
//           )}
//         </>
//       ) : (
//         // Render the selected game component
//         <>
//           {selectedGame.name === "Tic Tac Toe" && (
//             <TicTacToeGame navigateToSelection={handleBackToSelection} />
//           )}


//           {selectedGame.name === "Retro Disc Golf" && (
//             <DiscArcadeModeGame navigateToSelection={handleBackToSelection} />
//           )} 

//           {selectedGame.name === "AimPoint" && (
//             <AimPointGame navigateToSelection={handleBackToSelection} />
//           )} 

//           {selectedGame.name === "Lights Out Worlds" && (
//             <LightsOutWorld navigateToSelection={handleBackToSelection} />
//           )} 

//           {selectedGame.name === "Game Of AIM" && (
//             <GameofAim navigateToSelection={handleBackToSelection} />
//           )} 

//         </>
//       )}
//     </div>
//   );
// };

// export default GameSelectionPage;


