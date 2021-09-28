import React from 'react';

import { ModalContainer } from './modalContainer';

type MenuItems = { label: string; onClick?: (event) => void; visible?: () => boolean }[];

type MenuProps = {
  menuGroups: MenuItems[];
  possition?: { x: number; y: number };
  showMenu?: boolean;
  onCloseRequest?: () => void;
};

export function ContextMenu({
  menuGroups,
  possition,
  showMenu = true,
  onCloseRequest,
}: MenuProps): JSX.Element {
  return (
    <ModalContainer
      style={{
        left: possition?.x,
        top: possition?.y,
        display: showMenu ? 'block' : 'none',
        zIndex: 1,
      }}
      onCloseRequest={onCloseRequest}
    >
      {menuGroups.map((group, index) => (
        <ul key={index}>
          {group.map(({ label, visible, onClick }, index) => {
            const isVisible = visible ? visible() : true;
            return isVisible ? (
              <li className="react-phylogeny-tree-conext-menu-item" key={index} onClick={onClick}>
                {label}
              </li>
            ) : null;
          })}
        </ul>
      ))}
    </ModalContainer>
  );
}
