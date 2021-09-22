import React from 'react';

import { Plugins, Hooks, usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { Newick, PhylocanvasProps } from '../types/phylogeny-tree';
import { ZoomButtons } from './zoom_buttons';

type TreeProps = {
  newick: Newick;
  options?: PhylocanvasProps;
  plugins?: Plugins;
  hooks?: Hooks;
  zoom?: boolean;
  zoomStyle?: React.CSSProperties;
};

export function PhylogenyTree({
  newick,
  options,
  plugins,
  hooks,
  zoom = true,
  zoomStyle,
}: TreeProps): JSX.Element {
  const phyloDiv = React.useRef<HTMLDivElement | null>(null);
  const { handleZoomIn, handleZoomOut } = usePhylogenyTree(
    newick,
    phyloDiv,
    options,
    plugins,
    hooks
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={phyloDiv} />
      {zoom ? (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomStyle} />
      ) : null}
    </div>
  );
}
