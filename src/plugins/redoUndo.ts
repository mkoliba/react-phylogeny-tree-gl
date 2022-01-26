import { Defaults } from '@phylocanvas/phylocanvas.gl';

import {
  Phylocanvas,
  Decorate,
  PhylocanvasProps,
  
  Source,
} from '../types/phylocanvas.gl';
import {
  UndoRedoProps,
  UndoRedoMethods,
  RedoUndoState,
  RedoUndoHookedMethodsNames,
  MethodArgs,
  StateValue,
} from '../types/react-phylogeny-tree';

type TrackedProps = (keyof PhylocanvasProps)[];

const defaultTrackedProps: TrackedProps = [];

export function createRedoUndoPlugin(trackedProps = defaultTrackedProps) {
  return function undoRedoPlugin(
    tree: Phylocanvas<UndoRedoProps, UndoRedoMethods>,
    decorate: Decorate<UndoRedoProps, UndoRedoMethods>
  ) {
    decorate('init', (delegate, args) => {
      delegate(...args);
      initUndoRedo(tree);
    });

    decorate('setProps', (delegate, args) => {
      const [updater, eventOrigin] = args;

      if (eventOrigin === undefined || eventOrigin !== 'undoRedo') {
        const updaterKeys = new Set(Object.keys(updater));
        if (trackedProps.some((key) => updaterKeys.has(key))) {
          addUndo(tree, 'setProps', args, delegate);
          return;
        }
      }
      
      delegate(...args);
    });

    decorate('setRoot', (delegate, args) => {
      const [nodeOrId, props, isUndoRedo] = args;
      

      if (isUndoRedo) {
        delegate(nodeOrId, props);
        return;
      }
      addUndo(tree, 'setRoot', args, delegate);
    });
    decorate('setSource', (delegate, args) => {
      const [data, original, isUndoRedo] = args;
      
      if (isUndoRedo) {
        delegate(data, original);

        return;
      }
      addUndo(tree, 'setSource', args, delegate);
    });
    // decorate('', (delegate, args) => {
    //   delegate(...args);
    // });
  };
}

function initUndoRedo(tree: Phylocanvas<UndoRedoProps, UndoRedoMethods>) {
  tree.canUndo = canUndo.bind(null, tree);
  tree.canRedo = canRedo.bind(null, tree);
  tree.undo = undo.bind(null, tree);
  tree.redo = redo.bind(null, tree);
  // tree.setSource = setSource.bind(tree);

  tree.setProps({ history: initialState }, 'undoRedo');
}

const initialState: RedoUndoState = {
  past: [],
  future: [],
};

const addUndo = <M extends RedoUndoHookedMethodsNames>(
  tree: Phylocanvas<UndoRedoProps, UndoRedoMethods>,
  method: M,
  args: MethodArgs<M>,
  delegate: (...args: MethodArgs<M>) => unknown
) => {
  const past = tree.props.history.past;
  const newVal: StateValue<M> = { method, args };
  const current = getPresent(tree.props, newVal);
  const newHistory: RedoUndoState = {
    future: [],
    past: [...past, current],
  };
  save(tree, newVal, newHistory, delegate);
};

type UndoRedoBoolMethod<
  P extends UndoRedoProps = UndoRedoProps,
  M extends UndoRedoMethods = UndoRedoMethods
> = (tree: Phylocanvas<P, M>) => boolean;

const canUndo: UndoRedoBoolMethod = (tree) => {
  return tree.props.history.past.length > 0;
};

const canRedo: UndoRedoBoolMethod = (tree) => {
  return tree.props.history.future.length > 0;
};

type UndoRedoMethod<
  P extends UndoRedoProps = UndoRedoProps,
  M extends UndoRedoMethods = UndoRedoMethods
> = (tree: Phylocanvas<P, M>) => void;

const undo: UndoRedoMethod = (tree) => {
  if (!tree.canUndo) return;
  const { past, future } = tree.props.history;
  const previous = past[past.length - 1];
  const present = getPresent(tree.props, previous);
  const newHistory = {
    past: past.slice(0, past.length - 1),
    future: [present, ...future],
  };
  save(tree, previous, newHistory);
};

const redo: UndoRedoMethod = (tree) => {
  if (!tree.canRedo) return;
  const { past, future } = tree.props.history;
  const next = future[0];
  const present = getPresent(tree.props, next);
  const newHistory = {
    past: [...past, present],
    future: future.slice(1),
  };

  save(tree, next, newHistory);
};

const save = <
  MN extends RedoUndoHookedMethodsNames,
  P extends UndoRedoProps = UndoRedoProps,
  M extends UndoRedoMethods = UndoRedoMethods
>(
  tree: Phylocanvas<P, M>,
  newVal: StateValue<MN>,
  newHistory: RedoUndoState,
  method?: (...args: MethodArgs<MN>) => unknown
) => {
  callFn(newVal, newHistory, method ?? tree[newVal.method]);
  if (isMethodVal('setSource', newVal)) {
    if (newVal.props !== undefined)
      tree.setProps({ ...(newVal.props as Partial<P>), history: newHistory }, 'undoRedo');
    else setPropsWithourRender(tree, { history: newHistory });
  }
};

const callFn = <U extends (...args: MethodArgs<RedoUndoHookedMethodsNames>) => unknown>(
  newVal: StateValue,
  newHistory: RedoUndoState,
  method: U
) => {
  const args = getArguments(newVal, newHistory);
  method(...args);
};

function setPropsWithourRender<
  P extends UndoRedoProps = UndoRedoProps,
  M extends UndoRedoMethods = UndoRedoMethods
>(tree: Phylocanvas<P, M>, updater: Record<string, unknown>) {

  if (updater) {
    const newProps = Object.freeze({
      ...(tree.props as P),
      ...updater,
    });
    tree.props = newProps;
  }
}

function getArguments(
  newVal: StateValue,
  history: RedoUndoState
): MethodArgs<RedoUndoHookedMethodsNames> {
  if (isMethodVal('setProps', newVal)) {
    const [updater] = newVal.args;
    const args: MethodArgs<'setProps'> = [{ ...updater, history }, 'undoRedo'];
    return args;
  } else if (isMethodVal('setRoot', newVal)) {
    const [nodeOrId, props] = newVal.args;
    const args: MethodArgs<'setRoot'> = [nodeOrId, { ...props, history }, true];
    return args;
  } else if (isMethodVal('setSource', newVal)) {
    const [data, original] = newVal.args;
    const args: MethodArgs<'setSource'> = [data, original, true];
    return args;
  }
  throw Error(`getArguments received arg present.method with unsoported value: ${newVal.method}`);
}

// function getTrackedProps<>(tree: Phylocanvas, propNames: T[]): {} {
//   return propNames.reduce((acc, propName) => {
//     return (acc[propName] = tree.props[propName]);
//   }, {});
// }

// function reducer(props: UndoRedoProps & PhylocanvasProps, type: 'undo' | 'redo') {
//   const { past, future } = props.history;
//   switch (type) {
//     case 'undo': {
//       const previous = past[past.length - 1];
//       const present = getPresent(props, previous);
//       const history = {
//         past: past.slice(0, past.length - 1),
//         future: [present, ...future],
//       };

//       const args =
//       return [
//         present?.method,
//         [...present.args]
//       ]
//       return {
//         ...previous,
//         history,
//       };
//     }
//     case 'redo': {
//       const next = future[0];
//       const present = getPresent(props, next);
//       const history = {
//         past: [...past, present],
//         future: future.slice(1),
//       };
//       return {
//         ...next,
//         history,
//       };
//     }
//   }
// }

// type MethodArgs<M extends RedoUndoHookedMethodsNames> = Parameters<
//   PhylocanvasMethods<UndoRedoProps & PhylocanvasProps>[M]
// >;

// type StateValue<
//   M extends RedoUndoHookedMethodsNames = RedoUndoHookedMethodsNames,
//   MP extends M = M
// > = {
//   method: M;
//   args: MethodArgs<MP>;
// };

function isMethodVal<M extends RedoUndoHookedMethodsNames>(
  methodName: M,
  value: StateValue<RedoUndoHookedMethodsNames>
): value is StateValue<M> {
  if (value.method === methodName) return true;
  return false;
}

function getPresent(props: UndoRedoProps & PhylocanvasProps, newVal: StateValue): StateValue {
  if (isMethodVal('setProps', newVal)) {
    return {
      method: newVal.method,
      args: getSetPropsPresent(props, newVal.args),
    };
  } else if (isMethodVal('setRoot', newVal)) {
    return {
      method: newVal.method,
      args: getSetRootPresent(props, newVal.args),
    };
  } else if (isMethodVal('setSource', newVal)) {
    const [historyProps, ...args] = getSetSourcePresent(props, newVal.args);
    return {
      method: newVal.method,
      args,
      props: historyProps,
    };
  }
  throw Error(`getPresent received argument 'value' with unsuported method: ${newVal.method}`);
}

function getSetPropsPresent(
  props: UndoRedoProps & PhylocanvasProps,
  [updater, eventOrigin]: MethodArgs<'setProps'>
): MethodArgs<'setProps'> {
  const present = pick(props, Object.keys(updater));
  return [present, eventOrigin];
}

function getSetRootPresent(
  props: UndoRedoProps & PhylocanvasProps,
  [, argsProps]: MethodArgs<'setRoot'>
): MethodArgs<'setRoot'> {
  const presentProps = argsProps !== undefined ? pick(props, Object.keys(argsProps)) : undefined;
  const node = props.rootId ?? undefined;
  return [node, presentProps];
}

// const setSourceProps = ['rootId', 'collapsedIds', 'rotatedIds'] as const;
// type SetSourceProps = 'rootId'| 'collapsedIds'| 'rotatedIds'
function getSetSourcePresent(
  props: UndoRedoProps & PhylocanvasProps,
  _args: MethodArgs<'setSource'>
): [Record<string, unknown>, ...MethodArgs<'setSource'>] {
  let presentOriginal: Source | undefined;
  if (typeof props.source !== 'string') {
    presentOriginal = props.source.original;
  }
  const historyProps = pick(props, ['rootId', 'collapsedIds', 'rotatedIds']);
  return [historyProps, props.source, presentOriginal];
}

function pick(obj: Record<string, unknown>, propNames: string[]): Record<string, unknown> {
  return propNames.reduce((acc, propName) => {
    if (propName in obj) {
      acc[propName] = obj[propName];
    } else if (propName in Defaults) {
      acc[propName] = Defaults[propName];
    }
    return acc;
  }, {} as Record<string, unknown>);
}

// type SetPropsArgs = readonly [
//   updater: Partial<Record<string, unknown>>,
//   eventOrigin: string | undefined
// ];
// type SetRootArgs = readonly [
//   nodeOrId: string | TreeNode | undefined,
//   props?: Partial<Record<string, unknown>> | undefined
// ];
// type SetSourceArgs = readonly [
//   data: Source,
//   original: Source | undefined,
//   props: Record<string, unknown> | undefined
// ];
