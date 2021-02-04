import { useState } from 'react';

export const useModal = () => {
  const [isShown, setIsShown] = useState<boolean>(false);

  /**
   * This function is used to show and hide the
   * modal vice versa
   */
  const toggle = () => setIsShown(!isShown);

  return {
    isShown,
    toggle,
  };
};
