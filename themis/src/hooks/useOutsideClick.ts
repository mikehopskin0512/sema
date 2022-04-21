import { useEffect, useRef } from 'react';

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<any>(null);

  const checker = (e: MouseEvent) => {
    if (!ref.current || ref.current.contains(e.target)) {
      return;
    }
    return callback();
  };

  useEffect(() => {
    document.addEventListener('click', checker);

    return () => {
      document.removeEventListener('click', checker);
    };
  }, [ref]);

  return ref;
};

export default useOutsideClick;
