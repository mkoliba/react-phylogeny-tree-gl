import { PhylocanvasInitProps, PhylocanvasProps, Plugins, Phylocanvas } from './phylocanvas.gl';

export type TreeProps<P extends PhylocanvasInitProps, M> = {
  props: P;
  plugins?: Plugins<P, M>;
  hooks?: Hooks<P, M>;
  zoom?: boolean;
  zoomStyle?: React.CSSProperties;
};

export type Hooks<P extends PhylocanvasInitProps, M> = ((
  getTree: () => Phylocanvas<P, M> | null,
  props: P & PhylocanvasProps
) => void)[];
