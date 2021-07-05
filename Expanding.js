import { BSTNode } from './BSTNode.js';

export class Expanding extends Phaser.Scene {

    constructor() {
        super({ key:'Expanding' });
    }

    preload() {
        this.load.spritesheet('onion', 'Assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {

        this.add.text(4500,100, 'Expansion', { fontSize: '20px', fill: '#000' });

        var keySpacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySpacebar.on('down', () => {
            this.scene.switch('SearchLinked');
        });

        // return an array with graphics for the node
        function makeNodeGraphics(key,scene) {
            var array = [];
            // var curtain = scene.add.rectangle(x, y, 55, 55, 0xe92a7a);
            var shape = scene.add.rectangle(0, 0, 55, 55, 0x35d330).setScale(0.5);
            var keyString = scene.add.text(0,0, '' + key, { fontSize: '10px', fill: '#000' });
            Phaser.Display.Align.In.Center(keyString, shape);
            array.push(shape);
            array.push(keyString);
            // array.push(curtain);
            return array;
            // return [shape,keyString];
        }

        var player = this.physics.add.sprite(5000, 200, 'onion').setScale(0.5);
        player.setBounce(0.1);
        this.cameras.main.setBounds(0, 0, 10_000, 10_000);
        this.cameras.main.startFollow(player, true, 0.03, 0.03);
        this.cameras.main.zoom = 1;

        // zoom in
        // this.cameras.main.centerOn(0,0);
        // var keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        // keyM.on('down', function () {
        //     var cam = this.cameras.main;
    
        //         cam.pan(100, 100, 2000, 'Power2');
        //         cam.zoomTo(2, 500);//zoom distance, duration/speed of zoom
        // }, this);

        // this.cameras.world.setBounds(0, 0, 600, 2000);
        // player.setCollideWorldBounds(true);
        var cursors = this.input.keyboard.createCursorKeys();

        // for intializing overlap of node with node, to be able to redraw the tree only when it expands
        var nodearray = [];
        // would be great to have such overlap (see last line) so then the tree expands only
        // when some nodes overlap
        // but we would need to store the nodes into some array so that we could initialize 
        // the overlap for each new node:
        // this.physics.add.overlap(node, nodearray, redraw, null, this);

        var nodetoreturn = null;

        var treeDepth = 0;
        var root = new BSTNode(this, 5000, 300, 'null', makeNodeGraphics('null',this));
        root.depth = 0;
        root.setSize(27,27);
        this.physics.add.existing(root, 1);

        var w = 40;
        // var numsToInsert = [10,8,6,4,7,9,16,17,18,19,20,21,22,23,24,25,26,27,28,29,33,44,55,66,77,88,99,111,222,333,444,555, 45,26,47,53,84,543,37,78,11,79,4,8,2,7,4,8,34,4,567,843,53,4,677,4,4,4,4,4,4,4];
        // var numsToInsert = [10,8,6,4,7,9,13];
        // var numsToInsert = [10,18,32,8,6,4,7,9,13,20,30,45];
        // var numsToInsert = [10,18,32,8,6,4,7,9,13,20,30,45,16,11,21,19,44];
        // var numsToInsert = [33,1,14,5,17,16,55,50,70,48,53,60,80,3,77];
        var numsToInsert = [268, 470, 499, 173, 286, 91, 214, 226, 114, 196, 456, 434, 59, 341, 242, 40, 301, 74, 
            402, 369, 294, 388, 390, 487, 291, 404, 15, 282, 465, 367, 97, 271, 221, 280, 383, 
            473, 236, 346, 213, 182, 75, 175, 290]
        // var numsToInsert = [10,18,32,8,6,4,7,9,13,20,30,45];
        // var numsToInsert = [10,18,32,8,6,4,7,9,13,20,30,45];


        this.physics.add.overlap(player, root, insert, cursorDownIsPressed, this);
        // for the curtain:
        // this.physics.add.collider(player, root, revealValue, null, this);
        this.physics.add.collider(player, root);

        function cursorDownIsPressed() {
            var moveAllowed = false;
            if (cursors.down.isDown) { 
                moveAllowed = true;
            }
            return moveAllowed;
        }
        
        function insert(player,node) {
            if(node.key == 'null') {
                var x = node.x;
                var y = node.y;
                var depth = node.depth;
                var parent = node.parent;
                var q = node.distanceFromParent;
                
                var newNode = new BSTNode(this, x, y, numsToInsert[0], makeNodeGraphics(numsToInsert[0],this));
                numsToInsert.shift();
                newNode.depth = depth;
                newNode.parent = parent;
                newNode.setSize(27,27);
                newNode.drawLinkToParent(this);
                this.physics.add.existing(newNode, 1);
                nodearray.push(newNode);
                newNode.distanceFromParent = q;

                //var neighborNode = null;
                // if (depth != 0){
                //     var neighborNode = traverseBSTAndFindNeighbor(root, depth, x, parent);
                //     if(neighborNode){
                //         var lowestCommonAncestor = traverseBSTAndFindLowestCommonAncestor(root, newNode, neighborNode);
                //         var distanceToAdd = (1.25*w) - (Math.abs(neighborNode.x-x));
                //         if (newNode.key<lowestCommonAncestor.key){
                //             lowestCommonAncestor.left.distanceFromParent = lowestCommonAncestor.left.distanceFromParent + distanceToAdd;
                //         } else {
                //             lowestCommonAncestor.right.distanceFromParent = lowestCommonAncestor.right.distanceFromParent + distanceToAdd;
                //         }

                //     }
                // }


                // if the depth that the current node is at is 0, then it means
                // a new root is being created here so we need to update the global root.
                if (depth == 0) {
                    root = newNode;
                } else if (parent.left == node) {
                    parent.left = newNode;
                } else if (parent.right == node) {
                    parent.right = newNode;
                }
                // ^  if parent's left link node is the same object as current node then we need to
                // update left link of parent.
                // otwrwise if parent's right link node is the same object as current node then
                // we need to update the right link of parent

                nodearray.splice(nodearray.indexOf(node),1);

                if (node.link != null) {
                    node.link.destroy();
                }
                node.destroy();

                // var qt = w;
                // if(parent != null){
                //     qt = (w*(Math.pow(2,treeDepth-1))) / (Math.pow(2,depth));
                // } else {
                //     qt = w;
                // }

                var childL = new BSTNode(this, x-w, y+w, 'null', makeNodeGraphics('null',this)); //y+w
                childL.parent = newNode;
                childL.depth = depth+1;
                childL.setSize(27,27);
                this.physics.add.existing(childL, 1);
                newNode.left = childL;
                childL.drawLinkToParent(this);
                nodearray.push(childL);
                childL.distanceFromParent = -w;

                var childR = new BSTNode(this, x+w, y+w, 'null', makeNodeGraphics('null',this));
                childR.parent = newNode;
                childR.depth = depth+1;
                childR.setSize(27,27);
                this.physics.add.existing(childR, 1);
                newNode.right = childR;
                childR.drawLinkToParent(this);
                nodearray.push(childR);
                childR.distanceFromParent = w;

                checkCollisions(childL);
                checkCollisions(childR);

                // if (childL.depth != 0){
                //     // var neighborNode = traverseBSTAndFindNeighbor(root, childL.depth, childL.x, childL.parent);
                //     traverseBSTAndFindNeighbor(root, childL.depth, childL.x, childL.parent);
                //     var neighborNode = nodetoreturn;
                //     nodetoreturn = null;
                //     if(neighborNode != null){
                //         console.log("NEIGHBOUR of CHILD L: " + neighborNode.key);
                //         console.log("NEIGHBOUR'S PARENT: " + neighborNode.parent.key);
                //         var lowestCommonAncestor = traverseBSTAndFindLowestCommonAncestor(root, childL, neighborNode);
                //         console.log("LCA: " + lowestCommonAncestor.key);
                //         console.log("child parent: " + childL.parent.key);
                //         var distanceToAdd = (2*w) - ((childL.x)-(neighborNode.x));
                //         //if (childL.parent.key<lowestCommonAncestor.key){
                //             // lowestCommonAncestor.left.distanceFromParent = lowestCommonAncestor.left.distanceFromParent + distanceToAdd;
                //         // } else {
                //         lowestCommonAncestor.right.distanceFromParent = lowestCommonAncestor.right.distanceFromParent + distanceToAdd;
                //         // }
                //     }
                // }

                // if (childR.depth != 0){
                //     // var neighborNode = traverseBSTAndFindNeighbor(root, childR.depth, childR.x, childR.parent);
                //     traverseBSTAndFindNeighbor(root, childR.depth, childR.x, childR.parent);
                //     var neighborNode = nodetoreturn;
                //     nodetoreturn = null;
                //     if(neighborNode != null){
                //         console.log("NEIGHBOUR of CHILD R: " + neighborNode.key);
                //         console.log("NEIGHBOUR'S PARENT: " + neighborNode.parent.key);
                //         var lowestCommonAncestor = traverseBSTAndFindLowestCommonAncestor(root, childR, neighborNode);
                //         console.log("LCA: " + lowestCommonAncestor.key);
                //         console.log("child parent: " + childL.parent.key);
                //         var distanceToAdd = (2*w) - ((neighborNode.x)-(childR.x));
                //        // if (childR.parent.key<lowestCommonAncestor.key){
                //             lowestCommonAncestor.left.distanceFromParent = lowestCommonAncestor.left.distanceFromParent - distanceToAdd;
                //         // } else {
                //         //     lowestCommonAncestor.right.distanceFromParent = lowestCommonAncestor.right.distanceFromParent + distanceToAdd;
                //         // }

                //     }
                // }

                this.physics.add.overlap(player, newNode, teleportLeft, cursorLeftIsPressed, this);
                this.physics.add.overlap(player, newNode, teleportRight, cursorRightIsPressed, this);
                this.physics.add.overlap(player, newNode, teleportUp, cursorUpIsPressed, this);
                
                this.physics.add.overlap(player, childL, teleportUp, cursorUpIsPressed, this);
                this.physics.add.overlap(player, childR, teleportUp, cursorUpIsPressed, this);

                this.physics.add.overlap(player, childL, insert, cursorDownIsPressed, this);
                this.physics.add.overlap(player, childR, insert, cursorDownIsPressed, this);

                this.physics.add.collider(newNode, nodearray, redrawTree, null, this);
                this.physics.add.collider(childL, nodearray, redrawTree, null, this);
                this.physics.add.collider(childR, nodearray, redrawTree, null, this);

                // When curtain exists:
                // this.physics.add.collider(player, newNode, revealValue, null, this);
                // this.physics.add.collider(player, childL, revealValue, null, this);
                // this.physics.add.collider(player, childR, revealValue, null, this);

                this.physics.add.collider(player, newNode);
                this.physics.add.collider(player, childL);
                this.physics.add.collider(player, childR);

                player.setPosition(root.x,root.y-30);

                if (childL.depth > treeDepth) {
                    treeDepth = childL.depth;
                }

                redraw(root, 1, this);

                // Child's depth is increased in above code. When it becomes larger than the 
                // depth of the existing tree then it means that tree got deeper so we need
                // to update the depth of the existing tree.
                // if (childL.depth > treeDepth) { //We do need this check otherwise the tree shrinks
                //     treeDepth = childL.depth;
                //     if (treeDepth>1) {
                //         var qt = w*(Math.pow(2,treeDepth-1));
                //         redraw(root, qt, this);
                //     }
                // }
            }
        }

        function checkCollisions(node){
            if (node.depth != 0){
                // var neighborNode = traverseBSTAndFindNeighbor(root, childL.depth, childL.x, childL.parent);
                traverseBSTAndFindNeighbor(root, node.depth, node.x, node.parent);
                var neighborNode = nodetoreturn;
                nodetoreturn = null;
                if(neighborNode != null){
                    // console.log("NEIGHBOUR of CHILD L: " + neighborNode.key);
                    // console.log("NEIGHBOUR'S PARENT: " + neighborNode.parent.key);
                    var lowestCommonAncestor = traverseBSTAndFindLowestCommonAncestor(root, node, neighborNode);
                    // console.log("LCA: " + lowestCommonAncestor.key);
                    // console.log("child parent: " + childL.parent.key);
                    var distanceToAdd = (2.1*w) - Math.abs(((node).x)-(neighborNode.x));
                    if (node.parent.key<lowestCommonAncestor.key){
                        lowestCommonAncestor.left.distanceFromParent = lowestCommonAncestor.left.distanceFromParent - distanceToAdd;
                    } else {
                    lowestCommonAncestor.right.distanceFromParent = lowestCommonAncestor.right.distanceFromParent + distanceToAdd;
                    }
                }
            }
        }

        function traverseBSTAndFindNeighbor(node, depth, x, parent) {
            if (node != null) {
                // console.log("Key " + node.key);
                // console.log(Math.abs(node.x-x));
                // console.log(w);
                // console.log("This node's depth " + node.depth);
                // console.log("Our nodes depth " + depth);
                // if (node.parent != null) { console.log("This node's parent " + node.parent.key); }
                // console.log("Our nodes parent " + parent.key);
                if(node.depth == depth && Math.abs((node.x)-(x))<=(2*w) && node.parent != parent){
                    // console.log("Returning: " + node.key);
                    // console.log(node.key);
                    // return node;
                    nodetoreturn = node;
                }
                traverseBSTAndFindNeighbor(node.left, depth, x, parent);
                traverseBSTAndFindNeighbor(node.right, depth, x, parent);
            } 
            // else {
            //     return null;
            // }
        }

        function traverseBSTAndFindLowestCommonAncestor(node, inserted, neighbor) {
            // if (node == null){
            //     return null;
            // } else 
            if (node.key > inserted.parent.key && node.key > neighbor.parent.key){
                return traverseBSTAndFindLowestCommonAncestor(node.left, inserted, neighbor);
            } else if (node.key < inserted.parent.key && node.key < neighbor.parent.key){
                return traverseBSTAndFindLowestCommonAncestor(node.right, inserted, neighbor);
            } else {
                return node;
            }
        }

        function updateDistances(node,xToCheck) {
            if(node.parent != null) {
                if ((node.parent.left.key == 'null' && node.parent.right.key != null && node.parent.right.key != 'null') || (node.parent.right.key == 'null' && node.parent.left.key != null && node.parent.left.key != 'null')) {
                    node.parent.left.distanceFromParent = node.left.distanceFromParent;
                    node.parent.right.distanceFromParent = node.right.distanceFromParent;
                } else if (node.parent.left.key != 'null' && node.parent.right.key != 'null' && node.parent.left.key != null && node.parent.right.key != null) {
                    if ((Math.max(node.parent.right.distanceFromParent*2, Math.abs(node.parent.left.distanceFromParent*2)) <= node.right.distanceFromParent*2) || (node.parent.x == xToCheck) ) {
                        node.parent.left.distanceFromParent = node.parent.left.distanceFromParent*2;
                        node.parent.right.distanceFromParent = node.parent.right.distanceFromParent*2;
                    }
                }
                updateDistances(node.parent,xToCheck);        
            }
        }

        function redrawTree(node,nodeThatIsInTheWay) {
            // if (collison is on same y as root) then expand
            // updateDistances(node.parent, node.x);
            // nodearray.forEach(item => {
            //     checkCollisions(item);
            // });
            checkCollisions(node);
            redraw(root, 1, this);
            // var qt = w*(Math.pow(2,node.depth-1));
            // redraw(root, node.depth, this);
            // console.log("length: " + nodearray.length);
            // nodearray.forEach(item => {
            //     console.log(item);
            // });
        }

        function redraw(node, controlDepth, scene) {
            if (node != null) {
                var q = node.distanceFromParent;
                var x = node.x;
                var y = node.y;
                var key = node.key;
                var left = node.left;
                var right = node.right;
                var parent = node.parent;
                var depth = node.depth;
                // console.log("distance from parent for " + key + " is " + q);

                var newNode;
                // if (depth > controlDepth) {
                //     newNode = new BSTNode(scene, parent.x+q, parent.y+w, key, makeNodeGraphics(key,scene)); //parent.x+q/2
                // } else 
                if (depth > 0) {
                    newNode = new BSTNode(scene, parent.x+q, parent.y+w, key, makeNodeGraphics(key,scene)); //parent.x+q/2
                    // q = Math.abs(q/2);
                } else {
                    newNode = new BSTNode(scene, x, y, key, makeNodeGraphics(key,scene));
                }
                
                if (left != null) {
                    left.parent = newNode;
                }

                if (right != null) {
                    right.parent = newNode;
                }

                newNode.depth = depth;
                newNode.parent = parent;
                newNode.left = left;
                newNode.right = right;
                newNode.distanceFromParent = q;
                newNode.setSize(27,27);
                scene.physics.add.existing(newNode, 1);

                if (depth == 0) {
                    root = newNode;
                } else if (parent.left == node) {
                    parent.left = newNode;
                } else if (parent.right == node) {
                    parent.right = newNode;
                }

                if (node.link != null) {
                    node.link.destroy();
                }
                node.destroy();

                nodearray.splice(nodearray.indexOf(node),1);

                newNode.drawLinkToParent(scene);

                nodearray.push(newNode);

                if (key != 'null') {
                    scene.physics.add.overlap(player, newNode, teleportLeft, cursorLeftIsPressed, scene);
                    scene.physics.add.overlap(player, newNode, teleportRight, cursorRightIsPressed, scene);
                }
                scene.physics.add.overlap(player, newNode, teleportUp, cursorUpIsPressed, scene);
                scene.physics.add.overlap(player, newNode, insert, cursorDownIsPressed, scene);
                scene.physics.add.collider(player, newNode);

                scene.physics.add.collider(newNode, nodearray, redrawTree, null, scene);

                // if (depth > 0) {
                //     q = Math.abs(q/2);
                // }

                // if (left != null && left.depth > controlDepth) {
                //     q = w;
                // }

                // pass node.distanceFromparent
                redraw(newNode.left,controlDepth,scene);
                redraw(newNode.right,controlDepth,scene);
            }
        }

        // traverses BST recursively, starting from root and prints all keys
        // call should look like this: traverseBST(root,0);
        // I think it's Pre-Order?
        function traverseBST(node) {
            if (node != null) {
                console.log("Node Key: " + node.key + " Index: " + index);
                traverseBST(node.left);
                traverseBST(node.right);
            }
        }

        // Left cursor logic on overlap with player:
        // this.physics.add.overlap(player, root, teleportLeft, cursorLeftIsPressed, this);

        function cursorLeftIsPressed() {
            var moveAllowed = false;
            if (cursors.left.isDown) {
                moveAllowed = true;
            }
            return moveAllowed;
        }

        function teleportLeft(player, node) {
            if (node.left != null) {
                player.setPosition(node.left.x,node.left.y-30);
            }
        }

        // Right cursor logic on overlap with player:
        // this.physics.add.overlap(player, root, teleportRight, cursorRightIsPressed, this);

        function cursorRightIsPressed() {
            var moveAllowed = false;
            if (cursors.right.isDown) {
                moveAllowed = true;
            }
            return moveAllowed;
        }

        function teleportRight(player, node) {
            if (node.right != null) {
                player.setPosition(node.right.x,node.right.y-30);
            }
        }

        // Up cursor logic on overlap with player:
        // this.physics.add.overlap(player, root, teleportUp, cursorUpIsPressed, this);

        function cursorUpIsPressed() {
            var moveAllowed = false;
            if (cursors.up.isDown) {
                moveAllowed = true;
            }
            return moveAllowed;
        }

        function teleportUp(player, node) {
            if (node.parent != null) {
                player.setPosition(node.parent.x,node.parent.y-30);
            }
        }

        // For the curtain on overlap/collide
        function revealValue(player, node) {
            node.curtain.destroy();
        }

    }

    update() {

    }
}