
import React, { useState, useEffect, useCallback } from "react";
import "./DiscArcadeModeGame.css";
import * as signalR from "@microsoft/signalr"; 
import forbiddenCircle from "../assets/forbiddenCircle.png";
import timerpng from "../assets/timer.png";
import purpleDisc from "../assets/purpledisc.png";
import redDisc from "../assets/reddisc.png";
import orangeDisc from "../assets/orangedisc.png";
import blueDisc from "../assets/bluedisc.png";
import yellowDisc from "../assets/yellowdisc.png";
import greenDisc from "../assets/greendisc.png";
import backgroundImage from "../assets/background-image.png";
import pawn from "../assets/pawn.png";
import star from "../assets/star.png";
import gameRemote from "../assets/gameremote.png";

const DiscArcadeModeGame = ({ navigateToSelection }) => {
  const [score, setScore] = useState(0);
  // eslint-disable-next-line
  const [misses, setMisses] = useState(0); 
  const [gameStarted, setGameStarted] = useState(false);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  
  const [timeRemaining, setTimeRemaining] = useState(30); 
  // eslint-disable-next-line
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResults, setGameResults] = useState(null); // Store game results

  const API_send_result = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameStatistics/createGameStatistics";

  // Flags for input modes
  const useManualInput = true; 
  const useApiInput = false; 

  const epcMapping = {
    EPC001: { type: "normal", points: 10, color: purpleDisc },
    EPC002: { type: "normal", points: 10, color: redDisc },
    EPC003: { type: "normal", points: 10, color: orangeDisc },
    EPC004: { type: "normal", points: 10, color: blueDisc },
    EPC005: { type: "normal", points: 10, color: yellowDisc },
    EPC101: { type: "bonus", points: 20, color: greenDisc },
    EPC102: { type: "bonus", points: 20, color: blueDisc },
    EPC103: { type: "bonus", points: 20, color: redDisc },
    EPC104: { type: "bonus", points: 20, color: yellowDisc },
    EPC105: { type: "bonus", points: 20, color: orangeDisc },
  };

  const [remainingDiscs, setRemainingDiscs] = useState([
    { epc: "EPC001", ...epcMapping["EPC001"] },
    { epc: "EPC002", ...epcMapping["EPC002"] },
    { epc: "EPC003", ...epcMapping["EPC003"] },
    { epc: "EPC004", ...epcMapping["EPC004"] },
    { epc: "EPC005", ...epcMapping["EPC005"] },
    { epc: "EPC006", ...epcMapping["EPC001"] },
    { epc: "EPC007", ...epcMapping["EPC002"] },
    { epc: "EPC008", ...epcMapping["EPC003"] },
    { epc: "EPC009", ...epcMapping["EPC004"] },
    { epc: "EPC010", ...epcMapping["EPC005"] },
    { epc: "EPC101", ...epcMapping["EPC101"] },
    { epc: "EPC102", ...epcMapping["EPC102"] },
    { epc: "EPC103", ...epcMapping["EPC103"] },
    { epc: "EPC104", ...epcMapping["EPC104"] },
    { epc: "EPC105", ...epcMapping["EPC105"] },
    { epc: "EPC106", ...epcMapping["EPC101"] },
    { epc: "EPC107", ...epcMapping["EPC102"] },
    { epc: "EPC108", ...epcMapping["EPC103"] },
    { epc: "EPC109", ...epcMapping["EPC104"] },
    { epc: "EPC110", ...epcMapping["EPC105"] },
  ]);

  const initialGrid = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

    //hskdjbskbskdbkvc
  // eslint-disable-next-line  
  const [grid, setGrid] = useState(initialGrid);

  const applyGlowEffect = (row, col) => {
    const cell = document.querySelector(
      `.retro-board-row:nth-child(${row + 1}) .retro-board-cell:nth-child(${col + 1})`
    );

    if (cell) {
      cell.style.backgroundColor = "white";
      setTimeout(() => {
        cell.style.backgroundColor = "";
      }, 300);
    }
  };

  const handleApiThrow = useCallback((epc, row, col) => {
    if (!gameStarted) return;
  
    const disc = remainingDiscs.find((d) => d.epc === epc);
    if (!disc) return; 
  
    applyGlowEffect(row, col);
  
    setScore((prev) => prev + disc.points);
    setRemainingDiscs((prev) => prev.filter((d) => d.epc !== epc));
  }, [gameStarted, remainingDiscs]);
  

  const handleManualThrow = useCallback((row, col) => {
    if (!useManualInput || !gameStarted || grid[row][col] !== null) return;
  
    const disc = remainingDiscs[0];
    applyGlowEffect(row, col);
  
    setScore((prev) => prev + disc.points);
    setRemainingDiscs((prev) => prev.slice(1));
  }, [useManualInput, gameStarted, grid, remainingDiscs]);
  

  const handleInputThrow = useCallback((epc, row, col) => {
    if (useApiInput) {
      handleApiThrow(epc, row, col);
    } else if (useManualInput) {
      handleManualThrow(row, col);
    } else {
      console.log("No valid input mode is active.");
    }
  }, [useApiInput, useManualInput, handleApiThrow, handleManualThrow]);

  useEffect(() => {
    if (timeRemaining === 0 || remainingDiscs.length === 0) {
      setGameStarted(false);
      setGameEnded(true);

      const results = {
        score: score,
        misses: misses,
        timeElapsed: 30 - timeRemaining, // Time spent playing
        status: remainingDiscs.length === 0 ? "All Discs Used!" : "Time Over!",
    };

    setGameResults(results); // Store results
    console.log("Game Results:", results);
    // setTimeout(() => {
    //   sendResultsToAPI(results);
    // }, 500);

    }
  }, [timeRemaining, remainingDiscs.length, misses, score]);
  
  const sendResultsToAPI = async (results) => {
    try {
        const response = await fetch(API_send_result, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(results),
        });

        if (!response.ok) {
            throw new Error("Failed to send game results.");
        }

        console.log("Game results sent successfully.");
    } catch (error) {
        console.error("Error sending game results:", error);
    }
  };

  useEffect(() => {
    console.log("Timer effect triggered");
  
    if (!gameStarted) return;
  
    let timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer); // ✅ Stop timer when reaching zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  
    return () => {
      console.log("Timer cleared");
      clearInterval(timer);
    };
  }, [gameStarted]); // ✅ Only depend on `gameStarted`
  
  useEffect(() => {
    if (!useApiInput || !gameStarted) return; // ✅ Ensure game is started before connecting
  
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://arcadegamebackendapi20241227164011.azurewebsites.net/gameHub", {
        transport: signalR.HttpTransportType.WebSockets |
                  signalR.HttpTransportType.ServerSentEvents |
                  signalR.HttpTransportType.LongPolling,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  
    connection
      .start()
      .then(() => {
        console.log("SignalR connection established using fallback transports");
        connection.on("ReceiveMove", (epc, row, col) => {
          console.log(`Move received: EPC=${epc}, Row=${row}, Col=${col}`);
          handleInputThrow(epc, row, col);
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));
  
    return () => {
      connection.stop();
    };
  }, [useApiInput, gameStarted, handleInputThrow]); // ✅ Only start if the game is running
  

  const renderResultScreen = () => (
    <div className="result-screen">
      <h1>Game Over</h1>
      <p>Final Score: {gameResults?.score}</p>
      <p>Misses: {gameResults?.misses}</p>
      <p>Time Spent: {gameResults?.timeElapsed} sec</p>
      <p>Status: {gameResults?.status}</p>
      {/* <button className="back-button" onClick={navigateToSelection}>Back to Selection</button> */}
    </div>
  );
  

  return (
    <div className="arcade-game-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
       {gameEnded ? renderResultScreen() : (
      <>
      <div className="game-name">
        <h1>Retro Disc Golf</h1>
      </div>
      <img src={pawn} alt="Pawn" className="pawn-icon" />
      <img src={star} alt="Star" className="star-icon" />
      <div className="retro-top-section">
        <div className="timer-display">
          <span>Time Remaining: </span><img src={timerpng} alt="Timer Icon" /> <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
        </div>
        <div className="retro-score-display">
        <h3>Score: {score.toString().padStart(3, "0")}</h3>
        </div>
        <div className="misses-display">
          <span>Misses: {misses}</span>
          <img src={forbiddenCircle} alt="Misses Icon" />
        </div>
      </div>

      {!gameStarted && (
        <>
          <div className="retro-game-board">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="retro-board-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`retro-board-cell ${cell?.type === "B" ? "bonus-cell" : cell?.type === "N" ? "normal-cell" : ""}`}
                    onClick={() => handleManualThrow(rowIndex, colIndex)}
                    style={{ backgroundImage: cell?.color ? `url(${cell.color})` : "none" }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <button
            className="start-button"
            onClick={() => {
              setGameStarted(true);
              setStartButtonDisabled(true);
            }}
            disabled={startButtonDisabled}
          >
            Start Game
          </button>
        </>
      )}

      {gameStarted && (
        <div className="retro-game-board">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="retro-board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`retro-board-cell ${cell?.type === "B" ? "bonus-cell" : cell?.type === "N" ? "normal-cell" : ""}`}
                  onClick={() => handleManualThrow(rowIndex, colIndex)}
                  style={{ backgroundImage: cell?.color ? `url(${cell.color})` : "none" }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      )}
        
      <div className="retro-disc-stack">
          <div className="normal-disc-stack">
            <h3>Normal Discs: {remainingDiscs.filter((disc) => disc.type === "normal").length}</h3>
            <div className="stack-container">
              {remainingDiscs.filter((disc) => disc.type === "normal").map((disc, index) => (
                <img
                  key={`normal-disc-${index}`}
                  src={disc.color}
                  alt="Normal Disc"
                  className="disc-icon"
                  style={{
                    left: `${index * 5}px`,
                    zIndex: remainingDiscs.length - index,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="bonus-disc-stack">
            <h3>Bonus Discs: {remainingDiscs.filter((disc) => disc.type === "bonus").length}</h3>
            <div className="stack-container">
              {remainingDiscs.filter((disc) => disc.type === "bonus").map((disc, index) => (
                <img
                  key={`bonus-disc-${index}`}
                  src={disc.color}
                  alt="Bonus Disc"
                  className="disc-icon"
                  style={{
                    left: `${index * 5}px`,
                    zIndex: remainingDiscs.length - index,
                  }}
                />
              ))}
            </div>
          </div>
      </div>


      {/* <button className="back-button" onClick={navigateToSelection}>
        Back to Selection
      </button> */}
      <img src={gameRemote} alt="Game Remote" className="game-remote" />
      </>
    )}
    </div>
  );
};

export default DiscArcadeModeGame;


// import React, { useState, useEffect, useCallback } from "react";
// import "./DiscArcadeModeGame.css";
// import * as signalR from "@microsoft/signalr"; 
// import forbiddenCircle from "../assets/forbiddenCircle.png";
// import timerpng from "../assets/timer.png";
// import purpleDisc from "../assets/purpledisc.png";
// import redDisc from "../assets/reddisc.png";
// import orangeDisc from "../assets/orangedisc.png";
// import blueDisc from "../assets/bluedisc.png";
// import yellowDisc from "../assets/yellowdisc.png";
// import greenDisc from "../assets/greendisc.png";
// import backgroundImage from "../assets/background-image.png";
// import pawn from "../assets/pawn.png";
// import star from "../assets/star.png";
// import gameRemote from "../assets/gameremote.png";

// const DiscArcadeModeGame = ({ navigateToSelection }) => {
//   const [score, setScore] = useState(0);
//   // eslint-disable-next-line
//   const [misses, setMisses] = useState(0); 
//   const [gameStarted, setGameStarted] = useState(false);
//   const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  
//   const [timeRemaining, setTimeRemaining] = useState(30); 
//   // eslint-disable-next-line
//   const [gameEnded, setGameEnded] = useState(false);
//   const [gameResults, setGameResults] = useState(null); // Store game results

//   const API_send_result = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameStatistics/createGameStatistics";

//   // Flags for input modes
//   const useManualInput = true; 
//   const useApiInput = false; 

//   const epcMapping = {
//     EPC001: { type: "normal", points: 10, color: purpleDisc },
//     EPC002: { type: "normal", points: 10, color: redDisc },
//     EPC003: { type: "normal", points: 10, color: orangeDisc },
//     EPC004: { type: "normal", points: 10, color: blueDisc },
//     EPC005: { type: "normal", points: 10, color: yellowDisc },
//     EPC101: { type: "bonus", points: 20, color: greenDisc },
//     EPC102: { type: "bonus", points: 20, color: blueDisc },
//     EPC103: { type: "bonus", points: 20, color: redDisc },
//     EPC104: { type: "bonus", points: 20, color: yellowDisc },
//     EPC105: { type: "bonus", points: 20, color: orangeDisc },
//   };

//   const [remainingDiscs, setRemainingDiscs] = useState([
//     { epc: "EPC001", ...epcMapping["EPC001"] },
//     { epc: "EPC002", ...epcMapping["EPC002"] },
//     { epc: "EPC003", ...epcMapping["EPC003"] },
//     { epc: "EPC004", ...epcMapping["EPC004"] },
//     { epc: "EPC005", ...epcMapping["EPC005"] },
//     { epc: "EPC006", ...epcMapping["EPC001"] },
//     { epc: "EPC007", ...epcMapping["EPC002"] },
//     { epc: "EPC008", ...epcMapping["EPC003"] },
//     { epc: "EPC009", ...epcMapping["EPC004"] },
//     { epc: "EPC010", ...epcMapping["EPC005"] },
//     { epc: "EPC101", ...epcMapping["EPC101"] },
//     { epc: "EPC102", ...epcMapping["EPC102"] },
//     { epc: "EPC103", ...epcMapping["EPC103"] },
//     { epc: "EPC104", ...epcMapping["EPC104"] },
//     { epc: "EPC105", ...epcMapping["EPC105"] },
//     { epc: "EPC106", ...epcMapping["EPC101"] },
//     { epc: "EPC107", ...epcMapping["EPC102"] },
//     { epc: "EPC108", ...epcMapping["EPC103"] },
//     { epc: "EPC109", ...epcMapping["EPC104"] },
//     { epc: "EPC110", ...epcMapping["EPC105"] },
//   ]);

//   const initialGrid = Array(3)
//     .fill(null)
//     .map(() => Array(3).fill(null));

//     //hskdjbskbskdbkvc
//   // eslint-disable-next-line  
//   const [grid, setGrid] = useState(initialGrid);

//   const applyGlowEffect = (row, col) => {
//     const cell = document.querySelector(
//       `.retro-board-row:nth-child(${row + 1}) .retro-board-cell:nth-child(${col + 1})`
//     );

//     if (cell) {
//       cell.style.backgroundColor = "white";
//       setTimeout(() => {
//         cell.style.backgroundColor = "";
//       }, 300);
//     }
//   };

//   const handleApiThrow = useCallback((epc, row, col) => {
//     if (!gameStarted) return;
  
//     const disc = remainingDiscs.find((d) => d.epc === epc);
//     if (!disc) return; 
  
//     applyGlowEffect(row, col);
  
//     setScore((prev) => prev + disc.points);
//     setRemainingDiscs((prev) => prev.filter((d) => d.epc !== epc));
//   }, [gameStarted, remainingDiscs]);
  

//   const handleManualThrow = useCallback((row, col) => {
//     if (!useManualInput || !gameStarted || grid[row][col] !== null) return;
  
//     const disc = remainingDiscs[0];
//     applyGlowEffect(row, col);
  
//     setScore((prev) => prev + disc.points);
//     setRemainingDiscs((prev) => prev.slice(1));
//   }, [useManualInput, gameStarted, grid, remainingDiscs]);
  

//   const handleInputThrow = useCallback((epc, row, col) => {
//     if (useApiInput) {
//       handleApiThrow(epc, row, col);
//     } else if (useManualInput) {
//       handleManualThrow(row, col);
//     } else {
//       console.log("No valid input mode is active.");
//     }
//   }, [useApiInput, useManualInput, handleApiThrow, handleManualThrow]);

//   useEffect(() => {
//     if (timeRemaining === 0 || remainingDiscs.length === 0) {
//       setGameStarted(false);
//       setGameEnded(true);

//       const results = {
//         score: score,
//         misses: misses,
//         timeElapsed: 30 - timeRemaining, // Time spent playing
//         status: remainingDiscs.length === 0 ? "All Discs Used!" : "Time Over!",
//     };

//     setGameResults(results); // Store results
//     console.log("Game Results:", results);
//     //sendResultsToAPI(results); // Send results to API

//     }
//   }, [timeRemaining, remainingDiscs.length, misses, score]);
  
//   const sendResultsToAPI = async (results) => {
//     try {
//         const response = await fetch(API_send_result, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(results),
//         });

//         if (!response.ok) {
//             throw new Error("Failed to send game results.");
//         }

//         console.log("Game results sent successfully.");
//     } catch (error) {
//         console.error("Error sending game results:", error);
//     }
//   };


//   useEffect(() => {
//     console.log("Timer effect triggered");
//     let timer;
//     if (gameStarted && timeRemaining > 0) {
//       timer = setInterval(() => {
//         console.log("Timer tick: ", timeRemaining);
//         setTimeRemaining((prev) => prev - 1);
//       }, 1000);
//     }
  
//     return () => {
//       console.log("Timer cleared");
//       clearInterval(timer);
//     };
//   }, [gameStarted, timeRemaining]);
  
//   useEffect(() => {
//     if (!useApiInput || gameStarted) return;

//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://arcadegamebackendapi20241227164011.azurewebsites.net/gameHub", {
//         transport: signalR.HttpTransportType.WebSockets |
//                    signalR.HttpTransportType.ServerSentEvents |
//                    signalR.HttpTransportType.LongPolling, // Enable fallback transports
//       })
//       .configureLogging(signalR.LogLevel.Information) // Optional: Logging for debugging
//       .withAutomaticReconnect()
//       .build();

//     connection
//       .start()
//       .then(() => {
//         console.log("SignalR connection established using fallback transports");
//         connection.on("ReceiveMove", (epc, row, col) => {
//           console.log(`Move received: EPC=${epc}, Row=${row}, Col=${col}`);
//           handleInputThrow(epc, row, col);
//         });
//       })
//       .catch((err) => console.error("SignalR connection error:", err));

//     return () => {
//       connection.stop(); 
//     };
//   }, [useApiInput, gameStarted, handleInputThrow]);

//   const renderResultScreen = () => (
//     <div className="result-screen">
//       <h1>Game Over</h1>
//       <p>Final Score: {gameResults?.score}</p>
//       <p>Misses: {gameResults?.misses}</p>
//       <p>Time Spent: {gameResults?.timeElapsed} sec</p>
//       <p>Status: {gameResults?.status}</p>
//       {/* <button className="back-button" onClick={navigateToSelection}>Back to Selection</button> */}
//     </div>
//   );
  

//   return (
//     <div className="arcade-game-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
//        {gameEnded ? renderResultScreen() : (
//       <>
//       <div className="game-name">
//         <h1>Retro Disc Golf</h1>
//       </div>
//       <img src={pawn} alt="Pawn" className="pawn-icon" />
//       <img src={star} alt="Star" className="star-icon" />
//       <div className="retro-top-section">
//         <div className="timer-display">
//           <span>Time Remaining: </span><img src={timerpng} alt="Timer Icon" /> <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
//         </div>
//         <div className="retro-score-display">
//         <h3>Score: {score.toString().padStart(3, "0")}</h3>
//         </div>
//         <div className="misses-display">
//           <span>Misses: {misses}</span>
//           <img src={forbiddenCircle} alt="Misses Icon" />
//         </div>
//       </div>

//       {!gameStarted && (
//         <>
//           <div className="retro-game-board">
//             {grid.map((row, rowIndex) => (
//               <div key={rowIndex} className="retro-board-row">
//                 {row.map((cell, colIndex) => (
//                   <div
//                     key={colIndex}
//                     className={`retro-board-cell ${cell?.type === "B" ? "bonus-cell" : cell?.type === "N" ? "normal-cell" : ""}`}
//                     onClick={() => handleManualThrow(rowIndex, colIndex)}
//                     style={{ backgroundImage: cell?.color ? `url(${cell.color})` : "none" }}
//                   ></div>
//                 ))}
//               </div>
//             ))}
//           </div>
//           <button
//             className="start-button"
//             onClick={() => {
//               setGameStarted(true);
//               setStartButtonDisabled(true);
//             }}
//             disabled={startButtonDisabled}
//           >
//             Start Game
//           </button>
//         </>
//       )}

//       {gameStarted && (
//         <div className="retro-game-board">
//           {grid.map((row, rowIndex) => (
//             <div key={rowIndex} className="retro-board-row">
//               {row.map((cell, colIndex) => (
//                 <div
//                   key={colIndex}
//                   className={`retro-board-cell ${cell?.type === "B" ? "bonus-cell" : cell?.type === "N" ? "normal-cell" : ""}`}
//                   onClick={() => handleManualThrow(rowIndex, colIndex)}
//                   style={{ backgroundImage: cell?.color ? `url(${cell.color})` : "none" }}
//                 ></div>
//               ))}
//             </div>
//           ))}
//         </div>
//       )}
        
//       <div className="retro-disc-stack">
//           <div className="normal-disc-stack">
//             <h3>Normal Discs: {remainingDiscs.filter((disc) => disc.type === "normal").length}</h3>
//             <div className="stack-container">
//               {remainingDiscs.filter((disc) => disc.type === "normal").map((disc, index) => (
//                 <img
//                   key={`normal-disc-${index}`}
//                   src={disc.color}
//                   alt="Normal Disc"
//                   className="disc-icon"
//                   style={{
//                     left: `${index * 5}px`,
//                     zIndex: remainingDiscs.length - index,
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="bonus-disc-stack">
//             <h3>Bonus Discs: {remainingDiscs.filter((disc) => disc.type === "bonus").length}</h3>
//             <div className="stack-container">
//               {remainingDiscs.filter((disc) => disc.type === "bonus").map((disc, index) => (
//                 <img
//                   key={`bonus-disc-${index}`}
//                   src={disc.color}
//                   alt="Bonus Disc"
//                   className="disc-icon"
//                   style={{
//                     left: `${index * 5}px`,
//                     zIndex: remainingDiscs.length - index,
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//       </div>


//       {/* <button className="back-button" onClick={navigateToSelection}>
//         Back to Selection
//       </button> */}
//       <img src={gameRemote} alt="Game Remote" className="game-remote" />
//       </>
//     )}
//     </div>
//   );
// };

// export default DiscArcadeModeGame;