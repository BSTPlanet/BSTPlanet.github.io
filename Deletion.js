import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
import { Panel } from './Panel.js';
import { ExpertAlien } from './ExpertAlien.js';
import { HelpBubble } from './HelpBubble.js';

var numsToInsert;
var tasks;
var singleTon;
var data;
var panel;
var expert;
const node_min = {x: 990, y: 813, name: "node_129" }
const node_max = {x: 1045, y: 813, name: "node_791" }
const node_421 = {x: 1100, y: 813, name: "node_421" }
const node_655 = {x: 1155, y: 813, name: "node_655" }
const node_338 = {x: 1210, y: 813, name: "node_338" }
var controls;

export class Deletion extends Phaser.Scene {

    constructor() {
        super({ key:'Deletion' });
    }

    init (data1) {
        numsToInsert = [];
        tasks = [];
        data = {};
        singleTon = data1.singleTon
        numsToInsert = data1.tree
        tasks = data1.task.slice()
        data = data1;
    }

    preload() {
        // *************INIT HELP BUBBLE*************
        this.scene.remove('HelpBubble_keyboard');
        this.helpBubble_key = 'HelpBubble_keyboard';
        this.helpBubble_scene = new HelpBubble('HelpBubble_keyboard');
        this.helpBubble = this.scene.add(this.helpBubble_key, this.helpBubble_scene, true);
        this.helpBubble.setHelp('keyboard_BST');


        // *************INIT PANEL AND EXPERT*************
        this.scene.remove('Panel');
        this.scene.remove('ExpertAlien');
        panel = this.scene.add('Panel', Panel, true);
        expert = this.scene.add('ExpertAlien', ExpertAlien, true);
        panel.setLevelName(data.levelName);

        if (tasks[0] == 'Min') {
            // expert.talk('deleteMin')
            expert.talk('deleteMin',0,'continue');
        } else if (tasks[0] == 'Max') {
            // expert.talk('deleteMax')
            expert.talk('deleteMax',0,'continue');
        } else if (tasks[0] == 734) {
            // expert.talk('deleteNoChild')
            expert.talk('deleteNoChild',0,'continue');
        } else if (tasks[0] == 76) {
            // expert.talk('deleteOneChild')
            expert.talk('deleteOneChild',0,'continue');
        } else if (tasks[0] == 631) {
            // expert.talk('deleteTwoChildren')
            expert.talk('deleteTwoChildren',0,'continue');
        }
    }

    create() {

        // creat the nodes for the reward level
        panel.loopOverNodes(singleTon.nodeSet)
        panel.loopOverTools(singleTon.toolSet)

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            if(tasks.length == 0 && data.task.length != 7) {
            // choose the correct delete scene
                if(data.task[1] == "Min") {
                    this.scene.restart({task: singleTon.deleteMaxTasks, tree: singleTon.deleteMaxTree, singleTon: singleTon, levelName: 'BST Delete max'});
                    destroyEverything();
                    this.input.keyboard.removeAllKeys(true);
                } else if (data.task[1] == "Max") {
                    this.scene.restart({task: singleTon.deleteNoChildrenTasks, tree: singleTon.deleteNoChildrenTree, singleTon: singleTon, levelName: 'BST Delete node - no children'});
                    destroyEverything();
                    this.input.keyboard.removeAllKeys(true);
                } else if (data.task[1] == 421) {
                    this.scene.restart({task: singleTon.deleteOneChildTasks, tree: singleTon.deleteOneChildTree, singleTon: singleTon, levelName: 'BST Delete node - one child'});
                    destroyEverything();
                    this.input.keyboard.removeAllKeys(true);
                } else if (data.task[1] == 655) {
                    this.scene.restart( {task: singleTon.deleteTwoChildrenTasks, tree: singleTon.deleteTwoChildrenTree, singleTon: singleTon, levelName: 'BST Delete - two children'});
                    destroyEverything();
                    this.input.keyboard.removeAllKeys(true);
                }  else if (data.task[1] == 338 && singleTon.set.size == 14) {
                    this.scene.stop();
                    this.scene.launch( 'Insertion',{task: singleTon.rewardTasks, tree: singleTon.rewardTree, singleTon: singleTon, levelName: 'Reward'});
                    destroyEverything();
                    this.input.keyboard.removeAllKeys(true);
                } else if (data.task[1] == 338 && singleTon.set.size != 14 && expert.progressCounter == 8) {
                    // expert.talk() that you haven't found all of the reward nodes yet
                    expert.talk('rewardLocked',0,'nosymbol');
                }
            } else if (expert.talking == false) {
                expert.talking = true;
                if (expert.progressCounter == 1) {
                    if (tasks[0] == 'Min') {
                        expert.talk('deleteMin',1,'close');
                    } else if (tasks[0] == 'Max') {
                        expert.talk('deleteMax',1,'close');
                    } else if (tasks[0] == 734) {
                        expert.talk('deleteNoChild',1,'close');
                    } else if (tasks[0] == 76) {
                        expert.talk('deleteOneChild',1,'close');
                    } else if (tasks[0] == 631) {
                        expert.talk('deleteTwoChildren',1,'nosymbol');
                    }
                }
            }
        });

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            destroyEverything();
            this.scene.stop('Panel');
            this.scene.stop('ExpertAlien');
            this.scene.stop('HelpBubble_keyboard');
            this.scene.stop();
            this.scene.wake('MenuBST')
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
        this.cameras.main.zoom = 0.7;
        
        // *************INITIALIZE BST*************

        var nodeColor;
        var backgroundColor;
        if(data.task[1] == "Min") {
            nodeColor = singleTon.deleteMinColor;
            backgroundColor = 'background_planet_raisin';
        } else if (data.task[1] == "Max") {
            nodeColor = singleTon.deleteMaxColor;
            backgroundColor = 'background_planet_darkBlue';
        } else if (data.task[1] == 421) {
            nodeColor = singleTon.deleteNoChildrenColor;
            backgroundColor = 'background_planet_raisin';
        } else if (data.task[1] == 655) {
            nodeColor = singleTon.deleteOneChildColor;
            backgroundColor = 'background_planet_raisin';
        }  else if (data.task[1] == 338) {
            nodeColor = singleTon.deleteTwoChildrenColor;
            backgroundColor = 'background_planet_darkBlue';
        }

        this.add.image(10_000,750,backgroundColor).setDepth(-1);

        var tree = new Tree(nodeColor,this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // specific to delete explanations
                scene.physics.add.overlap(player, node, triggerExplanation, null, scene);


                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, deleteNode, backspaceIsPressed, scene);
                scene.physics.add.overlap(player, node, checkAndDeleteSecondNode, mIsPressed, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }

        // *************** DELETE EXPLANATIONS ***************

        var talkNodes;
        if (tasks[0] == 'Min') {
            talkNodes = [98];
        } else if (tasks[0] == 'Max') {
            talkNodes = [992];
        } else if (tasks[0] == 734) {
            talkNodes = [734];
        } else if (tasks[0] == 76) {
            talkNodes = [76];
        } else if (tasks[0] == 631) {
            talkNodes = [631,791,717];
        }

        function triggerExplanation(player,node) {

            if (tasks[0] == 'Min') {
                if(talkNodes[0] == 98 && node.key == talkNodes[0] && expert.progressCounter == 2) {
                    expert.talk('deleteMin',2,'nosymbol');
                    talkNodes.shift();
                }
            } else if (tasks[0] == 'Max') {
                if(talkNodes[0] == 992 && node.key == talkNodes[0] && expert.progressCounter == 2) {
                    expert.talk('deleteMax',2,'nosymbol');
                    talkNodes.shift();
                }
            } else if (tasks[0] == 734) {
                if(talkNodes[0] == 734 && node.key == talkNodes[0] && expert.progressCounter == 2) {
                    expert.talk('deleteNoChild',2,'nosymbol');
                    talkNodes.shift();
                }
            } else if (tasks[0] == 76) {
                if(talkNodes[0] == 76 && node.key == talkNodes[0] && expert.progressCounter == 2) {
                    expert.talk('deleteOneChild',2,'nosymbol');
                    talkNodes.shift();
                }
            } else if (tasks[0] == 631) {
                if(talkNodes[0] == 631 && node.key == talkNodes[0] && expert.progressCounter == 2) {
                    expert.talk('deleteTwoChildren',2,'nosymbol');
                    talkNodes.shift();
                } else if(talkNodes[0] == 791 && node.key == talkNodes[0] && expert.progressCounter == 4) {
                    expert.talk('deleteTwoChildren',4,'nosymbol');
                    talkNodes.shift();
                } else if (talkNodes[0] == 717 && node.key == talkNodes[0] && expert.progressCounter == 5) {
                    expert.talk('deleteTwoChildren',5,'nosymbol');
                    talkNodes.shift();
                }
            }
        }
        
       // *************** TASKS + TASK ACTIONS ***************
       

        // displays what operations needs to be performed by the player
        var taskText = this.add.text(9000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask();

        //while there are still some tasks in the array, displays text indicating what needs to be done
        function displayTask() {
            if (tasks.length != 0) { 
                if (tasks.length == 1 && (tasks[0] == "Min" || tasks[0] == "Max")) {
                    panel.refreshTask('Delete ' + tasks[0] + ' again');
                } else {
                    panel.refreshTask('Delete ' + tasks[0]);
                }
            } else {
                panel.allTasksDone();
            }
        }

        function taskSucceededActions(scene) {
            panel.greenFeedback();
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.closeCurtains();

            if(tasks[0] == "Min") {
                if(!singleTon.set.has(98)) {
                    singleTon.updateSet(98)
                } else {
                    singleTon.updateSet(129)
                } 
            } else if (tasks[0] == "Max") {
                if (!singleTon.set.has(992)) {
                    singleTon.updateSet(992)
                } else {
                    singleTon.updateSet(791)
                } 
            } else {
                singleTon.updateSet(tasks[0])
            }

            // expert explanations
            if (tasks[0] == 'Min') {
                if (expert.progressCounter == 3) {
                    expert.talk('deleteMin',3,'close');
                } else if (expert.progressCounter == 4){
                    expert.talk('deleteMin',4,'continue');
                } 
            } else if (tasks[0] == 'Max') {
                if (expert.progressCounter == 3) {
                    expert.talk('deleteMax',3,'close');
                } else if (expert.progressCounter == 4){
                    expert.talk('deleteMax',4,'continue');
                } 
            } else if (tasks[0] == 734 && expert.progressCounter == 3) {  // no child
                expert.talk('deleteNoChild',3,'close');
            } else if (tasks[0] == 421 && expert.progressCounter == 4) {  // no child
                expert.talk('deleteNoChild',4,'continue');
            } else if (tasks[0] == 76 && expert.progressCounter == 3) {      // one child
                expert.talk('deleteOneChild',3,'close');
            } else if (tasks[0] == 655 && expert.progressCounter == 4){      // one child
                expert.talk('deleteOneChild',4,'continue');
            } else if (tasks[0] == 631 && expert.progressCounter == 6) {       // two children
                expert.talk('deleteTwoChildren',6,'close');
            } else if (tasks[0] == 338 && expert.progressCounter == 7) {     // two children
                expert.talk('deleteTwoChildren',7,'continue');
            }

            if (tasks[0] == "Min" && singleTon.set.has(129) && !(singleTon.nodeSet.has(node_min))) {
                singleTon.addNode(node_min)
                panel.rewardNodeActions(129);
            } else if (tasks[0] == "Max" && singleTon.set.has(791) && !(singleTon.nodeSet.has(node_max))) {
                singleTon.addNode(node_max)
                panel.rewardNodeActions(791);
            } else if (tasks[0] == 421 && !(singleTon.nodeSet.has(node_421))) {
                singleTon.addNode(node_421)
                panel.rewardNodeActions(421);
            }  else if (tasks[0] == 655 && !(singleTon.nodeSet.has(node_655))) {
                singleTon.addNode(node_655)
                panel.rewardNodeActions(655);
            } else if (tasks[0] == 338 && !(singleTon.nodeSet.has(node_338))) {
                singleTon.addNode(node_338)
                panel.rewardNodeActions(338);
            }

            tasks.shift();

            if (tasks.length != 0) { 
                if (tasks.length == 1 && (tasks[0] == "Min" || tasks[0] == "Max")) {
                    panel.refreshTask('Delete ' + tasks[0] + ' again');
                } else {
                    panel.refreshTask('Delete ' + tasks[0]);
                }
            } else {
                panel.allTasksDone();
            }
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
                            alpha: '+=1',
                            // onComplete: taskSucceededActions(this),
                            // onCompleteParams: [this]
                        });

                        this.time.addEvent({
                            delay: 4000,
                            callback: function(scene) {
                                // ENABLE KEYBOARD
                                taskSucceededActions(scene)
                                scene.input.keyboard.enabled = true;
                                // displayTask();
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
                                delay: 3000,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    // tree.traverseAndCheckCrossings(scene);

                                    tree.redraw(scene);

                                    // appearLinksOneChild(node.left, scene);
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

                            // move player to root, update tasks, enable keyboard
                            this.time.addEvent({
                                delay: 3500,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    // tree.traverseAndCheckCrossings(scene);
    
                                    tree.redraw(scene);
    
                                    // appearLinksOneChild(node.right, scene);
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
                    } else { // both children are NOT null
                        // setting a value of nodeToDelete to use it after user clicks Enter
                        nodeToDelete = node;
                        nodeToDelete.nodeGraphics.setTint(0xf3a6ff);
                        if(nodeToDelete.key == 631) {
                            expert.talk('deleteTwoChildren',3,'nosymbol');
                        }
                    }
                } else {
                    panel.redFeedback();
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    tree.closeCurtains()


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

        //code used on overlap when the user clicks Enter - part of the deleteNode logic for deleting nodes with two children
        // code for deletion when both children are NOT null
        function checkAndDeleteSecondNode(player, node){
            if(nodeToDelete != null && node.key != 'null'){
                var key = min(nodeToDelete.right);
                if(node.key == key){

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
                                // Version 2
                                updateBranch(node,distanceX);
                            },
                            args: [nodeToDelete,node,this]
                        });

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

                                // TODO: ROTATE node.right.link and after it is rotated then redraw to extend:
                                // node.right.link.setAlpha(0);
                                // move node link, rotate it and extend it
                                if (node.right.link != null) {

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
                                        // ROTATION TWEEN:
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
                                // appearLinks(node,scene);
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
                            delay: 5800,
                            callback: function(node,scene) {
                                nodeToDelete.destroyNode();
                                nodeToDelete = null;
                                tree.updateNodeDepths(node);
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
                                    var childL = new NodeBST(scene, singleTon.deleteMinColor, node.parent.posX-tree.w, node.parent.posY+tree.z, 'null',node.parent.dpth+1,node.parent);
                                    childL.distanceFromParent = -tree.w;
                                    node.parent.left = childL;
                                    childL.nullGraphics.setAlpha(0);
                                    childL.keyString.setAlpha(0);
                                    childL.link.setAlpha(0);

                                    tree.checkCollisions(childL);

                                    // teleporting + curtains
                                    childL.setPhysicsNode(cursors,player,scene);

                                    // physics
                                    scene.physics.add.overlap(player, childL, deleteNode, backspaceIsPressed, scene);
                                    scene.physics.add.overlap(player, childL, checkAndDeleteSecondNode, mIsPressed, scene);
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
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
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


                                    // tree.updateNodeDepths(node.right);
                                    tree.updateNodeDepths(tree.root);

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    actuallyMoveBranch(nodeToUseForAppear.left,distanceX,scene); //v2

                                    // appearLinks(node.right, scene);

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

                                    // tree.updateNodeDepths(tree.root);
                                    nodeToDelete.destroyNode();
                                },
                                args: [nodeToUseForAppear,nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 7000,
                                callback: function(nodeToUseForAppear,node,scene) {
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redraw(scene);    
                                },
                                args: [nodeToUseForAppear,node,this]
                            });

                        } //end of else if

                        this.time.addEvent({
                            delay: 8000,
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
                    panel.redFeedback();
                    player.setPosition(nodeToDelete.x,nodeToDelete.y-BUFFER);
                    tree.closeCurtains()
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
                    targets: [node.nodeGraphics, node.nullGraphics, node.curtain, node.keyString],
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
                    callback: function(node,scene) {
                        node.body.updateFromGameObject();
                        node.curtain.body.updateFromGameObject();
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

        function calcAngle(z,smth) {
            return Math.atan(z/smth) * (180/Math.PI);
        }

        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            tasks = null;
            numsToInsert = null;
        }
    }

    update(time,delta) {
        controls.update(delta);
    }
}
