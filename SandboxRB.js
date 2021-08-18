import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
import { Database } from './Database.js';
import { SandboxPanel } from './SandboxPanel.js';
import { ExpertAlien } from './ExpertAlien.js';
import { HelpBubble } from './HelpBubble.js';

var controls;
var player;
var panel;
var expert;
var singleTon = new Database();

export class SandboxRB extends Phaser.Scene {

    constructor() {
        super({ key:'SandboxRB' });
    }

    preload() {

        // *************INIT HELP BUBBLE*************
        this.scene.remove('HelpBubble_keyboard');
        this.helpBubble_key = 'HelpBubble_keyboard';
        this.helpBubble_scene = new HelpBubble('HelpBubble_keyboard');
        this.helpBubble = this.scene.add(this.helpBubble_key, this.helpBubble_scene, true);
        this.helpBubble.setHelp('keyboard_RB');

        // *************INIT PANEL AND EXPERT*************
        this.scene.remove('SandboxPanel');
        this.scene.remove('ExpertAlien');
        panel = this.scene.add('SandboxPanel', SandboxPanel, true);
        expert = this.scene.add('ExpertAlien', ExpertAlien, true);
        panel.setLevelName('RB Sandbox');
    }

    create() {

        // *************VARIABLES*************
        // THIS ALSO MUST BE CHANGED IN NodeBST.js line ~211
        // Used to offset y of player so that the player does not fall off the node during setPosition
        // If player is falling off the node then increase the buffer
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background_planet_venus').setDepth(-1);

        // var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // spacebar.on('down', () => {
        //     // generate new tree (random num of nodes) and new tasks (10)
        // });

        // Restart the current scene - generate new tree and tasks
        var keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        keyN.on('down', () => {
            destroyEverything();
            this.scene.restart('SandboxRB');
            this.input.keyboard.removeAllKeys(true);
        });

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            destroyEverything();
            this.scene.stop('SandboxPanel');
            this.scene.stop('ExpertAlien');
            this.scene.stop('HelpBubble_keyboard');
            this.scene.stop();
            this.scene.wake('SandboxMenu');
            this.scene.wake('HelpBubble_sandbox');
            this.input.keyboard.removeAllKeys(true);
        });

        // *************PLAYER*************
        player = this.physics.add.sprite(10_000, 100, 'onion');
        player.setBounce(0.1);

        // *************CAMERA AND ZOOM*************
        var keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        var keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        var keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        var keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        var keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        var keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,
        
            left: keyA,
            right: keyD,
            up: keyW,
            down: keyS,
            zoomIn: keyQ,
            zoomOut: keyE,
        
            zoomSpeed: 0.01,
            minZoom: 0.3,
            maxZoom: 3,
        
            acceleration: 2,
            drag: 3,
            maxSpeed: 2
        });

        this.cameras.main.setBounds(0,0, 20_000, 10_000);
        this.cameras.main.startFollow(player, true, 0.05, 0.05);
        this.cameras.main.zoom = 0.6;

        // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        var keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        var keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        var keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // reset player's position on the root
        // var keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // keyZ.on('down', () => {
        //     player.setPosition(tree.root.x,tree.root.y-BUFFER);
        // });

        // %%%%%%%%%%%%%%%%%%%%%%
        // RED BLACK: 

        // var numsToInsert = [66,44];
        // var tasks = [10,7,55,52,57,473,236,346,213,99,23,4,754,33,627,226,5,24,9,44,37,84,14,884];

        // var numsToInsert = [536, 877, 115, 428, 260, 122, 782, 397, 797, 237]
        // var tasks = [527,786,862]

        var numsToInsert = generateNumsToInsert(Math.floor(Math.random() * 10));
        var tasks = generateNumsForInsertTask(10);
        console.log(numsToInsert);

        // var numsToInsert = [574, 817, 153, 386, 224];
        // var numsToInsert = [23, 481, 680, 768, 266];
        // [158, 592, 741, 252, 63] too much expanded
        // var numsToInsert = [431, 979, 168, 481, 110];
        // var numsToInsert = [61,12]
        // [849, 208, 892, 787, 690, 175, 36] rotates correctly to a completely black tree, just how it should be
        // crossed links:
        // [400, 413, 52, 322, 720, 924, 445, 373, 804, 567] 
        // [739, 955, 671, 64, 142, 888, 362, 209, 399, 735]
        // nodes too near each other:
        // [711, 146, 102, 42, 118, 400, 913, 357, 702] 
        // [418, 339, 738, 32, 829, 803, 557, 657, 374, 816]
        // [993, 136, 517, 620, 275, 795, 268, 721, 108, 263]
        // [80, 323, 666, 406, 2, 127, 30, 762, 356, 620]

        // HOW IT IS:
        // this combo is an example when some tree branches do not expand and expand later
        // the whole combo inserted automatically looks fine
        // var numsToInsert = [66,44];
        // var tasks = [10,7,55,52,57];

        // HOW IT SHOULD BE:
        // the whole combo inserted automatically
        // var numsToInsert = [66,44,10,7,55,59, 57];
        // var tasks = [57];

        // var numsToInsert = [66,44,473, 236, 346, 213];
        // var numsToInsert = [66,88,33,11];
        // var numsToInsert = ['Y','L','P','M','X','H','C','R','A','E','S'];
        // var numsToInsert = [99,55,57,];
        
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

        var tree = new Tree(singleTon.redBlackColor2,this);
        // BST (intially an empty/null root node)
        tree.isRB = true;
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, node, rotateLeft, lkeyIsPressed, scene);
                scene.physics.add.overlap(player, node, rotateRight, rkeyIsPressed, scene);
                scene.physics.add.overlap(player, node, flipColors, fkeyIsPressed, scene);
                // redraw
                scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }

        function redrawTree(node) {
            // sometimes there is a problem when node is root so node parent doesn't exist
            console.log('something collided')
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.updateDistances(node.parent, node.posX);
            tree.redraw(this);
        }
                
       // *************** TASKS + TASK ACTIONS ***************

        // var tasks = [473, 236, 346, 213, 182, 75, 175, 290, 33,1,14,5,17,16,55,50,70,48,53,60,80,3,77];

        // elements to delete, one-by-one
        // var tasks = ['Min',48,'Max'];
        // var tasks = [99,6,3,1,42,48,25,7,9,8,0];
        // var tasks = [99,99,99,99,99,99,99,99,99,99]
        // var tasks = [408, 613, 779, 957, 813, 330, 461, 110, 695, 768]
        // var tasks = [33,1,14,5,17,16,55,50,70,48,53,60,80,3,77];
        // var tasks = generateNumsForInsertTask(50);

        // displays what operations needs to be performed by the player
        displayTask();

        //while there are still some tasks in the array, displays text indicating what needs to be done
        //when tasks is empty then press P to continue to next lesson
        function displayTask() {
            if (tasks.length != 0) { 
                panel.refreshTask('Insert ' + tasks[0]);
            } else {
                panel.allTasksDone();
                panel.task.setText('No more tasks!');
            }
        }

        function taskSucceededActions() {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tasks.shift();
        }

        // ************** INSERTION ***************

        function checkInsertion(player,nodeThatPlayerStandsOn) {
            checkInsertionH(tree.root,nodeThatPlayerStandsOn,player,this);
        }
   
        function checkInsertionH(node,nodeThatPlayerStandsOn,player,scene) {
            if (tasks.length != 0) {
                if (node.key == 'null') {
                    if (node == nodeThatPlayerStandsOn) {
                        insert(player,nodeThatPlayerStandsOn,scene);
                        panel.greenFeedback();
                    } else {
                        panel.redFeedback();
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    }
                } else if (node.key > tasks[0]) {
                    checkInsertionH(node.left,nodeThatPlayerStandsOn,player,scene);
                } else if (node.key < tasks[0]) {
                    checkInsertionH(node.right,nodeThatPlayerStandsOn,player,scene);
                }
            }  
        }

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

        function insert(player,node,scene) {
            if(node.key == 'null') {
                node.setKey(tasks[0]);
                node.setNodeGraphics();
                node.curtain.setVisible(false);

                node.isRed = true;
                node.changeLinkColour(scene);

                // create left child
                var childL = new NodeBST(scene, singleTon.redBlackColor, node.posX-tree.w, node.posY+tree.z, 'null',node.dpth+1,node,true);
                childL.distanceFromParent = -tree.w;
                tree.nodearray.push(childL);
                childL.drawLinkToParentRB(scene);

                // create right child
                var childR = new NodeBST(scene, singleTon.redBlackColor, node.posX+tree.w, node.posY+tree.z, 'null',node.dpth+1,node,true);
                childR.distanceFromParent = tree.w;
                tree.nodearray.push(childR);
                childR.drawLinkToParentRB(scene);

                node.setChildren(childL,childR);

                // teleporting + curtains
                childL.setPhysicsNode(cursors,player,scene);
                childR.setPhysicsNode(cursors,player,scene);

                // checks
                scene.physics.add.overlap(player, childL, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, childL, rotateLeft, lkeyIsPressed, scene);
                scene.physics.add.overlap(player, childL, rotateRight, rkeyIsPressed, scene);
                scene.physics.add.overlap(player, childL, flipColors, fkeyIsPressed, scene);
                scene.physics.add.overlap(player, childR, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, childR, rotateLeft, lkeyIsPressed, scene);
                scene.physics.add.overlap(player, childR, rotateRight, rkeyIsPressed, scene);
                scene.physics.add.overlap(player, childR, flipColors, fkeyIsPressed, scene);

                scene.physics.add.collider(player, childL);
                scene.physics.add.collider(player, childR);
                // redraw
                scene.physics.add.overlap(childL, tree.nodearray, redrawTree, null, scene);
                scene.physics.add.overlap(childR, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
            
                // update depth of the tree
                if (childL.dpth > tree.treedpth) {
                    tree.treedpth = childL.dpth;
                }

                //tree.checkRBLinks(node.parent);
                // do some flippin' until everything is correct  - a while loop until it breaks when everything is correct?
                //tree.check();
                tree.redraw(scene);
                
                // PLAY 'BACKSTREET BOYS - TELL ME WHY' HERE

                // DISABLE KEYBOARD
                scene.input.keyboard.enabled = false;

                node.nodeGraphics.setAlpha(0);
                node.keyString.setAlpha(0);
                node.curtain.setAlpha(0);
                childL.nullGraphics.setAlpha(0);
                childL.keyString.setAlpha(0);
                childL.link.setAlpha(0);
                childR.nullGraphics.setAlpha(0);
                childR.keyString.setAlpha(0);
                childR.link.setAlpha(0);

                scene.add.tween({
                    targets: [node.nodeGraphics, node.keyString, node.curtain, childL.nullGraphics, childL.keyString, childL.link, childR.nullGraphics, childR.keyString, childR.link],
                    ease: 'Sine.easeIn',
                    duration: 1000,
                    alpha: "+=1"
                });
                
                scene.time.addEvent({
                    delay: 1000,
                    callback: function(scene) {
                        taskSucceededActions();
                        displayTask(scene);
                        scene.input.keyboard.enabled = true;
                    },
                    args: [scene]
                });
            }
        }

        // ****DESTROY****

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();

        }


        // *****************************
        // *****************************
        // *************** RED_BLACK ***************
        // *****************************
        // *****************************


        // ************** ROTATE RIGHT ***************

        var rAllowed = false;
        function rkeyIsPressed() {
            var moveAllowed = false;
            if(keyR.isDown){
                rAllowed = true;
            }
            if (rAllowed && keyR.isUp) {
                moveAllowed = true;
                rAllowed = false;
            }
            return moveAllowed;
        }

        function updateLinksRight(node) {
            // node = 44
            // parentless node, belonged to 44 
            var oldR = node.right; // null
            var newNode = node.parent; // 66

            if (node.parent.parent == null) {
                node.parent = null;
                tree.root = node;
                // theoretically and practically we don't need to set the dpth, because updateNodeDepths does it for us
                tree.root.dpth = 0;
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

         
            tree.updateDistances(newNode,newNode.right.posX);          //66
            tree.updateNodeDepths(tree.root); 

            // update position of 44
            node.posX = newNode.posX;
            node.posY = newNode.posY;
        }

        // DONE - change so we click on the middle node
        function rotateRight(player, node) {                                
            if(node.parent != null && node.key != 'null' && node.left.isRed && node.isRed) {     // && !node.parent.right.isRed
                // node = 44
    
                // DISABLE KEYBOARD
                this.input.keyboard.enabled = false;
    
                // change links
                // update depths
                // find deepest node - NOT NEEDED SO FAR
                // updateDistances - for 66s branch only now, because 10 doesn't change anything
                updateLinksRight(node);

                // at this point all nodes behind the scenes are rotated properly and colors are switched, 
                // but graphics on the screen show the state before the rotation

                // OLD Now what should happen:           (NEW - we now also update invisible rectangles in order to allow them to collide)
                // one function updates posX and posY and then we animate the nodes (rectangle,nullGraphics,nodeGraphics,curtain,keyString)
                // then another function update the physics bodies
                // updatePos - set 44s position beforehand

                // update positions of nodes without moving them
                tree.updatePos(node);
                // update the rectangle positions and their physics bodies
                // this allows them to collide so then we can animate the nodes after their collision and tree expansion
                tree.updateRectanglePos(node);
                // set the player somewhere where it makes sense (the player still stands on nothing now)
                player.setPosition(node.posX, node.posY-BUFFER);

                // animate:
                // ATTENTION: the pointers are updated, but visuals on the game are the old ones

                // hide links (of nodes that change what they point to):
                this.add.tween({
                    targets: [node.link, node.right.link, node.right.left.link],
                    ease: 'Sine.easeOut',
                    delay: 500,
                    duration: 1000,
                    alpha: '-=1',
                });

                // NEW: create tweens to move the nodes and the links
                // OLD: destroy links (of nodes that DO NOT change what they point to):
                this.time.addEvent({
                    delay: 2000,
                    callback: function(scene,node) {
                        // tree.destroyLinks(node);
                        createMovingTweens(scene,node);     // NODES TWEENS IN HERE

                        // move player with the node
                        // scene.add.tween({
                        //     targets: player,
                        //     x: node.posX, 
                        //     y: node.posY - BUFFER,
                        //     ease: 'Power2',
                        //     duration: 1000
                        // });
                    },
                    args: [this,node]
                });

                this.time.addEvent({
                    delay: 4100,
                    callback: function(scene, node) {
                        // update physics bodies (basically we need to do this to move the curtain bodies)
                        tree.updateBodies(node);
                        // draw the links. It fixes for now the links that have a wrong angle and are too short
                        tree.drawLinksRB(scene, node);
                        // set the links that are changing to be invisible
                        node.link.setAlpha(0);
                        node.right.link.setAlpha(0);
                        node.right.left.link.setAlpha(0);
                        // appear the hidden links (the ones that changed)
                        scene.add.tween({
                            targets: [node.link, node.right.link, node.right.left.link],
                            ease: 'Sine.easeIn',
                            alpha: '+=1',
                            delay: 1000,
                            duration: 1000,
                        }); 
                    },
                    args: [this, node]
                });

                this.time.addEvent({
                    delay: 6200,
                    callback: function(scene) {
                        // ENABLE KEYBOARD
                        scene.input.keyboard.enabled = true;

                        // do panel and task stuff here
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        tree.redrawTweened(scene);
                    },
                    args: [this]
                });
            }
        }

        // ************* END (rotate right) ****************









        // ************** ROTATE LEFT ***************

        var lAllowed = false;
        function lkeyIsPressed() {
            var moveAllowed = false;
            if(keyL.isDown){
                lAllowed = true;
            }
            if (lAllowed && keyL.isUp) {
                moveAllowed = true;
                lAllowed = false;
            }
            return moveAllowed;
        }

        function updateLinksLeft(node){
            // node = 50
            // parentless node (30), belonged to 50 
            var oldR = node.left; // null
            var newNode = node.parent; // 44

            if (node.parent.parent == null) {
                node.parent = null;
                tree.root = node;
                // theoretically  and practically we don't need to set the dpth, because updateNodeDepths does it for us
                tree.root.dpth = 0;
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

            tree.updateDistances(newNode,newNode.right.posX);    //44
            tree.updateNodeDepths(tree.root); 

            // update position of 50
            node.posX = newNode.posX;
            node.posY = newNode.posY;
        }

        function rotateLeft(player, node) {                                
            if(node.key != 'null' && node.parent != null && node.isRed && node.parent.right == node) { // when the node we stand on is red and its link is a right leaning link
                // node = 50
    
                // DISABLE KEYBOARD
                this.input.keyboard.enabled = false;
    
                // change links
                // update depths
                // updateDistances - for 66s branch only now, because 10 doesn't change anything
                updateLinksLeft(node);

                // at this point all nodes behind the scenes are rotated properly and colors are switched, 
                // but graphics on the screen show the state before the rotation

                // OLD Now what should happen:           (NEW - we now also update invisible rectangles in order to allow them to collide)
                // one function updates posX and posY and then we animate the nodes (rectangle,nullGraphics,nodeGraphics,curtain,keyString)
                // then another function update the physics bodies
                // updatePos - set 44s position beforehand

                // update positions of nodes without moving them
                tree.updatePos(node);
                // set the player somewhere where it makes sense (the player still stands on nothing now)
                player.setPosition(node.posX, node.posY-BUFFER);
                // update the rectangle positions and their physics bodies
                // this allows them to collide so then we can animate the nodes after their collision and tree expansion
                tree.updateRectanglePos(node);
                // findDeepestNodeFromTheNodeWeCalledOpOnAndUpdateDistances(node);

                // animate:
                // ATTENTION: the pointers are updated, but visuals on the game are the old ones

                // hide links (of nodes that change what they point to):
                this.add.tween({
                    targets: [node.link, node.left.link, node.left.right.link],
                    ease: 'Sine.easeOut',
                    delay: 500,
                    duration: 1000,
                    alpha: '-=1',
                });

                // NEW: create tweens to move the nodes and the links
                // OLD: destroy links (of nodes that DO NOT change what they point to):
                this.time.addEvent({
                    delay: 2000,
                    callback: function(scene,node) {
                        // tree.destroyLinks(node);
                        createMovingTweens(scene,node);     // NODES TWEENS IN HERE
                    },
                    args: [this,node]
                });

                this.time.addEvent({
                    delay: 4100,
                    callback: function(scene, node) {
                        // update physics bodies (basically we need to do this to move the curtain bodies)
                        tree.updateBodies(node);
                        // draw the links. It fixes for now the links that have a wrong angle and are too short
                        tree.drawLinksRB(scene, node);
                        // set the links that are changing to be invisible
                        node.link.setAlpha(0);
                        node.left.link.setAlpha(0);
                        node.left.right.link.setAlpha(0);
                        // appear the hidden links (the ones that changed)
                        scene.add.tween({
                            targets: [node.link, node.left.link, node.left.right.link],
                            ease: 'Sine.easeIn',
                            alpha: '+=1',
                            delay: 1000,
                            duration: 1000,
                        }); 
                    },
                    args: [this, node]
                });

                this.time.addEvent({
                    delay: 6200,
                    callback: function(scene,node) {
                        // ENABLE KEYBOARD
                        scene.input.keyboard.enabled = true;
                        // do panel and task stuff here
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        // tree.updateDistances(node.left.left.left,node.left.left.left.right.posX);
                        tree.redrawTweened(scene);
                    },
                    args: [this,node]
                });
            }
        }

        // ********* END (RotateLeft)







        // ************** FLIP COLORS ***************

        var fAllowed = false;
        function fkeyIsPressed() {
            var moveAllowed = false;
            if(keyF.isDown){
                fAllowed = true;
            }
            if (fAllowed && keyF.isUp) {
                moveAllowed = true;
                fAllowed = false;
            }
            return moveAllowed;
        }

        function flipColors(player,node) {
            if(node.key != 'null' && node.left.isRed && node.right.isRed){
                if (node != tree.root) {            // if node is not root then make it red
                    node.isRed = true;
                    node.drawLinkToParentRB(this);
                } else {                            // if node is root then leave it black (better-safe-than-sorry code)
                    node.isRed = false;
                }
        
                node.left.isRed = false;
                node.right.isRed = false;
                node.left.drawLinkToParentRB(this);
                node.right.drawLinkToParentRB(this);
            }
        }

        // function flipColors(player,node) {
        //     if(node.left.isRed && node.right.isRed){
        //         // does the root always have to be black? if so then here we need to check that if the node is the root then don't change it to red
        //         // DISABLE KEYBOARD
        //         this.input.keyboard.enabled = false;

        //         this.time.addEvent({
        //             delay: 1000,
        //             callback: function(node, scene) {
        //                 if (node != this.root) {            // if node is not root then make it red
        //                     node.isRed = true;
        //                 } else {                            // if node is root then leave it black (better-safe-than-sorry code)
        //                     node.isRed = false;
        //                 }
                
        //                 node.left.isRed = false;
        //                 node.right.isRed = false;
        //                 tree.redraw(scene);
        //             },
        //             args: [node, this]
        //         });
    
        //         this.time.addEvent({
        //             delay: 2000,
        //             callback: function(scene) {
        //                 scene.input.keyboard.enabled = true;
        //             },
        //             args: [this]
        //         });
        //     }
        // }
        // ************** END (flip colors) ***************





        // ************** HELPER TO CREATE TWEENS FOR MOVING ***************

        // loop through a selected tree branch and create for each node:
        //      a tween that moves the node done
        //      a tween that moves the link done
        //      a tween that rotates the link that needs rotation done
        //      a tween that extends a link that needs extensions  -  TODO
        function createMovingTweens(scene,node) {     // but not moving the rectangle
            if (node != null) {

                // move node graphics
                scene.add.tween({
                    targets: [node.nodeGraphics, node.nullGraphics, node.curtain, node.keyString],
                    x: node.posX, 
                    y: node.posY,
                    ease: 'Power2',
                    duration: 1000
                });

                // move node link, rotate it and extend it
                if (node.link != null) {

                    var N = node.distanceFromParent;
    
                    var O = null;
                    if (node.distanceFromParent < 0) {
                        O = (node.link.x - node.link.width) - node.link.x;
                    } else {
                        O = (node.link.x + node.link.width) - node.link.x;
                    }
                    
                    var oldAngle = calcAngle(tree.z,O);
                    var newAngle = calcAngle(tree.z,N);
                    var difference = oldAngle - newAngle;
                    
                    scene.add.tween({
                        targets: node.link,
                        x: node.posX, 
                        y: node.posY,
                        ease: 'Power2',
                        duration: 1000
                    });
                    
                    if (difference != 0 && node.link.alpha == 1) {
                        // ROTATION TWEEN:
                        scene.add.tween({
                            targets: node.link,
                            angle: -difference,
                            ease: 'Sine.easeInOut',
                            duration: 1000,
                            onComplete: drawLink,
                            onCompleteParams: [node,scene]
                        });
                        
                        function drawLink(tween,targets,node,scene) {
                            node.drawLinkToParentRB(scene);
                        }
                    } 
                }

                createMovingTweens(scene,node.left);
                createMovingTweens(scene,node.right);
            }
        }

        function calcAngle(z,smth) {
            return Math.atan(z/smth) * (180/Math.PI);
        }

        // ******* END (createMovingTweens)


        // helper functions that were used when fixing tree expansion
        
        // function findDeepestNodeFromTheNodeWeCalledOpOnAndUpdateDistances(node) {
        //     if (node != null) {
        //         // console.log('node depth ' + node.dpth);
        //         // console.log('tree depth ' + tree.treedepth)
        //         if (node.key == 'null' && node.dpth == tree.treedpth && node.distanceFromParent > 0){
        //             // console.log('doing update distances on ' + node.parent.key);
        //             // console.log('nulls dfp ' + node.distanceFromParent);
        //             tree.updateDistances(node.parent,node.posX);
        //         }
        //         findDeepestNodeFromTheNodeWeCalledOpOnAndUpdateDistances(node.left);
        //         findDeepestNodeFromTheNodeWeCalledOpOnAndUpdateDistances(node.right);
        //     }
        // }

        // function traverse(node) {
        //     if (node != null) {
        //         if (node.key == 10 || node.key == 52 || node.key == 44) {
        //             console.log(node.distanceFromParent);
        //         }
        //         traverse(node.left);
        //         traverse(node.right);
        //     }
        // }
    }

    update(time,delta) {
        controls.update(delta);
    }
}
