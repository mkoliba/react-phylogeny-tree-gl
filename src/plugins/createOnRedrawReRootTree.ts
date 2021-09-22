import { Phylocanvas } from '../types/phylogeny-tree';

export function createOnRedrawReRootTreePlugin(
  onRedrawReRootTree: (tree: Phylocanvas, leafsInTree: string[]) => void
) {
  // redraw original tree/re-root tree
  return function (tree: Phylocanvas, decorate) {
    decorate('setSource', (delegate, args) => {
      delegate(...args);
      if (tree) {
        const ids = tree.getGraphWithoutLayout().leaves.map((value) => value.id);
        onRedrawReRootTree(tree, ids);
      }
    });
  };
}
