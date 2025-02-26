
import React, { useState, useEffect } from "react";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css"; // Import the CSS for styling

const OnScreenKeyboard = ({ onChange, focusField }) => {
  const [inputValue, setInputValue] = useState("");

  // Define the full keyboard layout with numbers, special characters, and alphabets
  const layout = {
    default: [
      "1 2 3 4 5 6 7 8 9 0",
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "{shift} z x c v b n m {backspace}",
      "{space} {enter}"
    ],
    shift: [
      "! @ # $ % ^ & * ( )",
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "{shift} Z X C V B N M {backspace}",
      "{space} {enter}"
    ]
  };

  useEffect(() => {
    if (focusField) {
      // Initialize keyboard when a field is focused
      const keyboardInstance = new Keyboard({
        onChange: (input) => {
          setInputValue(input);
          if (onChange) onChange(input);
        },
        onKeyPress: (button) => {
          if (onChange) onKeyPress(button);
        },
        layoutName: "default", // Use the default layout initially
        layout: layout, // Apply the custom layout
      });

      keyboardInstance.setOptions({
        container: document.querySelector(".keyboard-container"),
      });

      return () => {
        keyboardInstance.destroy(); // Cleanup when unmounted
      };
    }
  }, [focusField, onChange]);

  if (!focusField) return null; // If no field is focused, don't show the keyboard

  return (
    <div className="keyboard-container">
      {/* This div will render the on-screen keyboard */}
    </div>
  );
};

export default OnScreenKeyboard;


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
