import PhylocanvasGL from '@phylocanvas/phylocanvas.gl';
import { useCallback, useEffect, useRef } from 'react';

import { PhylocanvasInitProps, Phylocanvas, Plugins } from '../types/phylocanvas.gl';
import { Hooks } from '../types/react-phylogeny-tree';

const emptyArray = [];

export function usePhylogenyTree<P extends PhylocanvasInitProps, M>(
  canvasRef: React.MutableRefObject<HTMLDivElement | null>,
  props?: P,
  plugins: Plugins<P, M> = emptyArray,
  hooks: Hooks<P, M> = emptyArray
) {
  const treeInstance = useRef<Phylocanvas<P, M> | null>(null);
  const getTree = useCallback<() => Phylocanvas<P, M> | null>(() => treeInstance.current, []);

  useEffect(() => {
    if (canvasRef.current) {
      const tree: Phylocanvas<P, M> = new PhylocanvasGL(
        canvasRef.current,
        {
          size: canvasRef.current.parentElement?.getBoundingClientRect(),
          ...props,
        },
        plugins
      );
      treeInstance.current = tree;

      return function cleanUp() {
        tree.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugins, canvasRef]);

  useEffect(() => {
    const tree = getTree();
    if (tree && props) {
      tree.setProps(props);
    }
  }, [props, getTree]);

  const zoomFactor = 0.2;
  const handleZoomIn = useCallback(() => {
    const tree = getTree();
    if (tree) {
      const { maxZoom, zoom } = tree.getView();
      const newZoom = zoom + zoomFactor;
      if (newZoom < maxZoom) tree.setZoom(newZoom);
      else if (zoom < maxZoom) tree.setZoom(maxZoom);
    }
  }, [getTree]);

  const handleZoomOut = useCallback(() => {
    const tree = getTree();
    if (tree) {
      const { minZoom, zoom } = tree.getView();
      const newZoom = zoom - zoomFactor;
      if (newZoom > minZoom) tree.setZoom(newZoom);
      else if (zoom > minZoom) tree.setZoom(minZoom);
    }
  }, [getTree]);

  loopHooks(hooks, getTree, props);

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
