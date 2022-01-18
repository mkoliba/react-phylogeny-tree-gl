import React from 'react';

import { usePhylogenyTreeWithMenu } from '../hooks/useTreeWithMenu';
import { TreeProps, PhylogenyTreeRef, Props, InitProps } from '../types/react-phylogeny-tree';
import { ContextMenu } from './contextMenu';
import { ZoomButtons } from './zoom_buttons';

const handleContextMenu = (event) => {
  event.preventDefault();
};

const wrapperStyle: React.CSSProperties = { width: '100%', height: '100%', position: 'absolute' };

function TreeWithMenu<IP extends InitProps<CP>, CP extends Props, M>(
  {
    initProps,
    controlledProps,
    plugins,
    hooks,
    zoomButtons = true,
    zoomButtonsStyle,
  }: TreeProps<IP, CP, M>,
  ref: React.Ref<PhylogenyTreeRef<IP & CP, M>>
): JSX.Element {
  const { phyloDiv, handleZoomIn, handleZoomOut, menuState, getTree, onClose } =
    usePhylogenyTreeWithMenu<IP, CP, M>(initProps, controlledProps, plugins, hooks);

  React.useImperativeHandle(ref, () => ({
    getTree,
  }));

  return (
    <div style={wrapperStyle} onContextMenu={handleContextMenu}>
      <div ref={phyloDiv} />
      {zoomButtons ? (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomButtonsStyle} />
      ) : null}
      {initProps?.interactive && menuState.visible && getTree !== null ? (
        <ContextMenu
          possition={menuState.possition}
          node={menuState.node}
          getTree={getTree}
          onCloseRequest={onClose}
        />
      ) : null}
    </div>
  );
}

export const PhylogenyTree = React.forwardRef(TreeWithMenu) as <
  IP extends InitProps<CP>,
  CP extends Props,
  M
>(
  props: TreeProps<IP, CP, M> & { ref?: React.ForwardedRef<PhylogenyTreeRef<IP & CP, M>> }
) => ReturnType<typeof TreeWithMenu>;
