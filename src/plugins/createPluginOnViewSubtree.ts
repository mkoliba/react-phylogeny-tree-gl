import { Phylocanvas, Decorate, TreeNode } from '../types/phylocanvas.gl';

export function createOnViewSubtreePlugin(
  onViewSubtree: (tree: Phylocanvas, leafsInSubtree: string[]) => void
) {
  return function onViewSubtreePlugin(tree: Phylocanvas, decorate: Decorate) {
    decorate('setRoot', (delegate, args: [TreeNode]) => {
      const [node] = args;
      if (!node.isLeaf) {
        delegate(...args);
        if (tree) {
          const leafs = tree.getGraphAfterLayout().leaves.map((value) => value.label || value.id);
          onViewSubtree(tree, leafs);
        }
      }
    });
  };
}
