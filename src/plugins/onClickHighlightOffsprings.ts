import { Phylocanvas, Decorate, TreeNode } from '../types/phylocanvas.gl';
import { getNodeLeafOffspringsIDs } from '../utils';

export function onClickHighlightOffsprings(tree: Phylocanvas, decorate: Decorate) {
  decorate('selectNode', (delegate, args: [TreeNode | string, boolean]) => {
    const [nodeOrId, append] = args;
    const node = nodeOrId ? tree.findNodeById(nodeOrId) : null;
    if (node && !node.isLeaf) {
      const ids = getNodeLeafOffspringsIDs(node);
      if (append) {
        const newItems = new Set(tree.props.selectedIds);
        for (const id of ids) {
          newItems.add(id);
        }
        this.setProps({ selectedIds: Array.from(newItems) });
      } else {
        this.setProps({ selectedIds: ids });
      }
    }
    delegate(...args);
  });
}
