// OnScreenKeyboard.js
import React, { useState, useEffect } from "react";
import Keyboard from "simple-keyboard";

import "./OnScreenKeyboard.css";
const OnScreenKeyboard = ({ onKeyPress, onChange }) => {
  const [keyboard, setKeyboard] = useState(null);

  useEffect(() => {
    // Initialize the keyboard when the component mounts
    const keyboardInstance = new Keyboard({
      onChange: input => {
        if (onChange) onChange(input); // Call the onChange callback if provided
      },
      onKeyPress: button => {
        if (onKeyPress) onKeyPress(button); // Call the onKeyPress callback if provided
      }
    });
    setKeyboard(keyboardInstance);

    return () => {
      // Cleanup keyboard instance on unmount
      if (keyboard) {
        keyboard.destroy();
      }
    };
  }, [onChange, onKeyPress, keyboard]);

  return (
    <div>
      <div className="keyboard-container">
        {/* This will render the keyboard */}
      </div>
    </div>
  );
};

export default OnScreenKeyboard;
