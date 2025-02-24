

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

  useEffect(() => {
    // ✅ Retrieve game details from `localStorage`
    const storedGame = localStorage.getItem("selectedGame");
    if (storedGame) {
      setSelectedGame(JSON.parse(storedGame).name);
    }
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
      <h2>Game Screen</h2>

      {/* ✅ Render the correct game component */}
      {selectedGame ? gameComponents[selectedGame] || <p>Game not found.</p> : <p>No game selected.</p>}

      <button onClick={() => navigate("/games")} className="back-button">
        Back to Games
      </button>
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