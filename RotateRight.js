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
var keyR;
var spacebar;
// the last element we are going to insert manually so we dont need to change the Rotate Left code

const node_27 = {x:990, y:813, name: "node_27"}

export class RotateRight extends Phaser.Scene {

    constructor() {
        super({ key:'RotateRight' });
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
        panel.setLevelName('RB Rotate Left');
        expert.talk('rotateRight',0);
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
             if (tasks.length == 0){
                this.scene.stop('Panel');
                this.scene.stop('ExpertAlien');
                this.scene.stop('HelpBubble_keyboard');
                this.scene.stop();
                this.scene.launch("InsertLarger",{task: singleTon.insertLargerTasks, tree: singleTon.insertLargerTree, singleTon:singleTon});
                destroyEverything();
                this.input.keyboard.removeAllKeys(true);
            } else {
                // if (expert.talking == false) {
                //     expert.talking = true;

                    if (expert.progressCounter == 1 ) {
                        expert.talk('rotateRight',1)
                    }
                    if (expert.progressCounter == 3) {
                        tree.destroyTree();
                        makeRBTree(data.tree[1],this);
                        displayTask();
                        expert.talk('rotateRight', 3);
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
            //  crate a tree for all element except the last element that is going to be inserted manually  
            tree.createTree(numsToInsert, scene);
            tree.openCurtains();
            setPhysicsTree(tree.root,scene);
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.root.left.left.isRed = true;
            tree.root.left.left.drawLinkToParentRB(scene);
        }
        

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkRight, rkeyIsPressed, scene);
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
                panel.refreshTask(tasks[0]);
            } else {
                panel.allTasksDone();
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            panel.greenFeedback();
            
            singleTon.updateSetRB(tasks[0])

            if (tasks[0] == 'Rotate Right Again' && !(singleTon.nodeSetRB.has(node_27))) {
                console.log(singleTon.nodeSetRB)
                singleTon.addNodeRB(node_27)
            }

            tasks.shift();
            
            if (tasks.length == 0) {
                panel.allTasksDone();
            }
        }   

        // *************** CHECK ROTATE RIGHT + ROTATE RIGHT  + ANIMATIONS ***************

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
            if(expert.progressCounter >= 2){
            if(node.key != 'null' && node.left.isRed && node.isRed && !node.parent.right.isRed && !node.right.isRed) {
                rotateRight(this, player, node)

                this.time.addEvent({
                    delay: 500,
                    callback: function(scene) {
                        if (tasks[0] == data.task[0]) {  // if it's the first task then talk about that
                            expert.talk('rotateRight',2);
                        } else {                         // if it's the last task then talk about the last thing and give reward node
                            expert.talk('rotateRight',4);
                            panel.rewardNodeActions(27);
                        }
                        taskSucceededActions(scene);
                    },
                    args: [this]
                });

            } else {
                panel.redFeedback();
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
            }
        }
    }

        function rotateRight(scene, player, node) {                                
            // if(node.key != 'null' && node.left.isRed && node.isRed && !node.parent.right.isRed) {
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
            // }
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

        if (expert.talking) {   
            keyR.enabled = false;
            spacebar.enabled = false;
        } else {
            keyR.enabled = true;
            spacebar.enabled = true;
        }
    }



    
}