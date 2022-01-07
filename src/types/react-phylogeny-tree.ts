import { Source, PhylocanvasProps, Plugins, Phylocanvas } from './phylocanvas.gl';

export type TreeProps<P extends PhylocanvasProps, M> = {
  source: Source;
  props: P;
  plugins?: Plugins<P, M>;
  hooks?: Hooks<P, M>;
  zoomButtons?: boolean;
  zoomButtonsStyle?: React.CSSProperties;
};

export type Hooks<P extends PhylocanvasProps, M> = ((
  getTree: GetTree<P, M>,
  props: P & PhylocanvasProps
) => void)[];

export type GetTree<
  P extends Record<string, unknown> = PhylocanvasProps,
  M = Record<string, unknown>
> = () => Phylocanvas<P, M> | null;
