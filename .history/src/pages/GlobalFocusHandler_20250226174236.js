import React, { useEffect, useRef } from 'react';

const GlobalFocusHandler = ({ children }) => {
  const inputRef = useRef(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Programmatically focus the input field
    }
  };

  // Optionally, you can use `useEffect` to add event listeners for focus
  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], textarea');
    
    // Attach a global focus handler to all input fields
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
      });
    };
  }, []);

  return <div>{children}</div>;
};

export default GlobalFocusHandler;
