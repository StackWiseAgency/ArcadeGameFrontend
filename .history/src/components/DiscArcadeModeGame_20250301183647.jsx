
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
import axios from "axios";

const DiscArcadeModeGame = ({ navigateToSelection }) => {
  const [score, setScore] = useState(0);
  // eslint-disable-next-line
  const [misses, setMisses] = useState(0); 
  const [gameStarted, setGameStarted] = useState(true);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  
  const [timeRemaining, setTimeRemaining] = useState(120); 
  // eslint-disable-next-line
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResults, setGameResults] = useState(null); // Store game results
  const API_RECEIVE_MOVE = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Webhook/GetLatestRfidData";
  
  const API_send_result = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameStatistics/createGameStatistics";

  // Flags for input modes
  const useManualInput = false; 
  const useApiInput = true; 

  const epcMapping = {

    E28011700000021C035AE34C: { type: "normal", points: 10, color: purpleDisc },
    E28011700000021C035AE347: { type: "normal", points: 10, color: redDisc },
    E28011700000021C035AE241: { type: "normal", points: 10, color: orangeDisc },
    E28011700000021C035AE246: { type: "normal", points: 10, color: blueDisc },
    E28011700000021C035AEB4A: { type: "normal", points: 10, color: redDisc },
    E28011700000021C035AE24B: { type: "normal", points: 10, color: greenDisc },
    E28011700000021C035AEB40: { type: "normal", points: 10, color: purpleDisc },
    E28011700000021C035AEB45: { type: "normal", points: 10, color: redDisc },
    E28011700000021C035AEB4F: { type: "normal", points: 10, color: orangeDisc },
    E28011700000021C035AEA49: { type: "normal", points: 10, color: blueDisc },
    E28011700000021C035AEA44: { type: "normal", points: 10, color: redDisc },
    E28011700000021C035AEA4E: { type: "normal", points: 10, color: greenDisc },

    // New Bonus Frisbees
    E28011700000021C035AFA39: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AFA34: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AFB3F: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AFB3A: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AFB35: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AFB30: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AF23B: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AF236: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AF231: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AF343: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AF33C: { type: "bonus", points: 20, color: yellowDisc },
    E28011700000021C035AF337: { type: "bonus", points: 20, color: yellowDisc },
  };

  const [remainingDiscs, setRemainingDiscs] = useState([
    // New normal Frisbees
    { epc: "E28011700000021C035AE34C", ...epcMapping["E28011700000021C035AE34C"] },
    { epc: "E28011700000021C035AE347", ...epcMapping["E28011700000021C035AE347"] },
    { epc: "E28011700000021C035AE241", ...epcMapping["E28011700000021C035AE241"] },
    { epc: "E28011700000021C035AE246", ...epcMapping["E28011700000021C035AE246"] },
    { epc: "E28011700000021C035AEB4A", ...epcMapping["E28011700000021C035AEB4A"] },
    { epc: "E28011700000021C035AE24B", ...epcMapping["E28011700000021C035AE24B"] },
    { epc: "E28011700000021C035AEB40", ...epcMapping["E28011700000021C035AEB40"] },
    { epc: "E28011700000021C035AEB45", ...epcMapping["E28011700000021C035AEB45"] },
    { epc: "E28011700000021C035AEB4F", ...epcMapping["E28011700000021C035AEB4F"] },
    { epc: "E28011700000021C035AEA49", ...epcMapping["E28011700000021C035AEA49"] },
    { epc: "E28011700000021C035AEA44", ...epcMapping["E28011700000021C035AEA44"] },
    { epc: "E28011700000021C035AEA4E", ...epcMapping["E28011700000021C035AEA4E"] },

    // New bonus Frisbees
    { epc: "E28011700000021C035AFA39", ...epcMapping["E28011700000021C035AFA39"] },
    { epc: "E28011700000021C035AFA34", ...epcMapping["E28011700000021C035AFA34"] },
    { epc: "E28011700000021C035AFB3F", ...epcMapping["E28011700000021C035AFB3F"] },
    { epc: "E28011700000021C035AFB3A", ...epcMapping["E28011700000021C035AFB3A"] },
    { epc: "E28011700000021C035AFB35", ...epcMapping["E28011700000021C035AFB35"] },
    { epc: "E28011700000021C035AFB30", ...epcMapping["E28011700000021C035AFB30"] },
    { epc: "E28011700000021C035AF23B", ...epcMapping["E28011700000021C035AF23B"] },
    { epc: "E28011700000021C035AF236", ...epcMapping["E28011700000021C035AF236"] },
    { epc: "E28011700000021C035AF231", ...epcMapping["E28011700000021C035AF231"] },
    { epc: "E28011700000021C035AF343", ...epcMapping["E28011700000021C035AF343"] },
    { epc: "E28011700000021C035AF33C", ...epcMapping["E28011700000021C035AF33C"] },
    { epc: "E28011700000021C035AF337", ...epcMapping["E28011700000021C035AF337"] },

  ]);

  const initialGrid = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

  // const initialGrid = [
  //   [7, 8, 9],  // Custom order for row 0
  //   [4, 5, 6],  // Custom order for row 1
  //   [1, 2, 3],  // Custom order for row 2
  // ];

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
      }, 500);
    }
  };

  const handleApiThrow = useCallback((epc, row, col) => {
    if (!gameStarted) return; // ✅ Prevent handling throws if the game isn't running
  
    // const disc = remainingDiscs.find((d) => d.epc === epc);
    const validDiscs = remainingDiscs.slice(0, 20); // Only the first 20 discs are valid

  const disc = validDiscs.find((d) => d.epc === epc);
    
    if (!disc) {
      console.warn(`🚨 Warning: Received invalid EPC - ${epc}`);
      return; 
    }
  
    applyGlowEffect(row, col);
  
    setScore((prev) => prev + disc.points);
  
    setRemainingDiscs((prevDiscs) =>
      prevDiscs.filter((d) => d.epc !== epc) // ✅ Prevents stale state issues
    );
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
        timeElapsed: 120 - timeRemaining, // Time spent playing
        status: remainingDiscs.length === 0 ? "All Discs Used!" : "Time Over!",
    };

    setGameResults(results); // Store results
  //  console.log("Game Results:", results);
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

      //  console.log("Game results sent successfully.");
    } catch (error) {
        console.error("Error sending game results:", error);
    }
  };

  useEffect(() => {
 //   console.log("Timer effect triggered");
  
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
     // console.log("Timer cleared");
      clearInterval(timer);
    };
  }, [gameStarted]); // ✅ Only depend on `gameStarted`
  
  // useEffect(() => {
  //   if (!useApiInput || !gameStarted) return; // Prevent unnecessary SSE connection if useApiInput is false or game has not started
  
  //   // Set up SSE connection to receive data from the API
  //   const eventSource = new EventSource(API_RECEIVE_MOVE); // Use your API URL for SSE
  
  //   // Handle when the connection is successfully opened
  //   eventSource.onopen = () => {
  //     console.log("📡 SSE connection established");
  //   };
  
  //   // Handle incoming SSE messages
  //   eventSource.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data); // Parse the incoming data
  
  //       if (data.tagReads && data.tagReads.length > 0) {
  //         const { epctag, antennaPort, firstSeenTimestamp, isHeartBeat } = data.tagReads[0]; // Process only the first entry in tagReads
  //         console.log(`📡 Data Received: EPC=${epctag}, Antenna Port=${antennaPort}, First Seen Timestamp=${firstSeenTimestamp}, Heartbeat=${isHeartBeat}`);
  
  //         // Convert antennaPort to row and column for a 3x3 grid
  //         const row = Math.floor((antennaPort - 1) / 3);
  //         const col = (antennaPort - 1) % 3;
  
  //         console.log(`🎯 Mapped: Antenna Port=${antennaPort} -> Row=${row}, Column=${col}`);
  
  //         // Call the handleInputThrow function with the mapped row and column
  //         handleInputThrow(epctag, row, col); // Pass the move data (epctag, row, col)
  //       } else {
  //         console.warn("⚠️ SSE response missing `tagReads` data.");
  //       }
  //     } catch (error) {
  //       console.error("🚨 Error processing SSE message:", error);
  //     }
  //   };
  
  //   // Handle SSE errors
  //   eventSource.onerror = (error) => {
  //     console.error("⚠️ SSE connection error:", error);
  //   };
  
  //   // Cleanup the SSE connection when the component unmounts
  //   return () => {
  //     eventSource.close(); // Close the SSE connection
  //     console.log("📡 SSE connection closed");
  //   };
  // }, [useApiInput, gameStarted, handleInputThrow]);  
  


  // useEffect(() => {
  //   if (!useApiInput || !gameStarted) return; // ✅ Prevent unnecessary API calls
  
  //   const fetchGameMoves = async () => {
  //     try {
  //       const response = await axios.get(API_RECEIVE_MOVE, {
  //         headers: { "Content-Type": "application/json" },
  //       });
  
  //       if (response.status === 200 && response.data.tagReads) {
  //         console.log("📡 Received Game Moves:", response.data.tagReads); // ✅ Debugging log
  
  //         // Process the received data
  //         response.data.tagReads.forEach(({ epctag, antennaPort, timestamp }) => {
  //           if (epctag && antennaPort) {
  //             // Map antennaPort (1-9) to row and column for a 3x3 grid
  //             const row = Math.floor((antennaPort - 1) / 3); // Calculate row based on antennaPort
  //             const col = (antennaPort - 1) % 3; // Calculate column based on antennaPort
  
  //             console.log(`🎯 Move Processed: EPC=${epctag}, Row=${row}, Col=${col}, Antenna=${antennaPort}, Time=${timestamp}`);
              
  //             // Pass the calculated row and column to handleInputThrow
  //             handleInputThrow(epctag, row, col);
  //           }
  //         });
  //       } else {
  //         console.warn("⚠️ API response missing `tagReads` data.");
  //       }
  //     } catch (error) {
  //       console.error("🚨 Error fetching game moves:", error);
  //     }
  //   };
  
  //   const intervalId = setInterval(fetchGameMoves, 2000); // ✅ Polling every 2 seconds
  
  //   return () => {
  //     clearInterval(intervalId); // ✅ Cleanup polling when component unmounts
  //     console.log("🔄 Polling stopped.");
  //   };
  // }, [useApiInput, gameStarted, handleInputThrow]);

  useEffect(() => {
    if (!useApiInput || !gameStarted || gameEnded) return; // ✅ Prevent unnecessary API calls
  
    const fetchGameMoves = async () => {
      try {
        const response = await axios.get(API_RECEIVE_MOVE, {
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.status === 200 && response.data.dataModel) {
         
            response.data.dataModel.forEach((dataItem) => {
             
              if (dataItem.tags && Array.isArray(dataItem.tags)) {
               
                dataItem.tags.forEach(({ epc, antennaPort, firstSeenTimestamp }) => {
                  if (epc && antennaPort) {
                  
                    const row = Math.floor((antennaPort - 1) / 3); 
                    const col = (antennaPort - 1) % 3; 
                   
                    handleInputThrow(epc, row, col);
                  }
                });
            }
          });
        } else {
          console.warn("⚠️ API response missing dataModel or tags.");
        }
      } catch (error) {
        console.error("🚨 Error fetching game moves:", error);
      }
    };
  
    const intervalId = setInterval(fetchGameMoves, 2000); 
  
    return () => {
      clearInterval(intervalId); 
  
    };
  }, [useApiInput, gameStarted, handleInputThrow, gameEnded]);
  
  
  
  // useEffect(() => {
  //   if (!useApiInput || !gameStarted) return; // ✅ Prevent unnecessary API calls
  
  //   const fetchGameMoves = async () => {
  //     try {
  //       const response = await axios.get(API_RECEIVE_MOVE);
        
  //       if (response.status === 200 && response.data.tagReads) {
  //         response.data.tagReads.forEach(({ epctag, row, col }) => {
  //           console.log(`🎯 Move received: EPC=${epctag}, Row=${row}, Col=${col}`);
  //           handleInputThrow(epctag, row, col);
  //         });
  //       }
  //     } catch (error) {
  //       console.error("🚨 Error fetching game moves:", error);
  //     }
  //   };
  
  //   const intervalId = setInterval(fetchGameMoves, 2000); // ✅ Polling every 2 seconds
  
  //   return () => {
  //     clearInterval(intervalId); // ✅ Cleanup polling when component unmounts
  //     console.log("🔄 Polling stopped.");
  //   };
  // }, [useApiInput, gameStarted, handleInputThrow]); // ✅ Ensures polling stops when game ends
  
  // useEffect(() => {
  //   if (!useApiInput || !gameStarted) return; // ✅ Prevent unnecessary API calls
  
  //   const fetchGameMoves = async () => {
  //     try {
  //       const response = await axios.post(
  //         API_RECEIVE_MOVE, 
  //         { gameSessionId: "your-session-id" }, // ✅ Replace with actual session ID if required
  //         { headers: { "Content-Type": "application/json" } }
  //       );
  
  //       if (response.status === 200 && response.data.tagReads) {
  //         console.log("📡 Received Game Moves:", response.data.tagReads); // ✅ Debugging log
  
  //         response.data.tagReads
  //           .filter(({ epctag, row, col }) => epctag && row !== undefined && col !== undefined) // ✅ Ensure valid data
  //           .forEach(({ epctag, row, col }) => {
  //             console.log(`🎯 Move Processed: EPC=${epctag}, Row=${row}, Col=${col}`);
  //             handleInputThrow(epctag, row, col); // ✅ Pass validated move data
  //           });
  //       } else {
  //         console.warn("⚠️ API response missing `tagReads` data.");
  //       }
  //     } catch (error) {
  //       console.error("🚨 Error fetching game moves:", error);
  //     }
  //   };
  
  //   const intervalId = setInterval(fetchGameMoves, 2000); // ✅ Polling every 2 seconds
  
  //   return () => {
  //     clearInterval(intervalId); // ✅ Cleanup polling when component unmounts
  //     console.log("🔄 Polling stopped.");
  //   };
  // }, [useApiInput, gameStarted, handleInputThrow]); 
  
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
        <h1>Disc Arcade</h1>
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
          {/* <button
            className="start-button"
            onClick={() => {
              setGameStarted(true);
              setStartButtonDisabled(true);
            }}
            disabled={startButtonDisabled}
          >
            Start Game
          </button> */}
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