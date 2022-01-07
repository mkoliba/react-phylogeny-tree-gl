import { useEffect } from 'react';

import { PhylocanvasProps } from '../types/phylocanvas.gl';
import { GetTree } from '../types/react-phylogeny-tree';

export function useAutoResize<P extends PhylocanvasProps, M>(getTree: GetTree<P, M>) {
  useEffect(() => {
    // console.log('useAutoResize2', getTree());
    function updateWidthAndHeight() {
      const tree = getTree();
      // console.log('useAutoResize3', tree);
      if (tree) {
        const width = tree.view.parentElement?.clientWidth;
        const height = tree.view.parentElement?.clientHeight;
        if (width && height) {
          tree.resize(width, height);
        }
      }
    }
    window.addEventListener('resize', updateWidthAndHeight);

    return function cleanUpAutoResize() {
      window.removeEventListener('resize', updateWidthAndHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTree]);
}
