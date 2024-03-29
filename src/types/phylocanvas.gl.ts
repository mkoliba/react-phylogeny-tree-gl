export type Newick = string;
export type BiojsTree = {
  children: BiojsTree[];
  name: string | number;
  branch_length: number;
};
export type Source =
  | Newick
  | {
      type: 'newick';
      data: Newick;
      original?: Source;
    }
  | {
      type: 'biojs';
      data: BiojsTree;
      original?: Source;
    };

export type Phylocanvas<
  P extends PhylocanvasInitProps = PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown> = Record<
    string,
    (...args: unknown[]) => unknown
  >
> = {
  deck: unknown;
  deferred: {
    count: number;
    render: boolean;
  };
  layers: unknown[];
  view: HTMLDivElement;
  props: Readonly<P & PhylocanvasProps>;
} & M &
  PhylocanvasMethods<P>;

export type Decorate<
  P extends PhylocanvasInitProps = PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown> = Record<
    string,
    (...args: unknown[]) => unknown
  >
> = <MethodName extends keyof (M & PhylocanvasMethods<P>)>(
  fnName: MethodName,
  fn: (
    delegate: (M & PhylocanvasMethods<P>)[MethodName],
    args: Parameters<(PhylocanvasMethods<P> & M)[MethodName]>
  ) => unknown
) => void;

export type Plugins<
  P extends PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown>
> = ((tree: Phylocanvas<P, M>, decorate: Decorate<P, M>) => void)[];

type RgbaArray = [number, number, number, number];
type ColumnKey = string;

export type PhylocanvasInitProps = { source: Source } & PhylocanvasProps;
export type PhylocanvasPropMetadata = {
  [leafID: string]: { [columnKey: string]: { colour: string; label: string } };
};
export type PhylocanvasPropSize = { height: number; width: number; [key: string]: unknown };
export type PhylocanvasProps = {
  source?: Source;
  alignLabels?: boolean;
  blockHeaderFontSize?: number;
  blockLength?: number;
  blockPadding?: number;
  blocks?: ColumnKey[];
  branchZoom?: number;
  centre?: [number, number];
  collapsedIds?: string[];
  edgeOverlapFactor?: number;
  fillColour?: RgbaArray;
  fontColour?: RgbaArray;
  fontFamily?: string;
  fontSize?: number;
  haloRadius?: number;
  haloWidth?: number;
  highlightColour?: RgbaArray;
  interactive?: boolean;
  lineWidth?: number;
  metadata?: PhylocanvasPropMetadata;
  nodeShape?: Shape;
  nodeSize?: number;
  padding?: number;
  rootId?: string | null;
  rotatedIds?: string[];
  selectedIds?: string[];
  shapeBorderAlpha?: number;
  shapeBorderWidth?: number;
  showBlockHeaders?: boolean;
  showBranchLengths?: boolean;
  showEdges?: boolean;
  showInternalLabels?: boolean;
  showLabels?: boolean;
  showLeafLabels?: boolean;
  showPiecharts?: boolean;
  showShapeBorders?: boolean;
  showShapes?: boolean;
  size?: PhylocanvasPropSize;
  stepZoom?: number;
  strokeColour?: RgbaArray;
  styleLeafLabels?: boolean;
  styleNodeEdges?: boolean;
  styles?: {
    [nodeID: string]: {
      fillColour?: string | RgbaArray;
      shape?: Shape;
      label?: string;
      [key: string]: unknown;
    };
  };
  treeToCanvasRatio?: number;
  type?: TreeType;
  zoom?: number;
};

export type Layer = { id: string; [key: string]: unknown };

export type PhylocanvasMethods<
  P extends PhylocanvasProps = Record<string, unknown>,
  Props = Partial<P>
> = {
  init: () => void;
  addLayer: (
    layerId,
    visiblePredicate,
    renderer
  ) => {
    id: string;
    isVisible: unknown;
    renderLayer: unknown;
  };
  ascendingNodeOrder: () => void;
  branchZoomingAxis: () => 'x' | 'y' | 'xy';
  collapseNode: (nodeOrId?: TreeNode | string) => void;
  descendingNodeOrder: () => void;
  destroy: () => void;
  exportJSON: (space, replacer) => string;
  exportNewick: (nodeOrId?: TreeNode | string, options?) => string;
  exportPNG: () => unknown;
  exportSVG: () => Blob;
  findNodeById: (nodeOrId?: TreeNode | string) => TreeNode | undefined;
  fitInCanvas: () => void;
  getAlignLeafLabels: () => boolean | undefined;
  getBlockHeaderFontSize: () => number;
  getBlockPadding: () => number;
  getBlockSize: () => number;
  getBranchScale: () => number;
  getBranchZoom: () => number;
  getCanvasCentrePoint: () => [number, number];
  getCanvasSize: () => {
    height: number;
    width: number;
  };
  getDrawingArea: () => {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  getFillColour: () => RgbaArray;
  getFontFamily: () => string;
  getFontSize: () => number;
  getGraphAfterLayout: () => GraphWithLayout;
  getGraphBeforeLayout: () => GraphWithLayout;
  getGraphWithStyles: () => GraphWithLayout;
  getGraphWithoutLayout: () => GraphWithoutLayout;
  getHighlightedNode: () => TreeNode;
  getMaxScale: () => number;
  getMaxZoom: () => number;
  getMetadataColumnWidth: () => number;
  getMinScale: () => number;
  getMinZoom: () => number;
  getNodeSize: () => number;
  getPadding: () => number;
  getPixelOffsets: () => {
    length: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  getScale: () => number;
  getShowShapes: () => boolean;
  getStepScale: () => number;
  getStepZoom: () => number;
  getStepZoomingAxis: () => 'x' | 'y';
  getStrokeColour: () => RgbaArray;
  getStrokeWidth: () => number;
  getTreeType: () => TreeType;
  getView: () => {
    maxZoom: number;
    minZoom: number;
    target: [number, number];
    zoom: number;
  };
  getWorldBounds: () => {
    min: number[];
    max: number[];
  };
  getZoom: () => number;
  handleClick: (info, event) => void;
  handleHover: (info, event) => void;
  hasLeafLabels: () => boolean;
  hasMetadata: () => boolean;
  hasMetadataHeaders: () => boolean;
  hasMetadataLabels: () => boolean;
  highlightNode: () => void;
  importJSON: (text, reviver) => void;
  isCanvasPointOnScreen: (screenPoint: [number, number], padding?: number) => boolean;
  isOrthogonal: () => boolean;
  isTreePointOnScreen: (worldPoint: number[], padding?: number) => boolean;
  midpointRoot: () => void;
  pickNodeAtCanvasPoint: (x: number, y: number) => TreeNode | null;
  pickNodeFromLayer: ({
    layer,
    object,
  }: {
    layer: unknown;
    object: { node: TreeNode; [key: string]: unknown };
  }) => TreeNode | null;
  projectPoint: (point: [number, number], optionalScale?: number) => [number, number];
  render: () => void;
  rerootNode: (nodeOrId?: TreeNode | string) => void;
  resize: (width: number, height: number) => void;
  resume: () => void;
  rotateNode: (nodeOrId?: TreeNode | string) => void;
  selectLeafNodes: (ids: string[], append?: boolean) => void;
  selectNode: (nodeOrId?: TreeNode | string, append?: boolean) => void;
  setBranchZoom: (branchZoom: number, screenPoint?: [number, number]) => void;
  setProps: (updater: Props, eventOrigin?: string) => void;
  setRoot: (nodeOrId?: TreeNode | string, props?: Props) => void;
  setScale: (scale: number, screenPoint?: [number, number]) => void;
  setSource: (data: Source, original?: Source) => void;
  setStepZoom: (stepZoom: number, screenPoint?: [number, number]) => void;
  setTooltip: (text) => void;
  setTreeType: (type: TreeType) => void;
  setView: (
    newView: Partial<{
      maxZoom: number;
      minZoom: number;
      centre: [number, number];
      zoom: number;
    }>
  ) => void;
  setZoom: (e) => void;
  suspend: () => void;
  unprojectPoint: (canvasPoint: [number, number]) => [number, number];
  constructor: () => void;
};

export type HandleClickArgs = [
  info: {
    layer: { id: string; [key: string]: unknown };
    object: { node: TreeNode; [key: string]: unknown };
  },
  event: {
    rightButton: boolean;
    center: { x: number; y: number };
    preventDefault: () => void;
    [key: string]: unknown;
  }
];

type GraphWithoutLayout = {
  firstIndex: number;
  ids: {
    [nodeID: string]: TreeNode;
  };
  lastIndex: number;
  leaves: LeafNode[];
  originalRoot: RootNode;
  originalSource: Source;
  postorderTraversal: TreeNode[];
  preorderTraversal: TreeNode[];
  root: RootNode;
  source: Source;
};

type GraphWithLayout = {
  bounds: { min: [number, number]; max: [number, number] };
  height: number;
  width: number;
} & GraphWithoutLayout;

export type Shape =
  | 'chevron'
  | 'chevron-inverted'
  | 'chevron-left'
  | 'chevron-right'
  | 'circle'
  | 'cross'
  | 'diamond'
  | 'dot'
  | 'double-chevron'
  | 'double-chevron-inverted'
  | 'double-chevron-left'
  | 'double-chevron-right'
  | 'heptagon'
  | 'heptagon-inverted'
  | 'heptagram'
  | 'heptagram-inverted'
  | 'hexagon'
  | 'hexagram'
  | 'octagon'
  | 'octagram'
  | 'pentagon'
  | 'pentagon-inverted'
  | 'pentagram'
  | 'pentagram-inverted'
  | 'plus'
  | 'square'
  | 'pentagram'
  | 'pentagram-inverted'
  | 'tetragram'
  | 'triangle'
  | 'triangle-inverted'
  | 'triangle-left'
  | 'triangle-right'
  | 'wye'
  | 'wye-inverted';

export type TreeType = 'cr' | 'dg' | 'hr' | 'rd' | 'rc';

export type CommonNodeProps = {
  angle: number;
  angleDegrees: number;
  branchLength: number;
  bx: number;
  by: number;
  distanceFromRoot: number;
  id: string;
  inverted: boolean;
  isCollapsed: boolean;
  isHidden: boolean;

  postIndex: number;
  preIndex: number;
  totalLeaves: number;
  totalNodes: number;
  totalSubtreeLength: number;
  visibleLeaves: number;
  strokeColour?: RgbaArray;
  x: number;
  y: number;
};

export type RootNode = {
  children: (LeafNode | InnerNode)[];
  name: string;
  isLeaf: false;
} & CommonNodeProps;

export type InnerNode = {
  parent: InnerNode | RootNode;
} & RootNode;

export type LeafNode = {
  fillColour: RgbaArray;
  label: string;
  parent: InnerNode | RootNode;
  shape: string;
  isLeaf: true;
} & CommonNodeProps;

export type TreeNode = RootNode | InnerNode | LeafNode;
