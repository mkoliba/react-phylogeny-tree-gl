import PhylocanvasGL from '@phylocanvas/phylocanvas.gl';
import React from 'react';

import type { Phylocanvas, Plugins } from '../types/phylocanvas.gl';
import type { Hooks, Props, InitProps } from '../types/react-phylogeny-tree';

const emptyArray = [];

export function usePhylogenyTree<
  IP extends InitProps<CP>,
  CP extends Props = Record<string, unknown>,
  M extends Record<string, (...args: unknown[]) => unknown> = Record<string, never>
>(
  canvasRef: React.RefObject<HTMLDivElement>,
  initProps: IP,
  controlledProps?: CP,
  plugins: Plugins<IP & CP, M> = emptyArray,
  hooks: Hooks<IP & CP, M> = emptyArray
) {
  type P = IP & CP;
  const treeInstance = React.useRef<Phylocanvas<P, M> | null>(null);
  const getTree = React.useCallback<() => Phylocanvas<P, M> | null>(() => treeInstance.current, []);
  const [, setIsInit] = React.useState(false); // we want to cause rerender when tree is instantiated

  React.useEffect(() => {
    if (canvasRef.current) {
      const tree: Phylocanvas<P, M> = new PhylocanvasGL(
        canvasRef.current,
        {
          size: canvasRef.current.parentElement?.getBoundingClientRect(),
          ...initProps,
          ...controlledProps,
        },
        plugins
      );
      treeInstance.current = tree;
      setIsInit(true);

      return function cleanUp() {
        tree.destroy();
        setIsInit(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initProps, plugins, canvasRef]); // we do not want to reinitialise when controlledProps change

  React.useEffect(() => {
    const tree = getTree();
    if (tree && controlledProps) {
      tree.setProps(controlledProps as Partial<P>);
    }
  }, [controlledProps, getTree]);

  const zoomFactor = 0.2;
  const handleZoomIn = React.useCallback(() => {
    const tree = getTree();
    if (tree) {
      const { maxZoom, zoom } = tree.getView();
      const newZoom = zoom + zoomFactor;
      if (newZoom < maxZoom) tree.setZoom(newZoom);
      else if (zoom < maxZoom) tree.setZoom(maxZoom);
    }
  }, [getTree]);

  const handleZoomOut = React.useCallback(() => {
    const tree = getTree();
    if (tree) {
      const { minZoom, zoom } = tree.getView();
      const newZoom = zoom - zoomFactor;
      if (newZoom > minZoom) tree.setZoom(newZoom);
      else if (zoom > minZoom) tree.setZoom(minZoom);
    }
  }, [getTree]);

  loopHooks(hooks, getTree, { ...initProps, ...controlledProps });

  return { handleZoomIn, handleZoomOut, getTree };
}

export const loopHooks = (hooks, getInstance, props) => {
  hooks.forEach((hook) => {
    const nextValue = hook(getInstance, props);
    if (process && process.env.NODE_ENV === 'development')
      if (typeof nextValue !== 'undefined') {
        throw new Error(
          'react-phylogeny-tree.gl: A loop-type hook ☝️ just returned a value! This is not allowed.'
        );
      }
  });
};
