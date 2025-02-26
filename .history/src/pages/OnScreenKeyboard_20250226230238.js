import React, { useState, useRef } from "react";
import "./OnScreenKeyboard.css"; 
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS
import throttle from "lodash/throttle"; // This should be at the top level, not inside the function

const CustomKeyboard = ({ onChange, buttonLabel = "Keyboard" }) => {
  const [inputValue, setInputValue] = useState("");
  const [specialCharsMode, setSpecialCharsMode] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false); 
  const keyboardRef = useRef(null); 
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const initialTop = 100; // Default initial top position (can be adjusted)
  const initialLeft = 100; // Default initial left position (can be adjusted)
  const initialZIndex = 100;

  const layout = {
    numbers: [
      "1 2 3 4 5 6 7 8 9 0",
    ],
    letters: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m",
      "{space} {backspace} {enter}"
    ],
    specialChars: [
      "! @ # $ % ^ & * ( )",
      "_ +  {space} {backspace} {enter}"
    ]
  };

  const handleKeyPress = (key) => {
    setInputValue(inputValue + key);
    if (onChange) onChange(inputValue + key); 
  };

  const handleBackspace = () => {
    const newValue = inputValue.slice(0, -1);
    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  const toggleSpecialCharsMode = () => {
    setSpecialCharsMode(!specialCharsMode);
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

  const toggleKeyboardVisibility = () => {
    setKeyboardVisible(!keyboardVisible); 
    if (!keyboardVisible) {
      // Set specific position when opening the keyboard (e.g., top: 100px, left: 100px)
      setPosition({ x: initialTop, y: initialLeft, z: 100, zIndex: initialZIndex}); // Adjust these values as per your requirement
    }
  };

  const closeKeyboard = () => {
    setKeyboardVisible(false);
  };

  const handleMouseDown = (event) => {
    // Only start dragging if the click is inside the keyboard container (avoid clicks on keys)
    if (!keyboardRef.current.contains(event.target)) return;

    setIsDragging(true);
    const offsetX = event.clientX - position.x;
    const offsetY = event.clientY - position.y;

    // Optimize mousemove event handling by using requestAnimationFrame
    const handleMouseMove = throttle((moveEvent) => {
      if (isDragging) {
        setPosition({
          x: moveEvent.clientX - offsetX,
          y: moveEvent.clientY - offsetY,
        });
      }
    }, 1); 

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Add mouse move and mouse up event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div>
      {/* Button to toggle keyboard visibility */}
      <button onClick={toggleKeyboardVisibility} className="keyboard-toggle-button">
        <i className="fa fa-keyboard-o"></i> {buttonLabel}
      </button>

      {/* Keyboard visibility toggle logic */}
      {keyboardVisible && (
        <div
          className={`keyboard-container ${isDragging ? "dragging" : ""}`}
          ref={keyboardRef}
          style={{
            top: position.y + "px",
            left: position.x + "px",
            cursor: isDragging ? "grabbing" : "grab", // Show grab cursor while dragging
          }}
          onMouseDown={handleMouseDown} // Make the entire keyboard container draggable
        >
          {/* Close button to hide keyboard */}
          <button className="close-button-keyboard" onClick={closeKeyboard}>
            ✖
          </button>

          {/* Toggle between letters and special characters */}
          <div className="toggle-container">
            <button onClick={toggleSpecialCharsMode} className="key-button toggle">
              {specialCharsMode ? "Alphabet" : "Special Characters"}
            </button>
          </div>

          {/* Render keyboard keys */}
          <div className="keyboard">
            {renderKeys(layout.numbers)}
            {renderKeys(specialCharsMode ? layout.specialChars : layout.letters)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomKeyboard;



// import React, { useState, useRef } from "react";
// import "./OnScreenKeyboard.css"; 
// import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS
// import throttle from "lodash/throttle";

// const CustomKeyboard = ({ onChange, buttonLabel = "Keyboard" }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [specialCharsMode, setSpecialCharsMode] = useState(false);
//   const [keyboardVisible, setKeyboardVisible] = useState(false); 
//   const keyboardRef = useRef(null); 
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const initialTop = 100; // Default initial top position (can be adjusted)
//   const initialLeft = 100; // Default initial left position (can be adjusted)
//   const initialZIndex = 100;

//   const layout = {
//     numbers: [
//       "1 2 3 4 5 6 7 8 9 0",
//     ],
//     letters: [
//       "q w e r t y u i o p",
//       "a s d f g h j k l",
//       "z x c v b n m",
//       "{space} {backspace} {enter}"
//     ],
//     specialChars: [
//       "! @ # $ % ^ & * ( )",
//       "_ + {space} {backspace} {enter}"
//     ]
//   };

//   const handleKeyPress = (key) => {
//     setInputValue(inputValue + key);
//     if (onChange) onChange(inputValue + key); 
//   };

//   const handleBackspace = () => {
//     const newValue = inputValue.slice(0, -1);
//     setInputValue(newValue);
//     if (onChange) onChange(newValue);
//   };

//   const toggleSpecialCharsMode = () => {
//     setSpecialCharsMode(!specialCharsMode);
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

//   const toggleKeyboardVisibility = () => {
//     setKeyboardVisible(!keyboardVisible); 
//     if (!keyboardVisible) {
//       // Set specific position when opening the keyboard (e.g., top: 100px, left: 100px)
//       setPosition({ x: initialTop, y: initialLeft, z: 100, zIndex: initialZIndex}); // Adjust these values as per your requirement
//   };

//   const closeKeyboard = () => {
//     setKeyboardVisible(false);
//   };

//   const handleMouseDown = (event) => {
//     // Only start dragging if the click is inside the keyboard container (avoid clicks on keys)
//     if (!keyboardRef.current.contains(event.target)) return;

//     setIsDragging(true);
//     const offsetX = event.clientX - position.x;
//     const offsetY = event.clientY - position.y;

//     // Optimize mousemove event handling by using requestAnimationFrame
//     const handleMouseMove = throttle((moveEvent) => {
//       if (isDragging) {
//         setPosition({
//           x: moveEvent.clientX - offsetX,
//           y: moveEvent.clientY - offsetY,
//         });
//       }
//     }, 1); 

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };

//     // Add mouse move and mouse up event listeners
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <div>
//       {/* Button to toggle keyboard visibility */}
//       <button onClick={toggleKeyboardVisibility} className="keyboard-toggle-button">
//         <i className="fa fa-keyboard-o"></i> {buttonLabel}
//       </button>

//       {/* Keyboard visibility toggle logic */}
//       {keyboardVisible && (
//         <div
//           className={`keyboard-container ${isDragging ? "dragging" : ""}`}
//           ref={keyboardRef}
//           style={{
//             top: position.y + "px",
//             left: position.x + "px",
//             cursor: isDragging ? "grabbing" : "grab", // Show grab cursor while dragging
//           }}
//           onMouseDown={handleMouseDown} // Make the entire keyboard container draggable
//         >
//           {/* Close button to hide keyboard */}
//           <button className="close-button-keyboard" onClick={closeKeyboard}>
//             ✖
//           </button>

//           {/* Toggle between letters and special characters */}
//           <div className="toggle-container">
//             <button onClick={toggleSpecialCharsMode} className="key-button toggle">
//               {specialCharsMode ? "Alphabet" : "Special Characters"}
//             </button>
//           </div>

//           {/* Render keyboard keys */}
//           <div className="keyboard">
//             {renderKeys(layout.numbers)}
//             {renderKeys(specialCharsMode ? layout.specialChars : layout.letters)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomKeyboard;



// import React, { useState, useRef } from "react";
// import "./OnScreenKeyboard.css"; 
// import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS

// const CustomKeyboard = ({ onChange, buttonLabel = "Keyboard" }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [specialCharsMode, setSpecialCharsMode] = useState(false);
//   const [keyboardVisible, setKeyboardVisible] = useState(false); 
//   const keyboardRef = useRef(null); 
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const layout = {
//     numbers: [
//       "1 2 3 4 5 6 7 8 9 0",
//     ],
//     letters: [
//       "q w e r t y u i o p",
//       "a s d f g h j k l",
//       "z x c v b n m",
//       " {space} {backspace} {enter}"
//     ],
//     specialChars: [
//       "! @ # $ % ^ & * ( )",
//       "_ +  {space} {backspace} {enter}"
//     ]
//   };

//   const handleKeyPress = (key) => {
//     setInputValue(inputValue + key);
//     if (onChange) onChange(inputValue + key); 
//   };

//   const handleBackspace = () => {
//     const newValue = inputValue.slice(0, -1);
//     setInputValue(newValue);
//     if (onChange) onChange(newValue);
//   };

//   const toggleSpecialCharsMode = () => {
//     setSpecialCharsMode(!specialCharsMode);
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

//   const toggleKeyboardVisibility = () => {
//     setKeyboardVisible(!keyboardVisible); 
//   };

//   const closeKeyboard = () => {
//     setKeyboardVisible(false);
//   };

//   const handleMouseDown = (event) => {
//     // Only start dragging if the click is inside the keyboard container (avoid clicks on keys)
//     if (!keyboardRef.current.contains(event.target)) return;

//     setIsDragging(true);
//     const offsetX = event.clientX - position.x;
//     const offsetY = event.clientY - position.y;

//     const handleMouseMove = (moveEvent) => {
//       if (isDragging) {
//         setPosition({
//           x: moveEvent.clientX - offsetX,
//           y: moveEvent.clientY - offsetY,
//         });
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };

//     // Add mouse move and mouse up event listeners
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <div>
//       {/* Button to toggle keyboard visibility */}
//       <button onClick={toggleKeyboardVisibility} className="keyboard-toggle-button">
//         <i className="fa fa-keyboard-o"></i> {buttonLabel}
//       </button>

//       {/* Keyboard visibility toggle logic */}
//       {keyboardVisible && (
//         <div
//           className={`keyboard-container ${isDragging ? "dragging" : ""}`}
//           ref={keyboardRef}
//           style={{
//             top: position.y + "px",
//             left: position.x + "px",
//             cursor: isDragging ? "grabbing" : "grab", // Show grab cursor while dragging
//           }}
//           onMouseDown={handleMouseDown} // Make the entire keyboard container draggable
//         >
//           {/* Close button to hide keyboard */}
//           <button className="close-button-keyboard" onClick={closeKeyboard}>
//             ✖
//           </button>

//           {/* Toggle between letters and special characters */}
//           <div className="toggle-container">
//             <button onClick={toggleSpecialCharsMode} className="key-button toggle">
//               {specialCharsMode ? "Alphabet" : "Special Characters"}
//             </button>
//           </div>

//           {/* Render keyboard keys */}
//           <div className="keyboard">
//             {renderKeys(layout.numbers)}
//             {renderKeys(specialCharsMode ? layout.specialChars : layout.letters)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomKeyboard;

