import { Tree } from './Tree.js';
import { Panel } from './Panel.js';
import { ExpertAlien } from './ExpertAlien.js';
import { HelpBubble } from './HelpBubble.js';

var numsToInsert;
var tasks;
var singleTon;
var panel;
var expert;
var controls;
var data;
var keyF;
var keyEnter;
var keyR;
var keyL;
var spacebar;

const node_210 = {x:1210, y:813, name: "node_210"}

export class InsertLargeTree extends Phaser.Scene {

    constructor() {
        super({ key:'InsertLargeTree' });
    }

    init (data1) {
        numsToInsert = [];
        tasks = [];
        singleTon = data1.singleTon
        tasks = data1.task.slice();
        data = data1;
        
    }

    preload() {
        // *************INIT HELP BUBBLE*************
        this.scene.remove('HelpBubble_keyboard');
        this.helpBubble_key = 'HelpBubble_keyboard';
        this.helpBubble_scene = new HelpBubble('HelpBubble_keyboard');
        this.helpBubble = this.scene.add(this.helpBubble_key, this.helpBubble_scene, true);
        this.helpBubble.setHelp('keyboard_RB');

        // *************INIT PANEL AND EXPERT*************
        this.scene.remove('Panel');
        this.scene.remove('ExpertAlien');
        panel = this.scene.add('Panel', Panel, true);
        expert = this.scene.add('ExpertAlien', ExpertAlien, true);
        panel.setLevelName('RB Insert In A Large Tree');
        expert.talk('insertLargeTree', 0);
    }

    create() {
        // create the nodes for the reward level
        panel.loopOverNodes(singleTon.nodeSetRB)
        panel.loopOverTools(singleTon.toolSet)

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background_planet_venus').setDepth(-1);

        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            if (tasks.length == 0 && singleTon.setRB.size != 14) {
                // expert.talk() that you haven't found all of the reward nodes yet
                expert.talk('rewardLocked',0,'nosymbol');
            } else if (tasks.length == 0 && singleTon.setRB.size == 14) {
                this.scene.stop('Panel');
                this.scene.stop('ExpertAlien');
                this.scene.stop('HelpBubble_keyboard');
                this.scene.stop();
                this.scene.launch("RewardRB",{task: singleTon.rewardRBTasks, tree: singleTon.rewardRBTree, singleTon:singleTon});
                destroyEverything();
                this.input.keyboard.removeAllKeys(true);
            } else {
                // if (expert.talking == false) {
                //     expert.talking = true;
                    if (expert.progressCounter == 5) {
                        tree.destroyTree();
                        makeRBTree(data.tree[1],this);
                        displayTask();
                        expert.talk('insertLargeTree',5);
                    }
                // }
            }           
        });

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            destroyEverything();
            this.scene.stop('Panel');
            this.scene.stop('ExpertAlien');
            this.scene.stop('HelpBubble_keyboard');
            this.scene.stop();
            this.scene.wake('MenuRB')
            this.input.keyboard.removeAllKeys(true);
        });

        // *************PLAYER*************
        var player = this.physics.add.sprite(10_000, 100, 'onion');
        player.setBounce(0.1);

        // *************KEYBOARD*************
        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


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
        
        // *************INITIALIZE BST*************

        var tree;
        makeRBTree(data.tree[0],this);

        function makeRBTree(numsArray,scene) {
            numsToInsert = numsArray;
            tree = new Tree(singleTon.redBlackColor2, scene);
            // BST (intially an empty/null root node)
            tree.isRB = true;
            tree.createRoot(scene);
            tree.createTree(numsToInsert,scene);
            tree.openCurtains();
            setPhysicsTree(tree.root,scene);
            player.setPosition(tree.root.x,tree.root.y-BUFFER);

        }

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkFlip, fkeyIsPressed, scene);
                scene.physics.add.overlap(player, node, checkInsertion, enterkeyIsPressed, scene);
                scene.physics.add.overlap(player, node, checkRight, rkeyIsPressed, scene);
                scene.physics.add.overlap(player, node, checkLeft, lkeyIsPressed, scene);

                // redraw
                scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }

        function redrawTree(node) {
            // if(node.parent != null){
            tree.updateDistances(node.parent, node.posX);
            // }
            tree.redraw(this);
        }
        
       // *************** TASKS + TASK ACTIONS ***************


        // displays what operations needs to be performed by the player
        displayTask();

        // while there are still some tasks in the array, displays text on the panel indicating what needs to be done
        function displayTask() {
            if (tasks.length != 0) { 
                panel.refreshTask('Insert ' + tasks[0]);
            } else {
                panel.allTasksDone();
            }
        }

        function taskSucceededActions() {
            if(tree.checkCorrectnessRBTree(tree.root)) {     // if RB tree is correct
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                panel.greenFeedback();
                singleTon.updateSetRB(tasks[0]);
                if (tasks[0] == 210 && !(singleTon.nodeSetRB.has(node_210))) {
                    singleTon.addNodeRB(node_210)
                }
                tasks.shift();
                if (tasks.length == 0) {
                    panel.allTasksDone();
                }
            } else {                                         // if RB tree is NOT correct yet
                // panel says that the RB tree needs to be corrected
                panel.refreshTask('Fix the tree!'); 
            }
            tree.setvarToReturnToDefault(); 
        }

        // *************** CHECK SEARCH + INSERT A NEW NODE ***************


        var enterAllowed = false;
        function enterkeyIsPressed() {
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

        
        function checkInsertion(player,nodeThatPlayerStandsOn) {
            checkInsertionH(tree.root,nodeThatPlayerStandsOn,player,this);
        }
   
        function checkInsertionH(node, nodeThatPlayerStandsOn, player,scene) {
            if (tasks.length != 0) {
                if (node.key == 'null') {
                    if (node == nodeThatPlayerStandsOn) {
                        tree.insertManual(nodeThatPlayerStandsOn, tasks[0], scene);
                        nodeThatPlayerStandsOn.curtain.visible = false;
                        setPhysicsTree(nodeThatPlayerStandsOn, scene)
                        animateInsertion(node, scene)
                        // player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        // panel.greenFeedback();
                        taskSucceededActions();
                        if (tasks[0] == data.task[0]){
                            expert.talk('insertLargeTree',1);
                        }
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

        function animateInsertion(node, scene) {

            scene.input.keyboard.enabled = false;

            node.setAlpha(0);
            node.keyString.setAlpha(0);
            node.curtain.setAlpha(0);
            node.left.setAlpha(0);
            node.left.keyString.setAlpha(0);
            node.left.link.setAlpha(0);
            node.right.setAlpha(0);
            node.right.keyString.setAlpha(0);
            node.right.link.setAlpha(0);

            scene.add.tween({
                targets: [node, node.keyString, node.curtain, node.left, node.left.keyString, node.left.link, node.right, node.right.keyString, node.right.link],
                ease: 'Sine.easeIn',
                duration: 1000,
                alpha: "+=1"
            });

            scene.input.keyboard.enabled = true;


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

                if(tasks[0] == data.task[0]) {
                    expert.talk('insertLargeTree', 3)
                }

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
                rotateRight(this, player, node)
                if (tasks[0] == data.task[0]) {
                    expert.talk('insertLargeTree', 2)
                }
            } else {
                panel.redFeedback();
                player.setPosition(tree.root.posX, tree.root.posY - BUFFER)
            }
        }
    

        function rotateRight(scene,player, node) {                              
            if(node.key != 'null' && node.left.isRed && node.isRed && !node.parent.right.isRed) {
                // node = 44
    
                // DISABLE KEYBOARD
                scene.input.keyboard.enabled = false;
    
                // change links
                // update depths
                // find deepest node - NOT NEEDED SO FAR
                // updateDistances - for 66s branch only now, because 10 doesn't change anything
                tree.updateLinksRight(node);

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
                scene.add.tween({
                    targets: [node.link, node.right.link, node.right.left.link],
                    ease: 'Sine.easeOut',
                    delay: 500,
                    duration: 1000,
                    alpha: '-=1',
                });

                // NEW: create tweens to move the nodes and the links
                // OLD: destroy links (of nodes that DO NOT change what they point to):
                scene.time.addEvent({
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
                    args: [scene,node]
                });

                scene.time.addEvent({
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
                    args: [scene, node]
                });

                scene.time.addEvent({
                    delay: 6200,
                    callback: function(scene) {
                        scene.input.keyboard.enabled = true;
                        // do panel and task stuff here
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        tree.redrawTweened(scene);
                    },
                    args: [scene]
                });
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
                rotateLeft(this, player, node)
                 this.time.addEvent({
                    delay: 500,
                    callback: function(scene) {

                        console.log(tree.checkCorrectnessRBTree(tree.root))

                        if(tree.checkCorrectnessRBTree(tree.root))  {                   
                            
                            if (tasks[0] == data.task[0]) {  // if it's the first task then talk about that
                                expert.talk('insertLargeTree',4);
                            } else {
                                expert.talk('insertLargeTree',6);
                                panel.rewardNodeActions(210);
                            }

                            taskSucceededActions()

                        }

                        tree.setvarToReturnToDefault () 
                        
                    },
                    args: [this]
                });
               
            } else {
                panel.redFeedback();
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
            }

        }
        

        function rotateLeft(scene, player, node) {                                
            if(node.key != 'null' && node.parent != null && node.isRed && node.parent.right == node) { // when the node we stand on is red and its link is a right leaning link
                // node = 50
    
                // DISABLE KEYBOARD
                scene.input.keyboard.enabled = false;
    
                // change links
                // update depths
                // updateDistances - for 66s branch only now, because 10 doesn't change anything
                tree.updateLinksLeft(node);

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

                // animate:
                // ATTENTION: the pointers are updated, but visuals on the game are the old ones

                // hide links (of nodes that change what they point to):
                scene.add.tween({
                    targets: [node.link, node.left.link, node.left.right.link],
                    ease: 'Sine.easeOut',
                    delay: 500,
                    duration: 1000,
                    alpha: '-=1',
                });

                // NEW: create tweens to move the nodes and the links
                // OLD: destroy links (of nodes that DO NOT change what they point to):
                scene.time.addEvent({
                    delay: 2000,
                    callback: function(scene,node) {
                        // tree.destroyLinks(node);
                        createMovingTweens(scene,node);     // NODES TWEENS IN HERE
                    },
                    args: [scene,node]
                });

                scene.time.addEvent({
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
                    args: [scene, node]
                });

                scene.time.addEvent({
                    delay: 6200,
                    callback: function(scene,node) {
                        scene.input.keyboard.enabled = true;
                        // do panel and task stuff here
                        // console.log(node.left.left.left.key);
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        // tree.updateDistances(node.left.left.left,node.left.left.left.right.posX);
                        tree.redrawTweened(scene);
                    },
                    args: [scene,node]
                });
            }
        }

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
                    
                    var oldAngle = node.calcAngle(tree.z,O);
                    var newAngle = node.calcAngle(tree.z,N);
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
        controls.update(delta); // needed for camera moving and zooming

        if (expert.talking) {   // only allow to perform operation when expert is done talking
            keyF.enabled = false;
            keyR.enabled = false;
            keyL.enabled = false;
            keyEnter.enabled = false;
            spacebar.enabled = false;
        } else {
            keyF.enabled = true;
            keyR.enabled = true;
            keyL.enabled = true;
            keyEnter.enabled = true;
            spacebar.enabled = true;
        }
    }

}