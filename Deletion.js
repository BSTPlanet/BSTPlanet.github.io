import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
var numsToInsert = [];
var tasks = [];

export class Deletion extends Phaser.Scene {

    constructor() {
        super({ key:'Deletion' });
    }

    init (data) {
        numsToInsert = data.tree
        tasks.push(data.task)
        console.log("Task: " + data.task)
    }

    preload() {
        this.load.image('background', 'Assets/background_planet_pink_singleLarge.png');
        this.load.image('onion', 'Assets/alien_pink.png');
        this.load.image('node_yellow', 'Assets/node_yellow_scaled.png'); // yellow node
        this.load.image('node_curtain', 'Assets/node_curtain.png'); // node curtain
        this.load.image('node_null', 'Assets/node_null_scaled.png'); // gray node null
    }

    create() {

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // var nodetoreturn = null;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background').setDepth(-1);

        // Text on top of the game world
        var text1 = this.add.text(9_000,100, 'DELETION BST - array', { fontSize: '30px', fill: '#000' });
        //Instructions
        var text2 = this.add.text(10_500,100, 'Instructions:\nBACKSPACE to delete\nBACKSPACE + P to delete node with 2 children\nENTER to insert', { fontSize: '20px', fill: '#000' });

         // Clafifications on the Insert Operation
        //  var text3 = this.make.text({
        //     x: 2700,
        //     y: 1000,
        //     text: 'You always start searching from the root. To find a key in the tree you have to compare it with the root key and go left if it’s smaller or go right if it’s bigger than the root key. You have to repeat this step until the key of node you are on is equal to the key you’re looking for - that’s when you stop and delete (press BACKSPACE). Sometimes the delete operation is more complicated than that - if the node you’re deleting has two children, you need to replace the deleted node with the leftmost node in the right subtree of the deleted node. In this case you’ll be asked to show which node should replace the node you want to delete (by pressing ENTER).',
        //     origin: { x: 0.5, y: 0.5 },
        //     style: {
        //         fontSize:'28px ',
        //         fill: 'black',
        //         align: 'justify',
        //         wordWrap: { width: 1600 }
        //     },
        // });

        // var text4 = this.add.text(2300,1130, 'To go back to the home page press ESC', { fontSize: '30px', fill: '#000' });

        // Go back to the home page
        // var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        // keyEscape.on('down', () => {
        //     this.scene.switch('BSTIntroduction');
        // });

        // Switches from this scene to InsertionLinked
        // var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // spacebar.on('down', () => {
        //     this.scene.stop('Sandbox');
        //     this.scene.start('SearchLinked');
        // });

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            this.scene.switch('IncorrectBST');
        });

         // Restart the current scene
        var keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyR.on('down', () => {
            destroyEverything();
            this.scene.restart('Sandbox');
            this.input.keyboard.removeAllKeys(true);
        });

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            this.scene.switch('MenuBST');
        });

        // *************PLAYER*************
        var player = this.physics.add.sprite(10_000, 300, 'onion');
        player.setBounce(0.1);

        // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        var keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        var keybackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        // *************CAMERA AND ZOOM*************
        this.cameras.main.setBounds(0, 0, 20_000, 20_000);
        // this.cameras.main.startFollow(player, true, 0.08, 0.08);
        // this.cameras.main.centerOn(2700,500);
        this.cameras.main.zoom = 0.5;
        this.cameras.main.startFollow(player, true, 0.05, 0.05);

        // var isZoomed = true;
        // var keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // keyZ.on('down', function () {
        //     var cam = this.cameras.main;
        //     if(isZoomed) {  // zoom out
        //         cam.stopFollow();
        //         cam.pan(root.x, root.y, 2000, 'Power2'); //x to pan to, y to pan to, pan speed?, pan mode
        //         cam.zoomTo(0.5, 1000);//zoom distance, duration/speed of zoom
        //         isZoomed = false;
        //     } else { // zoom in
        //         cam.startFollow(player, true, 0.05, 0.05);
        //         // cam.pan(player.x, player.y, 2000, 'Power2'); //x to pan to, y to pan to, pan speed?, pan mode
        //         cam.zoomTo(1, 1000);//zoom distance, duration/speed of zoom
        //         isZoomed = true;
        //     }
        // }, this);

        // this.cameras.world.setBounds(0, 0, 600, 2000);
        // player.setCollideWorldBounds(true);

        // ************* NUMBERS TO INSERT *************

        // GENERATE RANDOM
        // var numsToInsert = generateNumsToInsert(30);
        // console.log(numsToInsert);

        function generateNumsToInsert(n) {
            var arr = [];
            var i;
            for(i=0;i<n;i++){
                var number = Math.floor(Math.random() * (999 - 1) + 1);
                if(!arr.includes(number)){
                    arr.push(number);
                }
            }
            return arr;
        }

        function generateNumsForInsertTask(n) {
            var arr = [];
            var i;
            for(i=0;i<n;i++){
                var number = Math.floor(Math.random() * (999 - 1) + 1);
                if(!arr.includes(number) && !numsToInsert.includes(number)){
                    arr.push(number);
                }
            }
            return arr;
        }
        
        // *************INITIALIZE BST*************

        var tree = new Tree(this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);
        // tree.root.left.drawLinkToParentRB(this);


        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, deleteNode, backspaceIsPressed, scene);
                scene.physics.add.overlap(player, node, checkAndDeleteSecondNode, pIsPressed, scene);
                // redraw
                // scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }
        
       // *************** TASKS + TASK ACTIONS ***************
       

        // // displays what operations needs to be performed by the player
        var taskText = this.add.text(9000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask(this);
        // // for displaying feedback after completing tasks
        // var feedback = this.add.text(2000,150, '', { fontSize: '20px', fill: '#000' });

        // //while there are still some tasks in the array, displays text indicating what needs to be done
        // //when tasks is empty then press P to continue to next lesson
        function displayTask(scene) {
            if (tasks.length != 0) { 
                taskText.setText('Delete ' + tasks[0]);
                console.log("Tasks on dsiplay:" + tasks[0])
            } else {
                taskText.setText('You did it!!! You did the thing!!!!'); 
                taskText.setPosition(9000,1100);
                taskText.setFill('#ff0062');
                taskText.setFontSize(80);
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tasks.shift();
            console.log("Task after deleting min" + tasks[0] + tasks.length )
            // feedback.setPosition(2000,150);
            // feedback.setText('Good job!!!');
            // displayTask(scene);
            // tree.calculateHeight();
            // tree.closeCurtains();
        }

        // ***************DELETION***************

        var backspaceAllowed = false;
        function backspaceIsPressed() {
            var moveAllowed = false;
            if (keybackspace.isDown) {
                backspaceAllowed = true;
            }
            if (backspaceAllowed && keybackspace.isUp) {
                moveAllowed = true;
                backspaceAllowed = false;
            }
            return moveAllowed;
        }

        var nodeToDelete = null;

        // code for deletion when both children are null and one child is null (and only selection when both children are NOT null)
        function deleteNode(player, node) {
            if (nodeToDelete == null && tasks.length != 0) {
                // (node.key != 'null') 
                if (node.key != 'null' && (tasks[0] == node.key || (tasks[0] == 'Min' && node.key == min(tree.root)) || (tasks[0] == 'Max' && node.key == max(tree.root))) && nodeToDelete == null) {
                    if (node.left.key =='null' && node.right.key =='null') { //  both children are null 

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.parent != null) {
                            player.setPosition(node.parent.x,node.parent.y-BUFFER);
                        }

                        // node.left, node.right, node
                        // hide links and nodes
                        this.add.tween({
                            targets: [node.left.link, node.right.link, node.left.nullGraphics, node.right.nullGraphics, node.nodeGraphics, node.keyString, node.left.keyString,node.right.keyString],
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        this.time.addEvent({
                            delay: 1000,
                            callback: function(node) {
                                node.setKey('null');
                                node.setNullGraphics();
                                node.nullGraphics.setAlpha(0);
                                node.left.destroyNode();
                                node.right.destroyNode();
                                node.setChildren(); // set children as null
                            },
                            args: [node]
                        });

                        this.add.tween({
                            targets: [node.nullGraphics, node.keyString],
                            ease: 'Sine.easeIn',
                            delay: 2000,
                            duration: 1000,
                            alpha: '+=1',
                            onComplete: taskSucceededActions,
                            onCompleteParams: [this]
                        });

                        this.time.addEvent({
                            delay: 3000,
                            callback: function(scene) {
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });

                    } else if (node.right.key == 'null' || node.left.key  == 'null') { // one child is null

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.right.key == 'null') { // right child is null

                            player.setPosition(node.left.x,node.left.y-BUFFER);

                            // hide links
                            this.add.tween({
                                targets: [node.left.link, node.right.link, node.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // hide right null of deleted node and the deleted node
                            this.add.tween({
                                targets: [node.right.nullGraphics, node.nodeGraphics, node.keyString, node.right.keyString],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // branch moves to the right
                            this.time.addEvent({
                                delay: 1000,
                                callback: function(node,scene) {

                                    if (node.parent == null) {
                                        node.left.parent = null;
                                        tree.root = node.left;
                                        tree.root.dpth = 0;
                                    } else if (node.parent.left == node) {
                                        node.parent.left = node.left;
                                        node.left.parent = node.parent;
                                    } else if (node.parent.right == node) {
                                        node.parent.right = node.left;
                                        node.left.parent = node.parent;
                                    }
                                    
                                    var distanceX = node.left.posX-node.posX;
                                    // moveBranch(node.left,distanceX,scene); //v1
                                    updateBranch(node.left,distanceX); //v2

                                    // TO PREVENT COLLAPSING:
                                    node.left.distanceFromParent = node.distanceFromParent;

                                    tree.updateNodeDepths(node.left); // starting from 9 (the node that changes deleted node)

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: node.left.posX,
                                        y: node.left.posY - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    actuallyMoveBranch(node.left,distanceX,scene); //v2

                                    // // destroy 15.right
                                    // node.right.destroyNode();
                                    // // destroy 15
                                    // node.destroyNode();
                                },
                                args: [node,this]
                            });

                            // move player to root, update tasks, enable keyboard
                            this.time.addEvent({
                                delay: 3000,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    // tree.traverseAndCheckCrossings(scene);

                                    tree.redraw(scene);

                                    appearLinksOneChild(node.left, scene);
                                    // destroy 15.right
                                    node.right.destroyNode();
                                    // destroy 15
                                    node.destroyNode();

                                },
                                args: [this]
                            });

                        } else {                        // left child is null

                            player.setPosition(node.right.x,node.right.y-BUFFER);

                            // hide links
                            this.add.tween({
                                targets: [node.left.link, node.right.link, node.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // hide left null of deleted node and the deleted node
                            this.add.tween({
                                targets: [node.left.nullGraphics, node.nodeGraphics, node.keyString, node.left.keyString],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // branch moves to the left up
                            this.time.addEvent({
                                delay: 1000,
                                callback: function(node,scene) {

                                    if (node.parent == null) {
                                        node.right.parent = null;
                                        tree.root = node.right;
                                        tree.root.dpth = 0;
                                    } else if (node.parent.left == node) {
                                        node.parent.left = node.right;
                                        node.right.parent = node.parent;
                                    } else if (node.parent.right == node) {
                                        node.parent.right = node.right;
                                        node.right.parent = node.parent;
                                    }

                                    // TODO:
                                    // not here:
                                    // 2.the collisions are checked only once? the crossings are not checked?

                                    var distanceX = node.right.posX-node.posX;
                                    // moveBranch(node.right,distanceX,scene); //v1
                                    updateBranch(node.right,distanceX); //v2

                                    // TO PREVENT COLLAPSING:
                                    node.right.distanceFromParent = node.distanceFromParent;

                                    tree.updateNodeDepths(node.right); // starting from 33 (the node that changes deletd node)

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: node.right.posX,
                                        y: node.right.posY - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    actuallyMoveBranch(node.right,distanceX,scene); //v2

                                    // appearLinks(node.right, scene);

                                    // // destroy 24.left
                                    // node.left.destroyNode();
                                    // // destroy 24
                                    // node.destroyNode();
                                },
                                args: [node,this]
                            });

                            // move player to root, update tasks, enable keyboard
                            this.time.addEvent({
                                delay: 3000,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    // tree.traverseAndCheckCrossings(scene);
    
                                    tree.redraw(scene);
    
                                    appearLinksOneChild(node.right, scene);
                                    // destroy 24.left
                                    node.left.destroyNode();
                                    // destroy 24
                                    node.destroyNode();
    
                                },
                                args: [this]
                            });
                        } //end of if else
     

                        this.time.addEvent({
                            delay: 6000,
                            callback: function(scene) {
                                taskSucceededActions(scene);
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });

                        // player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        // taskSucceededActions(this);
                    } else { // both children are NOT null
                        // setting a value of nodeToDelete to use it after user clicks Enter
                        nodeToDelete = node;
                        // nodeToDelete.nodeGraphics.setFillStyle(0xff0090, 1);
                        nodeToDelete.nodeGraphics.setTint(0xff0090);
                        // feedback.setPosition(nodeToDelete.x-700,250);
                        // feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.');
                    }
                } else {
                    // feedback.setPosition(2000,150);
                    // feedback.setText('Try again');                
                    // if(nodeToDelete != null) //node.left.key  != 'null' && node.right.key  != 'null' && 
                    // {
                    //     // feedback.setPosition(nodeToDelete.x,185);
                    //     // feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.\n\nTRY AGAIN'); 
                    // } else {
                    //     player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    // }
                    this.add.text(9000,1100, 'Try again!', { fontSize: '60px', fill: '#ff0062' });
                }
            } else {
                // no more tasks
                this.add.text(9000,900, 'You are done with the tasks!', { fontSize: '60px', fill: '#ff0062' });
            }
        }

        //code used on overlap when the user clicks Enter - part of the deleteNode logic for deleting nodes with two children

        var enterAllowed = false;
        function enterIsPressed() {
            var moveAllowed = false;
            if(keyEnter.isDown){
                enterAllowed = true;
            }
            if (enterAllowed && keyEnter.isUp) {
                moveAllowed = true;
                enterAllowed = false;
            }
            return moveAllowed;
        }

        var pAllowed = false;
        function pIsPressed() {
            var moveAllowed = false;
            if(keyP.isDown){
                pAllowed = true;
            }
            if (pAllowed && keyP.isUp) {
                moveAllowed = true;
                pAllowed = false;
            }
            return moveAllowed;
        }

        // code for deletion when both children are NOT null
        function checkAndDeleteSecondNode(player, node){
            if(nodeToDelete != null && node.key != 'null'){
                var key = min(nodeToDelete.right);
                if(node.key == key){

                    // Main cases:
                    // if the right child has nothing on the left - DONE
                    // if the right child has a left child and it has nulls - IN PROGRESS
                    // Other cases:
                    // if the right child has left child and it has right subtree

                    if (nodeToDelete.right.left.key == 'null') { // when nodeToDelete's right child IS min (move min and its right subtree up)

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        // hide links:
                        if (nodeToDelete.parent != null) {
                            this.add.tween({
                                targets: [nodeToDelete.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });
                        }

                        this.add.tween({
                            targets: [nodeToDelete.left.link, nodeToDelete.right.link, node.left.link],
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        // nodes and their components:
                        this.add.tween({
                            targets: [nodeToDelete.nodeGraphics, nodeToDelete.curtain, nodeToDelete.keyString, node.left.nullGraphics, node.left.keyString],
                            delay: 1000,
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        // destroy left child(null) of 15 and update some stuff
                        this.time.addEvent({
                            delay: 2100,
                            callback: function(nodeToDelete,node) {
                                node.left.destroyNode(); // destroy null left child of 15
                                node.left = null;
                                node.parent = nodeToDelete.parent; // set 15s parent as what 10 had (null) || set 25s parent to 15
                                node.dpth = nodeToDelete.dpth;
                            },
                            args: [nodeToDelete,node]
                        });

                        // abs(10 x - 15 x) + node x
                        this.time.addEvent({
                            delay: 2500,
                            callback: function(nodeToDelete,node,scene) {
                                var distanceX = Math.abs(nodeToDelete.posX-node.posX);

                                // Version 1
                                // scene.add.tween({
                                //     targets: player,
                                //     x: player.x - distanceX, // if 15 is on left branch then we should do +
                                //     y: player.y - tree.z, // 10 is Buffer
                                //     ease: 'Power2',
                                //     duration: 1500,
                                // });

                                // moveBranch(node,distanceX,scene);

                                // Version 2
                                updateBranch(node,distanceX);
                            },
                            args: [nodeToDelete,node,this]
                        });

                        // Version 1
                        // this.time.addEvent({
                        //     delay: 4500,
                        //     callback: function(nodeToDelete,node,scene) {
                        //         if (nodeToDelete == tree.root) { // if deleted node is root
                        //             tree.root = node;
                        //             node.left = nodeToDelete.left;  // move 10's left branch to 15
                        //             node.left.parent = node; // change left branch's parent to 15
                        //         } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                        //             node.left = nodeToDelete.left;  // set 25s left to 16 (move 20's left branch to 25)
                        //             node.left.parent = node; // set 16s parent to 25 (change left branch's parent to 25)
                        //             node.parent.right = node; // set 15's right child to 25
                        //         } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                        //             node.left = nodeToDelete.left;
                        //             node.left.parent = node;
                        //             node.parent.left = node; 
                        //         }
                        //         node.distanceFromParent = nodeToDelete.distanceFromParent;
                        //         node.left.drawLinkToParent(scene);
                        //         node.left.link.setAlpha(0);
                        //         scene.add.tween({
                        //             targets: node.left.link,
                        //             ease: 'Sine.easeOut',
                        //             duration: 1000,
                        //             alpha: '+=1'
                        //         });
                        //         tree.updateNodeDepths(tree.root);
                        //         nodeToDelete.destroyNode();
                        //     },
                        //     args: [nodeToDelete,node,this]
                        // });

                        // Version 2
                        this.time.addEvent({
                            delay: 3000,
                            callback: function(nodeToDelete,node,scene) {
                                var distanceX = Math.abs(nodeToDelete.posX-node.posX);

                                if (nodeToDelete == tree.root) { // if deleted node is root
                                    tree.root = node;
                                    node.left = nodeToDelete.left;  // move 10's left branch to 15
                                    node.left.parent = node; // change left branch's parent to 15
                                } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                                    node.left = nodeToDelete.left;  // set 25s left to 16 (move 20's left branch to 25)
                                    node.left.parent = node; // set 16s parent to 25 (change left branch's parent to 25)
                                    node.parent.right = node; // set 15's right child to 25
                                } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                                    node.left = nodeToDelete.left;
                                    node.left.parent = node;
                                    node.parent.left = node; 
                                }
                                node.distanceFromParent = nodeToDelete.distanceFromParent;
                                tree.updateNodeDepths(tree.root);
                                // nodeToDelete.destroyNode();

                                tree.traverseAndCheckCollisions(scene);
                                tree.traverseAndCheckCrossings(scene);

                                scene.add.tween({
                                    targets: player,
                                    x: node.posX, // if 15 is on left branch then we should do +
                                    y: node.posY - BUFFER, // 10 is Buffer
                                    ease: 'Power2',
                                    duration: 1500,
                                });
                                actuallyMoveBranch(node,distanceX,scene);
                                appearLinks(node,scene);
                            },
                            args: [nodeToDelete,node,this]
                        });

                        // need to appear movedNodes's link to parent and left link

                        this.time.addEvent({
                            delay: 4500,
                            callback: function(node,scene) {
                                // node.left.drawLinkToParent(scene);
                                // node.left.link.setAlpha(0);
                                scene.add.tween({
                                    targets: node.left.link,
                                    ease: 'Sine.easeIn',
                                    duration: 1000,
                                    alpha: '+=1'
                                });
                            },
                            args: [node,this]
                        });
                        // end of Version 2

                        this.time.addEvent({
                            delay: 5800,
                            callback: function(node,scene) {
                                // nodeToDelete.setKey(node.key);
                                // nodeToDelete.setFillStyle(0xF5CBDD, 1);
                                // deleteMin(node);
                                nodeToDelete.destroyNode();
                                nodeToDelete = null;
                                tree.updateNodeDepths(node);
                                // tree.updateNodePosX();

                                // Version 1
                                // tree.traverseAndCheckCollisions(scene);
                                // tree.traverseAndCheckCrossings(scene);
                                // tree.redraw(scene);

                                // Version 2
                                // A way to move the branch together with already expanded branch:
                                // in moveBranch only update the posX - line 643
                                // then check for collisions - line 
                                // then actually move the branch nodes (change x to updated posX) - line
                                // redraw
                                tree.traverseAndCheckCollisions(scene);
                                tree.traverseAndCheckCrossings(scene);
                                tree.redraw(scene);
                            },
                            args: [node,this]
                        });

                        this.time.addEvent({
                            delay: 7500,
                            callback: function(scene) {
                                taskSucceededActions(scene);
                                displayTask(scene);
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });
                                
                        
                    } else if (nodeToDelete.right.left.key != 'null') { // when nodeToDelete's right child's left exists (it means there will be a min somewhere on the left from right child)

                        var nodeToUseForAppear = node.parent;

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        // hide links:
                        if (nodeToDelete.parent != null) {
                            this.add.tween({
                                targets: [nodeToDelete.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });
                        }

                        this.add.tween({
                            targets: [nodeToDelete.left.link, nodeToDelete.right.link, node.left.link, node.right.link, node.link],
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        // when min doesn't have children on the right
                        if (node.right.key == 'null') {

                            // hide nodes and their components:
                            this.add.tween({
                                targets: [nodeToDelete.nodeGraphics, nodeToDelete.curtain, nodeToDelete.keyString, node.left.nullGraphics, node.left.keyString, node.right.nullGraphics, node.right.keyString],
                                delay: 1000,
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });
                            
                            // create null for 20 and destroy 16's both null children and update some stuff
                            this.time.addEvent({
                                delay: 2100,
                                callback: function(nodeToDelete,node,scene) {
                                    // make null for 20
                                    var childL = new NodeBST(scene,node.parent.posX-tree.w, node.parent.posY+tree.z, 'null',node.parent.dpth+1,node.parent);
                                    childL.distanceFromParent = -tree.w;
                                    node.parent.left = childL;
                                    childL.nullGraphics.setAlpha(0);
                                    childL.keyString.setAlpha(0);
                                    childL.link.setAlpha(0);

                                    tree.checkCollisions(childL);

                                    // teleporting + curtains
                                    childL.setPhysicsNode(cursors,player,scene);

                                    // physics
                                    scene.physics.add.overlap(player, childL, insert, enterIsPressed, scene);
                                    scene.physics.add.overlap(player, childL, deleteNode, backspaceIsPressed, scene);
                                    scene.physics.add.overlap(player, childL, checkAndDeleteSecondNode, pIsPressed, scene);
                                    scene.physics.add.collider(player, childL);
                                    
                                    node.left.destroyNode(); // destroy null left child of 16
                                    node.right.destroyNode(); // destroy null right child of 16
                                    node.left = null;
                                    node.right = null;
                                    node.parent = nodeToDelete.parent; // set 16s parent as what 15 had (null)
                                    node.dpth = nodeToDelete.dpth;
                                },
                                args: [nodeToDelete,node,this]
                            });

                            // move 16 to the place of 15
                            this.time.addEvent({
                                delay: 2500,
                                callback: function(nodeToDelete,node,scene) {
                                    
                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    // 16 shape and curtain moves up
                                    scene.add.tween({
                                        targets: [node, node.nodeGraphics, node.curtain],
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y, 
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    var distanceX = Math.abs(node.keyString.x-node.posX);
                                    
                                    // 16s keystring moves up
                                    scene.add.tween({
                                        targets: node.keyString,
                                        x: nodeToDelete.x - distanceX,
                                        y: nodeToDelete.keyString.y, // - (tree.z*(node.dpth-nodeToDelete.dpth))
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    // draw 16s link to parent, update physics bodies
                                    scene.time.addEvent({
                                        delay: 1500,
                                        callback: function(node,scene) {
                                            node.drawLinkToParent(scene);
                                            node.link.setAlpha(0);
                                            node.body.updateFromGameObject();
                                            node.curtain.body.updateFromGameObject();
                                        },
                                        args: [node,scene]
                                    });

                                    // update 16s x and y
                                    node.posX = nodeToDelete.posX;
                                    node.posY = nodeToDelete.posY;

                                },
                                args: [nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 4500,
                                callback: function(nodeToUseForAppear,nodeToDelete,node,scene) {
                                    if (nodeToDelete == tree.root) { // if deleted node is root
                                        tree.root = node;
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.right = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.left = node; 
                                    }

                                    // put/appear null on the left of 20
                                    scene.add.tween({
                                        targets: [nodeToUseForAppear.left.nullGraphics, nodeToUseForAppear.left.nodeGraphics, nodeToUseForAppear.left.keyString],
                                        ease: 'Sine.easeIn',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    node.distanceFromParent = nodeToDelete.distanceFromParent;
                                    
                                    if (node.parent != null) {
                                        scene.add.tween({
                                            targets: [node.link],
                                            delay: 1000,
                                            ease: 'Sine.easeOut',
                                            duration: 1000,
                                            alpha: '+=1'
                                        });
                                    }

                                    scene.add.tween({
                                        targets: [node.left.link, node.right.link, nodeToUseForAppear.left.link], //node.right.left.link
                                        delay: 1000,
                                        ease: 'Sine.easeOut',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    tree.updateNodeDepths(tree.root);
                                    nodeToDelete.destroyNode();
                                },
                                args: [nodeToUseForAppear,nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 8000,
                                callback: function(node,scene) {
                                    // nodeToDelete.setKey(node.key);
                                    // nodeToDelete.setFillStyle(0xF5CBDD, 1);
                                    // deleteMin(node);
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
                                    // tree.updateNodePosX();
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redraw(scene);  
                                },
                                args: [node,this]
                            });

                        } else if (node.right.key != 'null') { // when min has children on the right (need to move the right branch up)
                            
                            // hide nodes and their components:
                            this.add.tween({
                                targets: [nodeToDelete, nodeToDelete.nodeGraphics, nodeToDelete.curtain, nodeToDelete.keyString, node.left, node.left.nullGraphics, node.left.keyString],
                                delay: 1000,
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            this.time.addEvent({
                                delay: 2100,
                                callback: function(nodeToDelete,node,scene) {
                                    node.left.destroyNode(); // node is min. we destroy its left child because it wont be needed anymore/it will be replaced
                                    // node.right.destroyNode();
                                    node.left = null;
                                    // node.right = null;
                                    node.parent = nodeToDelete.parent;
                                    node.dpth = nodeToDelete.dpth;
                                },
                                args: [nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 2500,
                                callback: function(nodeToDelete,node,scene) {
                                    
                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    // 11 shape and curtain moves up
                                    scene.add.tween({
                                        targets: [node, node.nodeGraphics, node.curtain],
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y, 
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    var distanceX = Math.abs(node.keyString.x-node.posX);
                                    
                                    // 11s keystring moves up
                                    scene.add.tween({
                                        targets: node.keyString,
                                        x: nodeToDelete.x - distanceX,
                                        y: nodeToDelete.keyString.y, // - (tree.z*(node.dpth-nodeToDelete.dpth))
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    // draw 11s link to parent, update physics bodies
                                    scene.time.addEvent({
                                        delay: 1500,
                                        callback: function(node,scene) {
                                            // node.drawLinkToParent(scene);
                                            // node.link.setAlpha(0);
                                            node.body.updateFromGameObject();
                                            node.curtain.body.updateFromGameObject();
                                        },
                                        args: [node,scene]
                                    });

                                },
                                args: [nodeToDelete,node,this]
                            });

                            // this.time.addEvent({
                            //     delay: 5500,
                            //     callback: function(nodeToDelete,node,scene) {
                            //         // var distanceX = Math.abs(node.posX-node.right.posX);
    
                            //         // updateBranch(node.right,distanceX); //v2

                            //         // moveBranch(node.right,distanceX,scene);

                            //     },
                            //     args: [nodeToDelete,node,this]
                            // });

                            this.time.addEvent({
                                delay: 6000,
                                callback: function(nodeToUseForAppear,nodeToDelete,node,scene) {

                                    var distanceX = Math.abs(node.posX-node.right.posX);
    
                                    updateBranch(node.right,distanceX); //v2

                                    // update 11s x and y - just to be sure it doesn't get updated before moveBranch 
                                    node.posX = nodeToDelete.posX;
                                    node.posY = nodeToDelete.posY;

                                    // draw 11s links - have to have it here after we update 11s posX and posY
                                    node.drawLinkToParent(scene);
                                    node.link.setAlpha(0);
                                    
                                    // update 12s distance from parent
                                    node.right.distanceFromParent = node.distanceFromParent; // <-- 11s.distancefromparent // nodeToUseForAppear.left.distanceFromParent; <-- 13s.left
                                    nodeToUseForAppear.left = node.right; // here nodeToUseForAppear is the parent of node(min)
                                    node.right.parent = nodeToUseForAppear;

                                    if (nodeToDelete == tree.root) { // if deleted node is root
                                        tree.root = node;
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.right = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.left = node; 
                                    }

                                    // update distancefromparent for 11
                                    node.distanceFromParent = nodeToDelete.distanceFromParent;


                                    // tree.updateNodeDepths(node.right);
                                    tree.updateNodeDepths(tree.root);

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    actuallyMoveBranch(nodeToUseForAppear.left,distanceX,scene); //v2

                                    // appearLinks(node.right, scene);
                                    
                                    if (node.parent != null) {
                                        scene.add.tween({
                                            targets: [node.link],
                                            delay: 1000,
                                            ease: 'Sine.easeOut',
                                            duration: 1000,
                                            alpha: '+=1'
                                        });
                                    }

                                    scene.add.tween({
                                        targets: [node.left.link, node.right.link, nodeToUseForAppear.left.link], //node.right.left.link
                                        delay: 1000,
                                        ease: 'Sine.easeOut',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    // tree.updateNodeDepths(tree.root);
                                    nodeToDelete.destroyNode();
                                },
                                args: [nodeToUseForAppear,nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 8000,
                                callback: function(nodeToUseForAppear,node,scene) {
                                    // nodeToDelete.setKey(node.key);
                                    // nodeToDelete.setFillStyle(0xF5CBDD, 1);
                                    // deleteMin(node);
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
                                    // tree.updateNodePosX();
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redraw(scene);
    
                                    appearLinksOneChild(nodeToUseForAppear.left,scene);
    
                                },
                                args: [nodeToUseForAppear,node,this]
                            });

                        } //end of else if

                        this.time.addEvent({
                            delay: 9000,
                            callback: function(scene) {
                                taskSucceededActions(scene);
                                displayTask(scene);
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });


                    } //end of else if

                } else {
                    player.setPosition(nodeToDelete.x,nodeToDelete.y-BUFFER);
                    // feedback.setPosition(nodeToDelete.x,175); 
                    // feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.\n\nTRY AGAIN');
                }
            }
        }

        // How to delay functions:
        // usage of time.addEvent
        // this.time.addEvent({
        //     delay: 1900,
        //     callback: console.log,
        //     args: ["TELL ME WHY"]
        // });

        // Version 1
        // function moveBranch(node,distanceX,scene) {
        //     if (node != null) {

        //         node.link.destroy();

        //         scene.add.tween({
        //             targets: [node, node.curtain, node.keyString],
        //             x: node.posX - distanceX, // if 15 is on left branch then we should do +
        //             y: node.posY - tree.z,
        //             ease: 'Power2',
        //             duration: 1500,
        //         });


        //         // move links:
        //         // scene.add.tween({
        //         //     targets: [node.x1,node.y1,node.x2,node.y2],
        //         //     x: 20000,
        //         //     y: 10000,
        //         //     // x1: { from: node.link.x1, to: node.link.x1+100 },
        //         //     // y1: { from: node.link.y1, to: node.link.y1+100 },
        //         //     // x2: 10080,
        //         //     // y2: 10080,
        //         //     ease: 'Power2',
        //         //     duration: 1000
        //         // });

        //         scene.time.addEvent({
        //             delay: 1500,
        //             callback: function(node,scene) {
        //                 node.drawLinkToParent(scene);
        //                 node.body.updateFromGameObject();
        //                 node.curtain.body.updateFromGameObject();
        //             },
        //             args: [node,scene]
        //         });

        //         node.posX = node.posX - distanceX; // if 15 is on left branch then we should do + - maybe should always be minus ?
        //         node.posY = node.posY - tree.z;

        //         moveBranch(node.left,distanceX,scene);
        //         moveBranch(node.right,distanceX,scene);
        //     }
        // }

        // Version 2 - Nikol's suggested 
        function updateBranch(node,distanceX) {
            if (node != null) {

                node.posX = node.posX - distanceX;
                node.posY = node.posY - tree.z;

                updateBranch(node.left,distanceX);
                updateBranch(node.right,distanceX);
            }
        }

        function actuallyMoveBranch(node,distanceX,scene) {
            if (node != null && node.x != node.posX) {

                node.link.destroy();

                scene.add.tween({
                    targets: [node.nodeGraphics, node.nullGraphics, node.curtain, node.keyString],
                    x: node.posX,
                    y: node.posY,
                    ease: 'Power2',
                    duration: 1500,
                });

                // move links - probably not anymore

                scene.time.addEvent({
                    delay: 1500,
                    callback: function(node,scene) {
                        // node.drawLinkToParent(scene);
                        // node.link.setAlpha(0);
                        node.body.updateFromGameObject();
                        node.curtain.body.updateFromGameObject();

                        // //tween for appearing links
                        // scene.add.tween({
                        //     targets: node.link,
                        //     ease: 'Sine.easeIn',
                        //     duration: 1000,
                        //     alpha: '+=1'
                        // });
                    },
                    args: [node,scene]
                });

                actuallyMoveBranch(node.left,distanceX,scene);
                actuallyMoveBranch(node.right,distanceX,scene);
            }
        }

        // when deleted node has two children - when right child IS min
        function appearLinks(node,scene) {
            if (node != null && node.x != node.posX){
                //tween for appearing links
                node.drawLinkToParent(scene);
                node.link.setAlpha(0);
                scene.add.tween({
                    delay: 1500,
                    targets: node.link,
                    ease: 'Sine.easeIn',
                    duration: 1000,
                    alpha: '+=1'
                });

                appearLinks(node.left,scene);
                appearLinks(node.right,scene);
            }
        }

        function appearLinksOneChild(node,scene) {
            if (node != null){
                //tween for appearing links
                node.link.setAlpha(0);
                scene.add.tween({
                    targets: node.link,
                    ease: 'Sine.easeIn',
                    duration: 1000,
                    alpha: '+=1'
                });

                appearLinksOneChild(node.left,scene);
                appearLinksOneChild(node.right,scene);
            }
        }

        // HELPER FOR deleteNode
        // THIS FUNCTION IS USED IN THE checkAndDeleteSecondNode FUNCTION
        // Returns min node.key of a tree
        function min(node) { 
            var keyToReturn = node.key;
            if (node != null && node.key != 'null'){
                if (node.left.key != 'null') {
                    keyToReturn = min(node.left);
                } else {
                    keyToReturn = node.key;
                    //deleteMin(node);
                }
            }
            return keyToReturn;
        }

        // HELPER FOR deleteNode
        // THIS FUNCTION IS USED IN THE checkAndDeleteSecondNode FUNCTION
        // deletes the min node
        // function deleteMin(node){
        //     if (node.right.key != 'null') {
        //         node.setKey(node.right.key);
        //         var newL = node.right.left;
        //         var newR = node.right.right;
        //         node.left.destroyNode();
        //         node.right.destroyNode();
        //         node.setChildren(newL, newR);
        //         node.left.parent = node;
        //         node.right.parent = node;
        //     } else {
        //         node.setKey('null');
        //         node.setNullGraphics();
        //         node.left.destroyNode();
        //         node.right.destroyNode();
        //         node.setChildren(); // set children as null
        //     }
        // }

        // HELPER FOR deleteNode
        // THIS FUNCTION IS USED IN THE checkAndDeleteSecondNode FUNCTION
        // Returns max node.key of a tree
        function max(node) { 
            var keyToReturn = node.key;
            if (node != null && node.key != 'null'){
                if (node.right.key != 'null') {
                    keyToReturn = max(node.right);
                } else {
                    keyToReturn = node.key;
                    //deleteMin(node);
                }
            }
            return keyToReturn;
        }

        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            text1.destroy();
            // text2.destroy();
            // text3.destroy();
            // text4.destroy();
            feedback.destroy();
            taskText.destroy();
        }
    }

    update() {

    }
}
