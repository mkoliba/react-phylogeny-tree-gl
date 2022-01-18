import React from 'react';

import { usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { createContextMenuPlugin } from '../plugins/contextMenu/createContextMenuPlugin';
import { TreeNode, Plugins } from '../types/phylocanvas.gl';
import { Hooks, Props, InitProps } from '../types/react-phylogeny-tree';

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

export function usePhylogenyTreeWithMenu<IP extends InitProps<CP>, CP extends Props, M>(
  initProps: IP,
  controlledProps: CP | undefined,
  plugins?: Plugins<IP & CP, M>,
  hooks?: Hooks<IP & CP, M>
) {
  const [menuState, dispatch] = React.useReducer(reducer, initialState);

  const phyloDiv = React.useRef<HTMLDivElement>(null);

  const pluginsWithMenu = React.useMemo(() => {
    if (plugins && initProps?.interactive)
      return [
        ...plugins,
        createContextMenuPlugin((updater) => {
          dispatch({ updater });
        }),
      ];
    return plugins;
  }, [plugins, initProps?.interactive]);

  const { handleZoomIn, handleZoomOut, getTree } = usePhylogenyTree<IP, CP, M>(
    phyloDiv,
    initProps,
    controlledProps,
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
