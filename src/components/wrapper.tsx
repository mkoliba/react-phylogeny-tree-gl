import React from 'react';

import { Plugins, Hooks } from '../hooks/usePhylogenyTree';
import { usePhylocanvasWithMenu } from '../plugins/contextMenu/useTreeWithMenu';
import { Newick, PhylocanvasProps } from '../types/phylocanvas.gl';
import { ContextMenu } from './contextMenu';
import { ZoomButtons } from './zoom_buttons';

type TreeProps<P, M> = {
  newick: Newick;
  options?: P & PhylocanvasProps;
  plugins?: Plugins<P, M>;
  hooks?: Hooks<P, M>;
  zoom?: boolean;
  zoomStyle?: React.CSSProperties;
};

const handleContextMenu = (event) => {
  event.preventDefault();
};

export function PhylogenyTree<P, M>({
  newick,
  options,
  plugins,
  hooks,
  zoom = true,
  zoomStyle,
}: TreeProps<P, M>): JSX.Element {
  const { phyloDiv, handleZoomIn, handleZoomOut, menuItems, visible, possition, onClose } =
    usePhylocanvasWithMenu<P, M>(newick, options, plugins, hooks);

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onContextMenu={handleContextMenu}
    >
      <div ref={phyloDiv} />
      {zoom ? (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomStyle} />
      ) : null}
      {options?.interactive ? (
        <ContextMenu
          showMenu={visible}
          possition={possition}
          menuGroups={menuItems}
          onCloseRequest={onClose}
        />
      ) : null}
    </div>
  );
}
