// OnScreenKeyboard.js
import React, { useState, useEffect } from "react";
import Keyboard from "simple-keyboard";

import "./OnScreenKeyboard.css";

// Import the CSS for styling

const OnScreenKeyboard = ({ onKeyPress, onChange }) => {
  const [keyboard, setKeyboard] = useState(null);

  useEffect(() => {
    // Ensure this only runs after the component has mounted
    if (typeof window !== 'undefined') {
      const keyboardInstance = new Keyboard({
        onChange: (input) => {
          if (onChange) onChange(input);
        },
        onKeyPress: (button) => {
          if (onKeyPress) onKeyPress(button);
        },
      });

      setKeyboard(keyboardInstance);
    }

    return () => {
      if (keyboard) {
        keyboard.destroy(); // Clean up the keyboard instance when the component unmounts
      }
    };
  }, [onChange, onKeyPress]);

  return <div className="keyboard-container">{/* Render keyboard */}</div>;
};

export default OnScreenKeyboard;
