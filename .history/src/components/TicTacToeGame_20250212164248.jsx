import React, { useState, useEffect, useCallback } from "react";
import { notification } from "antd";
import Timer from "./Timer"; // Import Timer Component
import "./TicTacToeGame.css";
// import backgroundImage from "../assets/background-image.png";
import maleAvatar from "../assets/maleavatar.png";
import profileIcon from "../assets/profile-icon.png";
import pawn from "../assets/pawn.png";
import star from "../assets/star.png";
import gameRemote from "../assets/gameremote.png";

const API_URL_gameresult = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSimulation/add";

const TicTacToeGame = ({ navigateToSelection }) => {
  const initialBoard = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null)); // 3x3 grid
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("A"); // Alternates between "A" and "B"
  const [putters, setPutters] = useState({ A: 10, B: 10 }); // Putters left for each player
  const [misses, setMisses] = useState({ A: 0, B: 0 }); // Misses for each player
  const [steals, setSteals] = useState({ A: 0, B: 0 }); // Steals for each player
  const [winner, setWinner] = useState(null); // Winner of the game, if any
  const [isLoading, setIsLoading] = useState(false); // Loading state for API input
  const [stealMode, setStealMode] = useState(false); // Flag for stealing victory mode
  const [stealPlayer, setStealPlayer] = useState(null); // Track which player is in steal mode
  const [winningCells, setWinningCells] = useState([]); // Cells forming the winning line
  const useSimulatedInput = false; // Toggle for simulated data
  const useManualInput = true; // Toggle for manual board clicks
  const [userHasThrown, setUserHasThrown] = useState(false); // Track if the user has started
  const [gameEnded, setGameEnded] = useState(false); // To mark the game as ended
  const [gameResults, setGameResults] = useState(null); // Store game results

  // Dynamic Popup for Notifications
  const showPopup = (message, description) => {
    notification.open({
        message,
        description,
        placement: "top",
        duration: 5,
        className: "custom-notification", // Custom class for notification
    });
  };

  const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSimulation/add"; // Replace with your actual API URL

  // Check win condition
  const checkWinCondition = useCallback((board, player) => {
    const winLines = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];
    for (const line of winLines) {
      if (line.every(([row, col]) => board[row][col] === player)) {
        setWinningCells(line);
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    // Check for draw condition when putters are updated
    if (
      putters.A === 0 &&
      putters.B === 0 &&
      !checkWinCondition(board, "A") &&
      !checkWinCondition(board, "B")
    ) {
      console.log("Draw condition detected through useEffect.");
      showPopup("Game Draw", "No more moves left!");
      setGameEnded(true); 

      const results = {
        winner: "Draw",
        playerA: { discs: putters.A, steals: steals.A, misses: misses.A },
        playerB: { discs: putters.B, steals: steals.B, misses: misses.B },
      };
  
      setGameResults(results);
      console.log("Game Results:", results);
      sendResultsToAPI(results); // Send data to API
  
      return;
    }
  }, [putters.A, putters.B, board, checkWinCondition, steals.A, steals.B, misses.A, misses.B]);
  

  // Update game state based on antenna data
  const handleMove = useCallback(
    ({ row, col }) => {
      console.log("Handling move at:", { row, col });
      
      if (winner && !stealMode) return; // Game already ended unless in steal mode
      

      const newBoard = board.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            if (stealMode && stealPlayer === currentPlayer) {
              // console.log("Winning Cells Before Neutralization:", winningCells);
              console.log("Clicked Cell:", { row, col });
              if (winningCells.some(([winRow, winCol]) => winRow === row && winCol === col)) {
                console.log("Neutralizing Winning Cell");
                setSteals((prev) => {
                  const updatedSteals = { ...prev, [currentPlayer]: prev[currentPlayer] + 1 };
                  console.log("Updated Steals:", updatedSteals);
                  return updatedSteals;
                });
                const updatedWinningCells = winningCells.filter(
                  ([winRow, winCol]) => !(winRow === row && winCol === col)
                );
                setPutters((prev) => ({
                  ...prev,
                  [currentPlayer]: prev[currentPlayer] > 0 ? prev[currentPlayer] - 1 : prev[currentPlayer],
                }));
                setWinningCells(updatedWinningCells);
                // console.log("Winning Cells After Neutralization:", updatedWinningCells);
                return null; // Neutralize the winning cell
              } else {
                console.log('Missed - Not a Winning Cell! ');
                setMisses((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
                return c; // Count as a miss if clicking outside winning cells
              }
            } else if (!stealMode && c === currentPlayer) {
              setMisses((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
              return currentPlayer; // No change if player already owns the cell
            } else if (c === null) {
              return currentPlayer; // Claim neutral target
            } else if (c !== currentPlayer) {
              setSteals((prev) => {
                const updatedSteals = { ...prev, [currentPlayer]: prev[currentPlayer] + 1 };
                console.log("Updated Steals:", updatedSteals);
                return updatedSteals;
              });
              const updatedWinningCells = winningCells.filter(
                ([winRow, winCol]) => !(winRow === row && winCol === col)
              );
              setWinningCells(updatedWinningCells);
              return null; // Neutralize the cell if claimed by the opponent
            }
          }
          return c;
        })
      );

      setBoard(newBoard);

      if (stealMode) {
        console.log("Steal Mode Active:", stealMode);
        console.log("Winning Cells Before Attempt:", winningCells);
      
        // Check if all winning cells are neutralized
        if (winningCells.length === 0) {
          console.log("All Winning Cells Neutralized");
          setWinner(null); // Reset winner
          setStealPlayer(null); // Reset after neutralization
          setStealMode(false); // End steal mode
          return;
        } 
        // Check for invalid steal
        else if (!winningCells.some(([winRow, winCol]) => winRow === row && winCol === col)) {
          console.log("Invalid Steal Attempt by Player:", stealPlayer);
         // notify(`Invalid Steal Attempt! Player ${stealPlayer} loses.`);
         
          showPopup(`Invalid Steal Attempt! Player ${stealPlayer} loses.`, "Alas!");

          setWinner("A"); // Player A wins
          setStealMode(false); // End steal mode

          const results = {
            winner: "A",
            playerA: { discs: putters.A, steals: steals.A, misses: misses.A },
            playerB: { discs: putters.B, steals: steals.B, misses: misses.B },
          };
    
          setGameResults(results);
          console.log("Game Results:", results);
          sendResultsToAPI(results); // Send data to API

          return;
        } 
        // Proceed with valid steal
        else {
          console.log("Valid Steal Attempt!");
      
          // Just disable steal mode and continue gameplay
          console.log("Steal Mode Disabled After Neutralizing a Cell");
          
          const updatedWinningCells = winningCells.filter(
            ([winRow, winCol]) => !(winRow === row && winCol === col)
          );
          setWinningCells(updatedWinningCells);
          
          setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
          setStealMode(false); // Disable steal mode immediately
          setWinner(null); // Reset winner for continued gameplay
          return; // Exit after processing steal mode logic
        }
      }

      if (!stealMode && checkWinCondition(newBoard, currentPlayer)) {
        setWinner(currentPlayer);

        
  
    
        if (currentPlayer === "A") {
            if (stealPlayer === null) {
                // First-time win by Player A
                //notify(`Player ${currentPlayer} wins! Player B gets a steal chance!`);
                showPopup( `Player ${currentPlayer} Matches Cells`,"Player B gets a steal chance!");
                setStealPlayer("B");
                setStealMode(true);
            } else if (stealPlayer === "B") {
                // Subsequent win by Player A, allow Player B to steal again
                //notify(`Player ${currentPlayer} wins again! Player B gets another steal chance!`);
                showPopup(`Player ${currentPlayer} Matches Cells`, "Player B gets a steal chance!");
                setStealMode(true);
            }
        } else if (currentPlayer === "B") {
            // If Player B wins, Player A should not receive steal mode
            showPopup(`Player ${currentPlayer} Wins!`, "Congratulations!");
            setStealMode(false);
            setStealPlayer(null); // Clear any potential steal opportunity
            setGameEnded(true); 

            const results = {
              winner: currentPlayer,
              playerA: { discs: putters.A, steals: steals.A, misses: misses.A },
              playerB: { discs: putters.B, steals: steals.B, misses: misses.B },
            };
      
            setGameResults(results);
            console.log("Game Results:", results);
            sendResultsToAPI(results); // Send data to API

            return; // Explicitly exit the function
        }
      }
  
      // Update turns and putters
      if (!stealMode) {
        setPutters((prev) => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] > 0 ? prev[currentPlayer] - 1 : prev[currentPlayer],
        }));
      }

      // Increment misses for invalid API data
      if (row === 0 && col === 0 && !useManualInput) {
        console.log("Missed Frisbee (API Miss)");
        setMisses((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
      }

      setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
    },
    [board, currentPlayer, winner, checkWinCondition, stealMode, stealPlayer, winningCells, useManualInput, misses.A, misses.B, putters.A, putters.B, steals.A, steals.B]
  );

  // Manual Input Handler
  const handleCellClick = (row, col) => {
    console.log("Cell clicked:", { row, col });
    if (gameEnded) return; // Do nothing if the game has ended
    if (!userHasThrown) {
      setUserHasThrown(true); // Start the game immediately if user makes a move
    }
    if (useManualInput) {
      if (stealMode && stealPlayer === currentPlayer) {
        // Stealing victory logic
        handleMove({ row, col });
      } else if (!stealMode) {
        // Normal move logic
        handleMove({ row, col });
      }
    }
  };

  const sendResultsToAPI = async (results) => {
    try {
        const response = await fetch(API_URL_gameresult, {
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


  // Simulate Antenna Input
  const simulateAntennaInput = useCallback(() => {
    const randomRow = Math.floor(Math.random() * 3);
    const randomCol = Math.floor(Math.random() * 3);
    handleMove({ row: randomRow, col: randomCol });
  }, [handleMove]);

  // Fetch Antenna Data from API
  const fetchAntennaDataFromAPI = useCallback(async () => {
    setIsLoading(true); // Show loader
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch antenna data");
      const data = await response.json();
      handleMove(data);
    } catch (error) {
      console.error("Error fetching antenna data:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  }, [API_URL, handleMove]);

  useEffect(() => {
    if (useManualInput) return; // Disable simulation/API when manual input is active

    const interval = setInterval(() => {
      if (useSimulatedInput) {
        simulateAntennaInput();
      } else {
        fetchAntennaDataFromAPI();
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [useSimulatedInput, fetchAntennaDataFromAPI, simulateAntennaInput, useManualInput]);

  useEffect(() => {
    console.log("Board state updated:", board);
  }, [board]);

  return (
    <div
      className="tictactoe-container"
      // style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {isLoading && <div className="api-loader"></div>}

      {!userHasThrown && !winner && (
        <Timer userHasThrown={userHasThrown} onStart={() => setUserHasThrown(true)} />
      )}

      {/* Pawn Icon */}
      <img src={pawn} alt="Pawn" className="pawn-icon" />
      <img src={star} alt="Star" className="star-icon" />
      <h1 className="game-title">Battle Tic Tac Toe</h1>

      <div className="scoreboard">
        <div className="team team-a">
          <h2 className="team-title">Team A</h2>
          <div className="stats-box">
            <img src={maleAvatar} alt="Team A Avatar" className="player-icon" />
            <p className="stat1">Discs <span>{putters.A}</span></p>
            <p className="stat1">Steals <span>{steals.A}</span></p>
            <p className="stat1">Misses <span> {misses.A}</span></p>
          </div>
        </div>

        <div className="game-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`board-cell ${
                    cell === "A" ? "player-a" : cell === "B" ? "player-b" : ""
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && (
                    <div
                      className={`circle ${
                        cell === "A" ? "circle-a" : cell === "B" ? "circle-b" : ""
                      }`} 
                    >
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="team team-b">
          <h2 className="team-title">Team B</h2>
          <div className="stats-box">
            <img src={profileIcon} alt="Team B Avatar" className="player-icon" />
            <p className="stat2">Discs <span>{putters.B}</span></p>
            <p className="stat2">Steals <span>{steals.B}</span></p>
            <p className="stat2">Misses <span> {misses.B}</span></p>
          </div>
        </div>
      </div>

      <img src={gameRemote} alt="Game Remote" className="game-remote" />
    </div>
  );
};

export default TicTacToeGame;

// copy 
// import React, { useState, useEffect, useCallback } from "react";
// import { notification } from "antd";
// import Timer from "./Timer"; // Import Timer Component
// import "./TicTacToeGame.css";
// import backgroundImage from "../assets/background-image.png";
// import gameRemote from "../assets/gameremote.png";
// import maleAvatar from "../assets/maleavatar.png";
// import profileIcon from "../assets/profile-icon.png";
// import pawn from "../assets/pawn.png";
// import star from "../assets/star.png";

// const TicTacToeGame = ({ navigateToSelection }) => {
//   const initialBoard = Array(3)
//     .fill(null)
//     .map(() => Array(3).fill(null)); // 3x3 grid
//   const [board, setBoard] = useState(initialBoard);
//   const [currentPlayer, setCurrentPlayer] = useState("A"); // Alternates between "A" and "B"
//   const [putters, setPutters] = useState({ A: 10, B: 10 }); // Putters left for each player
//   const [misses, setMisses] = useState({ A: 0, B: 0 }); // Misses for each player
//   const [steals, setSteals] = useState({ A: 0, B: 0 }); // Steals for each player
//   const [winner, setWinner] = useState(null); // Winner of the game, if any
//   const [isLoading, setIsLoading] = useState(false); // Loading state for API input
//   const [stealMode, setStealMode] = useState(false); // Flag for stealing victory mode
//   const [stealPlayer, setStealPlayer] = useState(null); // Track which player is in steal mode
//   const [winningCells, setWinningCells] = useState([]); // Cells forming the winning line
//   const useSimulatedInput = false; // Toggle for simulated data
//   const useManualInput = true; // Toggle for manual board clicks
//   const [userHasThrown, setUserHasThrown] = useState(false); // Track if the user has started
//   const [gameEnded, setGameEnded] = useState(false); // To mark the game as ended

//   // Dynamic Popup for Notifications
//   const showPopup = (message, description) => {
//     notification.open({
//         message,
//         description,
//         placement: "top",
//         duration: 5,
//         className: "custom-notification", // Custom class for notification
//     });
//   };

//   const API_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameSimulation/add"; // Replace with your actual API URL

//   // Check win condition
//   const checkWinCondition = useCallback((board, player) => {
//     const winLines = [
//       [[0, 0], [0, 1], [0, 2]],
//       [[1, 0], [1, 1], [1, 2]],
//       [[2, 0], [2, 1], [2, 2]],
//       [[0, 0], [1, 0], [2, 0]],
//       [[0, 1], [1, 1], [2, 1]],
//       [[0, 2], [1, 2], [2, 2]],
//       [[0, 0], [1, 1], [2, 2]],
//       [[0, 2], [1, 1], [2, 0]],
//     ];
//     for (const line of winLines) {
//       if (line.every(([row, col]) => board[row][col] === player)) {
//         setWinningCells(line);
//         return true;
//       }
//     }
//     return false;
//   }, []);

//   useEffect(() => {
//     // Check for draw condition when putters are updated
//     if (
//       putters.A === 0 &&
//       putters.B === 0 &&
//       !checkWinCondition(board, "A") &&
//       !checkWinCondition(board, "B")
//     ) {
//       console.log("Draw condition detected through useEffect.");
//       showPopup("Game Draw", "No more moves left!");
//       setGameEnded(true); 
//       return;
//     }
//   }, [putters, board, checkWinCondition]);
  

//   // Update game state based on antenna data
//   const handleMove = useCallback(
//     ({ row, col }) => {
//       console.log("Handling move at:", { row, col });
      
//       if (winner && !stealMode) return; // Game already ended unless in steal mode
      

//       const newBoard = board.map((r, rIdx) =>
//         r.map((c, cIdx) => {
//           if (rIdx === row && cIdx === col) {
//             if (stealMode && stealPlayer === currentPlayer) {
//               // console.log("Winning Cells Before Neutralization:", winningCells);
//               console.log("Clicked Cell:", { row, col });
//               if (winningCells.some(([winRow, winCol]) => winRow === row && winCol === col)) {
//                 console.log("Neutralizing Winning Cell");
//                 setSteals((prev) => {
//                   const updatedSteals = { ...prev, [currentPlayer]: prev[currentPlayer] + 1 };
//                   console.log("Updated Steals:", updatedSteals);
//                   return updatedSteals;
//                 });
//                 const updatedWinningCells = winningCells.filter(
//                   ([winRow, winCol]) => !(winRow === row && winCol === col)
//                 );
//                 setPutters((prev) => ({
//                   ...prev,
//                   [currentPlayer]: prev[currentPlayer] > 0 ? prev[currentPlayer] - 1 : prev[currentPlayer],
//                 }));
//                 setWinningCells(updatedWinningCells);
//                 // console.log("Winning Cells After Neutralization:", updatedWinningCells);
//                 return null; // Neutralize the winning cell
//               } else {
//                 console.log('Missed - Not a Winning Cell! ');
//                 setMisses((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
//                 return c; // Count as a miss if clicking outside winning cells
//               }
//             } else if (!stealMode && c === currentPlayer) {
//               setMisses((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
//               return currentPlayer; // No change if player already owns the cell
//             } else if (c === null) {
//               return currentPlayer; // Claim neutral target
//             } else if (c !== currentPlayer) {
//               setSteals((prev) => {
//                 const updatedSteals = { ...prev, [currentPlayer]: prev[currentPlayer] + 1 };
//                 console.log("Updated Steals:", updatedSteals);
//                 return updatedSteals;
//               });
//               const updatedWinningCells = winningCells.filter(
//                 ([winRow, winCol]) => !(winRow === row && winCol === col)
//               );
//               setWinningCells(updatedWinningCells);
//               return null; // Neutralize the cell if claimed by the opponent
//             }
//           }
//           return c;
//         })
//       );

//       setBoard(newBoard);

//       if (stealMode) {
//         console.log("Steal Mode Active:", stealMode);
//         console.log("Winning Cells Before Attempt:", winningCells);
      
//         // Check if all winning cells are neutralized
//         if (winningCells.length === 0) {
//           console.log("All Winning Cells Neutralized");
//           setWinner(null); // Reset winner
//           setStealPlayer(null); // Reset after neutralization
//           setStealMode(false); // End steal mode
//           return;
//         } 
//         // Check for invalid steal
//         else if (!winningCells.some(([winRow, winCol]) => winRow === row && winCol === col)) {
//           console.log("Invalid Steal Attempt by Player:", stealPlayer);
//          // notify(`Invalid Steal Attempt! Player ${stealPlayer} loses.`);
         
//           showPopup(`Invalid Steal Attempt! Player ${stealPlayer} loses.`, "Alas!");

//           setWinner(currentPlayer === "A" ? "B" : "A"); // Player A wins
//           setStealMode(false); // End steal mode
//           return;
//         } 
//         // Proceed with valid steal
//         else {
//           console.log("Valid Steal Attempt!");
      
//           // Just disable steal mode and continue gameplay
//           console.log("Steal Mode Disabled After Neutralizing a Cell");
          
//           const updatedWinningCells = winningCells.filter(
//             ([winRow, winCol]) => !(winRow === row && winCol === col)
//           );
//           setWinningCells(updatedWinningCells);
          
//           setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
//           setStealMode(false); // Disable steal mode immediately
//           setWinner(null); // Reset winner for continued gameplay
//           return; // Exit after processing steal mode logic
//         }
//       }

//       if (!stealMode && checkWinCondition(newBoard, currentPlayer)) {
//         setWinner(currentPlayer);
    
//         if (currentPlayer === "A") {
//             if (stealPlayer === null) {
//                 // First-time win by Player A
//                 //notify(`Player ${currentPlayer} wins! Player B gets a steal chance!`);
//                 showPopup(`Player ${currentPlayer} Wins!`, "Player B gets a steal chance!");
//                 setStealPlayer("B");
//                 setStealMode(true);
//             } else if (stealPlayer === "B") {
//                 // Subsequent win by Player A, allow Player B to steal again
//                 //notify(`Player ${currentPlayer} wins again! Player B gets another steal chance!`);
//                 showPopup(`Player ${currentPlayer} Wins!`, "Player B gets a steal chance!");
//                 setStealMode(true);
//             }
//         } else if (currentPlayer === "B") {
//             // If Player B wins, Player A should not receive steal mode
//             showPopup(`Player ${currentPlayer} Wins!`, "Congratulations!");
//             setStealMode(false);
//             setStealPlayer(null); // Clear any potential steal opportunity
//             setGameEnded(true); 
//             return; // Explicitly exit the function
//         }
//       }
  
//       // Update turns and putters
//       if (!stealMode) {
//         setPutters((prev) => ({
//           ...prev,
//           [currentPlayer]: prev[currentPlayer] > 0 ? prev[currentPlayer] - 1 : prev[currentPlayer],
//         }));
//       }

//       // Increment misses for invalid API data
//       if (row === 0 && col === 0 && !useManualInput) {
//         console.log("Missed Frisbee (API Miss)");
//         setMisses((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
//       }

//       setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
//     },
//     [board, currentPlayer, winner, checkWinCondition, stealMode, stealPlayer, winningCells, useManualInput]
//   );

//   // Manual Input Handler
//   const handleCellClick = (row, col) => {
//     console.log("Cell clicked:", { row, col });
//     if (gameEnded) return; // Do nothing if the game has ended
//     if (!userHasThrown) {
//       setUserHasThrown(true); // Start the game immediately if user makes a move
//     }
//     if (useManualInput) {
//       if (stealMode && stealPlayer === currentPlayer) {
//         // Stealing victory logic
//         handleMove({ row, col });
//       } else if (!stealMode) {
//         // Normal move logic
//         handleMove({ row, col });
//       }
//     }
//   };

//   // Simulate Antenna Input
//   const simulateAntennaInput = useCallback(() => {
//     const randomRow = Math.floor(Math.random() * 3);
//     const randomCol = Math.floor(Math.random() * 3);
//     handleMove({ row: randomRow, col: randomCol });
//   }, [handleMove]);

//   // Fetch Antenna Data from API
//   const fetchAntennaDataFromAPI = useCallback(async () => {
//     setIsLoading(true); // Show loader
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) throw new Error("Failed to fetch antenna data");
//       const data = await response.json();
//       handleMove(data);
//     } catch (error) {
//       console.error("Error fetching antenna data:", error);
//     } finally {
//       setIsLoading(false); // Hide loader
//     }
//   }, [API_URL, handleMove]);

//   useEffect(() => {
//     if (useManualInput) return; // Disable simulation/API when manual input is active

//     const interval = setInterval(() => {
//       if (useSimulatedInput) {
//         simulateAntennaInput();
//       } else {
//         fetchAntennaDataFromAPI();
//       }
//     }, 2000); // Poll every 2 seconds

//     return () => clearInterval(interval);
//   }, [useSimulatedInput, fetchAntennaDataFromAPI, simulateAntennaInput, useManualInput]);

//   useEffect(() => {
//     console.log("Board state updated:", board);
//   }, [board]);

//   return (
//     <div
//       className="tictactoe-container"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       {isLoading && <div className="api-loader"></div>}

//       {!userHasThrown && !winner && (
//         <Timer userHasThrown={userHasThrown} onStart={() => setUserHasThrown(true)} />
//       )}

//       {/* Pawn Icon */}
//       <img src={pawn} alt="Pawn" className="pawn-icon" />
//       <img src={star} alt="Star" className="star-icon" />
//       <h1 className="game-title">Battle Tic Tac Toe</h1>

//       <div className="scoreboard">
//         <div className="team team-a">
//           <h2 className="team-title">Team A</h2>
//           <div className="stats-box">
//             <img src={maleAvatar} alt="Team A Avatar" className="player-icon" />
//             <p className="stat1">Discs <span>{putters.A}</span></p>
//             <p className="stat1">Steals <span>{steals.A}</span></p>
//             <p className="stat1">Misses <span> {misses.A}</span></p>
//           </div>
//         </div>

//         <div className="game-board">
//           {board.map((row, rowIndex) => (
//             <div key={rowIndex} className="board-row">
//               {row.map((cell, colIndex) => (
//                 <div
//                   key={colIndex}
//                   className={`board-cell ${
//                     cell === "A" ? "player-a" : cell === "B" ? "player-b" : ""
//                   }`}
//                   onClick={() => handleCellClick(rowIndex, colIndex)}
//                 >
//                   {cell && (
//                     <div
//                       className={`circle ${
//                         cell === "A" ? "circle-a" : cell === "B" ? "circle-b" : ""
//                       }`} 
//                     >
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         <div className="team team-b">
//           <h2 className="team-title">Team B</h2>
//           <div className="stats-box">
//             <img src={profileIcon} alt="Team B Avatar" className="player-icon" />
//             <p className="stat2">Discs <span>{putters.B}</span></p>
//             <p className="stat2">Steals <span>{steals.B}</span></p>
//             <p className="stat2">Misses <span> {misses.B}</span></p>
//           </div>
//         </div>
//       </div>

//       <img src={gameRemote} alt="Game Remote" className="game-remote" />
//     </div>
//   );
// };

// export default TicTacToeGame;
