import { Phylocanvas, TreeNode } from '../../types/phylogeny-tree';

export type TreeMenuItems = {
  label: string | ((tree: Phylocanvas | null) => string);
  visible?: (tree: Phylocanvas | null) => boolean;
  handler: (tree: Phylocanvas | null) => void;
}[][];

export const treeMenuItems: TreeMenuItems = [
  [
    {
      label: 'Fit in panel',
      handler: (tree) => tree?.fitInCanvas(),
    },
    {
      label: 'Expand collapsed subtrees',
      visible: (tree) => (tree?.props?.collapsedIds?.length || 0) > 0,
      handler: (tree) => tree?.setProps({ collapsedIds: [] }),
    },
    {
      label: 'Redraw original tree',
      handler: (tree) => tree?.setSource(tree.getGraphWithoutLayout().originalSource),
    },
  ],
];

export type NodeMenuItems = {
  label: string | ((tree: Phylocanvas | null, node: TreeNode) => string);
  handler: (tree: Phylocanvas, node: TreeNode) => void;
  visible?: (tree: Phylocanvas | null, node: TreeNode) => boolean;
}[][];

export const nodeMenuItems: NodeMenuItems = [
  [
    {
      label: (tree, node) =>
        tree?.props.collapsedIds?.indexOf(node.id) || -1 === -1
          ? 'Collapse subtree'
          : 'Expand subtree',
      handler: (tree, node) => tree.collapseNode(node),
    },
    {
      label: 'Rotate subtree',
      handler: (tree, node) => tree.rotateNode(node),
    },
  ],

  [
    {
      label: 'View subtree',
      handler: (tree, node) => tree.setRoot(node),
    },
    {
      label: 'Re-root tree',
      handler: (tree, node) => tree.rerootNode(node),
    },
  ],
];
