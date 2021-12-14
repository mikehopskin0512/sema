import { useRef, useEffect } from 'react';

export const useIsMount = () => {
  // Used to determine if it's the first render
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};
