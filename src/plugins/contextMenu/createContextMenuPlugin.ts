import { Phylocanvas, Decorate, HandleClickArgs } from '../../types/phylocanvas.gl';

export function createContextMenuPlugin(setMenuProps) {
  return function contextMenuPlugin(tree: Phylocanvas, decorate: Decorate) {
    decorate('handleClick', (delegate, args: HandleClickArgs) => {
      const [info, event] = args;
      if (event.rightButton) {
        event.preventDefault();
        const node = tree.pickNodeFromLayer(info);
        setMenuProps({
          visible: true,
          possition: {
            x: event.center.x,
            y: event.center.y,
          },
          node: node,
        });
      } else delegate(...args);
    });
  };
}
