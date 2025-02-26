
import React, { useState, useEffect, useRef } from "react";
import "./OnScreenKeyboard.css"; 

const CustomKeyboard = ({ onChange, focusField }) => {
  const [inputValue, setInputValue] = useState("");
  const [specialCharsMode, setSpecialCharsMode] = useState(false); 
  const keyboardRef = useRef(null); 

  
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

  useEffect(() => {
   
    if (!focusField) {
      setInputValue(""); 
    }
    
   
    const handleClickOutside = (event) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target)) {
       
        console.log("Clicked outside the keyboard");
      }
    };

   
    document.addEventListener("mousedown", handleClickOutside);

   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [focusField]);

  if (!focusField) return null; 

  return (
    <div className="keyboard-container" ref={keyboardRef}>
      {/* <div className="input-container">
        <input type="text" value={inputValue} readOnly className="keyboard-input" />
      </div> */}

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

