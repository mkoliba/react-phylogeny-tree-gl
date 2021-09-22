import { Phylocanvas } from '../types/phylogeny-tree';

export function createOnViewSubtreePlugin(
  onViewSubtree: (tree: Phylocanvas, leafsInSubtree: string[]) => void
) {
  return function onViewSubtreePlugin(tree: Phylocanvas, decorate) {
    decorate('setRoot', (delegate, args) => {
      delegate(...args);

      if (tree) {
        const leafs = tree.getGraphAfterLayout().leaves.map((value) => value.id);
        onViewSubtree(tree, leafs);
      }
    });
  };
}
