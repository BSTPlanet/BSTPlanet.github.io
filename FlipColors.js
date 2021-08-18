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
var spacebar;
const node_77 = {x:880, y:813, name: "node_77"}

export class FlipColors extends Phaser.Scene {

    constructor() {
        super({ key:'FlipColors' });
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
        panel.setLevelName('RB Flip Colors');
        expert.talk('flipColors',0,'nosymbol');
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
            if (tasks.length == 0) {
                this.scene.stop('Panel');
                this.scene.stop('ExpertAlien');
                this.scene.stop('HelpBubble_keyboard');
                this.scene.stop();
                this.scene.launch("RotateLeft",{task: singleTon.rotateLeftTasks, tree: singleTon.rotateLeftTree, singleTon:singleTon});
                destroyEverything();
                this.input.keyboard.removeAllKeys(true);
            } else {
                // if (expert.talking == false) {
                //     expert.talking = true;
                    if (expert.progressCounter == 2) {
                        tree.destroyTree();
                        makeRBTree(data.tree[1],this);
                        displayTask();
                        expert.talk('flipColors',2,'nosymbol');
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

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

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

            
            // make the children of the root red
            tree.root.left.isRed = true;
            tree.root.right.isRed = true; 

            // // make the graphics of the new redLinks
            tree.root.left.drawLinkToParentRB(scene);
            tree.root.right.drawLinkToParentRB(scene);
        }

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkFlip, fkeyIsPressed, scene);
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

            if (tasks[0] == 'Flip Colors Again' && !(singleTon.nodeSetRB.has(node_77))) {
                singleTon.addNodeRB(node_77)
                console.log(singleTon.nodeSetRB)
            }
            
            tasks.shift();
            
            if (tasks.length == 0) {
                panel.allTasksDone();
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
                tree.flipColors(this,node);
                node.left.drawLinkToParentRB(this);
                node.right.drawLinkToParentRB(this);

                this.time.addEvent({
                    delay: 500,
                    callback: function(scene) {
                        if (tasks[0] == data.task[0]) {  // if it's the first task then talk about that
                            expert.talk('flipColors',1);
                        } else {                         // if it's the last task then talk about the last thing and give reward node
                            expert.talk('flipColors',3);
                            panel.rewardNodeActions(77);
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
            spacebar.enabled = false;
        } else {
            keyF.enabled = true;
            spacebar.enabled = true;


        }
    }

}