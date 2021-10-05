import { useCallback, useRef } from 'react';

import { Phylocanvas, TreeNode } from './types/phylocanvas.gl';

export function setRootNLevelsUp(
  tree: Phylocanvas,
  nodeID: string,
  noLevels = 6,
  minLeafToRootLength = 5
): void {
  let node: TreeNode | undefined;
  let upLength = 0;
  if (nodeID !== null) {
    node = tree.findNodeById(nodeID);
    if (node !== undefined) {
      upLength += node.branchLength;

      const noLevelsUp = noLevels >= 1 ? noLevels : 1;
      for (let i = 0; i < noLevelsUp; i++) {
        if ('parent' in node) {
          upLength += node.parent.branchLength;
          node = node.parent;
        } else break;
      }
      while (upLength < minLeafToRootLength && 'parent' in node) {
        upLength += node.parent.branchLength;
        node = node.parent;
      }
    }
  }
  if (node) tree.setRoot(node.id);
}

export function useGetLatest<T>(obj: T): () => T {
  const ref = useRef<T>();
  ref.current = obj;
  return useCallback(() => ref.current as T, []);
}

export const EmptyArray = [];

export function getNodeLeafOffspringsIDs(node: TreeNode): string[] {
  if (node.isLeaf) return [node.id];
  const leafIDs = node.children.reduce((acc, child) => {
    const ids = getNodeLeafOffspringsIDs(child);
    return [...acc, ...ids];
  }, []);
  return leafIDs;
}
