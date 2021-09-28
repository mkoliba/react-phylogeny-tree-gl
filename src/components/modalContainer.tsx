import React from 'react';

import { useCloseModal } from '../hooks/useCloseModal';

export function ModalContainer({ children, style, onCloseRequest }): JSX.Element {
  const modalElem = useCloseModal(onCloseRequest);
  return (
    <div ref={modalElem} className="react-phylogeny-tree-conext-menu" style={style}>
      {children}
    </div>
  );
}
