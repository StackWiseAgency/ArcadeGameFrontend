import React, { useState } from "react";
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

import TrophyIcon from "../assets/trophy.png"; // Trophy icon
import ProfileIcon from "../assets/profile-icon.png"; // Profile icon

const games = [
  {
    name: "AimPoint",
    description: "Play matches in different stadiums",
    price: "$10",
    numericPrice: 10,
    image: DiscGolf,
  },
  {
    name: "Tic Tac Toe",
    description: "The ultimate arcade game with retro theme",
    price: "$10",
    numericPrice: 10,
    image: TicTacToe,
  },
  {
    name: "Retro Disc Golf",
    description: "The ultimate arcade game with retro theme",
    price: "$10",
    numericPrice: 10,
    image: RetroGolf,
  },
  {
    name: "Lights Out Worlds",
    description: "The ultimate arcade game with retro theme",
    price: "$20",
    numericPrice: 20,
    image: LightsOut,
  },
  {
    name: "Game Of AIM",
    description: "The ultimate AIM game",
    price: "$50",
    numericPrice: 50,
    image: TicTacToe,
  },
];

const GameSelectionPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [hasPaid, setHasPaid] = useState(false); // Tracks if the user has paid
  const [paidPrice, setPaidPrice] = useState(null); // Tracks the price of the paid game
  const [isGameStarted, setIsGameStarted] = useState(false); // Tracks if a game has started

  const handlePlayClick = (game) => {
    setSelectedGame(game);

    if (hasPaid && game.numericPrice === paidPrice) {
      // If already paid for this price, skip payment
      setIsQueueOpen(true);
    } else {
      // If not paid, open payment modal
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQueueOpen(true);
    setHasPaid(true); // Set payment as completed
    setPaidPrice(selectedGame.numericPrice); // Track the price of the paid game
  };

  const handleQueueCompletion = () => {
    setIsQueueOpen(false);
    setIsGameStarted(true); // Start the selected game
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
    setIsGameStarted(false);
    setIsQueueOpen(false);
  };

  return (
    <div className="game-selection-container">
      {!isGameStarted ? (
        <>
          <div className="header">
            <div className="reward-points">
              <img src={TrophyIcon} alt="Trophy" className="trophy-icon" />
              <p>Reward Points: 200pts</p>
            </div>
            <div className="logged-in-user">
              <img src={ProfileIcon} alt="User" className="profile-icon" />
              <p>Azeem Khalid</p>
              <span>azeemsmart1777</span>
            </div>
          </div>
          <h1 className="select-games-title">Select Games</h1>
          <div className="games-grid">
            {games.map((game, index) => (
              <div className="game-card" key={index}>
                <img src={game.image} alt={game.name} className="game-image" />
                <div className="game-info">
                  {/* Hide the price if it matches the paid price */}
                  {!(hasPaid && game.numericPrice === paidPrice) && (
                    <p className="game-price">{game.price}</p>
                  )}
                  <h3 className="game-title">{game.name}</h3>
                  <p className="game-description">{game.description}</p>
                  <button
                    className="play-button"
                    onClick={() => handlePlayClick(game)}
                  >
                    Tap to Play
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <PaymentTran selectedGame={selectedGame} onClose={closeModal} />
          )}

          {isQueueOpen && (
            <PlayersQueue onClose={handleQueueCompletion} />
          )}
        </>
      ) : (
        // Render the selected game component
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


