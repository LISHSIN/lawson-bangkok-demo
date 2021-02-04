import { useContext } from 'react';
import { mapboxReactContext } from 'components/MapboxContext';

export const usePopup = () => {
  const context = useContext(mapboxReactContext);
  const { updateCustomPopup } = context;

  /**
   * This function is used to update
   * the context value to show/hide the popup
   */
  const toggle = (val: JSX.Element | undefined) => {
    updateCustomPopup(val);
  }

  return {
    toggle,
  };
};
