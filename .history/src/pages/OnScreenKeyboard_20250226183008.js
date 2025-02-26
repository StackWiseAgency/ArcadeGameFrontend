
import React, { useState, useEffect, useRef } from "react";
import Keyboard from "simple-keyboard";
 // Import the CSS for styling
 import "simple-keyboard/build/css/index.css"; 
const OnScreenKeyboard = ({ onKeyPress, onChange }) => {
  const keyboardRef = useRef(null); // Ref for the keyboard container

  useEffect(() => {
    if (keyboardRef.current) {
      // Initialize the keyboard instance only once the component has mounted
      const keyboardInstance = new Keyboard({
        onChange: (input) => {
          if (onChange) onChange(input); // Update parent with the input
        },
        onKeyPress: (button) => {
          if (onKeyPress) onKeyPress(button); // Handle individual key presses
        },
      });

      // Attach the keyboard to the container using the ref
      keyboardInstance.setOptions({
        container: keyboardRef.current,
      });

      // Cleanup the keyboard instance when the component unmounts
      return () => {
        keyboardInstance.destroy();
      };
    }
  }, [onChange, onKeyPress]);

  return <div ref={keyboardRef} className="keyboard-container"></div>; // Render keyboard inside the ref container
};

export default OnScreenKeyboard;
