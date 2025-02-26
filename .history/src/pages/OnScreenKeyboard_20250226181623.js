// OnScreenKeyboard.js
import React, { useState, useEffect, useRef } from "react";
import Keyboard from "simple-keyboard";
import "./OnScreenKeyboard.css"; // Import custom styles for the keyboard

const OnScreenKeyboard = ({ onKeyPress, onChange }) => {
  const [keyboard, setKeyboard] = useState(null);
  const keyboardRef = useRef(null); // Reference to the keyboard container

  useEffect(() => {
    // Ensure this only runs in the browser
    if (typeof window !== 'undefined') {
      // Initialize the keyboard instance
      const keyboardInstance = new Keyboard({
        onChange: (input) => {
          if (onChange) onChange(input); // Handle input change
        },
        onKeyPress: (button) => {
          if (onKeyPress) onKeyPress(button); // Handle key press
        },
        layoutName: "default", // You can change the layout if needed
      });

      // Set the keyboard container using the ref
      keyboardInstance.setOptions({
        container: keyboardRef.current, // Attach the keyboard to the container
      });

      // Store the instance in the state
      setKeyboard(keyboardInstance);

      // Cleanup function to destroy the keyboard when the component unmounts
      return () => {
        if (keyboardInstance) {
          keyboardInstance.destroy(); // Clean up the keyboard instance
        }
      };
    }
  }, [onChange, onKeyPress]); // Only re-run if onChange or onKeyPress props change

  return (
    <div className="keyboard-container" ref={keyboardRef}>
      {/* This is where the keyboard will be rendered */}
    </div>
  );
};

export default OnScreenKeyboard;
