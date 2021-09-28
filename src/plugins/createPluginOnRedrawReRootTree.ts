import { Phylocanvas, Decorate } from '../types/phylogeny-tree';

export function createOnRedrawReRootTreePlugin(
  onRedrawReRootTree: (tree: Phylocanvas, leafsInTree: string[]) => void
) {
  // redraw original tree/re-root tree
  return function onRedrawReRootTreePlugin(tree: Phylocanvas, decorate: Decorate) {
    decorate('setSource', (delegate, args) => {
      delegate(...args);
      if (tree) {
        const ids = tree.getGraphWithoutLayout().leaves.map((value) => value.id);
        onRedrawReRootTree(tree, ids);
      }
    });
  };
}
