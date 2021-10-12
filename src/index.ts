import { PhylogenyTree } from './components/treeWithMenu';
import { PhylogenyTreeWithoutMenu } from './components/treeWithoutMenu';
import { usePhylogenyTree } from './hooks/usePhylogenyTree';
import { usePhylogenyTreeWithMenu } from './hooks/useTreeWithMenu';

export default PhylogenyTree;
export { usePhylogenyTree, usePhylogenyTreeWithMenu, PhylogenyTreeWithoutMenu };
