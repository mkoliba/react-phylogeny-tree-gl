# react-phylogeny-tree-gl

React integration of [phylocanvas.gl](https://phylocanvas.gl). Components (and hooks) for phylogenetic tree visualisation for Newick tree format.

It handles up to 100 000+ leaves.

## Install

```bash
yarn add react-phylogeny-tree-gl
```

## Components

### `PhylogenyTree`

It includes zoom buttons, context menu (adds context menu plugin to plugins array) and support `redoUndo` plugin with control buttons.

Props:

- `initProps`: phylocanvas.gl properties used for initialisation. Should be ref. stable (eg. memoized), if changes phylocanvas instance is reinitialised
- `controlledProps`: phylocanvas.gl properties, when change phylocanvas.gl tree.setProps method is called with new value. During initialisation props `initProps` and `controlledProps` are merged `{...initProps, ...controlledProps}`.
- `plugins`: array of phylocanvas.gl plugins, viz section Plugins bellow
  - should be Should be ref stable (eg. memoized), if changes phylogeny-tree instance is reinitialised
- `hooks`: array of hooks, viz section Hooks bellow. Should be ref stable.
- `zoomButtons`: boolean, when `interactive` (in `initProps`) and `zoomButtons` are `true` buttons for zoom appears.
- `zoomButtonsStyle`: `CSSProperties` object passed to zoom buttons container.
- `ref` reference which expose getTree function which returns phylocanvas.gl instance and allows us to perform imperative operations on it.

There have to be `source` prop in either in `initProps` or `controlledProps`. The source type is:

```typescript
type Newick = string;
type BiojsTree = {
  children: BiojsTree[];
  name: string | number;
  branch_length: number;
};
type Source =
  | Newick
  | {
      type: 'newick';
      data: Newick;
      original?: Source;
    }
  | {
      type: 'biojs';
      data: BiojsTree;
      original?: Source;
    };
```

#### CSS

For correct function of zoom buttons, context menu and redo-undo control buttons it is necessary.

```javascript
import 'react-phylogeny-tree-gl/styles.css';
```

### `PhylogenyTreeWithoutMenu`

## Hooks

### `usePhylogenyTreeWithMenu`

used by PhylogenyTree component. Utilise `usePhylogenyTree` to instantiate phylocanvas.gl.

### `usePhylogenyTree`

instantiate phylocanvas.gl

## phylocanvas.gl Plugins

phylocanvas.gl supported plugins of type:

```typescript
export type Plugins<
  P extends PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown>
> = ((tree: Phylocanvas<P, M>, decorate: Decorate<P, M>) => void)[];

export type Decorate<
  P extends PhylocanvasInitProps = PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown> = Record<
    string,
    (...args: unknown[]) => unknown
  >
> = <MethodName extends keyof (M & PhylocanvasMethods<P>)>(
  fnName: MethodName,
  fn: (
    delegate: (M & PhylocanvasMethods<P>)[MethodName],
    args: Parameters<(PhylocanvasMethods<P> & M)[MethodName]>
  ) => unknown
) => void;
```

### `scalebar`

Shows scalebar at right corner

### `onClickHighlightOffsprings`

## factories for phylocanvas.gl Plugins

### `createOnSelectPlugin`

### `createOnViewSubtreePlugin`

## react-phylogeny hooks

import from `react-phylogeny-tree.gl/hooks`. Pass in array with stable reference between rerenders (memoize). Their type is:

```typescript
type Hooks<P extends PhylocanvasProps, M> = ((
  getTree: () => Phylocanvas<P, M> | null,
  props: P & PhylocanvasProps
) => void)[];
```

### `useLeafSubtree`

react hook which wraps `setRootNLevelsUp`. Needs to receive folowing object under key `leafSubtree` from `props`.

```typescript
leafSubtree: {
    leafID?: string;
    noLevels?: number;
    minLeafToRootLength?: number;
    setLeafLabels?: (ids: (string | number)[]) => void;
  };
```

### `useAutoResize`

react hook for autoresizing canvas when window size changes.

## Example

```typescript
import React from 'react';
import PhylogenyTree from 'react-phylogeny-tree-gl';
import { useLeafSubtree, useAutoResize } from 'react-phylogeny-tree-gl/hooks';
import {
  createOnSelectPlugin,
  createOnViewSubtreePlugin,
  createOnRedrawReRootTreePlugin,
  createRedoUndoPlugin,
  onClickHighlightOffsprings,
  scalebar,
} from 'react-phylogeny-tree-gl/plugins';
import { PhylogenyTreeRef, UndoRedoMethods } from 'react-phylogeny-tree-gl/types';

type TreeNodeColors = {
  [id: string]: { fillColour: string } | null;
};
type TreeProps = {
  newick: string;
  leafColors: TreeNodeColors;
  selectedLeafs: string[];
  subtreeBaseLeaf: string | undefined;
  rootId?: string;
  noLevelsUp: number;
  minBranchLength: number;
};

export type RefProps = {
  source: string;
  interactive: boolean;
  nodeSize: number;
  haloRadius: number;
  haloWidth: number;
  scalebar: boolean;
  highlightColour: [number, number, number, number];
  rootId: string;
  selectedIds: string[];
  styles: TreeNodeColors;
  leafSubtree: {
    leafID: string;
    noLevels: number;
    minLeafToRootLength: number;
  };
};

export type TreeRef = PhylogenyTreeRef<RefProps, UndoRedoMethods>;

const hooks = [useAutoResize, useLeafSubtree];
export const Tree = React.forwardRef(TreeComponent);
function TreeComponent(
  {
    newick,
    rootId,
    leafColors,
    selectedLeafs,
    subtreeBaseLeaf,
    noLevelsUp,
    minBranchLength,
  }: TreeProps,
  ref?: React.RefObject<TreeRef>
): JSX.Element {
  const showHelp = React.useContext(ShowHelpContext);

  const initOptions = React.useMemo(
    () => ({
      source: newick,
      rootId: null,
      interactive: true,
      nodeSize: 7,
      haloRadius: 6,
      haloWidth: 2,
      scalebar: true,
      highlightColour: tuple(52, 182, 199, 255),
    }),
    [newick]
  );
  const controlledOptions = React.useMemo(
    () => ({
      selectedIds: selectedLeafs,
      styles: leafColors,
      leafSubtree: {
        leafID: subtreeBaseLeaf,
        noLevels: noLevelsUp,
        minLeafToRootLength: minBranchLength,
      },
    }),
    [leafColors, minBranchLength, noLevelsUp, selectedLeafs, subtreeBaseLeaf]
  );
  const plugins = React.useMemo(() => {
    return [
      createRedoUndoPlugin(),
      createOnSelectPlugin((_tree, selectedLeafLabels) => {
        if (selectedLeafLabels && selectedLeafLabels.length) {

          console.log(selectedLeafLabels)
        }
      }),
      createOnViewSubtreePlugin((tree, leafsInTree) => {
        console.log(leafsInTree)
      }),
      createOnRedrawReRootTreePlugin((tree, leafsInTree) => {
        console.log(leafsInTree, tree.props.rootId, false);
      }),
      onClickHighlightOffsprings,
      scalebar,
    ];
  }, []);

  React.useEffect(() => {
    if (ref.current) {
      const tree = ref.current.getTree();
      if (tree.props.rootId !== rootId) {
        tree.setRoot(rootId);
      }
    }
  }, [rootId, ref]);


  return (
    <div style={position: 'relative'}>
      <PhylogenyTree
        ref={ref}
        initProps={initOptions}
        controlledProps={controlledOptions}
        hooks={hooks}
        plugins={plugins}
      />
    </div>
  );
}

const tuple = <T extends unknown[]>(...args: T): T => args;
```
