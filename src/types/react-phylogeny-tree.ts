import { Newick, PhylocanvasProps, Plugins, Phylocanvas } from './phylocanvas.gl';

export type TreeProps<P, M> = {
  newick: Newick;
  options?: P & PhylocanvasProps;
  plugins?: Plugins<P, M>;
  hooks?: Hooks<P, M>;
  zoom?: boolean;
  zoomStyle?: React.CSSProperties;
};

export type Hooks<P, M> = ((
  getTree: () => Phylocanvas<P, M> | null,
  options: P & PhylocanvasProps
) => void)[];
