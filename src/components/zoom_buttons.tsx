import React from 'react';

export function ZoomButtons({ onZoomIn, onZoomOut, style }): JSX.Element {
  return (
    <div className="react-phylogeny-tree-ctrl-group react-phylogeny-tree-ctrl-zoom" style={style}>
      <button
        className="react-phylogeny-tree-ctrl-zoom-in"
        type="button"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <span className="react-phylogeny-tree-ctrl-icon" aria-hidden="true"></span>
      </button>
      <button
        className="react-phylogeny-tree-ctrl-zoom-out"
        type="button"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <span className="react-phylogeny-tree-ctrl-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
}
