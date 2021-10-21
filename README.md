# react-phylogeny-tree

This is beta version and API may be subject of changes.

React integration of [phylocanvas.gl](https://phylocanvas.gl). Component (and hook) for phylogenetic tree visualisation for Newick tree format.

It handles up to 100 000+ leaves.

## Install

```bash
yarn add react-phylogeny-tree
```

## API

Use prepared component `PhylogenyTree`.

Props:

- `source`: newick string or source object.
  - mandatory
  - should be ref. stable (or memoized), if changes phylogeny-tree instance is reinitialised
- `props`: phylocanvas.gl props, when change phylocanvas.gl tree.setProps method is called with new value
- `plugins`: array of phylocanvas.gl plugins, viz section Plugins bellow
  - should be memoized, if changes phylogeny-tree instance is reinitialised
- `hooks`: array of hooks, viz section Hooks bellow
- `zoom`: boolean, when `interactive` and `zoom` are `true` buttons for zoom appears.
- `zoomStyle`: `CSSProperties` object passed to zoom buttons container.

## Plugins

phylocanvas.gl supported plugins of type:

```typescript
type Plugins<P, M> = ((
  tree: Phylocanvas<P, M>,
  decorate: <T = unknown>(
      fnName: string,
      fn: (delegate: (...args: T[]) => unknown, args: T[]) => unknown
    ) => void;
  ) => void)[];
```

## Hooks

import from `react-phylogeny-tree.gl/hooks`. Pass in array with stable reference between rerenders (memoize). Their type is:

```typescript
type Hooks<P extends PhylocanvasProps, M> = ((
  getTree: () => Phylocanvas<P, M> | null,
  props: P & PhylocanvasProps
) => void)[];
```

`useLeafSubtree`: react hook which wraps `setRootNLevelsUp`. Needs to receive folowing object under key `leafSubtree` from `props`.

```typescript
leafSubtree: {
    leafID?: string;
    noLevels?: number;
    minLeafToRootLength?: number;
    setLeafLabels?: (ids: (string | number)[]) => void;
  };
```

`useAutoResize`: react hook for autoresizing canvas when window size changes.

## css

Zoom buttons and context menu require css for proper function.

```javascript
import 'react-phylogeny-tree-gl/css/zoom.css';
```

```javascript
import 'react-phylogeny-tree-gl/css/contextMenu.css';
```
