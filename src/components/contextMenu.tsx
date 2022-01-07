import React from 'react';

import { MenuState } from '../hooks/useTreeWithMenu';
import { treeMenuItems, nodeMenuItems } from '../plugins/contextMenu/menuItems';
import { GetTree } from '../types/react-phylogeny-tree';
import { ModalContainer } from './modalContainer';

type ContextMenuProps<P extends Record<string, unknown>, M> = {
  getTree: GetTree<P, M>;
  onCloseRequest?: () => void;
} & Pick<MenuState, 'possition' | 'node'>;

export function ContextMenu<P extends Record<string, unknown>, M>({
  possition,
  node,
  getTree,
  onCloseRequest,
}: ContextMenuProps<P, M>): JSX.Element {
  const menuItems = node && !node.isLeaf ? nodeMenuItems : treeMenuItems;
  return (
    <ModalContainer
      style={{
        left: possition?.x,
        top: possition?.y,
        zIndex: 1,
      }}
      onCloseRequest={onCloseRequest}
    >
      {menuItems.map((menuGroup, index) => (
        <ul key={index}>
          {menuGroup.map(({ label, handler, visible, isActive }) => {
            const tree = getTree();
            if (visible ? visible(tree) : true) {
              const text = typeof label === 'string' ? label : label(getTree(), node);
              return typeof isActive === 'function' ? (
                <ToggleItem
                  key={text}
                  text={text}
                  isActive={isActive}
                  tree={tree}
                  onClick={(e) => {
                    e.preventDefault();
                    const tree = getTree();
                    if (tree) handler(tree, node);
                  }}
                />
              ) : (
                <MenuItem
                  key={text}
                  text={text}
                  onClick={(e) => {
                    e.preventDefault();
                    const tree = getTree();
                    if (tree) handler(tree, node);
                    if (onCloseRequest) onCloseRequest();
                  }}
                />
              );
            }
            return;
          })}
        </ul>
      ))}
    </ModalContainer>
  );
}

type MenuItemProps = { text: string; onClick: (e) => void };
export function MenuItem({ text, onClick }: MenuItemProps): JSX.Element {
  return (
    <li className="react-phylogeny-tree-conext-menu-item" onClick={onClick}>
      {text}
    </li>
  );
}

export function ToggleItem({ text, isActive, tree, onClick }): JSX.Element {
  const [active, setActive] = React.useState(isActive(tree));
  const toggleClass = active ? 'is-active' : '';

  return (
    <li
      className="react-phylogeny-tree-context-menu-has-toggle"
      onClick={(e) => {
        onClick(e);
        setActive(isActive(tree));
      }}
    >
      {text}
      <span className={`react-phylogeny-tree-context-menu-toggle ${toggleClass}`}></span>
    </li>
  );
}
