import React from 'react';

import type { Phylocanvas, PhylocanvasInitProps } from '../types/phylocanvas.gl';
import type { GetTree, UndoRedoMethods, UndoRedoProps } from '../types/react-phylogeny-tree';

function hasRedoUndoPlugin<
  P extends PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown>,
  RP extends UndoRedoProps,
  RM extends UndoRedoMethods
>(tree: Phylocanvas<P, M> | Phylocanvas<RP, RM>): tree is RedoPhylocanvas<RP, RM> {
  if (
    tree !== null &&
    'redo' in tree &&
    'undo' in tree &&
    'canRedo' in tree &&
    'canUndo' in tree &&
    'history' in tree.props
  ) {
    return true;
  }
  return false;
}

type RedoPhylocanvas<P extends UndoRedoProps, M extends UndoRedoMethods> = Phylocanvas<P, M>;

export function RedoUndo<
  P extends PhylocanvasInitProps = UndoRedoProps,
  M extends Record<string, (...args: unknown[]) => unknown> = UndoRedoMethods
>({ getTree }: { getTree: GetTree<P, M> }) {
  const tree = getTree();
  if (tree && hasRedoUndoPlugin(tree)) {
    return <RedoUndoView tree={tree} />;
  }
  return null;
}

export function RedoUndoView<P extends UndoRedoProps, M extends UndoRedoMethods>({
  tree,
}: {
  tree: Phylocanvas<P, M>;
}) {
  const [redoActive, setRedoActive] = React.useState(false);
  const [undoActive, setUndoActive] = React.useState(false);
  React.useEffect(() => {
    if (tree !== null && 'undo' in tree && 'redo') {
      const { canUndo, canRedo } = tree;
      setRedoActive(canRedo());
      setUndoActive(canUndo());
    }
  }, [tree, tree?.props?.history?.past, tree?.props?.history?.future]);

  if (tree !== null && 'undo' in tree) {
    const { redo, undo, canUndo, canRedo } = tree;
    return (
      <RedoUndoButtons
        canRedo={redoActive}
        canUndo={undoActive}
        onRedo={() => {
          if (canRedo()) redo();
          setRedoActive(canRedo());
          setUndoActive(canUndo());
        }}
        onUndo={() => {
          if (canUndo()) undo();
          setRedoActive(canRedo());
          setUndoActive(canUndo());
        }}
      />
    );
  }
  return null;
}

export function RedoUndoButtons({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  style = {},
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  style?: React.CSSProperties;
}): JSX.Element {
  return (
    <div className="react-phylogeny-tree-ctrl-group react-phylogeny-tree-redo-undo" style={style}>
      <button
        className="react-phylogeny-tree-ctrl-zoom-in"
        type="button"
        onClick={onUndo}
        title="Undo"
        disabled={!canUndo}
      >
        <span
          className="react-phylogeny-tree-undo react-phylogeny-tree-redo-undo-icon"
          aria-hidden="true"
        ></span>
      </button>
      <button
        className="react-phylogeny-tree-ctrl-zoom-out"
        type="button"
        onClick={onRedo}
        title="Redo"
        disabled={!canRedo}
      >
        <span
          className=" react-phylogeny-tree-redo react-phylogeny-tree-redo-undo-icon"
          aria-hidden="true"
        ></span>
      </button>
    </div>
  );
}
