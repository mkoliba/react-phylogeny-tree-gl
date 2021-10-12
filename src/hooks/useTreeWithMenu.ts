import React from 'react';

import { usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { createContextMenuPlugin } from '../plugins/contextMenu/createContextMenuPlugin';
import { TreeNode, PhylocanvasProps, Plugins } from '../types/phylocanvas.gl';
import { Hooks } from '../types/react-phylogeny-tree';

export type MenuState = {
  possition?: { x: number; y: number };
  visible: boolean;
  node?: TreeNode;
};

const initialState: MenuState = {
  possition: undefined,
  visible: false,
  node: undefined,
};

export function usePhylogenyTreeWithMenu<P, M>(
  newick: string,
  options?: P & PhylocanvasProps,
  plugins?: Plugins<P, M>,
  hooks?: Hooks<P, M>
) {
  const [menuState, dispatch] = React.useReducer(reducer, initialState);

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

  const { handleZoomIn, handleZoomOut, getTree } = usePhylogenyTree<P, M>(
    newick,
    phyloDiv,
    options,
    pluginsWithMenu,
    hooks
  );

  const closeMenu = React.useCallback(() => {
    dispatch({ updater: initialState });
  }, [dispatch]);

  return {
    phyloDiv,
    handleZoomIn,
    handleZoomOut,
    getTree,
    menuState,
    onClose: closeMenu,
  };
}

function reducer(state: MenuState, action: { updater: Partial<MenuState> }) {
  return {
    ...state,
    ...action.updater,
  };
}
