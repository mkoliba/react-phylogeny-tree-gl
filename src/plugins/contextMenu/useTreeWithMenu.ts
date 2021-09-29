import React from 'react';

import { Plugins, Hooks, usePhylogenyTree } from '../../hooks/usePhylogenyTree';
import { TreeNode, PhylocanvasProps, Phylocanvas } from '../../types/phylogeny-tree';
import { createContextMenuPlugin } from '../contextMenu/createContextMenuPlugin';
import { nodeMenuItems, treeMenuItems } from './menuItems';

type State = {
  possition?: { x: number; y: number };
  visible: boolean;
  node?: TreeNode;
};

const initialState: State = {
  possition: undefined,
  visible: false,
  node: undefined,
};

export function usePhylocanvasWithMenu(
  newick: string,
  options?: PhylocanvasProps,
  plugins?: Plugins,
  hooks?: Hooks
) {
  const [{ possition, visible, node }, dispatch] = React.useReducer(reducer, initialState);

  const phyloDiv = React.useRef<HTMLDivElement | null>(null);

  const pluginsWithMenu = React.useMemo(() => {
    if (plugins && options?.interactive)
      return [
        ...plugins,
        createContextMenuPlugin((updater) => {
          dispatch({ updater });
        }),
      ];
    return plugins;
  }, [plugins, options?.interactive]);

  const { handleZoomIn, handleZoomOut, getTree } = usePhylogenyTree(
    newick,
    phyloDiv,
    options,
    pluginsWithMenu,
    hooks
  );

  const closeMenu = React.useCallback(() => {
    dispatch({ updater: initialState });
  }, [dispatch]);

  const menuItems = useGetMenuItems(node, getTree, closeMenu);

  return {
    phyloDiv,
    handleZoomIn,
    handleZoomOut,
    menuItems,
    visible,
    possition,
    onClose: closeMenu,
  };
}

function reducer(state: State, action: { updater: Partial<State> }) {
  return {
    ...state,
    ...action.updater,
  };
}

function useGetMenuItems(
  node: TreeNode | undefined,
  getTree: () => Phylocanvas | null,
  closeMenu: () => void
) {
  const menuGroup = node && !node.isLeaf ? nodeMenuItems : treeMenuItems;

  return React.useMemo(() => {
    return menuGroup.map((group) => {
      return group.map(({ label, handler, visible }) => {
        const isVisible =
          typeof visible === 'function'
            ? () => {
                const tree = getTree();
                if (tree) return visible(tree, node as TreeNode);
                return false;
              }
            : visible;
        const text = typeof label === 'string' ? label : label(getTree(), node as TreeNode);
        return {
          label: text,
          onClick: (e) => {
            e.preventDefault();
            const tree = getTree();
            if (tree) handler(tree, node as TreeNode);
            closeMenu();
          },
          visible: isVisible,
        };
      });
    });
  }, [closeMenu, getTree, menuGroup, node]);
}
