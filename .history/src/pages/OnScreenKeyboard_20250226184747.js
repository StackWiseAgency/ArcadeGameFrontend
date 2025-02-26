import React, { useState, useEffect } from "react";
import "./OnScreenKeyboard.css"; // Import custom CSS for the keyboard

const CustomKeyboard = ({ onChange, focusField }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (key) => {
    setInputValue(inputValue + key);
    if (onChange) onChange(inputValue + key); // Pass the value to the parent
  };

  const handleBackspace = () => {
    const newValue = inputValue.slice(0, -1);
    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleCloseKeyboard = () => {
    // You can handle closing the keyboard here if necessary
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
      <div className="keyboard">
        {"abcdefghijklmnopqrstuvwxyz".split("").map((key) => (
          <button key={key} onClick={() => handleKeyPress(key)} className="key-button">
            {key}
          </button>
        ))}
        <button onClick={handleBackspace} className="key-button backspace">
          Backspace
        </button>
      </div>
    </div>
  );
};

export default CustomKeyboard;


// import React, { useState } from "react";
// import "./OnScreenKeyboard.css"; // Import the custom CSS for the keyboard

// const CustomKeyboard = ({ onChange }) => {
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
