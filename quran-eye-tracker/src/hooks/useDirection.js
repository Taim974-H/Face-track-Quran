// src/hooks/useDirection.js
import { useState, useEffect, useRef } from 'react';

export const useDirection = () => {
  const [preferredDirection, setPreferredDirectionInternal] = useState('center');
  const [hasChosenDirection, setHasChosenDirection] = useState(false);
  const preferredDirectionRef = useRef(preferredDirection);

  // Wrap the state setter so we know a choice was made.
  const setPreferredDirection = (direction) => {
    setPreferredDirectionInternal(direction);
    if (!hasChosenDirection) {
      setHasChosenDirection(true);
    }
  };

  useEffect(() => {
    preferredDirectionRef.current = preferredDirection;
  }, [preferredDirection]);

  return { preferredDirection, setPreferredDirection, preferredDirectionRef, hasChosenDirection };
};
