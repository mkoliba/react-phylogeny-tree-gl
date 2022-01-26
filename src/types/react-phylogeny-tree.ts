import {
  PhylocanvasProps,
  PhylocanvasInitProps,
  Plugins,
  Phylocanvas,
  Source,
  PhylocanvasMethods,
  TreeNode,
} from './phylocanvas.gl';

export type Props = Record<string, unknown> & PhylocanvasProps;

type SourceRequired = { source: Source };
export type InitProps<CP extends Props> = CP extends SourceRequired
  ? Props
  : Props & SourceRequired;

export type TreeProps<
  IP extends InitProps<CP>,
  CP extends Props,
  M extends Record<string, (...args: unknown[]) => unknown>
> = {
  initProps: IP;
  controlledProps?: CP | undefined;
  plugins?: Plugins<IP & CP, M>;
  hooks?: Hooks<IP & CP, M>;
  zoomButtons?: boolean;
  zoomButtonsStyle?: React.CSSProperties;
};

export type Hooks<
  P extends PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown>
> = ((getTree: GetTree<P, M>, props: P) => void)[];

export type GetTree<
  P extends PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown>
> = () => Phylocanvas<P, M> | null;

export type PhylogenyTreeRef<
  P extends PhylocanvasInitProps = PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown> = Record<string, never>
> = {
  getTree: GetTree<P, M>;
};
