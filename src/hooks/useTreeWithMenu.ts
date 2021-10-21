import React from 'react';

import { usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { createContextMenuPlugin } from '../plugins/contextMenu/createContextMenuPlugin';
import { TreeNode, PhylocanvasProps, Plugins, Source } from '../types/phylocanvas.gl';
import { Hooks } from '../types/react-phylogeny-tree';

export type MenuState = {
  possition?: { x: number; y: number } | undefined;
  visible: boolean;
  node?: TreeNode | undefined;
};

const initialState: MenuState = {
  possition: undefined,
  visible: false,
  node: undefined,
};

export function usePhylogenyTreeWithMenu<P extends PhylocanvasProps, M>(
  source: Source,
  props: P,
  plugins?: Plugins<P, M>,
  hooks?: Hooks<P, M>
) {
  const [menuState, dispatch] = React.useReducer(reducer, initialState);

  const phyloDiv = React.useRef<HTMLDivElement | null>(null);

  const pluginsWithMenu = React.useMemo(() => {
    if (plugins && props?.interactive)
      return [
        ...plugins,
        createContextMenuPlugin((updater) => {
          dispatch({ updater });
        }),
      ];
    return plugins;
  }, [plugins, props?.interactive]);

  const { handleZoomIn, handleZoomOut, getTree } = usePhylogenyTree<P, M>(
    phyloDiv,
    source,
    props,
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
