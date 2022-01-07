import React from 'react';

import { usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { PhylocanvasProps } from '../types/phylocanvas.gl';
import { TreeProps, PhylogenyTreeRef } from '../types/react-phylogeny-tree';
import { ZoomButtons } from './zoom_buttons';

const wrapperStyle: React.CSSProperties = { width: '100%', height: '100%', position: 'absolute' };

function TreeWithoutMenu<P extends PhylocanvasProps, M>(
  { source, props, plugins, hooks, zoomButtons = true, zoomButtonsStyle }: TreeProps<P, M>,
  ref: React.Ref<PhylogenyTreeRef<P,M>>
): JSX.Element {
  const phyloDiv = React.useRef<HTMLDivElement | null>(null);

  const { handleZoomIn, handleZoomOut, getTree } = usePhylogenyTree<P, M>(
    phyloDiv,
    source,
    props,
    plugins,
    hooks
  );

  React.useImperativeHandle(ref, () => ({
    getTree,
  }));

  return (
    <div style={wrapperStyle}>
      <div ref={phyloDiv} />
      {zoomButtons ? (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomButtonsStyle} />
      ) : null}
    </div>
  );
}

export const PhylogenyTreeWithoutMenu = React.forwardRef(TreeWithoutMenu);