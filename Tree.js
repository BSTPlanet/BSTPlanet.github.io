import { NodeBST } from './NodeBST.js';

export class Tree {

    constructor(color,scene) {

        this.root = null;
        // Global tree dpth is stored here
        this.treedpth = null;
        // Used for intializing overlap of node with node, to be able to redraw the tree only when it expands
        this.nodearray = [];
        // A constant w used for calculating distances between nodes
        this.w = 80;
        // A constant z that specifies the distance between nodes on y axis
        this.z = 150;

        this.isRB = false;

        this.nodetoreturn = null;

        this.nodeColor = color;
        this.scene = scene;
        this.everythingIsCorrect = true;
        this.varToReturn = true;

        scene.add.existing(this);
    }

    createRoot(scene) {
        if (this.isRB) {
            this.root = new NodeBST(scene,this.nodeColor,10_000,200,'null',0, null,true);
            this.nodearray.push(this.root);
            this.root.isRed = false;
        } else {
            this.root = new NodeBST(scene,this.nodeColor,10_000,200,'null',0,null,false);
        }
        this.treedepth = 0;
    }

    createTree(numsToInsert,scene) {
        numsToInsert.forEach(key => {
            this.insertAutomatic(this.root, key, scene);
        });
        this.redraw(scene);
    }


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

    // updateNodeDepths(node){
    //     this.updateNodeDepthsH(node,this.root.key);  // this was wrong (node.key != rooKey)
    // }

    updateNodeDepths(node) {
        if (node != null) {

            // this was wrong (node.key != rooKey
            if (node.parent == null) {
                node.dpth = 0;
            } else {
                node.dpth = node.parent.dpth+1;
            }
            
            this.updateNodeDepths(node.left);
            this.updateNodeDepths(node.right);
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

                if (node != this.root) {
                    node.isRed = true;
                }
                node.changeLinkColour(scene);

                // create left child
                var childL = new NodeBST(scene, this.nodeColor, node.posX-this.w, node.posY+this.z, 'null',node.dpth+1,node,true);
                childL.distanceFromParent = -this.w;
                
                // create right child
                var childR = new NodeBST(scene, this.nodeColor, node.posX+this.w, node.posY+this.z, 'null',node.dpth+1,node,true);
                childR.distanceFromParent = this.w;

                node.setChildren(childL,childR);

                this.nodearray.push(childL);
                this.nodearray.push(childR);

                // update depth of the tree
                if (childL.dpth > this.treedpth) {
                    this.treedpth = childL.dpth;
                }

                this.checkRBLinksInserted(scene,node);
                this.check(scene);

            } else {

                // create left child
                var childL = new NodeBST(scene, this.nodeColor, node.posX-this.w, node.posY+this.z, 'null',node.dpth+1,node,false);
                childL.distanceFromParent = -this.w;
                
                // create right child
                var childR = new NodeBST(scene, this.nodeColor, node.posX+this.w, node.posY+this.z, 'null',node.dpth+1,node,false);
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

    // used for inserting the elements into the RB tree one by one withou checks
    insertManual(node, key, scene) {
        if (node.key == 'null') {
            node.setKey(key);
            node.setNodeGraphics();

            if(this.isRB) {
                node.isRed = true;
                
                if(node == this.root) {
                    node.isRed = false;
                }
                
                node.changeLinkColour(scene);
                
                // create left child
                var childL = new NodeBST(scene, this.nodeColor, node.posX-this.w, node.posY+this.z, 'null',node.dpth+1,node,true);
                childL.distanceFromParent = -this.w;
                childL.drawLinkToParentRB(scene)
                this.nodearray.push(childL);

                
                // create right child
                var childR = new NodeBST(scene, this.nodeColor, node.posX+this.w, node.posY+this.z, 'null',node.dpth+1,node,true);
                childR.distanceFromParent = this.w;
                childR.drawLinkToParentRB(scene)
                this.nodearray.push(childR);


                node.setChildren(childL,childR);
                
                // update depth of the tree
                if (childL.dpth > this.treedpth) {
                    this.treedpth = childL.dpth;
                    // this.redraw(scene)
                }
            } else {

                 // create left child
                 var childL = new NodeBST(scene, this.nodeColor, node.posX-this.w, node.posY+this.z, 'null',node.dpth+1,node,false);
                 childL.distanceFromParent = -this.w;
                 childL.drawLinkToParent(scene)

                 
                 // create right child
                 var childR = new NodeBST(scene, this.nodeColor, node.posX+this.w, node.posY+this.z, 'null',node.dpth+1,node,false);
                 childR.distanceFromParent = this.w;
                 childR.drawLinkToParent(scene)

 
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
            if (node.left != null) { 
                this.insertManual(node.left, key, scene);
            }
        } else if (node.key < key) {
            if (node.right != null) {
                this.insertManual(node.right, key, scene);
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
    checkCollisions(node) {
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

            // this.isRB &&
            if (node.dpth == 0) {
                node.changePosition(scene, 10_000, 200);
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

    checkCrossings(node) {  
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

    // ************ TWEENED REDRAW ***************

    redrawTweened(scene) {
        this.redrawTweenedH(this.root,scene);

    }

    redrawTweenedH(node, scene) {
        if (node != null) {

            var q = node.distanceFromParent;

            // this.isRB && 
            if (node.dpth == 0) {
                node.changePositionTweened(scene, 10_000, 200);
            }
            
            if (node.dpth > 0) {
                node.changePositionTweened(scene, node.parent.posX+q, node.parent.posY+this.z);
            }

            this.redrawTweenedH(node.left,scene);
            this.redrawTweenedH(node.right,scene);
        }
    }

    // ************ REDRAW WITHOUT MOVING GRAPHICS ***************

    updatePos(node) {
        if (node != null) {

            var q = node.distanceFromParent;

            // this.isRB && 
            if (node.dpth == 0) {
                node.changePositionNoMove(10_000, 200);
            }
            
            if (node.dpth > 0) {
                node.changePositionNoMove(node.parent.posX+q, node.parent.posY+this.z);
            }

            this.updatePos(node.left);
            this.updatePos(node.right);
        }
    }

    updateBodies(node) {
        if(node != null) {
            node.updatePhysicsBodies();
            this.updateBodies(node.left);
            this.updateBodies(node.right);
        }
    }

    updateRectanglePos(node) {
        if(node != null) {
            node.changeRecPosition(node.posX, node.posY) 
            this.updateRectanglePos(node.left)
            this.updateRectanglePos(node.right)
        }
    }
    
    // ***************CODE TO MAKE THE CURTAIN VISIBLE***************

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

    // ***************CODE TO MAKE THE CURTAIN INVISIBLE***************

    openCurtains() {
        this.openCurtainsH(this.root);
    }

    // helper
    openCurtainsH(node) {
        if (node != null && node.key != 'null' && node.curtain.visible == true) {
            node.curtain.setVisible(false);
            this.openCurtainsH(node.left);
            this.openCurtainsH(node.right);
        }
    }



    // *************** CODE TO MAKE THE KEYS A DIFFERENT COLOR***************

    changeNodeColor(node,scene, color) {
        if (node != null) {
            node.keyString.setFill(color)
            this.changeNodeColor(node.left,scene, color);
            this.changeNodeColor(node.right,scene, color);
        }
    }

    // *************** CODE TO HIGHLIGHT THE LINKS IN A DIFFERENT COLOR ***************

    highlightLinkColor(node,scene, color) {
        if (node != null) {
            node.highlightLinks(node, scene, color)
            this.highlightLinkColor(node.left,scene, color);
            this.highlightLinkColor(node.right,scene, color);
        }
    }

    highlightChildrenLinks(scene) {
        this.highlightChildrenLinksH(this.root,scene);
    }
    
    highlightChildrenLinksH(node,scene) {
        if (node != null) {
            if (node.left != null && node.right != null) {
                console.log('we are here')
                scene.tweens.add({
                    targets: node.left.link,
                    duration: 1000,
                    // scaleX: 3.25,
                    // scaleY: 3.5,
                    // yoyo: true,
                    // repeat: -1,
                    ease: 'Sine.easeOut',
                    alpha: '-=1'
                });
            }
            this.highlightChildrenLinksH(node.left,scene);
            this.highlightChildrenLinksH(node.right,scene);
        }
    }
    
    // ***************RB BST CODE****************************
    
    check (scene) { // pass root 
        var perfect = false;
        while (perfect == false) {
            
            this.checkRBTreeLinks(scene,this.root);
            // console.log(everythingIsCorrect);
            if(this.everythingIsCorrect){
                perfect = true;
            }
            this.everythingIsCorrect = true;
        }
    }

    checkRBTreeLinks(scene,node) { // pass root
        if (node != null) {
            // console.log('result ' + this.checkRBLinksInserted(node));
            // console.log('node the checkRBLinksInserted was called on ' + node.key);
            this.everythingIsCorrect = this.checkRBRoot(scene,node) && this.everythingIsCorrect;
            // console.log('checked ' + node.key);
            // console.log('next checks ' + node.left.key + ' and ' + node.right.key)
            // console.log("doing recursion");
            this.checkRBTreeLinks(scene,node.left);
            this.checkRBTreeLinks(scene,node.right);
        }
    }

    checkRBLinksInserted(scene, node) { // checkRBLinksInserted(insertedNode.parent)
        // if insertedNode isRed && insertedNode.parent.left isRed then flipColors(insertedNode.parent)
        // if insertedNode isRed && insertedNode.parent.left !isRed then rotateLeft(insertedNode.parent)
        // if insertedNode isRed && insertedNode.parent isRed then rotateRight(???)
        // update depths

        var nodeWasFine = true;
        // console.log("we are checking the node but do not go to the if statement!!!");
        if (node != null && node.key != 'null' && node.parent != null){
            // console.log('the key ' + node.key);
            // if (!node.left.isRed && node.right.isRed)    { nodeWasFine = false; this.rotateLeft(node); this.updateNodeDepths(this.root); console.log('rotating left') };
            // if (node.left.isRed && node.left.left.isRed) { nodeWasFine = false; this.rotateRight(node); this.updateNodeDepths(this.root); console.log('rotating right')};
            // if (node.left.isRed && node.right.isRed)     { nodeWasFine = false; this.flipColors(scene, node); this.updateNodeDepths(this.root); console.log('fliping colors')};
            if (!node.parent.left.isRed && node.isRed) { 
                nodeWasFine = false; this.rotateLeft(node.parent); this.updateNodeDepths(this.root); console.log('rotating left'); 
            } else if (node.isRed && node.parent.isRed) { 
                nodeWasFine = false; this.rotateRight(node.parent.parent); this.updateNodeDepths(this.root); console.log('rotating right');
            } else if (node.parent.left.isRed && node.parent.right.isRed) { 
                nodeWasFine = false; this.flipColors(scene, node.parent); this.updateNodeDepths(this.root); console.log('fliping colors');
            }
        } 
        return nodeWasFine;
    }

    checkRBRoot(scene, node) { // checkRBLinksInserted(insertedNode.parent)
        // if insertedNode isRed && insertedNode.parent.left isRed then flipColors(insertedNode.parent)
        // if insertedNode isRed && insertedNode.parent.left !isRed then rotateLeft(insertedNode.parent)
        // if insertedNode isRed && insertedNode.parent isRed then rotateRight(???)
        // update depths
        var nodeWasFine = true;
        // console.log("we are checking the node but do not go to the if statement!!!");
        if (node != null && node.key != 'null'){
            // console.log('the key in checkRBRoot ' + node.key);
            if (!node.left.isRed && node.right.isRed)    { nodeWasFine = false; this.rotateLeft(node); this.updateNodeDepths(this.root); console.log('rotating left') };
            if (node.left.isRed && node.left.left.isRed) { nodeWasFine = false; this.rotateRight(node); this.updateNodeDepths(this.root); console.log('rotating right')};
            if (node.left.isRed && node.right.isRed)     { nodeWasFine = false; this.flipColors(scene, node); this.updateNodeDepths(this.root); console.log('fliping colors')};
            // if (!node.parent.left.isRed && node.isRed) { 
            //     nodeWasFine = false; this.rotateLeft(node.parent); this.updateNodeDepths(this.root); console.log('rotating left'); 
            // } else if (node.isRed && node.parent.isRed) { 
            //     nodeWasFine = false; this.rotateRight(node.parent.parent); this.updateNodeDepths(this.root); console.log('rotating right');
            // } else if (node.parent.left.isRed && node.isRed) { 
            //     nodeWasFine = false; this.flipColors(scene, node); this.updateNodeDepths(this.root); console.log('fliping colors');
            // }
        } 

        return nodeWasFine;
    }

    checkCorrectnessRBNode(node) { // checkRBNode(insertedNode.parent)
        var nodeWasFine = true;
        if (node != null && node.key != 'null'){
            if (!node.left.isRed && node.right.isRed)    { nodeWasFine = false};
            if (node.left.isRed && node.left.left.isRed) { nodeWasFine = false};
            if (node.left.isRed && node.right.isRed)     { nodeWasFine = false};
        } 

        return nodeWasFine;
    }


    // always start from the root
    checkCorrectnessRBTree (node) {
        if(node != null && node.key != 'null') {
            if(this.checkCorrectnessRBNode(node)) { 
                this.varToReturn = true && this.varToReturn;
                // console.log("In the true statement " + this.varToReturn)
                this.checkCorrectnessRBTree(node.left)
                this.checkCorrectnessRBTree(node.right)
            } else {
                this.varToReturn = false;
            }
        }
        return this.varToReturn;
    }

    setvarToReturnToDefault () {
        this.varToReturn = true;
    }

    updateLinksRight(node) {
        // node = 44
        // parentless node, belonged to 44 
        var oldR = node.right; // null
        var newNode = node.parent; // 66

        if (node.parent.parent == null) {
            node.parent = null;
            this.root = node;
            // theoretically and practically we don't need to set the dpth, because updateNodeDepths does it for us
            this.root.dpth = 0;
            node.isRed = false;
            newNode.isRed = true;
            //node.distanceFromParent = -tree.w;
        } else if (node.parent == node.parent.parent.left) {  // if 66 is a left child of its parent 
            node.parent.parent.left = node;
        } else {
            node.parent.parent.right = node; // when node is on the right of its parent
        }

        node.parent = newNode.parent;   // 44.parent = 66s parent
        node.right = newNode; // 44.right = 66
        newNode.parent = node; // 66.parent = 44
        newNode.left = oldR; // 66.left = parentless null
        oldR.parent = newNode; // parentless null.parent = 66   (it has family!)

        // switch colors
        node.isRed = false;            // 44 is black
        newNode.isRed = true;          // 66 is red

        //should be ok - 66's dfp = -50's dfp and 50 stays (OLD COMMENT)
        // 66s dfp = -(10s dfp)
        newNode.distanceFromParent = -(newNode.parent.left.distanceFromParent);
        
        if (node != null && node.parent != null && node.parent.right != null)  { //should be ok as well    // THIS IF STATEMENT IS NEEDED
            // if 44 is a right child 
            if (node.key == node.parent.right.key) {
                node.distanceFromParent = -(node.parent.left.distanceFromParent);

            // if 44 is a left child 
            } else if (node.key == node.parent.left.key){
                node.distanceFromParent = -(node.parent.right.distanceFromParent);
            }
        }

        // change distance from parent on nulls of 66
        // newNode.left.distanceFromParent = -tree.w;
        newNode.left.distanceFromParent = -(newNode.right.distanceFromParent);      // new code

     
        this.updateDistances(newNode,newNode.right.posX);          //66
        this.updateNodeDepths(this.root); 

        // update position of 44
        node.posX = newNode.posX;
        node.posY = newNode.posY;
    }


    rotateRight(node) {
        // node = 975
        // node = 33
        var nx = node.left.right;  // nx is null  (33.14.null)
        if (node.parent == null) {
            node.left.parent = null;
            this.root = node.left;
            this.root.dpth = 0;
            node.isRed = true;
            node.left.isRed = false;
            //node.distanceFromParent = -tree.w;
        } else if (node == node.parent.left) {
            node.parent.left = node.left; // 975.left = 674                 // 44.left = 14
        } else {
            node.parent.right = node.left; // when node is on the right of its parent
        }
        node.left.parent = node.parent;   // 674.parent = 975.parent       // 14.parent = 44
        node.left.right = node; // 674.right = 975                         // 14.right = 33
        node.parent = node.left; // 975.parent = 674                       // 33.parent = 14
        node.left = nx; // 975.left = 674.right                            // 33.left = null
        nx.parent = node; // 674.right.parent = 975                        // null.parent = 33

        // switch colors
        node.parent.isRed = false;  // 14 is black
        node.isRed = true;          // 33 is red

        // 559 && 975 = -w/w ???


            //     674
            //     / \
            // 559     975

        // TODO!!!!! : this is not correct ????
        //if (node.parent != null){

        node.distanceFromParent = -(node.parent.left.distanceFromParent); //should be ok - 66's dfp = -50's dfp and 50 stays 
        if (node.parent != null && node.parent.parent != null && node.parent.parent.right != null) { //should be ok as well
            if (node.parent.key == node.parent.parent.right.key)
            {
                node.parent.distanceFromParent = -(node.parent.parent.left.distanceFromParent);
            } else if (node.parent.key == node.parent.parent.left.key){
                node.parent.distanceFromParent = -(node.parent.parent.right.distanceFromParent);
            }
        }
        
        // console.log(node.key);
        // console.log(tree.root.key);
        // if (node.key == tree.root.key) {
        //     node.distanceFromParent = tree.w;
        //     tree.root = node.left;
        //     console.log(node.key);
        //     console.log(tree.root.key);
        // }
        

        node.left.distanceFromParent = -this.w;
        node.right.distanceFromParent = this.w;
        node.parent.left.left.distanceFromParent = -this.w;
        node.parent.left.right.distanceFromParent = this.w;
        
        // 1's nulls positions
        // node.parent.left.left.posX = node.parent.left.posX;
        // node.parent.left.right.posX = node.left.posX;
        node.parent.left.left.posX = node.parent.left.posX;
        node.parent.left.right.posX = node.parent.posX + this.w; 

        // 33's nulls positions
        // console.log('33 right way before posX = ' + node.right.posX);
        // console.log('33.left posX before = ' + node.left.posX);

        node.left.posX = node.right.posX - this.w;
        node.right.posX = node.right.posX + this.w;
        
        // console.log('33.left posX after = ' + node.left.posX);

        this.updateDistances(node,node.right.posX);
        this.updateDistances(node.parent.left,node.parent.left.right.posX);
        //tree.updateDistances(node.parent, node.parent.right.posX);


        // 559:
        // node.parent.left.left.distanceFromParent = -tree.w;
        // node.parent.left.right.distanceFromParent = tree.w;
        // node.parent.left.left.posX = node.left.posX - tree.w;
        // node.parent.left.right.posX = node.left.posX + tree.w;
        // node.parent.left.distanceFromParent = ?
        // node.parent.left.posX = ?

        // redraw

    }

    updateLinksLeft(node){
        // node = 50
        // parentless node (30), belonged to 50 
        var oldR = node.left; // null
        var newNode = node.parent; // 44

        if (node.parent.parent == null) {
            node.parent = null;
            this.root = node;
            // theoretically  and practically we don't need to set the dpth, because updateNodeDepths does it for us
            this.root.dpth = 0;
            node.isRed = false;
            newNode.isRed = true;

        } else if (node.parent == node.parent.parent.left) {  // if 44 is a left child of its parent 
            node.parent.parent.left = node;

        } else {
            node.parent.parent.right = node; // when node is on the right of its parent
        }

        node.parent = newNode.parent;   // 50.parent = 44s parent
        node.left = newNode; // 50.left = 44
        newNode.parent = node; // 44.parent = 50
        newNode.right = oldR; // 44.right = parentless node (30)
        oldR.parent = newNode; // parentless node (30).parent = 44  (it has family!)

        // switch colors
        if(newNode.isRed == false) {     // if the node that moved down is black
            newNode.isRed = true;        // make it red
            node.isRed = false;         // the node we called the op on becomes black
        } else {                        // else if the node that moved down is red
            newNode.isRed = true;       // keep the node that moved down red
            node.isRed = true;         // and the node we called the op on stays red
        }

        newNode.distanceFromParent = newNode.left.distanceFromParent;
        newNode.parent.right.distanceFromParent = -(newNode.distanceFromParent); //new code

        // change distance from parent on 30 of 44
        // the parentless node's dfp = single positive w
        // newNode.right.distanceFromParent = tree.w;              // changed position from below
        newNode.right.distanceFromParent = -(newNode.left.distanceFromParent);  // new code


        if (node != null && node.parent != null) {          //new code
            if (node.key == node.parent.right.key) {                    // if 50 is a right child 
                node.distanceFromParent = -(node.parent.left.distanceFromParent);
            } else if (node.key == node.parent.left.key){               // if 50 is a left child 
                node.distanceFromParent = -(node.parent.right.distanceFromParent);
            }
        }

        // // change distance from parent on 30 of 44
        // // the parentless node's dfp = single positive w
        // newNode.right.distanceFromParent = tree.w;

        // node.left.posX = node.left.posX - tree.w; FIX THIS - maybe dont need this
        // node.right.posX = node.left.posX + tree.w; FIX THIS - maybe dont need this

        this.updateDistances(newNode,newNode.right.posX);    //44
        this.updateNodeDepths(this.root); 

        // update position of 50
        node.posX = newNode.posX;
        node.posY = newNode.posY;
    }

    rotateLeft(node) {
        // node = 559
        // node = 1
        var nx = node.right.left; // nx is 674.left // nx is null (1.14.null)
        if (node.parent == null) {
            node.right.parent = null;
            this.root = node.right;
            this.root.dpth = 0;
            this.root.isRed = false;
        } else if (node == node.parent.left) {
            node.parent.left = node.right; // 975.left = 674  // 1=14    33.left = 1.right
        } else {
            node.parent.right = node.right; // when node is on the right of its parent
        }
        node.right.parent = node.parent; // 674.parent = 975  // 14.parent = 33
        node.right.left = node;   // 674.left = 559           // 14.left = 1
        node.parent = node.right; // 559.parent = 674         // 1.parent = 14
        node.right = nx; // 559.right = 674.left              // 1.right = null
        nx.parent = node; // 674.left.parent = 559            // null.parent = 1

        if(node.isRed == false) {
            node.parent.isRed = false;
            node.isRed = true;
        }

        // 559.left and right = -w/w :

        node.distanceFromParent = node.left.distanceFromParent;
        node.parent.right.distanceFromParent = -(node.distanceFromParent);
        node.left.distanceFromParent = -this.w;
        node.right.distanceFromParent = this.w;
        if (node.parent != null && node.parent.parent != null){
            if(node.parent == node.parent.parent.left){
                node.parent.distanceFromParent = -(node.parent.parent.right.distanceFromParent);
            } else if (node.parent == node.parent.parent.right){
                node.parent.distanceFromParent = -(node.parent.parent.left.distanceFromParent);
            }
        }

        node.left.posX = node.left.posX - this.w;
        node.right.posX = node.left.posX + this.w;
        
        this.updateDistances(node,node.right.posX);

        // redraw
    }

    flipColors(scene,node) {
        // does the root always have to be black? if so then here we need to check that if the node is the root then don't change it to red
        if (node != this.root) {            // if node is not root then make it red
            node.isRed = true;
        } else {                            // if node is root then leave it black (better-safe-than-sorry code)
            node.isRed = false;
        }

        node.left.isRed = false;
        node.right.isRed = false;
        node.drawLinkToParentRB(scene)
        // change links colors here - will change on redraw?
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

    // destroy the links of the tree
    destroyLinks (node) {
        if(node != null) {
            if (node.link != null) {
                node.link.destroy()
            }
            this.destroyLinks(node.left)
            this.destroyLinks(node.right)
        }
    }

    // draw all the Links to parent
    drawLinksRB (scene, node){
        if(node != null) {
            node.drawLinkToParentRB(scene)
            this.drawLinksRB (scene, node.left)
            this.drawLinksRB (scene, node.right)
        }
    }

}