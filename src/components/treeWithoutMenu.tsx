import React from 'react';

import { usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { PhylocanvasInitProps } from '../types/phylocanvas.gl';
import { TreeProps } from '../types/react-phylogeny-tree';
import { ZoomButtons } from './zoom_buttons';

const wrapperStyle: React.CSSProperties = { width: '100%', height: '100%', position: 'absolute' };

export function PhylogenyTreeWithoutMenu<P extends PhylocanvasInitProps, M>({
  props,
  plugins,
  hooks,
  zoom = true,
  zoomStyle,
}: TreeProps<P, M>): JSX.Element {
  const phyloDiv = React.useRef<HTMLDivElement | null>(null);

  const { handleZoomIn, handleZoomOut } = usePhylogenyTree<P, M>(phyloDiv, props, plugins, hooks);

  return (
    <div style={wrapperStyle}>
      <div ref={phyloDiv} />
      {zoom ? (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomStyle} />
      ) : null}
    </div>
  );
}
