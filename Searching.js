import { Tree } from './Tree.js';
import { Panel } from './Panel.js';
import { ExpertAlien } from './ExpertAlien.js';
import { HelpBubble } from './HelpBubble.js';

// we need the nodest for when we destor the nodes. Otherwise we can just use the singleTon.nodeset
// var nodeSet;
var numsToInsert;
var tasks;
var singleTon;
var panel;
var expert;
var controls;
const node_97 = {x:880, y:813, name: "node_97"}

export class Searching extends Phaser.Scene {

    constructor() {
        super({ key:'Searching' });
    }

    init (data) {
        numsToInsert = [];
        tasks = [];
        singleTon = data.singleTon
        numsToInsert = data.tree
        tasks = data.task.slice();
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
        panel.setLevelName('BST Search');
        expert.talk('search',0,'continue');
    }

    create() {
        // create the nodes for the reward level
        panel.loopOverNodes(singleTon.nodeSet)
        panel.loopOverTools(singleTon.toolSet)
        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background_planet_darkBlue').setDepth(-1);

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {

            if(tasks.length == 0) {
                this.scene.stop('Panel');
                this.scene.stop('ExpertAlien');
                this.scene.stop('HelpBubble_keyboard');
                this.scene.stop();
                this.scene.launch("Insertion",{task: singleTon.insertTasks, tree: singleTon.insertionTree, singleTon:singleTon});
                destroyEverything();
                this.input.keyboard.removeAllKeys(true);
            } else if (expert.talking == false) {
                expert.talking = true;
                if (expert.progressCounter == 1) {
                    expert.talk('search',1,'nosymbol');
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

        // player.anims.create({
        //     key: 'player_teleport',
        //     frames: [
        //         { key: 'onion' },
        //         { key: 'teleport_1' },
        //         { key: 'teleport_2' },
        //         { key: 'teleport_3' },
        //         { key: 'teleport_4' },
        //         { key: 'teleport_5' },
        //         { key: 'teleport_6' },
        //         { key: 'teleport_7', duration: 50 }
        //     ],
        //     frameRate: 8
        // });

        // either need to make a spritesheet or somehow make those 
        // other images (except the onion) have physics on them
        // player.anims.create({
        //     key: 'player_teleport',
        //     frames: [
        //         { key: 'teleport_7' },
        //         { key: 'teleport_6' },
        //         { key: 'teleport_5' },
        //         { key: 'teleport_4' },
        //         { key: 'teleport_3' },
        //         { key: 'teleport_2' },
        //         { key: 'teleport_1' },
        //         { key: 'onion', duration: 10 }
        //     ],
        //     frameRate: 20,
        // });

        // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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

        // this.cameras.main.setBounds(0, 0, 20_000, 20_000);
        // this.cameras.main.centerOn(10_000,100);
        // this.cameras.main.startFollow(player, true, 0.08, 0.08);
        // this.cameras.main.startFollow(player, true, 0.05, 0.05);

        
        // *************INITIALIZE BST*************

        var tree = new Tree(singleTon.searchColor, this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // specific to search explanation
                scene.physics.add.overlap(player, node, triggerExplanation, null, scene);


                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkSearch, enterIsPressed, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }

        
       // *************** TASKS + TASK ACTIONS ***************


        // // displays what operations needs to be performed by the player
        var taskText = this.add.text(9000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask();

        //while there are still some tasks in the array, displays text indicating what needs to be done
        function displayTask() {
            if (tasks.length != 0) { 
                panel.refreshTask('Find ' + tasks[0]);
            } else {
                // You did it!!! You did the thing!!!!
                panel.allTasksDone();
                expert.talk('search',5,'continue');
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.closeCurtains();
            singleTon.updateSet(tasks[0]);
            if(tasks[0] == 566) {
                expert.talk('search',4,'close');
            }
            // add a node to the panel when 97 task is done
            if (tasks[0] == 97 && !(singleTon.nodeSet.has(node_97))) {
                singleTon.addNode(node_97)
                panel.rewardNodeActions(97);
            }
            tasks.shift();
        }

        function checkSearch(player, node){
            if(node.key == tasks[0]){
                panel.greenFeedback();
                node.nodeGraphics.setTint(0xFF0000);

                this.time.addEvent({
                    delay: 2000,
                    callback: function(scene) {
                        node.nodeGraphics.setTint(0xFFFFFF)
                        taskSucceededActions(scene);
                        displayTask();
                    },
                    args: [this]
                });

            }
            else if (node.key != tasks[0]) {
                panel.redFeedback();
                displayTask();
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                tree.closeCurtains();
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

        // *************** SEARCH EXPLANATION ***************

        var talkNodes = [519,566];
        function triggerExplanation(player,node) {
            if(talkNodes[0] == 519 && node.key == talkNodes[0] && expert.progressCounter == 2) {
                expert.talk('search',2,'nosymbol');
                talkNodes.shift();
            } else if(talkNodes[0] == 566 && node.key == talkNodes[0] && expert.progressCounter == 3) {
                expert.talk('search',3,'nosymbol');
                talkNodes.shift();
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
            taskText.destroy();
        }
    }

    update(time,delta) {
        controls.update(delta);
    }
}
