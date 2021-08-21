import { Tree } from './Tree.js';
import { PlayPanel } from './PlayPanel.js';
import { ExpertAlien } from './ExpertAlien.js';
import { HelpBubble } from './HelpBubble.js';
import { NodeBST } from './NodeBST.js';

var panel;
var expert;
var controls;

var numsToInsert;
var ops = [];
var tasks = [];

export class Play extends Phaser.Scene {

    constructor() {
        super({ key:'Play' })
    }

    init(data) {
        this.db = data.database;
    }
    
    preload() {

        // *************INIT HELP BUBBLE*************
        this.scene.remove('HelpBubble_play');
        this.helpBubble_key = 'HelpBubble_play';
        this.helpBubble_scene = new HelpBubble('HelpBubble_play');
        this.helpBubble = this.scene.add(this.helpBubble_key, this.helpBubble_scene, true);
        this.helpBubble.setHelp('play');

        // *************INIT PANEL AND EXPERT*************
        this.scene.remove('PlayPanel');
        this.scene.remove('ExpertAlien');
        panel = this.scene.add('PlayPanel', PlayPanel, true);
        expert = this.scene.add('ExpertAlien', ExpertAlien, true);

    }

    create() {
        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        this.background = this.add.image(10_000,750,'background_planet_raisin').setDepth(-1);

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            destroyEverything();
            this.scene.stop('PlayPanel');
            this.scene.stop('ExpertAlien');
            this.scene.sleep('HelpBubble_play');
            this.scene.stop();
            this.scene.wake('HelpBubble_title');
            this.scene.wake('TitlePage');
            this.input.keyboard.removeAllKeys(true);
        });

        // *************KEYBOARD AND KEYS*************

        // arrows, spacebar, shift
        this.cursors = this.input.keyboard.createCursorKeys();

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keybackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        var keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        var keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        var keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        var keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // *************PLAYER*************

        var player = this.physics.add.sprite(10_000, 100, 'onion');
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
            maxZoom: 2,
        
            acceleration: 2,
            drag: 3,
            maxSpeed: 2
        });

        this.cameras.main.setBounds(0,0, 20_000, 20_000);
        this.cameras.main.startFollow(player, true, 0.05, 0.05);
        this.cameras.main.zoom = 0.7;

        // ***************** TREE, TASK OPERATIONS, TASKS GENERATORS *********************
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

        // explanation in SandboxBST.js
        function generateTasks(n,isRB) {
            // generate n random numbers for tasks (this also checks that the random num doesn't exist in the tree)
            var genNums = [];
            while(genNums.length < n) {
                var number = Math.floor(Math.random() * (999 - 1) + 1);
                if(!genNums.includes(number) && !numsToInsert.includes(number)){
                    genNums.push(number);
                }
            }

            if (isRB == true) {
                // populate ops with Insert
                // populate tasks with random numbers
                var k;
                for(k=0;k<n;k++){
                    ops[k] = 'Insert ';     // there must be a better way to initiate array of size n with only one word 'Insert ' ?
                }
                tasks = genNums;
            } else {
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
        }

        // *************INIT GAME*************

        // popup at the beginning
        this.explanation_popup = this.add.container(10_000,550).setDepth(6);
        this.explanation_window = this.add.image(0,0,'help_window').setScale(1.2);
        this.explanation_popup.add(this.explanation_window);
        this.expl_text = 'Goal: Perform as many operations as you can in the given time!\n\n\n\nThere will be 2 levels in total: BST and RB.\n\nIn BST level perform the given insert and delete tasks. You will be given 1 point for each successfully performed operation.\n\n\nIn RB level perform insert operations and maintain the tree by performing red-black operations. You will be given 1 point when you insert a node and fix the tree successfully.\n\n\n\n\nIn this game mode it\'s important to be quick, therefore the operations are not animated anymore!';         this.explanation_text = this.add.text(-680,-380, this.expl_text, { fontFamily: 'audiowide', fontSize: '39px', fill: '#ffffff', align: 'justify', wordWrap: { width: 1400, useAdvancedWrap: true }});
        this.explanation_popup.add(this.explanation_text);
        this.close_key = this.add.image(580,410,'spacebar_continue').setScale(1.4);
        this.explanation_popup.add(this.close_key);

        this.gameStarted = false;
        this.levelCounter = 1;
        this.gamePaused = true;
        // this.time = 3;

        // *************INITIALIZE BST*************

        // var numsToInsert = [178, 287, 74, 453, 233, 975, 279, 472, 33, 11, 426, 966, 444, 518, 149, 882, 29, 587]
        // ops = ['Delete '];
        // tasks = [178];

        var opNames = ['Insert ', 'Delete '];

        // just creates a root for player to stand on before any levels start
        var tree;
        tree = new Tree('dreamy', this);
        tree.createRoot(this);
        setPhysicsTree(tree.root,this);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spacebar.on('down', () => {

            if (this.levelCounter == 3) {            // THE END
                destroyEverything();
                this.scene.stop('PlayPanel');
                this.scene.stop('ExpertAlien');
                this.scene.sleep('HelpBubble_play');
                this.input.keyboard.removeAllKeys(true);
                this.scene.stop();
                // send total points from Panel to Input scene for display:
                this.scene.run('Input',{ totalpoints: panel.total_points, database: this.db });
                // show alien flying home
                // maybe expert says something that 'see you soon' or whatever
                // time event? : 
                    // after that ask for input - enter your name
                    // after name - display leaderboard table top 20
                    // tell to press esc to go back to menu
            } else if (this.gamePaused) {
                if (this.levelCounter == 1) {         // BST LEVEL
                    this.explanation_popup.setVisible(false);
                    this.gameStarted = true;
                    this.gamePaused = false;
                    // Level 1 - bst
                    makeTree(this, false, 20, 30,'dreamy');
                    panel.setLevelName('BST');
                    panel.refreshTask(ops[0] + tasks[0]);
                    panel.setTime(this.time);
                    panel.startTimer();
                } else if (this.levelCounter == 2) {   // RB LEVEL         
                    // Level 2 - rb null
                    this.gamePaused = false;
                    panel.removeRewardPopups();
                    this.keyEnter.enabled = true;
                    this.keybackspace.enabled = true;
                    tree.destroyTree();
                    this.background.destroy();
                    this.background = this.add.image(10_000,750,'background_planet_venus').setDepth(-1);
                    makeTree(this,true,0,40,'venus');
                    this.cameras.main.startFollow(player, true, 0.1, 0.1);
                    panel.setLevelName('RB');
                    panel.resetPoints();
                    panel.resetTimer(this.time);
                    panel.refreshTask(ops[0] + tasks[0]);
                    panel.startTimer();
                }
            }
        });

        function makeTree(scene,isRB,treeSize,taskSize,color) {
            if (tree != null) {
                tree.destroyTree();
            }
            numsToInsert = generateNumsToInsert(treeSize);
            generateTasks(taskSize,isRB);
            // numsToInsert = [55, 80, 679, 75, 88, 123, 96, 579, 222]
            // numsToInsert = [188, 502, 866, 995, 465] // the new root had 3 links
            // numsToInsert = [774, 923, 893, 557, 787]
            console.log(numsToInsert)
            console.log(ops)
            console.log(tasks)
            // tasks = [['Delete ', 'Delete ', 'Insert '],['Min', 'Max', 221]] // the new root had 3 links
            tree = new Tree(color, scene);
            // BST (intially an empty/null root node)
            if (isRB) {
                tree.isRB = isRB;
                tree.createRoot(scene);
                tree.createTree(numsToInsert,scene);
                setPhysicsTreeRB(tree.root,scene);
            } else {
                tree.createRoot(scene);
                tree.createTree(numsToInsert,scene);
                setPhysicsTree(tree.root,scene);
            }
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
        }

        // for BST
        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(scene.cursors,player,scene);

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

        // for RB-BST
        function setPhysicsTreeRB(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(scene.cursors,player,scene);

                // checks
                scene.physics.add.overlap(player, node, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, node, checkLeft, lkeyIsPressed, scene);
                scene.physics.add.overlap(player, node, checkRight, rkeyIsPressed, scene);
                scene.physics.add.overlap(player, node, checkFlip, fkeyIsPressed, scene);

                // redraw
                scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene);

                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTreeRB(node.left,scene);
                setPhysicsTreeRB(node.right,scene);
            }
        }

        function redrawTree(node) {
            // sometimes there is a problem when node is root so node parent doesn't exist
            tree.updateDistances(node.parent, node.posX);
            tree.redraw(this);
        }



        // *************** TASKS + TASK ACTIONS ***************

        function displayTask() {
            if (tasks.length != 0) { 
                panel.refreshTask(ops[0] + tasks[0]);
            } else {
                panel.allTasksDone();
            }
        }

        function taskSucceededActions(scene) {
            if (tasks.length == 0) {
                panel.allTasksDone();
            } else {
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                panel.greenFeedback();
            
                if(tree.isRB) {    // if the tree is RB check correctness and then shift the task
                    if(tree.checkCorrectnessRBTree(tree.root)) {     // if RB tree is correct
                        ops.shift();
                        tasks.shift();
                        displayTask();
                        panel.addPoint();
                    } else {                                         // if RB tree is NOT correct yet
                        // panel says that the RB tree needs to be corrected
                        panel.refreshTask('Fix the tree!'); 
                    }
                    tree.setvarToReturnToDefault(); 
                } else {           // the tree is not RB then just shift the task 
                    ops.shift();
                    tasks.shift();
                    displayTask();
                    panel.addPoint();
                }

                // without the delay in some cases one node stays open
                scene.time.addEvent({
                    delay: 100,
                    callback: function() {
                        tree.closeCurtains();
                    },
                    args: []
                });
            }
        }

        // *************** CHECK INSERT + INSERT A NEW NODE ***************

        var enterAllowed = false;
        function enterIsPressed() {
            var moveAllowed = false;
            if(this.keyEnter.isDown){
                enterAllowed = true;
            }
            if (enterAllowed && this.keyEnter.isUp) {
                moveAllowed = true;
                enterAllowed = false;
            }
            return moveAllowed;
        }

        function checkInsertion(player,nodeThatPlayerStandsOn) {
            checkInsertionH(tree.root,nodeThatPlayerStandsOn,player,this);
        }

        function checkInsertionH(node, nodeThatPlayerStandsOn, player,scene) {
            if (tasks.length != 0) {
                if (node.key == 'null') {
                    if (node == nodeThatPlayerStandsOn) {
                        tree.insertManual(nodeThatPlayerStandsOn, tasks[0], scene);
                        tree.redraw(scene)
                        nodeThatPlayerStandsOn.curtain.visible = false;
                        if(tree.isRB) {
                            setPhysicsTreeRB(nodeThatPlayerStandsOn, scene)
                        } else {
                            setPhysicsTree(nodeThatPlayerStandsOn, scene)
                        }
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        panel.greenFeedback();
                        taskSucceededActions(scene);
                    } else {  //  unsucessful search 
                        panel.redFeedback();
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        tree.closeCurtains();
                    }
                } else if (node.key > tasks[0]) {
                    checkInsertionH(node.left,nodeThatPlayerStandsOn,player,scene);
                } else if (node.key < tasks[0]) {
                    checkInsertionH(node.right,nodeThatPlayerStandsOn,player,scene);
                }
            }  
        }

         // *************** CHECK DELETE + DELETE A NODE ***************

        var backspaceAllowed = false;
        function backspaceIsPressed() {
            var moveAllowed = false;
            if (this.keybackspace.isDown) {
                backspaceAllowed = true;
            }
            if (backspaceAllowed && this.keybackspace.isUp) {
                moveAllowed = true;
                backspaceAllowed = false;
            }
            return moveAllowed;
        }
 
        var nodeToDelete = null;

        function deleteNode(player, node) {
            if (nodeToDelete == null && tasks.length[1] != 0) {
                if (node.key != 'null' && (tasks[0] == node.key || (tasks[0] == 'Min' && node.key == min(tree.root)) || (tasks[0] == 'Max' && node.key == max(tree.root))) && nodeToDelete == null) {
                    if (node.left.key =='null' && node.right.key =='null') { //  both children are null 

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.parent != null) {
                            player.setPosition(node.parent.posX,node.parent.posY-BUFFER);
                        }
                        node.setKey('null');
                        node.setNullGraphics();
                        node.left.destroyNode();
                        node.right.destroyNode();
                        node.setChildren(); // set children as null

                        // ENABLE KEYBOARD
                        taskSucceededActions(this);
                        this.input.keyboard.enabled = true;

                    } else if (node.right.key == 'null' || node.left.key  == 'null') { // one child is null
                        // traverseTree(tree.root)

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.right.key == 'null') { // right child is null

                            player.setPosition(node.left.x,node.left.y-BUFFER);

                            if (node.parent == null) {
                                node.left.link.destroy()
                                node.left.parent = null;
                                tree.root = node.left;
                                tree.root.dpth = 0;
                                tree.root.changePosition(this,10000,200)

                            } else if (node.parent.left == node) {
                                node.parent.left = node.left;
                                node.left.parent = node.parent;
                                
                            } else if (node.parent.right == node) {
                                node.parent.right = node.left;
                                node.left.parent = node.parent;
                            }
                            
                            // if the node.left is the new root then start updating the positions from node.left.left (root.left)
                            if (node.left.key == tree.root.key) {
                                updateBranch(this, tree.root.left, -tree.w); //v2
                            } else {
                                var distanceX = node.left.posX-node.posX;
                                updateBranch(this, node.left, distanceX); //v2
                            }

                            // TO PREVENT COLLAPSING:
                            node.left.distanceFromParent = node.distanceFromParent;

                            tree.updateNodeDepths(node.left); // starting from 9 (the node that changes deleted node)

                            tree.traverseAndCheckCollisions(this); //v2
                            tree.traverseAndCheckCrossings(this); //v2

                            node.left.drawLinkToParent(this);

                            node.right.destroyNode();
                            node.destroyNode();
                            tree.redraw(this);
                        } else {                        // left child is null

                            player.setPosition(node.right.x,node.right.y-BUFFER);

                            if (node.parent == null) {
                                node.right.link.destroy()
                                node.right.parent = null;
                                tree.root = node.right;
                                tree.root.dpth = 0;
                                tree.root.changePosition(this,10000,200)

                            } else if (node.parent.left == node) {
                                node.parent.left = node.right;
                                node.right.parent = node.parent;
                                
                            } else if (node.parent.right == node) {
                                node.parent.right = node.right;
                                node.right.parent = node.parent;
                            }

                            // if the node.left is the new root then start updating the positions from node.right.right (root.right)
                            if(node.right.key == tree.root.key) {
                                updateBranch(this,tree.root.right, tree.w)
                            } else {
                                var distanceX = node.right.posX-node.posX;
                                updateBranch(this, node.right,distanceX); //v2
                            }

                            // TO PREVENT COLLAPSING:
                            node.right.distanceFromParent = node.distanceFromParent;

                            tree.updateNodeDepths(node.right); // starting from 33 (the node that changes deletd node)

                            tree.traverseAndCheckCollisions(this); //v2
                            tree.traverseAndCheckCrossings(this); //v2                            

                            node.right.drawLinkToParent(this);
                            
                            node.left.destroyNode();
                            node.destroyNode();
                            tree.redraw(this);
    
                        } //end of if else
    
                        taskSucceededActions(this);
                        // ENABLE KEYBOARD
                        this.input.keyboard.enabled = true;
                
                    } else { // both children are NOT null
                        nodeToDelete = node;
                        nodeToDelete.nodeGraphics.setTint(0x00fbff);
                    }
                } else {
                    panel.redFeedback();
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    tree.closeCurtains()
                }
            }
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

        function checkAndDeleteSecondNode(player, node){
            if(nodeToDelete != null && node.key != 'null'){
                var key = min(nodeToDelete.right);
                if(node.key == key){
                    player.setPosition(node.parent.posX, node.parent.posY - BUFFER)

                    if (nodeToDelete.right.left.key == 'null') { // when nodeToDelete's right child IS min (move min and its right subtree up)

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        node.left.destroyNode(); // destroy null left child of 15
                        node.left = null;
                        node.parent = nodeToDelete.parent; // set 15s parent as what 10 had (null) || set 25s parent to 15
                        node.dpth = nodeToDelete.dpth;
                      
                        var distanceX = Math.abs(nodeToDelete.posX-node.posX);

                        updateBranch(this,node,distanceX);
                            
                        var distanceX = Math.abs(nodeToDelete.posX-node.posX);

                        if (nodeToDelete == tree.root) { // if deleted node is root
                            tree.root = node;
                            node.left = nodeToDelete.left;  // move 10's left branch to 15
                            node.left.parent = node; // change left branch's parent to 15
                            tree.root.dpth = 0;
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

                        tree.traverseAndCheckCollisions(this);
                        tree.traverseAndCheckCrossings(this);

                        node.drawLinkToParent(this);
                        node.left.drawLinkToParent(this);
                       
                        nodeToDelete.destroyNode();
                        nodeToDelete = null;
                        tree.updateNodeDepths(node);
                      
                        tree.traverseAndCheckCollisions(this);
                        tree.traverseAndCheckCrossings(this);
                        tree.redraw(this);
                       
                        // ENABLE KEYBOARD
                        this.input.keyboard.enabled = true;
                        
                    } else if (nodeToDelete.right.left.key != 'null') { // when nodeToDelete's right child's left exists (it means there will be a min somewhere on the left from right child)

                        var nodeToUseForAppear = node.parent;

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        // when min doesn't have children on the right
                        if (node.right.key == 'null') {
                          
                            var childL = new NodeBST(this, 'dreamy', node.parent.posX-tree.w, node.parent.posY+tree.z, 'null',node.parent.dpth+1,node.parent,false);
                            childL.distanceFromParent = -tree.w;
                            node.parent.left = childL;

                            tree.checkCollisions(childL);

                            // teleporting + curtains
                            childL.setPhysicsNode(this.cursors,player,this);

                            // physics
                            this.physics.add.overlap(player, childL, checkInsertion, enterIsPressed, this);
                            this.physics.add.overlap(player, childL, deleteNode, backspaceIsPressed, this);
                            this.physics.add.overlap(player, childL, checkAndDeleteSecondNode, mIsPressed, this);
                            this.physics.add.collider(player, childL);
                            
                            node.left.destroyNode(); 
                            node.right.destroyNode();
                            node.left = null;
                            node.right = null;
                            node.parent = nodeToDelete.parent; // set 16s parent as what 15 had (null)
                            node.dpth = nodeToDelete.dpth;
                                    
                            var distanceX = Math.abs(node.keyString.x-node.posX);
                                
                            node.drawLinkToParent(this);
                            node.body.updateFromGameObject();
                            node.curtain.body.updateFromGameObject();
                  
                            node.posX = nodeToDelete.posX;
                            node.posY = nodeToDelete.posY;

                            if (nodeToDelete == tree.root) { 
                                tree.root = node;
                                node.left = nodeToDelete.left;
                                node.left.parent = node;
                                node.right = nodeToDelete.right;
                                node.right.parent = node;
                                tree.root.dpth = 0;
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

                            node.distanceFromParent = nodeToDelete.distanceFromParent;

                            tree.updateNodeDepths(tree.root);
                            nodeToDelete.destroyNode();
                        
                            nodeToDelete = null;
                            tree.updateNodeDepths(node);
                            // tree.updateNodePosX();
                            tree.traverseAndCheckCollisions(this);
                            tree.traverseAndCheckCrossings(this);
                            tree.redraw(this);  

                        } else if (node.right.key != 'null') { // when min has children on the right (need to move the right branch up)
                            
                            node.left.destroyNode(); // node is min. we destroy its left child because it wont be needed anymore/it will be replaced
                            node.left = null;
                            node.parent = nodeToDelete.parent;
                            node.dpth = nodeToDelete.dpth;
                            
                            var distanceX = Math.abs(node.keyString.x-node.posX);
                                    
                            node.body.updateFromGameObject();
                            node.curtain.body.updateFromGameObject();
                                    
                            var distanceX = Math.abs(node.posX-node.right.posX);

                            updateBranch(this,node.right,distanceX); //v2

                            node.posX = nodeToDelete.posX;
                            node.posY = nodeToDelete.posY;

                            node.drawLinkToParent(this);
                            node.link.setAlpha(0);
                            
                            node.right.distanceFromParent = node.distanceFromParent; // <-- 11s.distancefromparent // nodeToUseForAppear.left.distanceFromParent; <-- 13s.left
                            nodeToUseForAppear.left = node.right; // here nodeToUseForAppear is the parent of node(min)
                            node.right.parent = nodeToUseForAppear;

                            if (nodeToDelete == tree.root) { // if deleted node is root
                                tree.root = node;
                                node.left = nodeToDelete.left;
                                node.left.parent = node;
                                node.right = nodeToDelete.right;
                                node.right.parent = node;
                                tree.root.dpth = 0;
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

                            node.distanceFromParent = nodeToDelete.distanceFromParent;

                            tree.updateNodeDepths(tree.root);

                            tree.traverseAndCheckCollisions(this); //v2
                            tree.traverseAndCheckCrossings(this); //v2
                           
                            node.drawLinkToParent(this);
                            nodeToUseForAppear.left.drawLinkToParent(this);
                            nodeToUseForAppear.left.link.setAlpha(0);
                            
                            nodeToDelete.destroyNode();
                        
                            nodeToDelete = null;
                            tree.updateNodeDepths(node);
                            tree.traverseAndCheckCollisions(this);
                            tree.traverseAndCheckCrossings(this);
                            tree.redraw(this);
                        } //end of else if
                    } //end of else if
                    taskSucceededActions(this);
                    displayTask();
                    // ENABLE KEYBOARD
                    this.input.keyboard.enabled = true;
                } else {
                    panel.redFeedback();
                    player.setPosition(nodeToDelete.x,nodeToDelete.y-BUFFER);
                    tree.closeCurtains()
                }
            }
        }

        // ************** HELPER FUNCTIONS DELETE ************

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

        function updateBranch(scene,node,distanceX) {
            if (node != null) {

                node.posX = node.posX - distanceX;
                node.posY = node.posY - tree.z;
                // node.link.destroy();
                node.changePosition(scene,node.posX, node.posY)

                updateBranch(scene,node.left,distanceX);
                updateBranch(scene,node.right,distanceX);
            }
        }

        // *************** CHECK FLIP + FLIP COLORS ***************

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

        function checkFlip(player,node) {
            if (node.key != 'null' && node.left.isRed && node.right.isRed) {
                panel.greenFeedback();
                tree.flipColors(this,node);
                node.left.drawLinkToParentRB(this);
                node.right.drawLinkToParentRB(this);
                taskSucceededActions(this);

            } else {
                panel.redFeedback();
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
            }
        }
        
        // *************** CHECK ROTATE + ROTATE RIGHT ***************

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

        function checkRight(player, node) {
            if(node.key != 'null' && node.left.isRed && node.isRed && !node.parent.right.isRed && !node.right.isRed) {
                panel.greenFeedback();
                tree.updateLinksRight(node);
                player.setPosition(tree.root.posX, tree.root.posY-BUFFER);
                tree.redraw(this);
                taskSucceededActions(this);

            } else {
                panel.redFeedback();
                player.setPosition(tree.root.posX, tree.root.posY - BUFFER)
            }
        }

    // *************** CHECK ROTATE + ROTATE LEFT ***************

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

        function checkLeft(player, node) {
            if (node.key != 'null' && node.parent != null && node.isRed && node.parent.right == node) {
                panel.greenFeedback();
                tree.updateLinksLeft(node)
                player.setPosition(tree.root.posX, tree.root.posY-BUFFER);
                tree.redraw(this)
                taskSucceededActions(this);
               
            } else {
                panel.redFeedback();
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
            }
        }
        
        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            numsToInsert = null;
            ops = [];
            tasks = [];
        }
    }

    update(time,delta) {
        controls.update(delta);

        // added the gamePaused cuz if it's only isTimerDone() then on true it keeps on calling levelPassedActions() in a loop
        if (panel.isTimerDone() && !this.gamePaused) {
            this.gamePaused = true;
            this.levelPassedActions();
        }

        if (!this.gamePaused && ops.length != 0 && ops[0] == 'Insert ') {
            this.keyEnter.enabled = true;
            this.keybackspace.enabled = false;
        } else if (!this.gamePaused && ops.length != 0 && ops[0] == 'Delete ') {
            this.keyEnter.enabled = false;
            this.keybackspace.enabled = true;
        }

        if (this.helpBubble.isHelpBubbleOpen() && !this.gamePaused && this.gameStarted) {
            this.gamePaused = true;
            panel.pauseTimer();
            this.cursors.left.enabled = false;
            this.cursors.right.enabled = false;
            this.cursors.up.enabled = false;
            this.keyEnter.enabled = false;
            this.keybackspace.enabled = false;
            this.spacebar.enabled = false;
        } else if (!this.helpBubble.isHelpBubbleOpen() && this.gamePaused && this.gameStarted && !panel.isTimerDone()) {
            this.gamePaused = false;
            this.cursors.left.enabled = true;
            this.cursors.right.enabled = true;
            this.cursors.up.enabled = true;
            this.spacebar.enabled = true;
            panel.startTimer();
        }
    }

    levelPassedActions() {
        this.levelCounter++;
        if (this.levelCounter == 2) {
            panel.displayRewardBST();
        } else if (this.levelCounter == 3) {
            panel.displayRewardRB();
            // this.getInput();
        }
        panel.updateTotalPoints();
        panel.noMoreTimeText();
        this.keyEnter.enabled = false;
        this.keybackspace.enabled = false;
    }

    // getInput() {
        // panel.removeRewardPopups()
        // this.input.keyboard.enabled = false;
        // Version 1 
        // put the element from form.html to phaser
        // this.nameInput = this.add.dom(10000, 400).createFromCache("form");
        // this.nameInput.setDepth(5)
        // this.nameInput.visible = true;
        // console.log(this.nameInput.getChildByName("name").value);
        // console.log(this.nameInput)


        // event  listen for enter press on v1
        // this.keyY.on("down", () => {
        //     let name = this.nameInput.getChildByName("name");
        //     console.log("value of field :" + name.value);
        //     if(name.value != "") {
        //         // this.message.setText("Hello, " + name.value);
        //         console.log(name.value);
        //     }
        //     console.log('There is no nameeee');
        // });

        // Version 2
        // create the input element in phaser
        // var el = document.createElement('INPUT');
        // el.style.position = 'absolute';
        // el.style.padding = '10px';
        // el.style.fontSize = '35px';
        // el.style.width = '700px';
        // el.style.height = '100px'
        // el.setAttribute("type", "text")
        // el.setAttribute("name", "name")
        // el.setAttribute("minlength", 1)
        // el.setAttribute("maxlength", 15)
        // el.setAttribute("placeholder", "Your Name")
        // // el.style.border = '1px solid' .rgb.hexValue = '00506e';
        // el.setAttribute("required", true)
        // this.add.dom(10000, 400, el);
        // console.log(el)
        // // this.add.existing(el);
        // this.input.keyboard.enabled = false;

        // Event listeners on v2 
        // // el.setInteractive().on('pointerdown', () => {
        // //     el.innerText
        // // })

        // el.addEventListener("pointerdown", () =>  {
        //     console.log(el.name)
        // })


        // el.addListener('click' () = {
        //     el.enabled = true;
        // });
        


        // el.on(eventName, callback, scope);
        
        // this.keyEnter.on("down", event => {
        //     let name = el.getChildByName("name");
        //     if(name.value != "") {
        //         // this.message.setText("Hello, " + name.value);
        //         console.log(name.value);
        //     }
        // });

    // }
}