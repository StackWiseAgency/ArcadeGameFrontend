import React, { useState, useEffect, useCallback } from "react";
import Timer from "./Timer";
import "./LightsOutWorld.css";
import * as signalR from "@microsoft/signalr";
import forbiddenCircle from "../assets/forbiddenCircle.png";
import timerpng from "../assets/timer.png";
import pawn from "../assets/pawn.png";
import star from "../assets/star.png";
import gameRemote from "../assets/gameremote.png";



const LightsOutWorld = ({ navigateToSelection }) => {
  const [grid, setGrid] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(true))
  ); 
  const [remainingDiscs, setRemainingDiscs] = useState(20); 
  const [misses, setMisses] = useState(0); 
  const [timer, setTimer] = useState(0); 
  const [isGameOver, setIsGameOver] = useState(false); 
  const [userHasThrown, setUserHasThrown] = useState(false); 
  const [lastThrowTime, setLastThrowTime] = useState(Date.now()); 
  const [useManualInput] = useState(false); 
  const [useApiInput] = useState(true); 
  const [useWebSocketInput] = useState(false); 
  const [gameResults, setGameResults] = useState(null); 

  const API_tosendgame_result = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameStatistics/createGameStatistics";
  const Lights_Out_get_API="https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Webhook/GetLatestRfidData";
  //const ReceiveMove_API= process.env.React_APP_ReceiveMove_API;

  const sendResultsToAPI = async (results) => {
    try {
        const response = await fetch(API_tosendgame_result, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(results),
        });

        if (!response.ok) {
            throw new Error("Failed to send game results.");
        }

       // console.log("Game results sent successfully.");
    } catch (error) {
        console.error("Error sending game results:", error);
    }
  };


  const handleGameEnd = useCallback(() => {
    setIsGameOver(true);

    const results = {
      status: grid.flat().every((cell) => !cell) ? "All Lights Turned Off!" : "Out of Discs!",
      timeElapsed: timer,
      discsLeft: remainingDiscs,
      misses: misses
    };

    setGameResults(results); 
    // console.log("Game Results:", results);
   // sendResultsToAPI(results); // Send results to API

  }, [grid, timer, remainingDiscs, misses]);

  const resetGrid = useCallback(() => {
    const newGrid = Array(3)
      .fill(null)
      .map(() => Array(3).fill(false)); 

    let lightsToTurnOn = Math.floor(Math.random() * 3) + 3;
    while (lightsToTurnOn > 0) {
      const row = Math.floor(Math.random() * 3);
      const col = Math.floor(Math.random() * 3);

      if (!newGrid[row][col]) {
        newGrid[row][col] = true;
        lightsToTurnOn--;
      }
    }

    setGrid(newGrid); 
  }, []);

  const handleThrow = useCallback((row, col) => {
    if (isGameOver) return;
    if (!userHasThrown) {
      setUserHasThrown(true); 
    }
    setLastThrowTime(Date.now()); 
    if (remainingDiscs <= 1) {
      setRemainingDiscs(0); 
      handleGameEnd(); 
      return;
    }

    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (cell) {
            setRemainingDiscs((prev) => Math.max(0, prev - 1)); 
            return false; 
          } else {
            setMisses((prev) => prev + 1); 
            setRemainingDiscs((prev) => Math.max(0, prev - 1)); 
          }
        }
        return cell;
      })
    );
    setGrid(newGrid);

   
    if (newGrid.flat().every((cell) => !cell)) {
      if (remainingDiscs > 0) {
        resetGrid(); 
      } else {
        handleGameEnd(); 
      }
    }
  }, [grid, isGameOver, handleGameEnd, resetGrid, remainingDiscs, userHasThrown]);
  
  // const fetchAntennaDataFromAPI = useCallback(async () => {
  //   if (!useApiInput || isGameOver) return; 

  //   const fetchWithRetry = async (url, retries = 3) => {
  //     for (let i = 0; i < retries; i++) {
  //       try {
  //         const response = await fetch(url, {
  //           method: "POST", 
  //           headers: {
  //             "Content-Type": "application/json", 
  //             "Referer": "http://localhost:3000",
  //           },
  //           body: JSON.stringify({ /* Include payload if needed */ }),
  //         });
  //         if (response.ok) return await response.json();
  //       } catch (error) {
  //         if (i === retries - 1) throw error; 
  //       }
  //     }
  //   };
    

  //   try {
  //     const data = await fetchWithRetry(Lights_Out_get_API, 3); // Retry 3 times
  //     const { row, col } = data;
  //     if (row >= 0 && row < 3 && col >= 0 && col < 3) { // Validate row and col
  //       handleThrow(row, col);
  //     } else {
  //       console.warn("Invalid data received from API:", data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching antenna data:", error);
  //   }
  // }, [useApiInput, isGameOver, handleThrow]);
  const fetchAntennaDataFromAPI = useCallback(async () => {
    if (!useApiInput || isGameOver) return;

    try {
      const response = await axios.get(Lights_Out_get_API);
      
      if (response.status !== 200) {
        console.warn("⚠️ API request failed");
        return;
      }
      
      const data = response.data;
      if (data && Array.isArray(data.dataModel)) {
        data.dataModel.forEach((dataItem) => {
          if (dataItem.tags && Array.isArray(dataItem.tags)) {
            dataItem.tags.forEach(({ epc, antennaPort, firstSeenTimestamp }) => {
              if (epc && antennaPort) {
                const row = Math.floor((antennaPort - 1) / 3);
                const col = (antennaPort - 1) % 3;
                // handleThrow(epc, row, col);
                handleThrow(row, col);
              }
            });
          }
        });
      } else {
        console.warn("⚠️ API response missing dataModel or tags.");
      }
    } catch (error) {
      console.error("🚨 Error fetching antenna data:", error);
    }
  }, [useApiInput, isGameOver, handleThrow]);
  
  useEffect(() => {
    if (!useApiInput || isGameOver) return;

    const interval = setInterval(() => {
      fetchAntennaDataFromAPI(); // Call API function periodically
    }, 100); // Fetch every 0.1 seconds

    return () => clearInterval(interval); 
  }, [useApiInput, isGameOver, fetchAntennaDataFromAPI]);

  // Timer for elapsed time
  useEffect(() => {
    if (!userHasThrown || isGameOver) return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [userHasThrown, isGameOver]);

  useEffect(() => {
    if (!useWebSocketInput || isGameOver) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://arcadegamebackendapi20241227164011.azurewebsites.net/gameHub", {
        transport: signalR.HttpTransportType.WebSockets | 
                  signalR.HttpTransportType.ServerSentEvents | 
                  signalR.HttpTransportType.LongPolling, 
                   //skipNegotiation: true,
      })
      .withHubProtocol(new signalR.JsonHubProtocol())
      .configureLogging(signalR.LogLevel.Information) // Optional: Logging for debugging
      .withAutomaticReconnect() 
      .build();

    connection.start()
      .then(() => {
        //console.log("SignalR connection established using fallback transports");
        connection.on("ReceiveMove", (row, col) => {
        //  console.log(`Move received: Row=${row}, Col=${col}`);
          handleThrow(row, col); // Update UI or game state
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      if (connection) {
        connection.stop()
            .then(() => 
              console.log("SignalR connection stopped")
          )
            .catch((err) => console.error("Error stopping SignalR connection:", err));
      }
    };
  }, [useWebSocketInput, isGameOver, handleThrow]);

  useEffect(() => {
    if (isGameOver) return;

    const inactivityInterval = setInterval(() => {
      // This handles the 30-second inactivity timeout to end the game, ensuring players cannot leave the game in an unfinished state.
      if (Date.now() - lastThrowTime > 90000) {
        handleGameEnd();
      }
    }, 1000); // Check every second

    return () => clearInterval(inactivityInterval);
  }, [isGameOver, lastThrowTime, handleGameEnd]);

  // Result Screen
  const renderResultScreen = () => (
    <div className="lights-result-screen">
      <h1>Game Over!</h1>
      <p>
        Status: {grid.flat().every((cell) => !cell) ? "All Lights Turned Off!" : "Out of Discs!"}
      </p>
      <p>Time: {`${Math.floor(timer / 60)}:${timer % 60}`}</p>
      <p>Discs Left: {remainingDiscs}</p>
      <p>Misses: {misses}</p>
      {/* <button className="lights-back-button" onClick={navigateToSelection}>
        Back to Game Selection
      </button> */}
    </div>
  );

  // Game Board
  const renderGameBoard = () => (
    <div className="lights-container">
      <img src={pawn} alt="Pawn" className="pawn-icon" />
      <img src={star} alt="Star" className="star-icon" />
      <h1 className="lights-game-title">Lights Out</h1>
      <div className="lights-scoreboard">
        <div className="lights-time-display">
          <span>Time </span> 
          <img src={timerpng} alt="timer icon" className="timer-icon"/> 
         
          <span>{`${Math.floor(timer / 60)}:${timer % 60}`}</span>
        </div>
          
        <div className="lights-disc-display">
          <span>Discs Left: {remainingDiscs}</span>
        </div>
        <div className="lights-misses-display">
          <span>Misses </span>
          <img src={forbiddenCircle} alt="Misses Icon" />
         
          <span>{misses}</span>
        </div>
          
      </div>
      <div className="lights-game-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="lights-board-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`lights-board-cell ${cell ? "lit" : "off"}`}
                onClick={() => useManualInput && handleThrow(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <img src={gameRemote} alt="Game Remote" className="game-remote" />
    </div>
  );
  // Return Main Component
  return (
    <div className="lights-container">
      {!userHasThrown && !isGameOver && (
        <Timer userHasThrown={userHasThrown} onStart={() => setUserHasThrown(true)} />
      )}
      {isGameOver ? renderResultScreen() : renderGameBoard()}
    </div>
  );
};

export default LightsOutWorld;
