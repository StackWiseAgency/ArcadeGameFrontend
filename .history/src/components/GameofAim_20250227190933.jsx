
import React, { useState, useEffect, useCallback } from "react";
import { notification, Card, Typography } from "antd";
import * as signalR from "@microsoft/signalr";
import Timer from "./Timer"; // Import Timer Component
import gameRemote from "../assets/gameremote.png";
import maleAvatar from "../assets/maleavatar.png";
import profileIcon from "../assets/profile-icon.png";
import pawn from "../assets/pawn.png";
import star from "../assets/star.png";
import backgroundImage from "../assets/background-image.png";
import "./GameofAim.css";
const { Title, Text } = Typography;
const GameofAim = () => {
  // Initial States
  const initialWall = Array(3).fill(null).map(() => Array(3).fill(null)); // 3x3 grid
  const [targetWall, setTargetWall] = useState(initialWall);
  const [currentPlayer, setCurrentPlayer] = useState(null); // "Player 1" or "Player 2"
  const [discs, setDiscs] = useState({ total: 20, player1: 10, player2: 10 });
  const [letters, setLetters] = useState({ player1: "", player2: "" }); // AIM letters
  const [scores, setScores] = useState({ player1: 0, player2: 0 }); // Arcade scores
  const [target, setTarget] = useState(null); // Current target to match
  const [winner, setWinner] = useState(null); // Winner of the game
  const [userHasThrown, setUserHasThrown] = useState(false); // To track if the user has started
  const [gameResults, setGameResults] = useState(null); // Store game results

  const API_result_send = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/GameStatistics/createGameStatistics";


  const useManualInput = true; // Flag for manual input
  const useWebSocket = false; // Flag for WebSocket connection

  const showPopup = (message, description) => {
    notification.open({
      message,
      description,
      placement: "top",
      duration: 5,
      className: "custom-notification-aim",
    });
  };

  useEffect(() => {
    if (!currentPlayer) {
      const randomPlayer = Math.random() < 0.5 ? "player1" : "player2";
      console.log(`Game started. Randomly selected starting player: ${randomPlayer}`);
      setCurrentPlayer(randomPlayer);
    }
  }, [currentPlayer]);

  const handleMove = useCallback(
    ({ row, col }) => {
      if (winner) {
        console.log("Game has ended. No further moves allowed.");
        return; // Game has ended
      }

      console.log(`Handling move: Row=${row}, Col=${col}`);

      if (target) {
        console.log(`Removing target regardless of match or miss.`);
        setTarget(null);
        setTargetWall((prev) =>
          prev.map((r, rIdx) =>
            r.map((c, cIdx) => (rIdx === target[0] && cIdx === target[1] ? null : c))
          )
        );

        if (target[0] === row && target[1] === col) {
          console.log(`Player ${currentPlayer} matched the target!`);
          // showPopup("Successful Match", `Player ${currentPlayer} matched the target!`);
          setScores((prev) => ({
            ...prev,
            [currentPlayer]: prev[currentPlayer] + 10,
          }));
          // setTarget(null);
          // setTargetWall((prev) =>
          //   prev.map((r, rIdx) =>
          //     r.map((c, cIdx) => (rIdx === row && cIdx === col ? null : c))
          //   )
          // );
          setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
        } else {
          console.log(`Player ${currentPlayer} missed the target.`);
          // showPopup("Missed Target", `Player ${currentPlayer} missed the target.`);
          setLetters((prev) => {
            const updatedLetters = { ...prev };
            const currentLetters = prev[currentPlayer].length;
            if (
              currentLetters === 0 ||
              prev[Object.keys(prev).find((key) => key !== currentPlayer)].length >= currentLetters
            ) {
              updatedLetters[currentPlayer] = prev[currentPlayer] + "AIM"[currentLetters];
              if (updatedLetters[currentPlayer] === "AIM") {
                console.log(`Player ${currentPlayer} has spelled AIM. Game over.`);
                setWinner(currentPlayer === "player1" ? "player2" : "player1");
              }
            }
            return updatedLetters;
          });
          
          setCurrentPlayer(currentPlayer); // Allow the player who missed to set the next target
        }
      } else {
        console.log(`Player ${currentPlayer} is setting a target at Row=${row}, Col=${col}`);
        const newWall = targetWall.map((r, rIdx) =>
          r.map((c, cIdx) => (rIdx === row && cIdx === col ? currentPlayer : c))
        );
        setTargetWall(newWall);
        setTarget([row, col]);
        // showPopup("Target Set", `Player ${currentPlayer} set a target!`);
        setScores((prev) => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + 10,
        }));
        setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
      }

      setDiscs((prev) => {
        console.log(`Updating discs: Player=${currentPlayer}, Remaining=${prev[currentPlayer] - 1}`);
        return {
          ...prev,
          [currentPlayer]: prev[currentPlayer] - 1,
          total: prev.total - 1,
        };
      });
    },
    [targetWall, target, winner, currentPlayer]
  );

  const handleCellClick = useCallback(
    (row, col) => {
      if (winner) {
        console.log("Game has ended. Cell clicks are disabled.");
        return;
      }
      if (!userHasThrown) {
        setUserHasThrown(true);
        console.log("Game started: User has thrown.");
      }
      if (useManualInput) {
        console.log(`Manual input: Cell clicked at Row=${row}, Col=${col}`);
        handleMove({ row, col });
      } else if (useWebSocket) {
        console.log(`WebSocket input: Cell clicked at Row=${row}, Col=${col}`);
        handleMove({ row, col });
      }
    },
    [winner, userHasThrown, useManualInput, useWebSocket, handleMove]
  );


  useEffect(() => {
    if (!useWebSocket || winner) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://arcadegamebackendapi20241227164011.azurewebsites.net/gameHub", {
        transport: signalR.HttpTransportType.WebSockets |
                   signalR.HttpTransportType.ServerSentEvents |
                   signalR.HttpTransportType.LongPolling,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("SignalR connection established.");
        connection.on("ReceiveMove", (row, col) => {
          console.log(`Move received: Row=${row}, Col=${col}`);
          handleCellClick(row, col); 
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      if (connection) {
        connection.stop()
          .then(() => console.log("SignalR connection stopped."))
          .catch((err) => console.error("Error stopping SignalR connection:", err));
      }
    };
  }, [useWebSocket, winner, handleCellClick]);

  useEffect(() => {
    if (discs.total === 0 && !winner) {
      const p1Letters = letters.player1.length;
      const p2Letters = letters.player2.length;

      console.log("All discs used. Determining winner:", { player1: p1Letters, player2: p2Letters });
      setWinner(p1Letters < p2Letters ? "player1" : "player2");
      const finalWinner = p1Letters < p2Letters ? "player1" : "player2";
    setWinner(finalWinner);

    const results = {
      winner: finalWinner,
      player1: { score: scores.player1, discsLeft: discs.player1, letters: letters.player1 },
      player2: { score: scores.player2, discsLeft: discs.player2, letters: letters.player2 },
    };

    setGameResults(results);
    console.log("Game Results:", results);
   
    }
  }, [discs, letters, winner, scores.player1, scores.player2]);

  const sendResultsToAPI = async (results) => {
    try {
      const response = await fetch(API_result_send, {
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

  const renderResultScreen = () => (
    <div className="result-screen-aim">
      <Card
        title="Game Over"
        bordered={false}
        style={{
          width: '600px', 
          margin: '0 auto',
          textAlign: 'center',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#6cca5c',
          borderRadius: '10px', 
        }}
      >
        <Title level={2} className="winner-aim">
          {winner === "player1" ? "Player 1 Wins!" : "Player 2 Wins!"}
        </Title>
        <Text type="secondary">
          Congratulations! The game has ended. Thank you for playing.
        </Text>
      </Card>
    </div>
  );

  return (
    // <div
    //   className="tictactoe-container-aim"
    //   style={{ backgroundImage: `url(${backgroundImage})` }}
    // >
      
    //   {winner ? renderResultScreen() : (
    //     <>
    //   {!userHasThrown && !winner && (
    //     <Timer userHasThrown={userHasThrown} onStart={() => setUserHasThrown(true)} />
    //   )}

    //   <img src={pawn} alt="Pawn" className="pawn-icon-aim" />
    //   <img src={star} alt="Star" className="star-icon-aim" />
    //   <h1 className="game-title-aim">Game of AIM</h1>

    //   <div className="scoreboard-aim">
    //     <div className="team-aim-team-a-aim">
    //       <h2 className="team-title-aim">Player 1</h2>
    //       <div className="stats-box-aim">
    //         <img src={maleAvatar} alt="Player 1 Avatar" className="player-icon-aim" />
    //         <p className="stat1-aim">Score <span>{scores.player1}</span></p>
    //         <p className="stat1-aim">Discs <span>{discs.player1}</span></p>
    //         <p className="stat1-aim">Letters <span>{letters.player1}</span></p>
    //       </div>
    //     </div>
    //     </div>
    <div
    className="tictactoe-container-aim"
    style={{ backgroundImage: `url(${backgroundImage})`, position: "relative", zIndex: 0 }}  // Ensure the background is at the base layer
  >
    {/* Result Screen */}
    {winner && (
      // <div className="result-screen-container">
        {renderResultScreen()} {/* Only render result screen if the winner is present */}
      
    )}

    {/* Game Content */}
    {!winner && (
      <>
        {!userHasThrown && !winner && (
          <Timer userHasThrown={userHasThrown} onStart={() => setUserHasThrown(true)} />
        )}

        <img src={pawn} alt="Pawn" className="pawn-icon-aim" />
        <img src={star} alt="Star" className="star-icon-aim" />
        <h1 className="game-title-aim">Game of AIM</h1>

        <div className="scoreboard-aim">
          <div className="team-aim-team-a-aim">
            <h2 className="team-title-aim">Player 1</h2>
            <div className="stats-box-aim">
              <img src={maleAvatar} alt="Player 1 Avatar" className="player-icon-aim" />
              <p className="stat1-aim">Score <span>{scores.player1}</span></p>
              <p className="stat1-aim">Discs <span>{discs.player1}</span></p>
              <p className="stat1-aim">Letters <span>{letters.player1}</span></p>
            </div>
          </div>
        </div>

        <div className="game-board-aim">
          {targetWall.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row-aim">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`board-cell-aim ${cell === "player1" ? "player-a-aim" : cell === "player2" ? "player-b-aim" : ""}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && (
                    <div
                      className={`circle-aim ${
                        cell === "player1" ? "circle-a-aim" : "circle-b-aim"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="scoreboard-aim1">
        <div className="team-aim-team-b-aim">
          <h2 className="team-title-aim">Player 2</h2>
          <div className="stats-box-aim">
            <img src={profileIcon} alt="Player 2 Avatar" className="player-icon-aim" />
            <p className="stat2-aim">Score <span>{scores.player2}</span></p>
            <p className="stat2-aim">Discs <span>{discs.player2}</span></p>
            <p className="stat2-aim">Letters <span>{letters.player2}</span></p>
          </div>
        </div>
      </div>
      

      <img src={gameRemote} alt="Game Remote" className="game-remote-aim" />
      </>
    )}
    
    </div>
  );
};

export default GameofAim;


// import React, { useState, useEffect, useCallback } from "react";
// import { notification } from "antd";
// import * as signalR from "@microsoft/signalr";
// import Timer from "./Timer"; // Import Timer Component
// import gameRemote from "../assets/gameremote.png";
// import maleAvatar from "../assets/maleavatar.png";
// import profileIcon from "../assets/profile-icon.png";
// import pawn from "../assets/pawn.png";
// import star from "../assets/star.png";
// import "./GameofAim.css";

// const GameofAim = () => {
//   // Initial States
//   const initialWall = Array(3).fill(null).map(() => Array(3).fill(null)); // 3x3 grid
//   const [targetWall, setTargetWall] = useState(initialWall);
//   const [currentPlayer, setCurrentPlayer] = useState(null); // "Player 1" or "Player 2"
//   const [discs, setDiscs] = useState({ total: 20, player1: 10, player2: 10 });
//   const [letters, setLetters] = useState({ player1: "", player2: "" }); // AIM letters
//   const [scores, setScores] = useState({ player1: 0, player2: 0 }); // Arcade scores
//   const [target, setTarget] = useState(null); // Current target to match
//   const [winner, setWinner] = useState(null); // Winner of the game

//   const useManualInput = true; // Flag for manual input
//   const useWebSocket = false; // Flag for WebSocket connection

//   const showPopup = (message, description) => {
//     notification.open({
//       message,
//       description,
//       placement: "top",
//       duration: 5,
//       className: "custom-notification-aim",
//     });
//   };

//   useEffect(() => {
//     if (!currentPlayer) {
//       const randomPlayer = Math.random() < 0.5 ? "player1" : "player2";
//       console.log(`Game started. Randomly selected starting player: ${randomPlayer}`);
//       setCurrentPlayer(randomPlayer);
//     }
//   }, [currentPlayer]);

//   const handleMove = useCallback(
//     ({ row, col }) => {
//       if (winner) {
//         console.log("Game has ended. No further moves allowed.");
//         return; // Game has ended
//       }

//       console.log(`Handling move: Row=${row}, Col=${col}`);

//       if (target) {
//         if (target[0] === row && target[1] === col) {
//           console.log(`Player ${currentPlayer} matched the target!`);
//           showPopup("Successful Match", `Player ${currentPlayer} matched the target!`);
//           setScores((prev) => ({
//             ...prev,
//             [currentPlayer]: prev[currentPlayer] + 10,
//           }));
//           setTarget(null);
//           setTargetWall((prev) =>
//             prev.map((r, rIdx) =>
//               r.map((c, cIdx) => (rIdx === row && cIdx === col ? null : c))
//             )
//           );
//           setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//         } else {
//           console.log(`Player ${currentPlayer} missed the target.`);
//           showPopup("Missed Target", `Player ${currentPlayer} missed the target.`);
//           setLetters((prev) => {
//             const updatedLetters = { ...prev };
//             const currentLetters = prev[currentPlayer].length;
//             if (
//               currentLetters === 0 ||
//               prev[Object.keys(prev).find((key) => key !== currentPlayer)].length >= currentLetters
//             ) {
//               updatedLetters[currentPlayer] = prev[currentPlayer] + "AIM"[currentLetters];
//               if (updatedLetters[currentPlayer] === "AIM") {
//                 console.log(`Player ${currentPlayer} has spelled AIM. Game over.`);
//                 setWinner(currentPlayer === "player1" ? "player2" : "player1");
//               }
//             }
//             return updatedLetters;
//           });
//           setCurrentPlayer(currentPlayer); // Allow the player who missed to set the next target
//         }
//       } else {
//         console.log(`Player ${currentPlayer} is setting a target at Row=${row}, Col=${col}`);
//         const newWall = targetWall.map((r, rIdx) =>
//           r.map((c, cIdx) => (rIdx === row && cIdx === col ? currentPlayer : c))
//         );
//         setTargetWall(newWall);
//         setTarget([row, col]);
//         showPopup("Target Set", `Player ${currentPlayer} set a target!`);
//         setScores((prev) => ({
//           ...prev,
//           [currentPlayer]: prev[currentPlayer] + 10,
//         }));
//         setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//       }

//       setDiscs((prev) => {
//         console.log(`Updating discs: Player=${currentPlayer}, Remaining=${prev[currentPlayer] - 1}`);
//         return {
//           ...prev,
//           [currentPlayer]: prev[currentPlayer] - 1,
//           total: prev.total - 1,
//         };
//       });
//     },
//     [targetWall, target, winner, currentPlayer]
//   );

//   const handleCellClick = (row, col) => {
//     if (winner) {
//       console.log("Game has ended. Cell clicks are disabled.");
//       return;
//     }
//     if (useManualInput) {
//       console.log(`Manual input: Cell clicked at Row=${row}, Col=${col}`);
//       handleMove({ row, col });
//     }
//   };

//   useEffect(() => {
//     if (!useWebSocket || winner) return;

//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://arcadegamebackendapi20241227164011.azurewebsites.net/gameHub", {
//         transport: signalR.HttpTransportType.WebSockets |
//                    signalR.HttpTransportType.ServerSentEvents |
//                    signalR.HttpTransportType.LongPolling,
//       })
//       .configureLogging(signalR.LogLevel.Information)
//       .withAutomaticReconnect()
//       .build();

//     connection.start()
//       .then(() => {
//         console.log("SignalR connection established.");
//         connection.on("ReceiveMove", (row, col) => {
//           console.log(`Move received: Row=${row}, Col=${col}`);
//           handleMove({ row, col });
//         });
//       })
//       .catch((err) => console.error("SignalR connection error:", err));

//     return () => {
//       if (connection) {
//         connection.stop()
//           .then(() => console.log("SignalR connection stopped."))
//           .catch((err) => console.error("Error stopping SignalR connection:", err));
//       }
//     };
//   }, [useWebSocket, winner, handleMove]);

//   useEffect(() => {
//     if (discs.total === 0 && !winner) {
//       const p1Letters = letters.player1.length;
//       const p2Letters = letters.player2.length;
//       console.log("All discs used. Determining winner:", { player1: p1Letters, player2: p2Letters });
//       setWinner(p1Letters < p2Letters ? "player1" : "player2");
//     }
//   }, [discs, letters, winner]);

//   return (
//     <div className="tictactoe-container-aim">
//       <img src={pawn} alt="Pawn" className="pawn-icon-aim" />
//       <img src={star} alt="Star" className="star-icon-aim" />
//       <h1 className="game-title-aim">Game of AIM</h1>
  
//       <div className="scoreboard-aim">
//         <div className="team-aim team-a-aim">
//           <h2 className="team-title-aim">Player 1</h2>
//           <img src={maleAvatar} alt="Player 1 Avatar" className="player-icon-aim" />
//           <p className="stat1-aim">Score: <span>{scores.player1}</span></p>
//           <p className="stat1-aim">Letters: <span>{letters.player1}</span></p>
//         </div>
//         <div className="team-aim team-b-aim">
//           <h2 className="team-title-aim">Player 2</h2>
//           <img src={profileIcon} alt="Player 2 Avatar" className="player-icon-aim" />
//           <p className="stat2-aim">Score: <span>{scores.player2}</span></p>
//           <p className="stat2-aim">Letters: <span>{letters.player2}</span></p>
//         </div>
//       </div>
  
//       {!winner && <Timer onStart={() => setCurrentPlayer(currentPlayer)} />}
  
//       <div className="game-board-aim">
//         {targetWall.map((row, rowIndex) => (
//           <div key={rowIndex} className="board-row-aim">
//             {row.map((cell, colIndex) => (
//               <div
//                 key={colIndex}
//                 className={`board-cell-aim ${cell ? (cell === "player1" ? "player-a-aim" : "player-b-aim") : ""}`}
//                 onClick={() => handleCellClick(rowIndex, colIndex)}
//               >
//                 {cell && <div className={`circle-aim ${cell === "player1" ? "circle-a-aim" : "circle-b-aim"}`}></div>}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
  
//       {winner && <h2 className="winner-aim">{winner === "player1" ? "Player 1 Wins!" : "Player 2 Wins!"}</h2>}
  
//       <img src={gameRemote} alt="Game Remote" className="game-remote-aim" />
//     </div>
//   );
  
// };

// export default GameofAim;


// import React, { useState, useEffect, useCallback } from "react";
// import { notification } from "antd";
// import * as signalR from "@microsoft/signalr";
// import "./GameofAim.css";

// const GameofAim = () => {
//   // Initial States
//   const initialWall = Array(3).fill(null).map(() => Array(3).fill(null)); // 3x3 grid
//   const [targetWall, setTargetWall] = useState(initialWall);
//   const [currentPlayer, setCurrentPlayer] = useState(null); // "Player 1" or "Player 2"
//   const [discs, setDiscs] = useState({ total: 20, player1: 10, player2: 10 });
//   const [letters, setLetters] = useState({ player1: "", player2: "" }); // AIM letters
//   const [scores, setScores] = useState({ player1: 0, player2: 0 }); // Arcade scores
//   const [target, setTarget] = useState(null); // Current target to match
//   const [winner, setWinner] = useState(null); // Winner of the game

//   const useManualInput = true; // Flag for manual input
//   const useWebSocket = false; // Flag for WebSocket connection

//   const showPopup = (message, description) => {
//     notification.open({
//       message,
//       description,
//       placement: "top",
//       duration: 5,
//       className: "custom-notification-aim",
//     });
//   };

//   useEffect(() => {
//     if (!currentPlayer) {
//       const randomPlayer = Math.random() < 0.5 ? "player1" : "player2";
//       console.log(`Game started. Randomly selected starting player: ${randomPlayer}`);
//       setCurrentPlayer(randomPlayer);
//     }
//   }, [currentPlayer]);

//   const handleMove = useCallback(
//     ({ row, col }) => {
//       if (winner) {
//         console.log("Game has ended. No further moves allowed.");
//         return; // Game has ended
//       }

//       console.log(`Handling move: Row=${row}, Col=${col}`);

//       if (target) {
//         if (target[0] === row && target[1] === col) {
//           console.log(`Player ${currentPlayer} matched the target!`);
//           showPopup("Successful Match", `Player ${currentPlayer} matched the target!`);
//           setScores((prev) => ({
//             ...prev,
//             [currentPlayer]: prev[currentPlayer] + 10,
//           }));
//           setTarget(null);
//           setTargetWall((prev) =>
//             prev.map((r, rIdx) =>
//               r.map((c, cIdx) => (rIdx === row && cIdx === col ? null : c))
//             )
//           );
//           setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//         } else {
//           console.log(`Player ${currentPlayer} missed the target.`);
//           showPopup("Missed Target", `Player ${currentPlayer} missed the target.`);
//           setLetters((prev) => {
//             const updatedLetters = { ...prev };
//             const currentLetters = prev[currentPlayer].length;
//             if (
//               currentLetters === 0 ||
//               prev[Object.keys(prev).find((key) => key !== currentPlayer)].length >= currentLetters
//             ) {
//               updatedLetters[currentPlayer] = prev[currentPlayer] + "AIM"[currentLetters];
//               if (updatedLetters[currentPlayer] === "AIM") {
//                 console.log(`Player ${currentPlayer} has spelled AIM. Game over.`);
//                 setWinner(currentPlayer === "player1" ? "player2" : "player1");
//               }
//             }
//             return updatedLetters;
//           });
//           setCurrentPlayer(currentPlayer); // Allow the player who missed to set the next target
//         }
//       } else {
//         console.log(`Player ${currentPlayer} is setting a target at Row=${row}, Col=${col}`);
//         const newWall = targetWall.map((r, rIdx) =>
//           r.map((c, cIdx) => (rIdx === row && cIdx === col ? currentPlayer : c))
//         );
//         setTargetWall(newWall);
//         setTarget([row, col]);
//         showPopup("Target Set", `Player ${currentPlayer} set a target!`);
//         setScores((prev) => ({
//           ...prev,
//           [currentPlayer]: prev[currentPlayer] + 10,
//         }));
//         setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//       }

//       setDiscs((prev) => {
//         console.log(`Updating discs: Player=${currentPlayer}, Remaining=${prev[currentPlayer] - 1}`);
//         return {
//           ...prev,
//           [currentPlayer]: prev[currentPlayer] - 1,
//           total: prev.total - 1,
//         };
//       });
//     },
//     [targetWall, target, winner, currentPlayer]
//   );

//   const handleCellClick = (row, col) => {
//     if (winner) {
//       console.log("Game has ended. Cell clicks are disabled.");
//       return;
//     }
//     if (useManualInput) {
//       console.log(`Manual input: Cell clicked at Row=${row}, Col=${col}`);
//       handleMove({ row, col });
//     }
//   };

//   useEffect(() => {
//     if (!useWebSocket || winner) return;

//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://arcadegamebackendapi20241227164011.azurewebsites.net/gameHub", {
//         transport: signalR.HttpTransportType.WebSockets |
//                    signalR.HttpTransportType.ServerSentEvents |
//                    signalR.HttpTransportType.LongPolling,
//       })
//       .configureLogging(signalR.LogLevel.Information)
//       .withAutomaticReconnect()
//       .build();

//     connection.start()
//       .then(() => {
//         console.log("SignalR connection established.");
//         connection.on("ReceiveMove", (row, col) => {
//           console.log(`Move received: Row=${row}, Col=${col}`);
//           handleMove({ row, col });
//         });
//       })
//       .catch((err) => console.error("SignalR connection error:", err));

//     return () => {
//       if (connection) {
//         connection.stop()
//           .then(() => console.log("SignalR connection stopped."))
//           .catch((err) => console.error("Error stopping SignalR connection:", err));
//       }
//     };
//   }, [useWebSocket, winner, handleMove]);

//   useEffect(() => {
//     if (discs.total === 0 && !winner) {
//       const p1Letters = letters.player1.length;
//       const p2Letters = letters.player2.length;
//       console.log("All discs used. Determining winner:", { player1: p1Letters, player2: p2Letters });
//       setWinner(p1Letters < p2Letters ? "player1" : "player2");
//     }
//   }, [discs, letters, winner]);

//   return (
//     <div className="tictactoe-container-aim">
//       <h1 className="game-title-aim">Game of AIM</h1>

//       <div className="scoreboard-aim">
//         <div className="team-aim team-a-aim">
//           <h2 className="team-title-aim">Player 1</h2>
//           <p className="stat1-aim">Score: <span>{scores.player1}</span></p>
//           <p className="stat1-aim">Letters: <span>{letters.player1}</span></p>
//         </div>
//         <div className="team-aim team-b-aim">
//           <h2 className="team-title-aim">Player 2</h2>
//           <p className="stat2-aim">Score: <span>{scores.player2}</span></p>
//           <p className="stat2-aim">Letters: <span>{letters.player2}</span></p>
//         </div>
//       </div>

//       <div className="game-board-aim">
//         {targetWall.map((row, rowIndex) => (
//           <div key={rowIndex} className="board-row-aim">
//             {row.map((cell, colIndex) => (
//               <div
//                 key={colIndex}
//                 className={`board-cell-aim ${cell ? (cell === "player1" ? "player-a-aim" : "player-b-aim") : ""}`}
//                 onClick={() => handleCellClick(rowIndex, colIndex)}
//               >
//                 {cell && <div className={`circle-aim ${cell === "player1" ? "circle-a-aim" : "circle-b-aim"}`}></div>}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       {winner && <h2 className="winner-aim">{winner === "player1" ? "Player 1 Wins!" : "Player 2 Wins!"}</h2>}
//     </div>
//   );
// };

// export default GameofAim;

