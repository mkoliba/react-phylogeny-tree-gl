import { plugins as phylocanvasPlugins } from '@phylocanvas/phylocanvas.gl';

import { createOnRedrawReRootTreePlugin } from './createPluginOnRedrawReRootTree';
import { createOnSelectPlugin } from './createPluginOnSelect';
import { createOnViewSubtreePlugin } from './createPluginOnViewSubtree';
import { onClickHighlightOffsprings } from './onClickHighlightOffsprings';
import { createRedoUndoPlugin } from './redoUndo';

const scalebar = phylocanvasPlugins.scalebar;

export {
  createOnSelectPlugin,
  createOnViewSubtreePlugin,
  createOnRedrawReRootTreePlugin,
  onClickHighlightOffsprings,
  createRedoUndoPlugin,
  scalebar,
};
