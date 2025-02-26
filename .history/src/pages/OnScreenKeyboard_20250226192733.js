import React, { useState, useEffect } from "react";
import "./OnScreenKeyboard.css"; // Import custom CSS for the keyboard

const CustomKeyboard = ({ onChange, focusField }) => {
  const [inputValue, setInputValue] = useState("");
  const [specialCharsMode, setSpecialCharsMode] = useState(false); // Toggle between letters and special characters

  // Define the keyboard layout with numbers, alphabets, and special characters
  const layout = {
    numbers: [
      "1 2 3 4 5 6 7 8 9 0",
    ],
    letters: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m",
      "{backspace} {space} {enter}"
    ],
    specialChars: [
      "! @ # $ % ^ & * ( )",
      "_ + {backspace} {space} {enter}"
    ]
   
  };

  const handleKeyPress = (key) => {
    setInputValue(inputValue + key);
    if (onChange) onChange(inputValue + key); // Pass the value to the parent
  };

  const handleBackspace = () => {
    const newValue = inputValue.slice(0, -1);
    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  const toggleSpecialCharsMode = () => {
    setSpecialCharsMode(!specialCharsMode); // Toggle between letters and special characters
  };

  const renderKeys = (layout) => {
    return layout.map((row, index) => {
      return (
        <div key={index} className="keyboard-row">
          {row.split(" ").map((key) => {
            if (key === "{backspace}") {
              return (
                <button key={key} onClick={handleBackspace} className="key-button backspace">
                  Backspace
                </button>
              );
            } else if (key === "{space}") {
              return (
                <button key={key} onClick={() => handleKeyPress(" ")} className="key-button space">
                  Space
                </button>
              );
            } else if (key === "{enter}") {
              return (
                <button key={key} onClick={() => handleKeyPress("\n")} className="key-button enter">
                  Enter
                </button>
              );
            } else {
              return (
                <button key={key} onClick={() => handleKeyPress(key)} className="key-button">
                  {key}
                </button>
              );
            }
          })}
        </div>
      );
    });
  };

  useEffect(() => {
    // Reset the inputValue when the focused field changes (to clear previous input)
    if (!focusField) {
      setInputValue(""); // Clear input when focus changes
    }
  }, [focusField]);

  if (!focusField) return null; // If no field is focused, don't show the keyboard

  return (
    <div className="keyboard-container">
      <div className="input-container">
        <input type="text" value={inputValue} readOnly className="keyboard-input" />
      </div>

      {/* Toggle button to switch between letters and special characters */}
      <div className="toggle-container">
        <button onClick={toggleSpecialCharsMode} className="key-button toggle">
        {renderKeys(layout.numbers)}
          {specialCharsMode ? "Alphabet" : "Special Characters"}
        </button>
      </div>

      <div className="keyboard">
        {/* Render the appropriate layout based on specialCharsMode */}
        {renderKeys(specialCharsMode ? layout.specialChars : layout.letters)}

        {/* Optionally, add the numbers row */}
        
      </div>
    </div>
  );
};

export default CustomKeyboard;


// import React, { useState, useEffect } from "react";
// import "./OnScreenKeyboard.css"; // Import custom CSS for the keyboard

// const CustomKeyboard = ({ onChange, focusField }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [shift, setShift] = useState(false); // To handle shift for uppercase and special characters

//   // Define the keyboard layout with numbers, alphabets, and special characters
//   const layout = {
//     default: [
//       "1 2 3 4 5 6 7 8 9 0",
//       "q w e r t y u i o p",
//       "a s d f g h j k l",
//       "{shift} z x c v b n m {backspace}",
//       "{space} {enter}"
//     ],
//     shift: [
//       "! @ # $ % ^ & * ( )",
//       "Q W E R T Y U I O P",
//       "A S D F G H J K L",
//       "{shift} Z X C V B N M {backspace}",
//       "{space} {enter}"
//     ]
//   };

//   const handleKeyPress = (key) => {
//     setInputValue(inputValue + key);
//     if (onChange) onChange(inputValue + key); // Pass the value to the parent
//   };

//   const handleBackspace = () => {
//     const newValue = inputValue.slice(0, -1);
//     setInputValue(newValue);
//     if (onChange) onChange(newValue);
//   };

//   const toggleShift = () => {
//     setShift(!shift);
//   };

//   const renderKeys = (layout) => {
//     return layout.map((row, index) => {
//       return (
//         <div key={index} className="keyboard-row">
//           {row.split(" ").map((key) => {
//             if (key === "{shift}") {
//               return (
//                 <button key={key} onClick={toggleShift} className="key-button shift">
//                   Shift
//                 </button>
//               );
//             } else if (key === "{backspace}") {
//               return (
//                 <button key={key} onClick={handleBackspace} className="key-button backspace">
//                   Backspace
//                 </button>
//               );
//             } else if (key === "{space}") {
//               return (
//                 <button key={key} onClick={() => handleKeyPress(" ")} className="key-button space">
//                   Space
//                 </button>
//               );
//             } else if (key === "{enter}") {
//               return (
//                 <button key={key} onClick={() => handleKeyPress("\n")} className="key-button enter">
//                   Enter
//                 </button>
//               );
//             } else {
//               return (
//                 <button key={key} onClick={() => handleKeyPress(key)} className="key-button">
//                   {shift && /[a-zA-Z]/.test(key) ? key.toUpperCase() : key}
//                 </button>
//               );
//             }
//           })}
//         </div>
//       );
//     });
//   };

//   useEffect(() => {
//     // Reset the inputValue when the focused field changes (to clear previous input)
//     if (!focusField) {
//       setInputValue(""); // Clear input when focus changes
//     }
//   }, [focusField]);

//   if (!focusField) return null; // If no field is focused, don't show the keyboard

//   return (
//     <div className="keyboard-container">
//       <div className="input-container">
//         <input type="text" value={inputValue} readOnly className="keyboard-input" />
//       </div>
//       <div className="keyboard">
//         {renderKeys(shift ? layout.shift : layout.default)} {/* Switch between default and shift layouts */}
//       </div>
//     </div>
//   );
// };

// export default CustomKeyboard;


// import React, { useState, useEffect } from "react";
// import "./OnScreenKeyboard.css"; // Import custom CSS for the keyboard

// const CustomKeyboard = ({ onChange, focusField }) => {
//   const [inputValue, setInputValue] = useState("");

//   const handleKeyPress = (key) => {
//     setInputValue(inputValue + key);
//     if (onChange) onChange(inputValue + key); // Pass the value to the parent
//   };

//   const handleBackspace = () => {
//     const newValue = inputValue.slice(0, -1);
//     setInputValue(newValue);
//     if (onChange) onChange(newValue);
//   };

//   const handleCloseKeyboard = () => {
//     // You can handle closing the keyboard here if necessary
//   };

//   useEffect(() => {
//     // Reset the inputValue when the focused field changes (to clear previous input)
//     if (!focusField) {
//       setInputValue(""); // Clear input when focus changes
//     }
//   }, [focusField]);

//   if (!focusField) return null; // If no field is focused, don't show the keyboard

//   return (
//     <div className="keyboard-container">
//       <div className="input-container">
//         <input type="text" value={inputValue} readOnly className="keyboard-input" />
//       </div>
//       <div className="keyboard">
//         {"abcdefghijklmnopqrstuvwxyz".split("").map((key) => (
//           <button key={key} onClick={() => handleKeyPress(key)} className="key-button">
//             {key}
//           </button>
//         ))}
//         <button onClick={handleBackspace} className="key-button backspace">
//           Backspace
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomKeyboard;
