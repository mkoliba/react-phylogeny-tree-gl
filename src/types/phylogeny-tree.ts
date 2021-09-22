export type Newick = string;

export type Decorate = (fnName: string, fn: unknown) => void;

export type Phylocanvas = {
  deck: any;
  deferred: {
    count: number;
    render: boolean;
  };
  layers: any[];
  view: HTMLDivElement;
  props: PhylocanvasProps;
} & Methods;

type RgbaArray = [number, number, number, number];
type ColumnKey = string;

export type PhylocanvasProps = Partial<{
  alignLabels: boolean;
  blockHeaderFontSize: number;
  blockLength: number;
  blockPadding: number;
  blocks: ColumnKey[];
  branchZoom: number;
  centre: [number, number];
  collapsedIds: [];
  edgeOverlapFactor: number;
  fillColour: RgbaArray;
  fontColour: RgbaArray;
  fontFamily: string;
  fontSize: number;
  haloRadius: number;
  haloWidth: number;
  highlightColour: RgbaArray;
  interactive: boolean;
  lineWidth: number;
  metadata: { [leafID: string]: { [columnKey: string]: { colour: string; label: string } } };
  nodeShape: Shape;
  nodeSize: number;
  padding: number;
  rootId: string | null;
  rotatedIds: string[];
  selectedIds: string[];
  shapeBorderAlpha: number;
  shapeBorderWidth: number;
  showBlockHeaders: boolean;
  showBranchLengths: boolean;
  showEdges: boolean;
  showInternalLabels: boolean;
  showLabels: boolean;
  showLeafLabels: boolean;
  showPiecharts: boolean;
  showShapeBorders: boolean;
  showShapes: boolean;
  size: { height: number; width: number };
  stepZoom: number;
  strokeColour: RgbaArray;
  styleLeafLabels: boolean;
  styleNodeEdges: boolean;
  styles: {
    [nodeID: string]: {
      fillColour?: string | RgbaArray;
      shape?: Shape;
      label?: string;
      [key: string]: unknown;
    };
  };
  treeToCanvasRatio: number;
  type: TreeType;
  zoom: number;
  [key:string]: unknown;
}>;

export type Methods = {
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
  collapseNode: (nodeOrId: TreeNode | string) => void;
  descendingNodeOrder: () => void;
  destroy: () => void;
  exportJSON: (space, replacer) => string;
  exportNewick: (nodeOrId: TreeNode | string, options) => string;
  exportPNG: () => unknown;
  exportSVG: () => Blob;
  findNodeById: (nodeOrId: TreeNode | string) => TreeNode | undefined;
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
  pickNodeAtCanvasPoint: (x:number, y: number) => TreeNode | null;
  pickNodeFromLayer: ({ layer, object }) => TreeNode | null;
  projectPoint: (point: [number, number], optionalScale?: number) => [number, number];
  render: () => void;
  rerootNode: (nodeOrId: TreeNode | string) => void;
  resize: (width: number, height: number) => void;
  resume: () => void;
  rotateNode: (nodeOrId: TreeNode | string) => void;
  selectLeafNodes: (ids: string[], append?: boolean) => void;
  selectNode: (nodeOrId: TreeNode | string, append?: boolean) => void;
  setBranchZoom: (branchZoom: number, screenPoint?: [number, number]) => void;
  setProps: (updater: PhylocanvasProps) => void;
  setRoot: (nodeOrId: TreeNode | string, props?: PhylocanvasProps) => void;
  setScale: (scale: number, screenPoint?: [number, number]) => void;
  setSource: (data: string, original?: string) => void;
  setStepZoom: (stepZoom: number, screenPoint?: [number, number]) => void;
  setTooltip: (text) => void;
  setTreeType: (type: TreeType) => void;
  setView: (newView: Partial<{
    maxZoom: number;
    minZoom: number;
    centre: [number, number];
    zoom: number;
  }>) => void;
  setZoom: (e) => void;
  suspend: () => void;
  unprojectPoint: (canvasPoint: [number, number]) => [number, number];
  constructor: () => void;
};

type GraphWithoutLayout = {
  firstIndex: number;
  ids: {
    [nodeID: string]: TreeNode;
  };
  lastIndex: number;
  leaves: LeafNode[];
  originalRoot: RootNode;
  originalSource: string;
  postorderTraversal: TreeNode[];
  preorderTraversal: TreeNode[];
  root: RootNode;
  source: Newick;
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
