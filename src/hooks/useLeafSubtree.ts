import { useEffect } from 'react';

import { PhylocanvasInitProps } from '../types/phylocanvas.gl';
import { GetTree } from '../types/react-phylogeny-tree';
import { setRootNLevelsUp } from '../utils';

export type SubtreeLeafOption = {
  leafSubtree: {
    leafID?: string;
    noLevels?: number;
    minLeafToRootLength?: number;
    setLeafLabels?: (ids: (string | number)[]) => void;
  };
};

export function useLeafSubtree<
  P extends PhylocanvasInitProps,
  M extends Record<string, (...args: unknown[]) => unknown>
>(
  getTree: GetTree<P, M>,
  { leafSubtree: { leafID, noLevels, minLeafToRootLength, setLeafLabels } }: SubtreeLeafOption
) {
  useEffect(() => {
    const tree = getTree();
    if (tree && leafID) {
      setRootNLevelsUp(tree, leafID, noLevels, minLeafToRootLength);
      const ids = tree.getGraphAfterLayout().leaves.map((value) => value.id);
      if (setLeafLabels) setLeafLabels(ids);
    }
  }, [leafID, noLevels, minLeafToRootLength, setLeafLabels, getTree]);
}
