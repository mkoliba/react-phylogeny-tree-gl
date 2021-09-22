import { Phylocanvas } from 'gl-react-phylogeny-tree/src/types/phylogeny-tree';

import { getNodeLeafOffspringsIDs } from '../utils';

export function onClickHighlightOffsprings(tree: Phylocanvas, decorate) {
  decorate('handleClick', (delegate, args) => {
    const [info, event] = args;
    if (
      !event.rightButton &&
      !(event.srcEvent.shiftKey && this.props.selectedIds && this.props.selectedIds.length)
    ) {
      const node = tree.pickNodeFromLayer(info);
      if (node && !node.isLeaf) {
        const ids = getNodeLeafOffspringsIDs(node);
        tree.selectLeafNodes(ids, event.srcEvent.metaKey || event.srcEvent.ctrlKey);
      } else delegate(...args);
    } else delegate(...args);
  });
}
