import { useRef } from 'react';

const useFocusOnClick = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return { inputRef, focusInput };
};

export default useFocusOnClick;
