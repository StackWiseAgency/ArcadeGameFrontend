import React, { useState, useEffect, useRef } from "react";
import "./OnScreenKeyboard.css"; // Import custom CSS for the keyboard

const CustomKeyboard = ({ onChange, focusField }) => {
  const [inputValue, setInputValue] = useState("");
  const [specialCharsMode, setSpecialCharsMode] = useState(false); // Toggle between letters and special characters
  const [keyboardVisible, setKeyboardVisible] = useState(true); // Track keyboard visibility
  const keyboardRef = useRef(null); // Reference for the keyboard container

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

    // Hide the keyboard when clicking outside of it
    const handleClickOutside = (event) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
        setKeyboardVisible(false); // Hide keyboard when clicking outside
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // If focusField is set to true (meaning we are focused on an input field), show the keyboard
  useEffect(() => {
    if (focusField) {
      setKeyboardVisible(true); // Show keyboard when input field is focused
    }
  }, [focusField]);

  // Prevent hiding keyboard when clicking inside the keyboard container
  const handleKeyboardClick = (event) => {
    event.stopPropagation(); // Prevent click from propagating and hiding the keyboard
  };

  if (!keyboardVisible || !focusField) return null; // If keyboard is hidden or no field is focused, don't show the keyboard

  return (
    <div className="keyboard-container" ref={keyboardRef} onClick={handleKeyboardClick}>
      <div className="input-container">
        <input type="text" value={inputValue} readOnly className="keyboard-input" />
      </div>

      {/* Toggle button to switch between letters and special characters */}
      <div className="toggle-container">
        <button onClick={toggleSpecialCharsMode} className="key-button toggle">
          {specialCharsMode ? "Alphabet" : "Special Characters"}
        </button>
      </div>

      <div className="keyboard">
        {renderKeys(layout.numbers)}
        {renderKeys(specialCharsMode ? layout.specialChars : layout.letters)}
      </div>
    </div>
  );
};

export default CustomKeyboard;


// import React, { useState, useEffect, useRef } from "react";
// import "./OnScreenKeyboard.css"; // Import custom CSS for the keyboard

// const CustomKeyboard = ({ onChange, focusField }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [specialCharsMode, setSpecialCharsMode] = useState(false); // Toggle between letters and special characters
//   const keyboardRef = useRef(null); // Reference for the keyboard container

//   // Define the keyboard layout with numbers, alphabets, and special characters
//   const layout = {
//     numbers: [
//       "1 2 3 4 5 6 7 8 9 0",
//     ],
//     letters: [
//       "q w e r t y u i o p",
//       "a s d f g h j k l",
//       "z x c v b n m",
//       "{backspace} {space} {enter}"
//     ],
//     specialChars: [
//       "! @ # $ % ^ & * ( )",
//       "_ + {backspace} {space} {enter}"
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

//   const toggleSpecialCharsMode = () => {
//     setSpecialCharsMode(!specialCharsMode); // Toggle between letters and special characters
//   };

//   const renderKeys = (layout) => {
//     return layout.map((row, index) => {
//       return (
//         <div key={index} className="keyboard-row">
//           {row.split(" ").map((key) => {
//             if (key === "{backspace}") {
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
//                   {key}
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
    
//     // Hide the keyboard when clicking outside of it
//     const handleClickOutside = (event) => {
//       if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
//         // You can implement hiding the keyboard here by setting a state or calling a function
//         console.log("Clicked outside the keyboard");
//       }
//     };

//     // Add event listener to document
//     document.addEventListener("mousedown", handleClickOutside);

//     // Clean up the event listener on component unmount
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [focusField]);

//   if (!focusField) return null; // If no field is focused, don't show the keyboard

//   return (
//     <div className="keyboard-container" ref={keyboardRef}>
//       <div className="input-container">
//         <input type="text" value={inputValue} readOnly className="keyboard-input" />
//       </div>

//       {/* Toggle button to switch between letters and special characters */}
//       <div className="toggle-container">
//         <button onClick={toggleSpecialCharsMode} className="key-button toggle">
//           {specialCharsMode ? "Alphabet" : "Special Characters"}
//         </button>
//       </div>

//       <div className="keyboard">
//         {renderKeys(layout.numbers)}
//         {renderKeys(specialCharsMode ? layout.specialChars : layout.letters)}
//       </div>
//     </div>
//   );
// };

// export default CustomKeyboard;


// import React, { useState, useEffect } from "react";
// import "./OnScreenKeyboard.css"; // Import custom CSS for the keyboard

// const CustomKeyboard = ({ onChange, focusField }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [specialCharsMode, setSpecialCharsMode] = useState(false); // Toggle between letters and special characters

//   // Define the keyboard layout with numbers, alphabets, and special characters
//   const layout = {
//     numbers: [
//       "1 2 3 4 5 6 7 8 9 0",
//     ],
//     letters: [
//       "q w e r t y u i o p",
//       "a s d f g h j k l",
//       "z x c v b n m",
//       "{backspace} {space} {enter}"
//     ],
//     specialChars: [
//       "! @ # $ % ^ & * ( )",
//       "_ + {backspace} {space} {enter}"
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

//   const toggleSpecialCharsMode = () => {
//     setSpecialCharsMode(!specialCharsMode); // Toggle between letters and special characters
//   };

//   const renderKeys = (layout) => {
//     return layout.map((row, index) => {
//       return (
//         <div key={index} className="keyboard-row">
//           {row.split(" ").map((key) => {
//             if (key === "{backspace}") {
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
//                   {key}
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

//       {/* Toggle button to switch between letters and special characters */}
//       <div className="toggle-container">
//         <button onClick={toggleSpecialCharsMode} className="key-button toggle">
       
//           {specialCharsMode ? "Alphabet" : "Special Characters"}
//         </button>
//       </div>

//       <div className="keyboard">
//       {renderKeys(layout.numbers)}
//         {renderKeys(specialCharsMode ? layout.specialChars : layout.letters)}
        
//       </div>
//     </div>
//   );
// };

// export default CustomKeyboard;
