import PhylocanvasGL from '@phylocanvas/phylocanvas.gl';
import { useCallback, useEffect, useRef } from 'react';
// import interactionsPlugin from '@mkoliba/phylogeny-tree-plugin-interactions/index';

import { Newick, PhylocanvasProps, Phylocanvas } from '../types/phylogeny-tree';

export type Plugins = ((
  tree: Phylocanvas,
  decorate: (fnName: string, fn: unknown) => void
) => void)[];
export type Hooks = ((getTree: () => Phylocanvas | null, options: PhylocanvasProps) => void)[];

const emptyObject = {};
const emptyArray = [];

export function usePhylogenyTree(
  newick: Newick,
  canvasRef: React.MutableRefObject<HTMLDivElement | null>,
  options: PhylocanvasProps = emptyObject,
  plugins: Plugins = emptyArray,
  hooks: Hooks = emptyArray
) {
  const treeInstance = useRef<Phylocanvas | null>(null);
  const getTree = useCallback<() => Phylocanvas | null>(() => treeInstance.current, []);

  useEffect(() => {
    if (canvasRef.current) {
      const tree: Phylocanvas = new PhylocanvasGL(
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
    if (tree) {
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

  return { handleZoomIn, handleZoomOut };
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
