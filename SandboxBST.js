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

// for task generation
var opNames = ['Insert ', 'Delete '];

// for deletion
var nodeToDelete = null;

export class SandboxBST extends Phaser.Scene {

    constructor() {
        super({ key:'SandboxBST' });
    }

    preload() {
        // *************INIT HELP BUBBLE*************
        this.scene.remove('HelpBubble_keyboard');
        this.helpBubble_key = 'HelpBubble_keyboard';
        this.helpBubble_scene = new HelpBubble('HelpBubble_keyboard');
        this.helpBubble = this.scene.add(this.helpBubble_key, this.helpBubble_scene, true);
        this.helpBubble.setHelp('keyboard_BST');

        // *************INIT PANEL AND EXPERT*************
        this.scene.remove('SandboxPanel');
        this.scene.remove('ExpertAlien');
        panel = this.scene.add('SandboxPanel', SandboxPanel, true);
        expert = this.scene.add('ExpertAlien', ExpertAlien, true);
        panel.setLevelName('Practice BST');
    }

    create() {

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background_planet_purple').setDepth(-1);

        // var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // spacebar.on('down', () => {

        // });

        // Restart the current scene
        var keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        keyN.on('down', () => {
            destroyEverything();
            this.scene.restart('SandboxBST');
            this.input.keyboard.removeAllKeys(true);
        });

        var keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEsc.on('down', () => {
            this.scene.stop('SandboxPanel');
            this.scene.stop('ExpertAlien');
            this.scene.stop('HelpBubble_keyboard');
            this.scene.stop();
            this.scene.wake('SandboxMenu');
            this.scene.wake('HelpBubble_sandbox');
            this.input.keyboard.removeAllKeys(true);
        });

        // *************PLAYER*************
        var player = this.physics.add.sprite(10_000, 100, 'onion');
        player.setBounce(0.1);

        // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        var keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        var keybackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        // press Z to see next tasks - only for demonstration purposes
        // var keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // keyZ.on('down', () => {
        //     ops.shift();
        //     tasks.shift();
        //     panel.refreshTask(ops[0] + tasks[0]);
        // });

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

        this.cameras.main.setBounds(0,0, 20_000, 20_000);
        this.cameras.main.startFollow(player, true, 0.05, 0.05);
        this.cameras.main.zoom = 0.6;

        // ************* NUMBERS TO INSERT *************

        // TOO LARGE DISTANCES IN EXPANSION - still is a problem
        // the order and amount of checks of collisions and crossings in the insert automatic changes the distances in many different ways for the first case below
        // var numsToInsert = [538,334,611,174,896,648,432,35,146,678,820,269,93,68,270,339,33,890,12,623,24,733,133,213,441,127,746,507,947,374,867,846,860,930,882,818,626,367,377,997,679,798,790,587,761,881,710,254,98,651]
        // var numsToInsert = [123, 212, 535, 415, 51, 214, 524, 612, 869, 539, 72, 201, 901, 281, 987, 94, 623, 409, 522, 226, 21, 68, 247, 413, 443, 658, 293, 666, 942, 286, 318, 430, 260, 742, 904, 48, 638, 862, 139, 322, 511, 808, 466, 22, 575, 508, 773, 28, 974, 252]
        // var numsToInsert = [493, 556, 736, 218, 622, 773, 747, 457, 534, 751, 270, 638, 436, 165, 524, 520, 723, 645, 124, 444, 226, 328, 992, 714, 366, 212, 879, 891, 702, 511, 475, 613, 499, 991, 311, 872, 562, 908, 744, 320, 987, 459, 496, 529, 452, 988, 17, 748, 49, 58]        
        // var numsToInsert = [107, 963, 607, 171, 895, 602, 217, 355, 269, 309, 721, 244, 935, 713, 83, 592, 827, 323, 763, 953, 451, 443, 897, 877, 943, 878, 537, 639, 645, 155, 322, 614, 272, 260, 966, 248, 870, 223, 18]
        
        // var ops = ["Delete "]
        // var tasks = ['Min']

        // *********************
        // THINGS THAT GO WRONG IN EXPANSION:

        // NODES MERGE UPON LOADING:
        // check collisions on children again(4 times in total) in insertion? if added - check with the cases above.
        // var numsToInsert = [323, 240, 918, 907, 582, 814, 21, 944, 428, 855, 174, 959, 908, 943, 778, 3, 209, 71, 949, 49, 107, 511, 766, 234, 834, 259, 830, 47, 677, 93, 730, 178, 284, 64, 161, 75, 972, 424, 479, 436, 326, 277, 6, 207, 926, 689, 9, 160, 70, 488]
        // right branch expands too much:
        // var numsToInsert = [190, 795, 717, 247, 431, 775, 322, 682, 857, 994, 563, 375, 672, 704, 729, 344, 364, 255, 211, 804, 642, 593, 420, 232, 544, 471, 280, 278, 291, 342, 581, 560, 43, 286, 788, 650, 659, 198, 721, 348, 499, 709, 381, 140, 343, 630, 164, 737, 512, 241];

        // var ops = ["Delete "]
        // var tasks = ['Min']

        // *********************

        // SOME INTERESTING CASES:

        // case of a tree when nodes are inserted more down than to the sides:
        // var numsToInsert = [972, 19, 296, 381, 62, 264, 937, 660, 526, 263, 534, 744, 524, 949, 68, 868, 620, 667, 506, 717, 578, 160, 392, 842, 166, 224, 175, 181, 290, 170, 649, 97, 194, 893, 541, 507, 730, 466, 719, 134, 656, 653, 711, 344, 941, 417, 992, 220, 953];
        
        // when inserted node expands (player moves together):
        // var numsToInsert =  [172, 747, 794, 125, 267, 507, 661, 662, 396, 986, 136, 889, 385, 344, 360, 930, 8, 33, 587, 873, 327, 15, 21, 629, 669, 134, 616, 210, 592, 139];
        // var ops = ["Insert "]
        // var tasks = [998]

        // upon expansion there is another collision, but doesn't expand (fixed by adding additional collision checks for inserted node's children - but not sure if that's good):
        // var numsToInsert = [618, 956, 989, 793, 572, 979, 205, 446, 310, 655, 271, 166, 275, 31, 802, 713, 395, 414, 90, 129, 885, 823, 450, 304, 445, 895, 385, 935, 53]
        // var ops = ["Insert "]
        // var tasks = [577]

        // *********************

        // *********************DELETION problems

        // delete 766 - case when node is deleted with one child and the branch moves up and collides - FIXED, BUT...
        // BUT - the link appears or extends too early compared to the expansion - cosmetic problem
        // var numsToInsert = [763, 752, 532, 588, 288, 987, 561, 122, 539, 875, 109, 584, 558, 766, 708, 996, 100, 160, 414, 196, 849, 839, 828, 495, 15, 274, 927, 117, 817, 99, 424, 383, 518, 381, 705, 842, 286, 475, 600, 214, 453, 393, 943, 147, 598, 295, 287, 978, 377, 920];
        // var ops = ["Delete "]
        // var tasks = [766]

        // delete 252 - case when min's right moves up and collides then expands (can fix with timing?)
        // var numsToInsert = [600, 808, 28, 451, 558, 952, 252, 684, 30, 453, 784, 192, 99, 115, 422, 2, 498, 917, 824, 963, 279, 618, 142, 149, 1, 669, 930, 659, 965, 581, 426, 119, 336, 69, 14, 535, 820, 389, 299, 122, 64, 864, 18, 556, 740, 985, 935, 663, 868];
        // var ops = ["Delete "]
        // var tasks = [252]
        
        // ************* GENERATE RANDOM TREE & TASKS *************

        // generates a random tree from 0 to 30 nodes
        var numsToInsert = generateNumsToInsert(Math.random() * 30);
        var ops = [];
        var tasks = [];
        generateTasks(20);
        
        console.log(numsToInsert);
        console.log(ops);
        console.log(tasks);

        // generateTasks(n)
        // combine genNums/numsToInsert and ops
            // if ops is Delete -> 
                // if chance is for min/max
                    // then add min/max
                    // remove min key/max key from treeNodes
                // else
                    // generate a random index to select a key from treeNodes
                    // select key from treeNodes and add to tasks
                    // remove that key from treeNodes
            // else if treeNodes is empty (Insertion)-> 
                // change Delete to Insert in ops
                // add Insertion task from randomly generated numbers genNums
                // add that number to treeNodes
            // else if ops is Insert -> 
                // get random key from genNums and add to tasks
                // add that key to treeNodes

        function generateTasks(n) {
            // generate n random numbers for tasks (this also checks that the random num doesn't exist in the tree)
            var genNums = [];
            while(genNums.length < n) {
                var number = Math.floor(Math.random() * (999 - 1) + 1);
                if(!genNums.includes(number) && !numsToInsert.includes(number)){
                    genNums.push(number);
                }
            }

            // populate ops
            var i;
            for(i=0;i<n;i++){
                var opIndex = Math.floor(Math.random() * opNames.length);
                ops.push(opNames[opIndex]);
            }

            // populate tasks
            var treeNodes = [...numsToInsert];
            var j = 0;
            while (tasks.length < n) {
                if (ops[j] == 'Delete ' && treeNodes.length != 0) {
                    var chanceOfminmax = Math.random();
                    if(chanceOfminmax < 0.2) {          // add a Min / Max task if the chance < 0.2 (20% chance to generate Min/Max task) (on average generates from 0 to 5 min/max ops)
                        if (chanceOfminmax < 0.05) {  // add Min task
                            tasks[j] = 'Min';
                            treeNodes.sort((a, b) => a - b).shift();
                        } else {                            // add Max task
                            tasks[j] = 'Max';
                            treeNodes.sort((a, b) => a - b).pop();
                        }
                    } else {                                // add Delete task
                        var index = Math.floor(Math.random() * treeNodes.length);
                        tasks[j] = treeNodes[index];
                        treeNodes.splice(index,1);
                    }
                } else if (treeNodes.length == 0) {         // add Insert task
                    ops[j] = 'Insert ';   // if task is Delete then change to Insert
                    tasks[j] = genNums[j];
                    treeNodes.push(genNums[j]);
                } else {                                    // add Insert task
                    tasks[j] = genNums[j];
                    treeNodes.push(genNums[j]);
                }
                j++;
            }
        }

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

        var tree = new Tree(singleTon.sandboxBSTColor,this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);


        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, node, deleteNode, backspaceIsPressed, scene);
                scene.physics.add.overlap(player, node, checkAndDeleteSecondNode, mIsPressed, scene);
  
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }
        
       // *************** TASKS + TASK ACTIONS ***************

        displayTask();
 
        function displayTask() {
            if (tasks.length != 0) { 
                panel.refreshTask(ops[0] + tasks[0]);
            } else {
                panel.allTasksDone();
            }
        }

        function taskSucceededActions() {
            panel.greenFeedback();
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.closeCurtains();
            ops.shift();
            tasks.shift();
            displayTask();
        }

        function taskFailedActions() {
            panel.redFeedback();
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.closeCurtains();
        }

        // ************************** PROCESS CALLBACKS FOR OVERLAPS ******************************

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

        var mAllowed = false;
        function mIsPressed() {
            var moveAllowed = false;
            if(keyM.isDown){
                mAllowed = true;
            }
            if (mAllowed && keyM.isUp) {
                moveAllowed = true;
                mAllowed = false;
            }
            return moveAllowed;
        }

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


        // ************************** INSERTION ******************************

        function checkInsertion(player,nodeThatPlayerStandsOn) {
            checkInsertionH(tree.root,nodeThatPlayerStandsOn,player,this);
        }

        function checkInsertionH(node, nodeThatPlayerStandsOn, player,scene) {
            if (tasks.length != 0) {
                if (node.key == 'null') {
                    if (node == nodeThatPlayerStandsOn) {
                        insert(player,nodeThatPlayerStandsOn,scene);
                        scene.time.addEvent({
                            delay: 1500,
                            callback: function(scene) {
                                taskSucceededActions();
                                scene.input.keyboard.enabled = true;
                            },
                            args: [scene]
                        });
                    } else {
                        taskFailedActions();
                    }
                } else if (node.key > tasks[0]) {
                    checkInsertionH(node.left,nodeThatPlayerStandsOn,player,scene);
                } else if (node.key < tasks[0]) {
                    checkInsertionH(node.right,nodeThatPlayerStandsOn,player,scene);
                }
            } else {
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                tree.closeCurtains();
            }
        }

        function insert(player,node, scene) {
            if(node.key == 'null') {
                node.setKey(tasks[0]);
                node.setNodeGraphics();
                node.curtain.setVisible(false);

                // create left child
                var childL = new NodeBST(scene, singleTon.sandboxBSTColor, node.posX-tree.w, node.posY+tree.z, 'null',node.dpth+1,node,false);
                childL.distanceFromParent = -tree.w;
                childL.drawLinkToParent(scene);
                tree.nodearray.push(childL);

                // create right child
                var childR = new NodeBST(scene, singleTon.sandboxBSTColor, node.posX+tree.w, node.posY+tree.z, 'null',node.dpth+1,node,false);
                childR.distanceFromParent = tree.w;
                childR.drawLinkToParent(scene);
                tree.nodearray.push(childR);

                node.setChildren(childL,childR);

                tree.checkCollisions(childL);
                tree.checkCollisions(childR);

                // teleporting + curtains
                childL.setPhysicsNode(cursors,player,scene);
                childR.setPhysicsNode(cursors,player,scene);

                // checks
                scene.physics.add.overlap(player, childR, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, childR, deleteNode, backspaceIsPressed, scene);
                scene.physics.add.overlap(player, childR, checkAndDeleteSecondNode, mIsPressed, scene);

                scene.physics.add.overlap(player, childL, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, childL, deleteNode, backspaceIsPressed, scene);
                scene.physics.add.overlap(player, childL, checkAndDeleteSecondNode, mIsPressed, scene);

                scene.physics.add.collider(player, childL);
                scene.physics.add.collider(player, childR);
            
                // update depth of the tree
                if (childL.dpth > tree.treedpth) {
                    tree.treedpth = childL.dpth;
                }

                tree.traverseAndCheckCollisions(scene);
                tree.traverseAndCheckCrossings(scene);

                // added these because sometimes after expansion there is a collision and no second expansion to fix that (check SOME INTERESTING CASES for a case)
                tree.checkCollisions(childL);
                tree.checkCollisions(childR);

                // Non-animated expansion:
                // tree.redraw(scene);

                // Animated expansion:
                // move player with inserted node (sometimes it happens that inserted node moves)
                scene.add.tween({
                    targets: player,
                    x: node.posX,
                    y: node.posY - BUFFER,
                    ease: 'Power2',
                    duration: 1000,
                });
                tree.redrawTweened(scene);

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
                    duration: 1500,
                    alpha: "+=1"
                });
            }
        }

        // ***************************** DELETION *********************************

        // code for deletion when both children are null and one child is null, min, max (and only SELECTION when both children are NOT null)
        function deleteNode(player, node) {
            if (nodeToDelete == null && tasks.length != 0) {

                if (node.key != 'null' && (tasks[0] == node.key || (tasks[0] == 'Min' && node.key == min(tree.root)) || (tasks[0] == 'Max' && node.key == max(tree.root))) && nodeToDelete == null) {     // check deletion of no children, one child, min, max

                    if (node.left.key =='null' && node.right.key =='null') {                             //  both children are null 

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.parent != null) {
                            player.setPosition(node.parent.posX,node.parent.posY-BUFFER);
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
                            alpha: '+=1'
                        });

                        this.time.addEvent({
                            delay: 4000,
                            callback: function(scene) {
                                taskSucceededActions();
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });

                    } else if (node.right.key == 'null' || node.left.key  == 'null') {                                  // one child is null

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.right.key == 'null') {                                 // right child is null

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
                                },
                                args: [node,this]
                            });

                            // appear link that changed
                            this.time.addEvent({
                                delay: 2500,
                                callback: function(scene,node) {
                                    node.left.drawLinkToParent(scene);
                                    node.left.link.setAlpha(0);
                                    scene.add.tween({
                                        targets: node.left.link,
                                        ease: 'Sine.easeIn',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });
                                },
                                args: [this,node]
                            });

                            // move player to root, update tasks, enable keyboard
                            this.time.addEvent({
                                delay: 3500,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redrawTweened(scene);
                                    node.right.destroyNode();
                                    node.destroyNode();

                                },
                                args: [this]
                            });

                        } else {                                                            // left child is null

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
                                },
                                args: [node,this]
                            });

                            // appear link that changed
                            this.time.addEvent({
                                delay: 2500,
                                callback: function(scene,node) {
                                    node.right.drawLinkToParent(scene);
                                    node.right.link.setAlpha(0);
                                    scene.add.tween({
                                        targets: node.right.link,
                                        ease: 'Sine.easeIn',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });
                                },
                                args: [this,node]
                            });

                            this.time.addEvent({
                                delay: 3500,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redrawTweened(scene);
                                    node.left.destroyNode();
                                    node.destroyNode();
                                },
                                args: [this]
                            });
                        } //end of if else
     
                        // move player to root, update tasks, enable keyboard
                        this.time.addEvent({
                            delay: 4500,
                            callback: function(scene) {
                                taskSucceededActions();
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });

                    } else {                                                                    // both children are NOT null
                        // setting a value of nodeToDelete to use it after user clicks Enter
                        nodeToDelete = node;
                        nodeToDelete.nodeGraphics.setTint(0x00fbff);  // 0xff0090
                    }
                } else {
                    taskFailedActions();
                }
            } else {
                // when no more tasks
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                tree.closeCurtains();
            }
        }

        // code for deletion when both children are NOT null
        // Main cases:
            // if the right child has nothing on the left
            // if the right child has a left child and it has nulls
            // Other cases:
            // if the right child has left child and it has right subtree
        function checkAndDeleteSecondNode(player, node){
            if(nodeToDelete != null && node.key != 'null'){
                var key = min(nodeToDelete.right);
                if(node.key == key){                // if selected min equals the correct min

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
                                node.left.destroyNode();
                                node.left = null;
                                node.parent = nodeToDelete.parent;
                                node.dpth = nodeToDelete.dpth;
                            },
                            args: [nodeToDelete,node]
                        });

                        this.time.addEvent({
                            delay: 2500,
                            callback: function(nodeToDelete,node) {
                                var distanceX = Math.abs(nodeToDelete.posX-node.posX);
                                // Version 2
                                updateBranch(node,distanceX);
                            },
                            args: [nodeToDelete,node]
                        });

                        // Version 2
                        this.time.addEvent({
                            delay: 3000,
                            callback: function(nodeToDelete,node,scene) {
                                var distanceX = Math.abs(nodeToDelete.posX-node.posX);

                                if (nodeToDelete == tree.root) { // if deleted node is root
                                    tree.root = node;
                                    tree.root.parent = null;
                                    node.left = nodeToDelete.left;
                                    node.left.parent = node;
                                } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                                    node.left = nodeToDelete.left;
                                    node.left.parent = node;
                                    node.parent.right = node;
                                } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                                    node.left = nodeToDelete.left;
                                    node.left.parent = node;
                                    node.parent.left = node; 
                                }
                                node.distanceFromParent = nodeToDelete.distanceFromParent;
                                tree.updateNodeDepths(tree.root);

                                tree.traverseAndCheckCollisions(scene);
                                tree.traverseAndCheckCrossings(scene);

                                scene.add.tween({
                                    targets: player,
                                    x: node.posX,
                                    y: node.posY - BUFFER,
                                    ease: 'Power2',
                                    duration: 1500,
                                });

                                actuallyMoveBranch(node,distanceX,scene);

                                // TODO: ROTATE node.right.link and after it is rotated then redraw to extend:
                                // node.right.link.setAlpha(0);
                                // move node link, rotate it and extend it
                                if (node.key != tree.root.key && node.right.link != null) {
                                    var N = node.right.distanceFromParent;
                    
                                    var O = null;
                                    if (node.right.distanceFromParent < 0) {
                                        O = (node.right.link.x - node.right.link.width) - node.right.link.x;
                                    } else {
                                        O = (node.right.link.x + node.right.link.width) - node.right.link.x;
                                    }
                                    
                                    var oldAngle = calcAngle(tree.z,O);
                                    var newAngle = calcAngle(tree.z,N);
                                    var difference = oldAngle - newAngle;
                                    
                                    scene.add.tween({
                                        targets: node.right.link,
                                        x: node.right.posX, 
                                        y: node.right.posY,
                                        ease: 'Power2',
                                        duration: 1500
                                    });
                                    
                                    if (difference != 0) {
                                        // LINK ROTATION TWEEN:
                                        scene.add.tween({
                                            targets: node.right.link,
                                            angle: -difference,
                                            ease: 'Sine.easeInOut',
                                            duration: 1500,
                                            onComplete: drawLink,
                                            onCompleteParams: [node.right,scene]
                                        });
                                        
                                        function drawLink(tween,targets,node,scene) {
                                            node.drawLinkToParent(scene);
                                        }
                                    }
                                }
                            },
                            args: [nodeToDelete,node,this]
                        });

                        // need to appear movedNodes's link to parent and left link
                        this.time.addEvent({
                            delay: 4500,
                            callback: function(node,scene) {
                                node.drawLinkToParent(scene);
                                node.link.setAlpha(0);
                                node.left.drawLinkToParent(scene);
                                node.left.link.setAlpha(0);
                                scene.add.tween({
                                    targets: [node.link, node.left.link],
                                    ease: 'Sine.easeIn',
                                    duration: 1000,
                                    alpha: '+=1'
                                });
                                
                            },
                            args: [node,this]
                        });
                        // end of Version 2

                        this.time.addEvent({
                            delay: 5600,
                            callback: function(node,scene) {
                                nodeToDelete.destroyNode();
                                nodeToDelete = null;
                                tree.updateNodeDepths(node);

                                // Version 2
                                // A way to move the branch together with already expanded branch:
                                // in moveBranch only update the posX
                                // then check for collisions
                                // then actually move the branch nodes (change x to updated posX)
                                // redraw
                                tree.traverseAndCheckCollisions(scene);
                                tree.traverseAndCheckCrossings(scene);
                                tree.redrawTweened(scene);
                            },
                            args: [node,this]
                        });

                        this.time.addEvent({
                            delay: 6700,
                            callback: function(scene) {
                                taskSucceededActions();
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
                                    // make null
                                    var childL = new NodeBST(scene, singleTon.sandboxBSTColor, node.parent.posX-tree.w, node.parent.posY+tree.z, 'null',node.parent.dpth+1,node.parent,false);
                                    childL.distanceFromParent = -tree.w;
                                    childL.drawLinkToParent(scene);
                                    node.parent.left = childL;
                                    childL.nullGraphics.setAlpha(0);
                                    childL.keyString.setAlpha(0);
                                    childL.link.setAlpha(0);

                                    tree.checkCollisions(childL);

                                    // teleporting + curtains
                                    childL.setPhysicsNode(cursors,player,scene);

                                    // physics
                                    scene.physics.add.overlap(player, childL, checkInsertion, enterIsPressed, scene);
                                    scene.physics.add.overlap(player, childL, deleteNode, backspaceIsPressed, scene);
                                    scene.physics.add.overlap(player, childL, checkAndDeleteSecondNode, mIsPressed, scene);
                                    scene.physics.add.collider(player, childL);
                                    
                                    node.left.destroyNode();
                                    node.right.destroyNode();
                                    node.left = null;
                                    node.right = null;
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
                                        y: nodeToDelete.keyString.y,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    //update physics bodies
                                    scene.time.addEvent({
                                        delay: 1500,
                                        callback: function(node,scene) {
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

                                    // draw 16s link to parent
                                    node.drawLinkToParent(scene);
                                    node.link.setAlpha(0);
                                    
                                    if (node.parent != null) {
                                        scene.add.tween({
                                            targets: [node.link],
                                            delay: 1000,
                                            ease: 'Sine.easeIn',
                                            duration: 1000,
                                            alpha: '+=1'
                                        });
                                    }

                                    scene.add.tween({
                                        targets: [node.left.link, node.right.link, nodeToUseForAppear.left.link], //node.right.left.link
                                        delay: 1000,
                                        ease: 'Sine.easeIn',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    tree.updateNodeDepths(tree.root);
                                    nodeToDelete.destroyNode();
                                },
                                args: [nodeToUseForAppear,nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 7000,
                                callback: function(node,scene) {
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redrawTweened(scene);
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
                                    node.left = null;
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
                                        y: nodeToDelete.keyString.y,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    // draw 11s link to parent, update physics bodies
                                    scene.time.addEvent({
                                        delay: 1500,
                                        callback: function(node,scene) {
                                            node.body.updateFromGameObject();
                                            node.curtain.body.updateFromGameObject();
                                        },
                                        args: [node,scene]
                                    });

                                },
                                args: [nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 4500,
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

                                    tree.updateNodeDepths(tree.root);

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    actuallyMoveBranch(nodeToUseForAppear.left,distanceX,scene); //v2

                                    node.drawLinkToParent(scene);
                                    node.link.setAlpha(0);
                                    nodeToUseForAppear.left.drawLinkToParent(scene);
                                    nodeToUseForAppear.left.link.setAlpha(0);
                                    
                                    if (node.parent != null) {
                                        scene.add.tween({
                                            targets: [node.link],
                                            delay: 1500,
                                            ease: 'Sine.easeOut',
                                            duration: 1000,
                                            alpha: '+=1'
                                        });
                                    }

                                    scene.add.tween({
                                        targets: [node.left.link, node.right.link, nodeToUseForAppear.left.link], //node.right.left.link
                                        delay: 1500,
                                        ease: 'Sine.easeOut',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    nodeToDelete.destroyNode();
                                },
                                args: [nodeToUseForAppear,nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 7000,
                                callback: function(node,scene) {
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redrawTweened(scene);    
                                },
                                args: [node,this]
                            });

                        } //end of else if

                        this.time.addEvent({
                            delay: 8000,
                            callback: function(scene) {
                                taskSucceededActions();
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });
                    } //end of else if

                } else {
                    panel.redFeedback();
                    player.setPosition(nodeToDelete.x,nodeToDelete.y-BUFFER);
                    tree.closeCurtains();
                }
            }
        }


        // ************************** HELPERS + AUX ******************************

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
                scene.add.tween({
                    targets: [node, node.nodeGraphics, node.nullGraphics, node.curtain, node.keyString],
                    x: node.posX,
                    y: node.posY,
                    ease: 'Power2',
                    duration: 1500,
                });

                // move links
                if (node.link != null) {
                    scene.add.tween({
                        targets: node.link,
                        x: node.posX, 
                        y: node.posY,
                        ease: 'Power2',
                        duration: 1500
                    });
                }

                scene.time.addEvent({
                    delay: 1500,
                    callback: function(node) {
                        node.body.updateFromGameObject();
                        node.curtain.body.updateFromGameObject();
                    },
                    args: [node]
                });

                actuallyMoveBranch(node.left,distanceX,scene);
                actuallyMoveBranch(node.right,distanceX,scene);
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
                }
            }
            return keyToReturn;
        }

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
                }
            }
            return keyToReturn;
        }

        // Used to calculate angle for Link rotation tween
        function calcAngle(z,smth) {
            return Math.atan(z/smth) * (180/Math.PI);
        }

        function printBST(node) {
            if (node != null) {
                console.log(node.key + ":");
                console.log("x: "+ node.x +" posX: " + node.posX);
                console.log("y: "+ node.x +" posY: " + node.posX);
                printBST(node.left);
                printBST(node.right);
            }
        }

        // How to delay functions:
        // usage of time.addEvent
        // this.time.addEvent({
        //     delay: 1900,
        //     callback: console.log,
        //     args: ["TELL ME WHY"]
        // });

        function checking(node) {
            if (node != null) {
                // console.log("Key: " + node.key + " x: " + node.posX);
                if (node.key == 80) {
                    console.log("80");
                    node.left.setPosition(100,100);
                }
                checking(node.left);
                checking(node.right);
            }
        }

        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();       
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
        }
    }

    update(time,delta) {
        controls.update(delta);
    }
}
