import React from 'react';

import { usePhylogenyTreeWithMenu } from '../hooks/useTreeWithMenu';
import { Phylocanvas } from '../types/phylocanvas.gl';
import { TreeProps } from '../types/react-phylogeny-tree';
import { ContextMenu } from './contextMenu';
import { ZoomButtons } from './zoom_buttons';

const handleContextMenu = (event) => {
  event.preventDefault();
};

const wrapperStyle: React.CSSProperties = { width: '100%', height: '100%', position: 'absolute' };

export function PhylogenyTree<P, M>({
  newick,
  options,
  plugins,
  hooks,
  zoom = true,
  zoomStyle,
}: TreeProps<P, M>): JSX.Element {
  const { phyloDiv, handleZoomIn, handleZoomOut, menuState, getTree, onClose } =
    usePhylogenyTreeWithMenu<P, M>(newick, options, plugins, hooks);

  return (
    <div style={wrapperStyle} onContextMenu={handleContextMenu}>
      <div ref={phyloDiv} />
      {zoom ? (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomStyle} />
      ) : null}
      {options?.interactive && menuState.visible && getTree !== null ? (
        <ContextMenu
          possition={menuState.possition}
          node={menuState.node}
          getTree={getTree as () => Phylocanvas<P, M>}
          onCloseRequest={onClose}
        />
      ) : null}
    </div>
  );
}
