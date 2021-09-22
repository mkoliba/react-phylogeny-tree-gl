import { Phylocanvas } from '../types/phylogeny-tree';
import { EmptyArray } from '../utils';

export function createOnSelectPlugin(
  onSelect: (tree: Phylocanvas, selectedIds: string[]) => void
) {
  return function onSelectPlugin(tree: Phylocanvas, decorate) {
    decorate('selectNode', (delegate, args) => {
      delegate(...args);
      const selectedIds = tree.props.selectedIds ?? EmptyArray;
      onSelect(tree, selectedIds);
    });
  };
}
