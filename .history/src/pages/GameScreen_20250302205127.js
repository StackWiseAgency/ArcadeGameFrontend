

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import all game components
import TicTacToeGame from "../components/TicTacToeGame";
import DiscArcadeModeGame from "../components/DiscArcadeModeGame";
import AimPointGame from "../components/AimPointGame";
import LightsOutWorld from "../components/LightsOutWorld";
import GameofAim from "../components/GameofAim";

const GameScreen = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // ✅ Retrieve game details from `localStorage`
  //   const storedGame = localStorage.getItem("selectedGame");
  //   if (storedGame) {
  //     setSelectedGame(JSON.parse(storedGame).name);
  //   }

  //   // ✅ Listen for changes in localStorage (to dynamically load new games)
  //   const handleStorageChange = () => {
  //     const updatedGame = localStorage.getItem("selectedGame");
  //     if (updatedGame) {
  //       setSelectedGame(JSON.parse(updatedGame).name);
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  useEffect(() => {
    // ✅ Load game details from `localStorage`

    // localStorage.setItem("selectedGame", JSON.stringify({ name: gameName }));
    console.log(localStorage.getItem("selectedGame")); // ✅ Check if it's saved
    

    const storedGame = localStorage.getItem("selectedGame");
    console.log("🎮 Checking selectedGame in GameScreen:", storedGame);
    if (storedGame) {
      setSelectedGame(JSON.parse(storedGame).name);
    }

    // ✅ Listen for `localStorage` updates (for dynamic game switching)
    const handleStorageChange = (event) => {
      if (event.key === "gameUpdate") {
        const updatedGame = localStorage.getItem("selectedGame");
        if (updatedGame) {
          setSelectedGame(JSON.parse(updatedGame).name);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  // ✅ Map game names to their respective components
  const gameComponents = {
    "tic-tac-clash": <TicTacToeGame />,
    "disc-arcade": <DiscArcadeModeGame />,
    "aimpoint": <AimPointGame />,
    "lights-out": <LightsOutWorld />,
    "game-of-aim": <GameofAim />,
  };

  return (
    <div className="game-container">
      {selectedGame ? gameComponents[selectedGame] || <p>Game not found.</p> : <p>No game selected.</p>}
    </div>
  );
};

export default GameScreen;


// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";

// // Import all game components
// import TicTacToeGame from "../components/TicTacToeGame";
// import DiscArcadeModeGame from "../components/DiscArcadeModeGame";
// import AimPointGame from "../components/AimPointGame";
// import LightsOutWorld from "../components/LightsOutWorld";
// import GameofAim from "../components/GameofAim";

// const GameScreen = () => {
//   const { gameName } = useParams(); // Get the selected game from the URL
//   const navigate = useNavigate();

//   // Map game names to corresponding components
//   const gameComponents = {
//     "tic-tac-clash": <TicTacToeGame />,
//     "disc-arcade": <DiscArcadeModeGame />,
//     "aimpoint": <AimPointGame />,
//     "lights-out": <LightsOutWorld />,
//     "game-of-aim": <GameofAim />,
//   };

//   return (
//     <div className="game-container">
//       <h2>Game Screen</h2>
      
//       {/* Render the game component dynamically */}
//       {gameComponents[gameName] || <p>Game not found.</p>}

//       <button onClick={() => navigate("/games")} className="back-button">
//         Back to Games
//       </button>
//     </div>
//   );
// };

// export default GameScreen;


// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
// //  socket.io-client
// const GameScreen = () => {
//     const navigate = useNavigate()
//     useEffect(() => {
//         // timer
// //addEventListener
// // navigate(hame)
//     }, [])
//   return (
//     <><div>GameScreen</div>
//     <iframe src='http://localhost:3000/game-sceen'width="800px" height='600px' />
//     </>
    
//   )
// }

// export default GameScreen