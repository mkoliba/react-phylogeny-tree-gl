import React from 'react';

import { usePhylogenyTreeWithMenu } from '../hooks/useTreeWithMenu';
import { Phylocanvas, PhylocanvasProps } from '../types/phylocanvas.gl';
import { TreeProps, PhylogenyTreeRef } from '../types/react-phylogeny-tree';
import { ContextMenu } from './contextMenu';
import { ZoomButtons } from './zoom_buttons';

const handleContextMenu = (event) => {
  event.preventDefault();
};

const wrapperStyle: React.CSSProperties = { width: '100%', height: '100%', position: 'absolute' };

function TreeWithMenu<P extends PhylocanvasProps & Record<string, unknown>, M>(
  { source, props, plugins, hooks, zoomButtons = true, zoomButtonsStyle }: TreeProps<P, M>,
  ref: React.Ref<PhylogenyTreeRef<P,M>>
): JSX.Element {
  const { phyloDiv, handleZoomIn, handleZoomOut, menuState, getTree, onClose } =
    usePhylogenyTreeWithMenu<P, M>(source, props, plugins, hooks);

  React.useImperativeHandle(ref, () => ({
    getTree,
  }));

  return (
    <div style={wrapperStyle} onContextMenu={handleContextMenu}>
      <div ref={phyloDiv} />
      {zoomButtons ? (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomButtonsStyle} />
      ) : null}
      {props?.interactive && menuState.visible && getTree !== null ? (
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

export const PhylogenyTree = React.forwardRef(TreeWithMenu);
