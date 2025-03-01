import React, { useState, useEffect, useCallback, useRef } from "react";
import "./AimPointGame.css";
import pawn from "../assets/pawn.png";
import star from "../assets/star.png";
import gameRemote from "../assets/gameremote.png";
import axios from "axios";


const AIMAPIresult_send = process.env.REACT_APP_AIMAPIresult_send;
const ReceiveMove_API= process.env.React_APP_ReceiveMove_API;

const useTargetCycle = (gameEnded, frisbees, durationSchedule, intervalSchedule, setMissedTargets, score) => {
  const [activeTarget, setActiveTarget] = useState(null);
  const lastActiveTargetRef = useRef(null); // Use ref for last active target
  const scheduleIndexRef = useRef(0); // Ref for tracking schedule index

  useEffect(() => {
    if (gameEnded || frisbees <= 0) return;
    let targetTimeout; // Timeout for target duration
    let activationTimeout; // Timeout for activation interval

    const handleActivationInterval = () => {
      // console.log("Activation Interval Started");
      // console.log(`Schedule Index: ${scheduleIndexRef.current}, Interval: ${intervalSchedule[scheduleIndexRef.current]}`);
      activationTimeout = setTimeout(() => {
        handleTargetDuration(); // Begin target duration
      }, intervalSchedule[scheduleIndexRef.current] * 1000);
    };

    const handleTargetDuration = () => {
      // console.log("Target Duration Started");
      // console.log(`Schedule Index: ${scheduleIndexRef.current}, Duration: ${durationSchedule[scheduleIndexRef.current]}`);
      let randomIndex;
      // Ensure no overlap with the last active target
      do {
        randomIndex = Math.floor(Math.random() * 9);
      } while (randomIndex === lastActiveTargetRef.current);

      setActiveTarget(randomIndex);
      lastActiveTargetRef.current = randomIndex;

      targetTimeout = setTimeout(() => {
        // console.log("Target Duration Ended");
        setMissedTargets((prev) => prev + 1);
        setActiveTarget(null); // Clear active target
        handleActivationInterval(); // Trigger next activation interval
      }, durationSchedule[scheduleIndexRef.current] * 1000);
    };

    handleActivationInterval(); // Begin the first activation interval

    return () => {
      clearTimeout(targetTimeout);
      clearTimeout(activationTimeout);
    };
  }, [gameEnded, frisbees, durationSchedule, intervalSchedule, setMissedTargets]);

  // Adjust schedule index based on score
  useEffect(() => {
    if (score > 0 && score % 3 === 0) {
    //  const scheduleIndex = Math.min(
        const newScheduleIndex = Math.min(
        Math.floor(score / 3),
        durationSchedule.length - 1
      );
      scheduleIndexRef.current = newScheduleIndex; // Update schedule index
      // durationSchedule[0] = durationSchedule[scheduleIndex];
      // intervalSchedule[0] = intervalSchedule[scheduleIndex];
    }
  }, [score, durationSchedule, intervalSchedule]);

  return { activeTarget, setActiveTarget, scheduleIndex: scheduleIndexRef.current };
};

const AimPointGame = () => {
  // State Variables
  const initialBoard = [
    [7, 8, 9],  // Custom order for row 0
    [4, 5, 6],  // Custom order for row 1
    [1, 2, 3], 
];
  // const [board] = useState(Array(3).fill(Array(3).fill(null))); 
  const [board, setBoard] = useState(initialBoard);
  const [score, setScore] = useState(0); // Player's score
  const [missedTargets, setMissedTargets] = useState(0); // Missed targets count
  const [timer, setTimer] = useState(120); // 2-minute timer
  const [gameEnded, setGameEnded] = useState(false); // Game over flag
  const [frisbees, setFrisbees] = useState(20); // Total number of frisbees
  const useManualInput = false;  // Toggle for manual board clicks
  const useApiInput = true;    // Toggle for API/WebSocket input
  const durationSchedule = React.useMemo(() => [5, 4.5, 4, 3.5, 3, 2.5, 2], []);
  const intervalSchedule = React.useMemo(() => [4, 3.5, 3, 2.5, 2, 1.5, 1], []);

  const [gameResults, setGameResults] = useState(null); // Store game results

  const { activeTarget, setActiveTarget, scheduleIndex } = useTargetCycle(
    gameEnded,
    frisbees,
    durationSchedule,
    intervalSchedule,
    setMissedTargets,
    score
  );

  // Timer Management
  useEffect(() => {
    if (timer === 0 || gameEnded) return; // Stop if game ends

    const countdown = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000); // Decrease timer every second

    return () => clearInterval(countdown); // Cleanup
  }, [timer, gameEnded]);

  // Centralized Move Handler
  const handleMove = useCallback(
    (index) => {
      if (gameEnded || frisbees === 0) return; // Ignore if game ended or no frisbees left
      setFrisbees((prev) => prev - 1); // Decrement frisbees
      if (index === activeTarget) {
        setScore((prev) => prev + 1); // Increment score
        setActiveTarget(null);
      } else {
        setMissedTargets((prev) => prev + 1); // Increment missed targets
        setActiveTarget(null);
      }
    },
    [activeTarget, setActiveTarget, gameEnded, frisbees]
  );

  const handleManualThrow = useCallback((index) => {
    handleMove(index); // Centralized move logic
  }, [handleMove]);

  const handleInputThrow = useCallback(
    (index) => {
      if (useApiInput) {
        
        return;
      } else if (useManualInput) {
        handleManualThrow(index); // Manual input logic
      }
    },
    [handleManualThrow, useApiInput, useManualInput]
  );

  // useEffect(() => {
  //   if (!useApiInput) return; 
  
  //   const socket = new WebSocket("ws://your-websocket-url");
  
  //   socket.onopen = () => {
  //     // console.log("WebSocket connection established");
  //   };
  
  //   socket.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       const { index } = data; // Assuming server sends index of the target
  //       handleMove(index); // Handle the target move
  //     } catch (error) {
  //       // console.error("Error processing WebSocket message:", error);
  //     }
  //   };
  
  //   socket.onerror = (error) => {
  //     // console.error("WebSocket error:", error);
  //   };
  
  //   socket.onclose = () => {
  //     // console.log("WebSocket connection closed");
  //   };
  
  //   return () => {
  //     socket.close(); // Cleanup on component unmount
  //   };
  // }, [useApiInput, handleMove]);

  // useEffect(() => {
  //   if (!useApiInput) return; // ✅ Prevent unnecessary WebSocket connection if useApiInput is false

  //   const socket = new WebSocket("ReceiveMove_API"); // Replace with your WebSocket URL

  //   socket.onopen = () => {
  //     console.log("WebSocket connection established");
  //   };

  //   socket.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);

  //       const { epc, antennaPort, firstSeenTimestamp, isHeartBeat } = data;

  //       // Log the received data
  //       console.log(`📡 Data Received: EPC=${epc}, Antenna Port=${antennaPort}, First Seen Timestamp=${firstSeenTimestamp}, Heartbeat=${isHeartBeat}`);

  //       // Process the data by calling the handleMove function and passing only the antennaPort
  //       handleMove(antennaPort); // Passing antennaPort only
  //     } catch (error) {
  //       console.error("🚨 Error processing WebSocket message:", error);
  //     }
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   socket.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   // Cleanup the WebSocket connection when the component unmounts
  //   return () => {
  //     socket.close();
  //     console.log("WebSocket connection closed on cleanup");
  //   };
  // }, [useApiInput, handleMove]);

  useEffect(() => {
    if (!useApiInput || gameEnded) return; 
    const fetchData = async () => {
      try {
        const response = await axios.get(ReceiveMove_API, {
          headers: { "Content-Type": "application/json" },
        });
    
      if (response.status === 200 && response.data.dataModel) {
          response.data.dataModel.forEach((dataItem) => {
      
            if (dataItem.tags && Array.isArray(dataItem.tags)) {
           
              dataItem.tags.forEach(({ epc, antennaPort, firstSeenTimestamp }) => {
                if (epc && antennaPort) {
                 
                  handleMove(antennaPort);
                }
              });
          }
        });
        
        } else {
          console.warn("⚠️ API response is missing data or invalid.");
        }
      } catch (error) {
        console.error("🚨 Error fetching data:", error);
      }
    };
    const intervalId = setInterval(fetchData, 3000);
    return () => {
      clearInterval(intervalId); 
     
    };
  }, [useApiInput, handleMove, gameEnded]);

  // useEffect(() => {
  //   if (!useApiInput) return; // Don't start if useApiInput is false

  //   // Set up SSE connection
  //   const eventSource = new EventSource(ReceiveMove_API);

  //   eventSource.onopen = () => {
  //     console.log("SSE connection established");
  //   };

  //   eventSource.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data); // Parse the data from the server

  //       const { epc, antennaPort, firstSeenTimestamp, isHeartBeat } = data;

  //       console.log(`📡 Data Received: EPC=${epc}, Antenna Port=${antennaPort}, First Seen Timestamp=${firstSeenTimestamp}, Heartbeat=${isHeartBeat}`);

  //       // Process the data by calling the handleMove function and passing only the antennaPort
  //       handleMove(antennaPort); // Only passing the antennaPort

  //     } catch (error) {
  //       console.error("🚨 Error processing SSE message:", error);
  //     }
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error("SSE error:", error);
  //   };

  //   // Cleanup when the component unmounts
  //   return () => {
  //     eventSource.close();
  //     console.log("SSE connection closed on cleanup");
  //   };
  // }, [useApiInput, handleMove]);
  

  // Game Over Check
  useEffect(() => {
    if (timer === 0 || frisbees === 0 || missedTargets === 20) {
      setGameEnded(true);

      const results = {
        score: score,
        missedTargets: missedTargets,
        timeLeft: timer,
        frisbeesLeft: frisbees,
      };
  
      setGameResults(results);
      // console.log("Game Results:", results);
     // sendResultsToAPI(results);

    }
  }, [timer, frisbees, missedTargets, score]);


  const sendResultsToAPI = async (results) => {
    try {
      const response = await fetch(AIMAPIresult_send, {
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
      // console.error("Error sending game results:", error);
    }
  };
  
  const renderScoreboard = () => (
    <div className="scoreboard-point">
      <h2 className="game-over-point">Game Over!</h2>
      <h2>Final Score: {gameResults?.score}</h2>
      <h2>Missed Targets: {gameResults?.missedTargets}</h2>
      {/* <h2>Time Left: {gameResults?.timeLeft}s</h2> */}
      <h2>Frisbees Left: {gameResults?.frisbeesLeft}</h2>
      {/* <button className="back-button-point" onClick={() => window.location.reload()}>
        Play Again
      </button> */}
    </div>
  );
  

  // Render UI
  return (

    <div className="game-container-point">

  <h1 className="game-title2">Aim Point</h1>
    <img src={pawn} alt="Pawn" className="pawn-icon-point" />
    <img src={star} alt="Star" className="star-icon-point" />
    
    <div className="scoreboard-point">
        {gameEnded && <h2 className="game-over-point">Game Over!</h2>}
        <h2>Score: {score}</h2>
        <h2>Missed Targets: {missedTargets}</h2>
        {/* <h2>Total Time Left: {timer}s</h2> */}
        <h2>Frisbees Left: {frisbees}</h2>
        
        {/* Only show Target Duration or Activation Interval if the game is not over */}
        {!gameEnded && activeTarget !== null ? (
            <h2 className="target-duration-point">
                Target Duration: {durationSchedule[scheduleIndex]}s
            </h2>
        ) : null}

        {!gameEnded && activeTarget === null ? (
            <h2 className="activation-interval-point">
                Activation Interval: {intervalSchedule[scheduleIndex]}s
            </h2>
        ) : null}
    </div>
    
    <div className="game-board-point">
        {board.flat().map((_, index) => (
            <div
                key={index}
                className={`board-cell-point ${
                    index === activeTarget ? "active-target-point" : ""
                }`}
                onClick={() => {
                    handleInputThrow(index); 
                }}
            ></div>
        ))}
    </div>

    <img src={gameRemote} alt="Game Remote" className="game-remote-point" />
</div>
  
  );
};

export default AimPointGame;


// copy 
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import "./AimPointGame.css";

// const useTargetCycle = (gameEnded, frisbees, durationSchedule, intervalSchedule, setMissedTargets, score) => {
//   const [activeTarget, setActiveTarget] = useState(null);
//   const lastActiveTargetRef = useRef(null); // Use ref for last active target
//   const scheduleIndexRef = useRef(0); // Ref for tracking schedule index

//   useEffect(() => {
//     if (gameEnded || frisbees <= 0) return;
//     let targetTimeout; // Timeout for target duration
//     let activationTimeout; // Timeout for activation interval

//     const handleActivationInterval = () => {
//       console.log("Activation Interval Started");
//       console.log(`Schedule Index: ${scheduleIndexRef.current}, Interval: ${intervalSchedule[scheduleIndexRef.current]}`);
//       activationTimeout = setTimeout(() => {
//         handleTargetDuration(); // Begin target duration
//       }, intervalSchedule[scheduleIndexRef.current] * 1000);
//     };

//     const handleTargetDuration = () => {
//       console.log("Target Duration Started");
//       console.log(`Schedule Index: ${scheduleIndexRef.current}, Duration: ${durationSchedule[scheduleIndexRef.current]}`);
//       let randomIndex;
//       // Ensure no overlap with the last active target
//       do {
//         randomIndex = Math.floor(Math.random() * 9);
//       } while (randomIndex === lastActiveTargetRef.current);

//       setActiveTarget(randomIndex);
//       lastActiveTargetRef.current = randomIndex;

//       targetTimeout = setTimeout(() => {
//         console.log("Target Duration Ended");
//         setMissedTargets((prev) => prev + 1);
//         setActiveTarget(null); // Clear active target
//         handleActivationInterval(); // Trigger next activation interval
//       }, durationSchedule[scheduleIndexRef.current] * 1000);
//     };

//     handleActivationInterval(); // Begin the first activation interval

//     return () => {
//       clearTimeout(targetTimeout);
//       clearTimeout(activationTimeout);
//     };
//   }, [gameEnded, frisbees, durationSchedule, intervalSchedule, setMissedTargets]);

//   // Adjust schedule index based on score
//   useEffect(() => {
//     if (score > 0 && score % 3 === 0) {
//     //  const scheduleIndex = Math.min(
//         const newScheduleIndex = Math.min(
//         Math.floor(score / 3),
//         durationSchedule.length - 1
//       );
//       scheduleIndexRef.current = newScheduleIndex; // Update schedule index
//       // durationSchedule[0] = durationSchedule[scheduleIndex];
//       // intervalSchedule[0] = intervalSchedule[scheduleIndex];
//     }
//   }, [score, durationSchedule, intervalSchedule]);

//   return { activeTarget, setActiveTarget, scheduleIndex: scheduleIndexRef.current };
// };

// const AimPointGame = () => {
//   // State Variables
//   const [board] = useState(Array(3).fill(Array(3).fill(null))); // 3x3 grid
//   const [score, setScore] = useState(0); // Player's score
//   const [missedTargets, setMissedTargets] = useState(0); // Missed targets count
//   const [timer, setTimer] = useState(120); // 2-minute timer
//   const [gameEnded, setGameEnded] = useState(false); // Game over flag
//   const [frisbees, setFrisbees] = useState(20); // Total number of frisbees
//   const useManualInput = true;  // Toggle for manual board clicks
//   const useApiInput = false;    // Toggle for API/WebSocket input
//   const durationSchedule = React.useMemo(() => [5, 4.5, 4, 3.5, 3, 2.5, 2], []);
//   const intervalSchedule = React.useMemo(() => [4, 3.5, 3, 2.5, 2, 1.5, 1], []);

//   const { activeTarget, setActiveTarget, scheduleIndex } = useTargetCycle(
//     gameEnded,
//     frisbees,
//     durationSchedule,
//     intervalSchedule,
//     setMissedTargets,
//     score
//   );

//   // Timer Management
//   useEffect(() => {
//     if (timer === 0 || gameEnded) return; // Stop if game ends

//     const countdown = setInterval(() => {
//       setTimer((prev) => Math.max(prev - 1, 0));
//     }, 1000); // Decrease timer every second

//     return () => clearInterval(countdown); // Cleanup
//   }, [timer, gameEnded]);

//   // Centralized Move Handler
//   const handleMove = useCallback(
//     (index) => {
//       if (gameEnded || frisbees === 0) return; // Ignore if game ended or no frisbees left
//       setFrisbees((prev) => prev - 1); // Decrement frisbees
//       if (index === activeTarget) {
//         setScore((prev) => prev + 1); // Increment score
//         setActiveTarget(null);
//       } else {
//         setMissedTargets((prev) => prev + 1); // Increment missed targets
//         setActiveTarget(null);
//       }
//     },
//     [activeTarget, setActiveTarget, gameEnded, frisbees]
//   );

//   const handleManualThrow = useCallback((index) => {
//     handleMove(index); // Centralized move logic
//   }, [handleMove]);

//   const handleInputThrow = useCallback(
//     (index) => {
//       if (useApiInput) {
        
//         return;
//       } else if (useManualInput) {
//         handleManualThrow(index); // Manual input logic
//       }
//     },
//     [handleManualThrow, useApiInput, useManualInput]
//   );

//   useEffect(() => {
//     if (!useApiInput) return; 
  
//     const socket = new WebSocket("ws://your-websocket-url");
  
//     socket.onopen = () => {
//       console.log("WebSocket connection established");
//     };
  
//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         const { index } = data; // Assuming server sends index of the target
//         handleMove(index); // Handle the target move
//       } catch (error) {
//         console.error("Error processing WebSocket message:", error);
//       }
//     };
  
//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
  
//     socket.onclose = () => {
//       console.log("WebSocket connection closed");
//     };
  
//     return () => {
//       socket.close(); // Cleanup on component unmount
//     };
//   }, [useApiInput, handleMove]);
  

//   // Game Over Check
//   useEffect(() => {
//     if (timer === 0 || frisbees === 0 || missedTargets === 20) {
//       setGameEnded(true);
//     }
//   }, [timer, frisbees, missedTargets]);

//   // Render UI
//   return (
//     <div className="game-container-point">
//       <div className="game-board-point">
//         {board.flat().map((_, index) => (
//           <div
//             key={index}
//             className={`board-cell-point ${
//               index === activeTarget ? "active-target-point" : ""
//             }`}
//             onClick={() => {
//               handleInputThrow(index); 
//             }}
//           ></div>
//         ))}
//       </div>
//       <div className="scoreboard-point">
//         <h2>Score: {score}</h2>
//         <h2>Missed Targets: {missedTargets}</h2>
//         <h2>Total Time Left: {timer}s</h2>
//         <h2>Frisbees Left: {frisbees}</h2>
//         {activeTarget !== null ? (
//           <h2 className="target-duration-point">
//             Target Duration: {durationSchedule[scheduleIndex]}s
//           </h2>
//         ) : (
//           <h2 className="activation-interval-point">
//             Activation Interval: {intervalSchedule[scheduleIndex]}s
//           </h2>
//         )}

//       </div>
//       {gameEnded && <h2 className="game-over-point">Game Over!</h2>}
//     </div>
//   );
// };

// export default AimPointGame;
