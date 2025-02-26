import React, { useState } from "react";

const CustomKeyboard = ({ onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (key) => {
    setInputValue(inputValue + key);
    if (onChange) onChange(inputValue + key); // Pass the value to the parent
  };

  const handleBackspace = () => {
    const newValue = inputValue.slice(0, -1);
    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div>
      <div>
        <input type="text" value={inputValue} readOnly />
      </div>
      <div>
        {"abcdefghijklmnopqrstuvwxyz".split("").map((key) => (
          <button key={key} onClick={() => handleKeyPress(key)}>
            {key}
          </button>
        ))}
        <button onClick={handleBackspace}>Backspace</button>
      </div>
    </div>
  );
};

export default CustomKeyboard;
