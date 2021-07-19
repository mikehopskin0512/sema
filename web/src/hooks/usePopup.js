import { useState, useEffect, useCallback } from 'react';

function usePopup(ref) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutSideOfMenu = useCallback((e) => {
    if (!e.path.includes(ref.current) && isOpen) {
      setIsOpen(false);
    }
  }, [ref, isOpen]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleClickOutSideOfMenu);
    } else {
      window.removeEventListener('click', handleClickOutSideOfMenu);
    }
  }, [handleClickOutSideOfMenu, isOpen]);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    closeMenu,
    openMenu,
    toggleMenu,
  };
}

export default usePopup;
