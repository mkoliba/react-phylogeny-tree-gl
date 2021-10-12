import { Phylocanvas, TreeNode, RootNode, InnerNode } from '../../types/phylocanvas.gl';
import { getNodeLeafOffspringsIDs } from '../../utils';
import { download, createBlobURL } from './fileDownload';

export type TreeMenuItem = {
  label: string | ((tree: Phylocanvas) => string);
  visible?: (tree: Phylocanvas) => boolean;
  handler: (tree: Phylocanvas) => void;
  isActive: undefined;
};
export type ToggleMenuItem = {
  label: string | ((tree: Phylocanvas) => string);
  handler: (tree: Phylocanvas) => void;
  visible?: (tree: Phylocanvas) => boolean;
  isActive?: (tree: Phylocanvas) => boolean;
};

export type NodeMenuItem = {
  label: string | ((tree: Phylocanvas, node: TreeNode) => string);
  handler: (tree: Phylocanvas, node: RootNode | InnerNode) => void;
  visible?: (tree: Phylocanvas) => boolean;
  isActive?: undefined;
};

export type TreeMenuItems = (TreeMenuItem | ToggleMenuItem)[][];
export type NodeMenuItems = NodeMenuItem[][];

export const treeMenuItems: TreeMenuItems = [
  [
    {
      label: 'Show labels',
      handler: (tree) => {
        const current = Boolean(tree.props.showLabels && tree.props.showLeafLabels);
        tree.setProps({
          showLabels: !current,
          showLeafLabels: !current,
        });
      },
      isActive: (tree) => Boolean(tree.props.showLabels && tree.props.showLeafLabels),
    },
  ],
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
  [
    {
      label: 'Export leaf labels',
      handler: (tree) => {
        const leafs = tree.getGraphAfterLayout().leaves.map((value) => value.label || value.id);
        download(createBlobURL(leafs.join('\n')), 'leaf_labels.txt');
      },
    },
    {
      label: 'Export selected labels',
      handler: (tree) => {
        const leafs = tree.props.selectedIds || [];
        download(createBlobURL(leafs.join('\n')), 'leaf_labels.txt');
      },
      visible: (tree) => Boolean(tree.props.selectedIds && tree.props.selectedIds.length > 0),
    },
    {
      label: 'Export as newick file',
      handler: (tree) => download(createBlobURL(tree.exportNewick()), 'phylogeny_tree.nwk'),
    },
    {
      label: 'Export as image',
      handler: (tree) => {
        download(tree.exportPNG() as string, 'phylogeny_tree.png');
      },
    },
    // {
    //   label: 'Export as SVG',
    //   handler: (tree) => {
    //     download(
    //       (window.URL || window.webkitURL).createObjectURL(tree.exportSVG()),
    //       'phylogeny_tree.svg'
    //     );
    //   },
    // },
  ],
];

export const nodeMenuItems: NodeMenuItems = [
  [
    {
      label: (tree, node) => {
        return tree.props.collapsedIds === undefined ||
          tree.props.collapsedIds?.indexOf(node.id) === -1
          ? 'Collapse subtree'
          : 'Expand subtree';
      },

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
  [
    {
      label: 'Export subtree leaf labels',
      handler: (tree, node) => {
        const ids = getNodeLeafOffspringsIDs(node).join('\n');
        download(createBlobURL(ids), 'leaf_labels.txt');
      },
    },
    {
      label: 'Export subtree as newick file',
      handler: (tree, node) =>
        download(createBlobURL(tree.exportNewick(node)), 'phylogeny_tree.nwk'),
    },
  ],
];
