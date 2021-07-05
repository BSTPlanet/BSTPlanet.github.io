import { NodeBST } from './NodeBST.js';

export class Tree {

    constructor(scene) {

        this.root = null;
        // Global tree dpth is stored here
        this.treedepth = null;
        // Used for intializing overlap of node with node, to be able to redraw the tree only when it expands
        this.nodearray = [];
        // A constant w used for calculating distances between nodes
        this.w = 80;
        // A constant z that specifies the distance between nodes on y axis
        this.z = 150;

        this.isRB = false;

        this.nodetoreturn = null;
        
        this.scene = scene;

        scene.add.existing(this);
    }

    createRoot(scene) {
        // this.root = new NodeBST(scene,10_000,400,'null',0,null);
        if (this.isRB) {
            this.root = new NodeBST(scene,10_000,400,'null',0,null,true);
            this.nodearray.push(this.root);
            this.root.isRed = false;
        } else {
            this.root = new NodeBST(scene,10_000,400,'null',0,null);

        }
        this.treedepth = 0;
    }

    createTree(numsToInsert,scene) {
        numsToInsert.forEach(key => {
            this.insertAutomatic(this.root, key, scene);
        });
        this.redraw(scene);
    }

    // createTreeRB(numsToInsert,scene) {
    //     numsToInsert.forEach(key => {
    //         this.insertAutomatic(this.root, key, scene);
    //     });
    //     this.redraw(scene);
    // }

    calculateHeight() {
        this.calculateHeightH(this.root);
    }
    // calculates the the dpth of the tree
    // here we give the root node as a parameter
    // helper
    calculateHeightH(node) {
        if (node.key === "null") return 0
        else {
            var left = this.calculateHeightH(node.left);
            var right =  this.calculateHeightH(node.right);
            this.treedpth = Math.max(left, right) + 1;
        }  
    }

    updateNodeDepths(node){
        this.updateNodeDepthsH(node,this.root.key);
    }

    updateNodeDepthsH(node,rootKey) {
        if (node != null) {

            if (node.key != rootKey){
                if (node.parent == null) {
                    node.dpth = 0;
                } else {
                    node.dpth = node.parent.dpth+1;
                }
            }
            
            this.updateNodeDepthsH(node.left,rootKey);
            this.updateNodeDepthsH(node.right,rootKey);
        }
    }

    // Insertion - automatic - new redraw
    insertAutomatic(node,key,scene) {

        if (node.key == 'null') {

            node.setKey(key);
            node.setNodeGraphics();

            // // create left child
            // var childL = new NodeBST(scene, node.posX-this.w, node.posY+this.z, 'null',node.dpth+1,node);
            // childL.distanceFromParent = -this.w;
            
            // // create right child
            // var childR = new NodeBST(scene, node.posX+this.w, node.posY+this.z, 'null',node.dpth+1,node);
            // childR.distanceFromParent = this.w;

            // node.setChildren(childL,childR);

            if (this.isRB) {

                node.isRed = true;
                node.changeLinkColour(scene);

                // create left child
                var childL = new NodeBST(scene, node.posX-this.w, node.posY+this.z, 'null',node.dpth+1,node,true);
                childL.distanceFromParent = -this.w;
                
                // create right child
                var childR = new NodeBST(scene, node.posX+this.w, node.posY+this.z, 'null',node.dpth+1,node,true);
                childR.distanceFromParent = this.w;

                node.setChildren(childL,childR);

                this.nodearray.push(childL);
                this.nodearray.push(childR);

                // update depth of the tree
                if (childL.dpth > this.treedpth) {
                    this.treedpth = childL.dpth;
                }

            } else {

                // create left child
                var childL = new NodeBST(scene, node.posX-this.w, node.posY+this.z, 'null',node.dpth+1,node);
                childL.distanceFromParent = -this.w;
                
                // create right child
                var childR = new NodeBST(scene, node.posX+this.w, node.posY+this.z, 'null',node.dpth+1,node);
                childR.distanceFromParent = this.w;

                node.setChildren(childL,childR);

                this.checkCollisions(childL);
    
                this.checkCollisions(childR);
       
                // update depth of the tree
                if (childL.dpth > this.treedpth) {
                    this.treedpth = childL.dpth;
                }
    
                // this.traverseAndCheckCollisions(scene);
                this.traverseAndCheckCrossings(scene);
                this.traverseAndCheckCollisions(scene);
            }

        } else if (node.key > key) {
            if (node.left != null) { //  we might not need this if statement check cause we dont have a node.left that is null
                this.insertAutomatic(node.left, key, scene);
            }
        } else if (node.key < key) {
            if (node.right != null) {
                this.insertAutomatic(node.right, key, scene);
            }
        }
    }

    // ***************REDRAW TREE CODE***************

    traverseAndCheckCollisions(scene) {
        this.traverseAndCheckCollisionsH(this.root,scene);
    }

    traverseAndCheckCollisionsH(node,scene) {
        if (node != null) {
            this.checkCollisions(node);
  
            this.traverseAndCheckCollisionsH(node.left,scene);
            this.traverseAndCheckCollisionsH(node.right,scene);
        }
    }

    // new redraw
    checkCollisions(node){
        if (node.dpth != 0){
            this.traverseBSTAndFindNeighbor(this.root, node.dpth, node.posX, node.parent);
            var neighborNode = this.nodetoreturn;
            this.nodetoreturn = null;
            if(neighborNode != null){
                var lowestCommonAncestor = this.traverseBSTAndFindLowestCommonAncestor(this.root, node, neighborNode);
                var distanceToAdd = (2*this.w) - Math.abs((node.posX)-(neighborNode.posX));
                if (node.parent.key>lowestCommonAncestor.key){
                    lowestCommonAncestor.left.distanceFromParent = lowestCommonAncestor.left.distanceFromParent - distanceToAdd;
                } else {
                    lowestCommonAncestor.right.distanceFromParent = lowestCommonAncestor.right.distanceFromParent + distanceToAdd;
                }
                this.updatePosH(lowestCommonAncestor);
            }
        }
    }

    traverseBSTAndFindNeighbor(node, depth, x, parent) {
        if (node != null) {
            if(node.dpth == depth && Math.abs((node.posX)-(x))<(2*this.w) && node.parent != parent){
                this.nodetoreturn = node;
            }
            this.traverseBSTAndFindNeighbor(node.left, depth, x, parent);
            this.traverseBSTAndFindNeighbor(node.right, depth, x, parent);
        } 
    }

    traverseBSTAndFindLowestCommonAncestor(node, inserted, neighbor) {
        if (node.key > inserted.parent.key && node.key > neighbor.parent.key){
            return this.traverseBSTAndFindLowestCommonAncestor(node.left, inserted, neighbor);
        } else if (node.key < inserted.parent.key && node.key < neighbor.parent.key){
            return this.traverseBSTAndFindLowestCommonAncestor(node.right, inserted, neighbor);
        } else {
            return node;
        }
    }

    // old redraw
    updateDistances(node,xToCheck) {
        if(node.parent != null) {
            if ((node.parent.left.key == 'null' && node.parent.right.key != null && node.parent.right.key != 'null') || (node.parent.right.key == 'null' && node.parent.left.key != null && node.parent.left.key != 'null')) {
                node.parent.left.distanceFromParent = node.left.distanceFromParent;
                node.parent.right.distanceFromParent = node.right.distanceFromParent;
            } else if (node.parent.left.key != 'null' && node.parent.right.key != 'null' && node.parent.left.key != null && node.parent.right.key != null) {
                if ((Math.max(node.parent.right.distanceFromParent*2, Math.abs(node.parent.left.distanceFromParent*2)) <= node.right.distanceFromParent*2) || (node.parent.posX == xToCheck) ) {
                    node.parent.left.distanceFromParent = node.parent.left.distanceFromParent*2;
                    node.parent.right.distanceFromParent = node.parent.right.distanceFromParent*2;
                }
            }
            this.updateDistances(node.parent,xToCheck);        
        }
    }

    redraw(scene) {
        this.redrawH(this.root,scene);
    }

    redrawH(node, scene) {
        if (node != null) {

            var q = node.distanceFromParent;

            if (this.isRB && node.dpth == 0) {
                node.changePosition(scene, 10_000, 400);
            }
            
            if (node.dpth > 0) {
                node.changePosition(scene, node.parent.posX+q, node.parent.posY+this.z);
            }

            this.redrawH(node.left,scene);
            this.redrawH(node.right,scene);
        }
    }

    traverseAndCheckCrossings(scene) {
        this.traverseAndCheckCrossingsH(this.root,scene);
    }

    traverseAndCheckCrossingsH(node,scene) {
        if (node != null) {
            this.checkCrossings(node);
            
            this.traverseAndCheckCrossingsH(node.left,scene);
            this.traverseAndCheckCrossingsH(node.right,scene);
        }
    }

    checkCrossings(node){  
        if (node.dpth != 0){
            this.traverseBSTAndFindCrossings(this.root, node.dpth, node.posX, node.parent);
            var crossedNode = this.nodetoreturn;
            this.nodetoreturn = null;
            if(crossedNode != null){
                var lowestCommonAncestor = this.traverseBSTAndFindLowestCommonAncestor(this.root, node, crossedNode);
                if (crossedNode==crossedNode.parent.left){
                    var distanceToAdd = (2*this.w) + (node.parent.right.posX - crossedNode.parent.left.posX);
                    lowestCommonAncestor.left.distanceFromParent = lowestCommonAncestor.left.distanceFromParent - distanceToAdd;
                } else {
                    var distanceToAdd = (2*this.w) + (crossedNode.parent.right.posX - node.parent.left.posX);
                    lowestCommonAncestor.right.distanceFromParent = lowestCommonAncestor.right.distanceFromParent + distanceToAdd;
                }
                this.updatePosH(lowestCommonAncestor);
                // this.updateNodePosX();
            }
        }
    }

    traverseBSTAndFindCrossings(node, depth, x, parent) {
        if (node != null) {
            if(node.dpth == depth && node.parent != parent && node.parent.left.posX < x && node.parent.right.posX > x){
                this.nodetoreturn = node;
            }
            this.traverseBSTAndFindCrossings(node.left, depth, x, parent);
            this.traverseBSTAndFindCrossings(node.right, depth, x, parent);
        } 
    }

    updateNodePosX() {
        this.updatePosH(this.root);
    }

    updatePosH(node) {
        if (node != null) {
            if (node.parent != null) {
                node.posX = node.parent.posX + node.distanceFromParent;
            }
            this.updatePosH(node.left);
            this.updatePosH(node.right);
        }
    }

    // ***************CODE TO HIDE THE CURTAIN***************

    closeCurtains() {
        this.closeCurtainsH(this.root);
    }

    // helper
    closeCurtainsH(node) {
        if (node != null && node.key != 'null' && node.curtain.visible == false) {
            node.curtain.setVisible(true);
            this.closeCurtainsH(node.left);
            this.closeCurtainsH(node.right);
        }
    }

    // ***************DESTROY***************

    destroyTree(){
        this.destroyTreeH(this.root);
        this.nodearray = null;
        // this removed the reference to nodes so they didn't stay in the memory
        this.root = null;
    }

    // helper
    destroyTreeH(node) {
        if (node != null) {
            this.destroyTreeH(node.left);
            this.destroyTreeH(node.right);
            node.destroyNode();
        }
    }

}