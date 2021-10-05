import { useEffect } from 'react';

import { Phylocanvas } from '../types/phylocanvas.gl';

export function useAutoResize(getTree: () => Phylocanvas | null) {
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
