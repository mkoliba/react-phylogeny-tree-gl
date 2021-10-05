import { Phylocanvas } from '../types/phylocanvas.gl';
import { EmptyArray } from '../utils';

export function createOnSelectPlugin(onSelect: (tree: Phylocanvas, selectedIds: string[]) => void) {
  return function onSelectPlugin(tree: Phylocanvas, decorate) {
    decorate('selectNode', (delegate, args) => {
      delegate(...args);
      const selectedIds = tree.props.selectedIds ?? EmptyArray;
      onSelect(tree, selectedIds);
    });
    decorate('selectLeafNodes', (delegate, args) => {
      delegate(...args);
      const selectedIds = tree.props.selectedIds ?? EmptyArray;
      onSelect(tree, selectedIds);
    });
  };
}
