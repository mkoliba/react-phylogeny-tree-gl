import { useCallback, useRef } from 'react';

import { Phylocanvas, TreeNode, LeafNode, InnerNode, RootNode } from './types/phylogeny-tree';

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

export function getNodeLeafOffspringsIDs(node: LeafNode): string;
export function getNodeLeafOffspringsIDs(node: InnerNode | RootNode): string[]
export function getNodeLeafOffspringsIDs(node): string |string[] {
  if ('children' in node) {
    const leafIDs = node.children.reduce((acc, child) => {
      const ids = getNodeLeafOffspringsIDs(child);
      if (Array.isArray(ids)) return [...acc, ...ids];
      return [...acc, ids];
    }, []);
    return leafIDs;
  }
  return node.id;
}
