import React, { useState, useEffect } from "react";
import "./GameStartTimer.css";

const GameStartTimer = ({ onGameStart, onUserAction }) => {
  const [startCountdown, setStartCountdown] = useState(null); // Countdown for auto-start
  const [userActionTimeout, setUserActionTimeout] = useState(5); // Timeout for user to throw the first disc
  const [isCountdownVisible, setIsCountdownVisible] = useState(false); // Control display of countdown

  useEffect(() => {
    // Timer for waiting on user action (5 seconds)
    const actionTimer = setInterval(() => {
      setUserActionTimeout((prev) => {
        if (prev === 1) {
          clearInterval(actionTimer);
          setIsCountdownVisible(true); // Show countdown
          startCountdownTimer(); // Start countdown
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer
    return () => clearInterval(actionTimer);
  }, []);

  const startCountdownTimer = () => {
    setStartCountdown(3); // Initialize countdown
    const countdownTimer = setInterval(() => {
      setStartCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownTimer);
          onGameStart(); // Trigger game start
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Reset user action timeout if the user throws the first disc
  const handleUserAction = () => {
    clearTimeout();
    setIsCountdownVisible(false); // Hide countdown if it was visible
    onUserAction(); // Inform parent component about user action
  };

  return (
    <>
      {/* Display user action timeout if no disc is thrown */}
      {!isCountdownVisible && userActionTimeout > 0 && (
        <div className="countdown-display">
          <h2>Throw the disc in: {userActionTimeout}</h2>
        </div>
      )}

      {/* Display 3-second countdown before auto-start */}
      {isCountdownVisible && startCountdown !== null && (
        <div className="countdown-display">
          <h2>Game starts in: {startCountdown}</h2>
        </div>
      )}
    </>
  );
};

export default GameStartTimer;

// copy 
// import React, { useState, useEffect } from "react";
// import "./GameStartTimer.css";

// const GameStartTimer = ({ onGameStart, onUserAction }) => {
//   const [startCountdown, setStartCountdown] = useState(null); // Countdown for auto-start
//   const [userActionTimeout, setUserActionTimeout] = useState(5); // Timeout for user to throw the first disc
//   const [isCountdownVisible, setIsCountdownVisible] = useState(false); // Control display of countdown

//   useEffect(() => {
//     // Timer for waiting on user action (5 seconds)
//     const actionTimer = setInterval(() => {
//       setUserActionTimeout((prev) => {
//         if (prev === 1) {
//           clearInterval(actionTimer);
//           setIsCountdownVisible(true); // Show countdown
//           startCountdownTimer(); // Start countdown
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Cleanup timer
//     return () => clearInterval(actionTimer);
//   }, []);

//   const startCountdownTimer = () => {
//     setStartCountdown(3); // Initialize countdown
//     const countdownTimer = setInterval(() => {
//       setStartCountdown((prev) => {
//         if (prev === 1) {
//           clearInterval(countdownTimer);
//           onGameStart(); // Trigger game start
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   // Reset user action timeout if the user throws the first disc
//   const handleUserAction = () => {
//     clearTimeout();
//     setIsCountdownVisible(false); // Hide countdown if it was visible
//     onUserAction(); // Inform parent component about user action
//   };

//   return (
//     <>
//       {/* Display user action timeout if no disc is thrown */}
//       {!isCountdownVisible && userActionTimeout > 0 && (
//         <div className="countdown-display">
//           <h2>Throw the disc in: {userActionTimeout}</h2>
//         </div>
//       )}

//       {/* Display 3-second countdown before auto-start */}
//       {isCountdownVisible && startCountdown !== null && (
//         <div className="countdown-display">
//           <h2>Game starts in: {startCountdown}</h2>
//         </div>
//       )}
//     </>
//   );
// };

// export default GameStartTimer;

