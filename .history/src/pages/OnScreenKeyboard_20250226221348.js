
import React, { useState, useRef } from "react";
import "./OnScreenKeyboard.css"; 
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS


const CustomKeyboard = ({ onChange, focusField, buttonLabel = "Keyboard" }) => {
  const [inputValue, setInputValue] = useState("");
  const [specialCharsMode, setSpecialCharsMode] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false); // Keyboard visibility state
  const keyboardRef = useRef(null); // Reference for keyboard container
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const layout = {
    numbers: [
      "1 2 3 4 5 6 7 8 9 0",
    ],
    letters: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m",
      " {space} {backspace} {enter}"
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

  // Show the keyboard when the button is clicked
  const toggleKeyboardVisibility = () => {
    setKeyboardVisible(!keyboardVisible); 
  };

  // Handle the event to close the keyboard
  const closeKeyboard = () => {
    setKeyboardVisible(false);
  };

  
  // Handle mouse down for drag start
  const handleMouseDown = (event) => {
    setIsDragging(true);
    const offsetX = event.clientX - position.x;
    const offsetY = event.clientY - position.y;
    const handleMouseMove = (moveEvent) => {
      if (isDragging) {
        setPosition({
          x: moveEvent.clientX - offsetX,
          y: moveEvent.clientY - offsetY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  return (
    <div>
      <button onClick={toggleKeyboardVisibility} className="keyboard-toggle-button">
      <i className="fa fa-keyboard-o"></i>{buttonLabel}
      </button>
      
      {keyboardVisible && (
         <div
            className={`keyboard-container ${isDragging ? "dragging" : ""}`}
            ref={keyboardRef}
            style={{
              top: position.y + "px",
              left: position.x + "px",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
          >
          <button className="close-button-keyboard" onClick={closeKeyboard}>
            ✖
          </button>
        
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
      )}
    </div>
  );
};

export default CustomKeyboard;



// import React, { useState, useRef } from "react";
// import "./OnScreenKeyboard.css";

// const CustomKeyboard = ({ onChange, focusField, buttonLabel = "Keyboard" }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [specialCharsMode, setSpecialCharsMode] = useState(false);
//   const [keyboardVisible, setKeyboardVisible] = useState(false); // Keyboard visibility state
//   const keyboardRef = useRef(null); // Reference for keyboard container

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

//   const handleClickOutside = (event) => {
//     if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
//       setKeyboardVisible(false); // Hide keyboard if clicked outside
//     }
//   };

//   // Show the keyboard when the button is clicked
//   const toggleKeyboardVisibility = () => {
//     setKeyboardVisible(!keyboardVisible); 
//   };

//   // Handle the event to close the keyboard
//   const closeKeyboard = () => {
//     setKeyboardVisible(false);
//   };

//   // Attach event listener for click outside the keyboard
//   React.useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div>
//       {/* Button to toggle keyboard visibility */}
//       <button onClick={toggleKeyboardVisibility} className="keyboard-toggle-button">
//         {buttonLabel}
//       </button>

//       {/* Keyboard Visibility Logic */}
//       {keyboardVisible && (
//         <div className="keyboard-container" ref={keyboardRef}>
//           {/* Close Button in the top-right */}
//           <button className="close-button" onClick={closeKeyboard}>
//             ✖
//           </button>

//           {/* Toggle button to switch between letters and special characters */}
//           <div className="toggle-container">
//             <button onClick={toggleSpecialCharsMode} className="key-button toggle">
//               {specialCharsMode ? "Alphabet" : "Special Characters"}
//             </button>
//           </div>

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



// import React, { useState, useEffect, useRef } from "react";
// import "./OnScreenKeyboard.css"; 

// const CustomKeyboard = ({ onChange, focusField }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [specialCharsMode, setSpecialCharsMode] = useState(false); 
//   const keyboardRef = useRef(null); 

  
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

//   useEffect(() => {
   
//     if (!focusField) {
//       setInputValue(""); 
//     }
    
   
//     const handleClickOutside = (event) => {
//       if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
       
//         console.log("Clicked outside the keyboard");
//       }
//     };

   
//     document.addEventListener("mousedown", handleClickOutside);

   
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [focusField]);

//   if (!focusField) return null; 

//   return (
//     <div className="keyboard-container" ref={keyboardRef}>
//       {/* <div className="input-container">
//         <input type="text" value={inputValue} readOnly className="keyboard-input" />
//       </div> */}

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

