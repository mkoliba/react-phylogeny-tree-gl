import React from 'react';

export function useCloseModal(onCloseRequest) {
  const modalElem = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function handleOutsideClick(e) {
      if (modalElem.current) {
        if (!modalElem.current.contains(e.target)) {
          if (onCloseRequest) onCloseRequest();
          document.removeEventListener('click', handleOutsideClick, false);
        }
      }
    }

    function handleKeyUp(e) {
      const escKeyNo = 27;
      const keys = {
        [escKeyNo]: () => {
          e.preventDefault();
          if (onCloseRequest) onCloseRequest();
          window.removeEventListener('keyup', handleKeyUp, false);
        },
      };
      if (keys[e.keyCode]) {
        keys[e.keyCode]();
      }
    }

    window.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('click', handleOutsideClick, false);
    return function unmountCleanUp() {
      window.removeEventListener('keyup', handleKeyUp, false);
      document.removeEventListener('click', handleOutsideClick, false);
    };
  });
  return modalElem;
}
