import React from 'react';

import { usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { TreeProps, PhylogenyTreeRef, Props, InitProps } from '../types/react-phylogeny-tree';
import { ZoomButtons } from './zoom_buttons';

const wrapperStyle: React.CSSProperties = { width: '100%', height: '100%', position: 'absolute' };

function TreeWithoutMenu<IP extends InitProps<CP>, CP extends Props, M>(
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
  const phyloDiv = React.useRef<HTMLDivElement>(null);

  const { handleZoomIn, handleZoomOut, getTree } = usePhylogenyTree<IP, CP, M>(
    phyloDiv,
    initProps,
    controlledProps,
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

export const PhylogenyTreeWithoutMenu = React.forwardRef(TreeWithoutMenu) as <
  IP extends InitProps<CP>,
  CP extends Props,
  M
>(
  props: TreeProps<IP, CP, M> & { ref?: React.ForwardedRef<PhylogenyTreeRef<IP & CP, M>> }
) => ReturnType<typeof TreeWithoutMenu>;
