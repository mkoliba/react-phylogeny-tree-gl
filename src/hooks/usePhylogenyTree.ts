import PhylocanvasGL from '@phylocanvas/phylocanvas.gl';
import { useCallback, useEffect, useRef } from 'react';
// import interactionsPlugin from '@mkoliba/phylogeny-tree-plugin-interactions/index';

import { Newick, PhylocanvasProps, Phylocanvas, Decorate } from '../types/phylocanvas.gl';

export type Plugins<P, M> = ((tree: Phylocanvas<P, M>, decorate: Decorate) => void)[];
export type Hooks<P, M> = ((
  getTree: () => Phylocanvas<P, M> | null,
  options: P & PhylocanvasProps
) => void)[];

const emptyArray = [];

export function usePhylogenyTree<P, M>(
  newick: Newick,
  canvasRef: React.MutableRefObject<HTMLDivElement | null>,
  options?: P & PhylocanvasProps,
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
          source: newick,
          ...options,
        },
        plugins
      );
      treeInstance.current = tree;

      return function cleanUp() {
        tree.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newick, plugins, canvasRef]);

  useEffect(() => {
    const tree = getTree();
    if (tree && options) {
      tree.setProps(options);
    }
  }, [options, getTree]);

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

  loopHooks(hooks, getTree, options);

  return { handleZoomIn, handleZoomOut, getTree };
}

export const loopHooks = (hooks, getInstance, options) => {
  hooks.forEach((hook) => {
    const nextValue = hook(getInstance, options);
    if (process && process.env.NODE_ENV === 'development')
      if (typeof nextValue !== 'undefined') {
        throw new Error(
          'react-phylogeny-tree.gl: A loop-type hook ☝️ just returned a value! This is not allowed.'
        );
      }
  });
};
