
 // Import custom styles for the keyboard
// OnScreenKeyboard.js
import React, { useState, useEffect, useRef } from "react";
import Keyboard from "simple-keyboard";
import "./OnScreenKeyboard.css";

const OnScreenKeyboard = ({ onKeyPress, onChange }) => {
  const keyboardRef = useRef(null);  // Create a reference for the keyboard container
  const [keyboard, setKeyboard] = useState(null);

  useEffect(() => {
    // Only initialize the keyboard after the component has mounted
    const keyboardInstance = new Keyboard({
      onChange: (input) => {
        if (onChange) onChange(input); // Pass the input to the onChange handler
      },
      onKeyPress: (button) => {
        if (onKeyPress) onKeyPress(button); // Pass the button press to the onKeyPress handler
      },
      layoutName: "default", // You can change this layout if needed
    });

    // Ensure the keyboard is rendered in the correct container
    keyboardInstance.setOptions({
      container: keyboardRef.current, // Render keyboard inside this container
    });

    // Set the keyboard instance in the state
    setKeyboard(keyboardInstance);

    // Cleanup on unmount
    return () => {
      if (keyboardInstance) {
        keyboardInstance.destroy();
      }
    };
  }, [onChange, onKeyPress]);

  return <div ref={keyboardRef} className="keyboard-container"></div>;
};

export default OnScreenKeyboard;
