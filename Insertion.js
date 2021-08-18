import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
import { Panel } from './Panel.js';
import { ExpertAlien } from './ExpertAlien.js';
import { HelpBubble } from './HelpBubble.js';

var panel;
var expert;
var tasks;
var numsToInsert;
var singleTon;
var data;
var controls;
var gotoRB;
const node_400 = {x:935, y:813, name: "node_400"}

export class Insertion extends Phaser.Scene {

    constructor() {
        super({ key:'Insertion' });
    }

    init (data1) {
        tasks = [];
        numsToInsert = [];
        singleTon = data1.singleTon
        numsToInsert = data1.tree
        tasks = [...data1.task]
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
        panel.setLevelName('BST Insertion');
        if(tasks[0] == 97){
            expert.talk('reward',0,'close');
        } else {
            expert.talk('insert',0,'continue');
        }
    }

    create() {

        gotoRB = false;

        // create the nodes for the reward level
        panel.loopOverNodes(singleTon.nodeSet)
        panel.loopOverTools(singleTon.toolSet)

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background_planet_raisin').setDepth(-1);

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            if (gotoRB) {
                this.scene.stop('Panel');
                this.scene.stop('ExpertAlien');
                this.scene.stop('HelpBubble_keyboard');
                this.scene.stop();
                this.scene.run('MenuRB',singleTon);
            } else if(tasks.length == 0 && data.task.length != 7 ) {
                this.scene.stop('Panel');
                this.scene.stop('ExpertAlien');
                this.scene.stop('HelpBubble_keyboard');
                this.scene.stop();
                this.scene.launch("Deletion",{task: singleTon.deleteMinTasks, tree: singleTon.deleteMinTree, singleTon:singleTon, levelName: 'BST Delete min'});
                destroyEverything();
                this.input.keyboard.removeAllKeys(true);
            } else if (expert.talking == false) {
                expert.talking = true;
                if (expert.progressCounter == 1 && tasks[0] == 600) {
                    expert.talk('insert',1,'close');
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

        // ************* NUMBERS TO INSERT *************
        // Array of nodes to be inserted into BST automatically by insertNodes
        // var numsToInsert = [13,36,50,78,84,98,48,47,22,24,34,32,11];
        
        // *********************
        
        // GENERATE RANDOM
        // var numsToInsert = generateNumsToInsert(30);
        // console.log(numsToInsert);

        // function generateNumsToInsert(n) {
        //     var arr = [];
        //     var i;
        //     for(i=0;i<n;i++){
        //         var number = Math.floor(Math.random() * (999 - 1) + 1);
        //         if(!arr.includes(number)){
        //             arr.push(number);
        //         }
        //     }
        //     return arr;
        // }

        // function generateNumsForInsertTask(n) {
        //     var arr = [];
        //     var i;
        //     for(i=0;i<n;i++){
        //         var number = Math.floor(Math.random() * (999 - 1) + 1);
        //         if(!arr.includes(number) && !numsToInsert.includes(number)){
        //             arr.push(number);
        //         }
        //     }
        //     return arr;
        // }
        
        // *************INITIALIZE BST*************

        var tree = new Tree(singleTon.insertColor,this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // specific to insert explanation
                scene.physics.add.overlap(player, node, triggerExplanation, null, scene);

                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkInsertion, enterIsPressed, scene);

                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }
        
        
       // *************** TASKS + TASK ACTIONS ***************

        displayTask();

        //while there are still some tasks in the array, displays text indicating what needs to be done
        function displayTask() {
            if (tasks.length != 0) { 
                panel.refreshTask('Insert ' + tasks[0]);
            } else {
                panel.allTasksDone();
                if (expert.progressCounter == 4) {
                    expert.talk('insert',4,'continue');
                }
                // TODO:
                // if (the level is reward) {
                //     when all tasks are done - display reward popup
                //     then tell player to go back to menu and learn rb bst
                // } else {
                //     panel.allTasksDone();
                // }
                if (singleTon.nodeSet.size == 7 && data.task.length == 7) {
                    if (tasks.length == 0) {
                        singleTon.addTool({x:1320, y:833, name: "wrench"});
                        gotoRB = true;
                        panel.task.setText('Press SPACEBAR to go to RB-BST levels!')
                        panel.displayRewardBST();
                    }
                }
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.closeCurtains();
            singleTon.updateSet(tasks[0]);
            if (tasks[0] == 600) {
                expert.talk('insert',3,'close');
            }
            if (tasks[0] == 400 && !(singleTon.nodeSet.has(node_400))) {
                singleTon.addNode(node_400)
                panel.rewardNodeActions(400);
            }
            // disappear the nodes after inserion in the reward level
            if(singleTon.nodeSet.size == 7 && data.task.length == 7 ) {
                var node = tasks[0]
                panel.destroyNode(node)
            }
            tasks.shift();
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

        function checkInsertion(player,nodeThatPlayerStandsOn) {
            checkInsertionH(tree.root,nodeThatPlayerStandsOn,player,this);
        }

        function checkInsertionH(node, nodeThatPlayerStandsOn, player,scene) {
            if (tasks.length != 0) {
                if (node.key == 'null') {
                    if (node == nodeThatPlayerStandsOn) {
                        insert(player,nodeThatPlayerStandsOn,scene);
                        panel.greenFeedback('GOOD JOB!');
                    } else {
                        panel.redFeedback('TRY AGAIN');
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        tree.closeCurtains();
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
                var childL = new NodeBST(scene, singleTon.insertColor, node.posX-tree.w, node.posY+tree.z, 'null',node.dpth+1,node);
                childL.distanceFromParent = -tree.w;
                childL.drawLinkToParent(scene);
                tree.nodearray.push(childL);

                // create right child
                var childR = new NodeBST(scene, singleTon.insertColor, node.posX+tree.w, node.posY+tree.z, 'null',node.dpth+1,node);
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
                scene.physics.add.overlap(player, childL, checkInsertion, enterIsPressed, scene);
                scene.physics.add.overlap(player, childR, checkInsertion, enterIsPressed, scene);

                // to stand on the node
                scene.physics.add.collider(player, childL);
                scene.physics.add.collider(player, childR);
            
                // update depth of the tree
                if (childL.dpth > tree.treedpth) {
                    tree.treedpth = childL.dpth;
                }

                tree.traverseAndCheckCollisions(scene);
                tree.traverseAndCheckCrossings(tree.root,scene);
                // tree.redraw(scene);
                tree.redrawTweened(scene);

                // PLAY 'BACKSTREET BOYS - TELL ME WHY' HERE

                // DISABLE KEYBOARD
                scene.input.keyboard.enabled = false;

                node.nodeGraphics.setAlpha(0);
                // node.setAlpha(0);
                node.keyString.setAlpha(0);
                node.curtain.setAlpha(0);
                childL.nullGraphics.setAlpha(0);
                // childL.setAlpha(0);
                childL.keyString.setAlpha(0);
                childL.link.setAlpha(0);
                childR.nullGraphics.setAlpha(0);
                // childR.setAlpha(0);
                childR.keyString.setAlpha(0);
                childR.link.setAlpha(0);

                scene.add.tween({
                    targets: [node.nodeGraphics, node.keyString, node.curtain, childL.nullGraphics, childL.keyString, childL.link, childR.nullGraphics, childR.keyString, childR.link],
                    ease: 'Sine.easeIn',
                    duration: 1500,
                    alpha: "+=1"
                });
                
                scene.time.addEvent({
                    delay: 1500,
                    callback: function(scene) {
                        taskSucceededActions(scene);
                        displayTask(scene);
                        scene.input.keyboard.enabled = true;
                    },
                    args: [scene]
                });
            }
        }

        // *************** INSERT EXPLANATION ***************

        var talkNodes = [595];
        function triggerExplanation(player,node) {
            if(node.parent != null) {
                if(talkNodes[0] == 595 && node.key == 'null' && node.parent.key == talkNodes[0] && node == node.parent.right && expert.progressCounter == 2) {
                    expert.talk('insert',2,'nosymbol');
                    talkNodes.shift();
                }
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
        controls.update(delta);
    }
}
