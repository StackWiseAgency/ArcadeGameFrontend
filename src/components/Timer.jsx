import React, { useState, useEffect } from "react";
import "./Timer.css";

const Timer = ({ userHasThrown, onStart }) => {
  const [countdown, setCountdown] = useState(10); // Initial 5-second wait
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  useEffect(() => {
    if (userHasThrown) {
      onStart(); // Start the game immediately if the user throws
      return;
    }

    const initialWait = setTimeout(() => {
      setIsCountdownRunning(true); // Begin the countdown
      setCountdown(3); // Set countdown duration
    }, 10000);

    return () => clearTimeout(initialWait);
  }, [userHasThrown, onStart]);

  useEffect(() => {
    if (!isCountdownRunning || countdown <= 0) {
      if (countdown === 0) onStart(); // Notify when countdown ends
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountdownRunning, countdown, onStart]);

  return (
    <div className="timer">
      {isCountdownRunning ? `Game starts in:  ${countdown}s` : "Get ready...!!!"}
    </div>
  );
};

export default Timer;

// copy 
// import React, { useState, useEffect } from "react";
// import "./Timer.css";

// const Timer = ({ userHasThrown, onStart }) => {
//   const [countdown, setCountdown] = useState(10); // Initial 5-second wait
//   const [isCountdownRunning, setIsCountdownRunning] = useState(false);

//   useEffect(() => {
//     if (userHasThrown) {
//       onStart(); // Start the game immediately if the user throws
//       return;
//     }

//     const initialWait = setTimeout(() => {
//       setIsCountdownRunning(true); // Begin the countdown
//       setCountdown(3); // Set countdown duration
//     }, 10000);

//     return () => clearTimeout(initialWait);
//   }, [userHasThrown, onStart]);

//   useEffect(() => {
//     if (!isCountdownRunning || countdown <= 0) {
//       if (countdown === 0) onStart(); // Notify when countdown ends
//       return;
//     }

//     const interval = setInterval(() => {
//       setCountdown((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isCountdownRunning, countdown, onStart]);

//   return (
//     <div className="timer">
//       {isCountdownRunning ? `Game starts in: ${countdown}s` : "Get ready...Start the Game!!!"}
//     </div>
//   );
// };

// export default Timer;
