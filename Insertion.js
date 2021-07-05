import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
import { Panel } from './Panel.js';
import { ExpertAlien } from './ExpertAlien.js';

var panel = null;
var expert = null;
var tasks;
var numsToInsert;

export class Insertion extends Phaser.Scene {

    constructor() {
        super({ key:'Insertion' });
    }

    init (data) {
        tasks = [];
        numsToInsert = [];
        numsToInsert = data.tree
        tasks.push(data.task)
        console.log("Task: " + data.task)
    }

    preload() {
        // this.load.image('onion', 'Assets/onion.png');
        this.load.image('background', 'Assets/background_planet_beige_singleLarge.png');
        this.load.image('onion', 'Assets/alien_pink.png');
        this.load.image('node_yellow', 'Assets/node_yellow_scaled.png'); // yellow node
        this.load.image('node_curtain', 'Assets/node_curtain.png'); // yellow node curtain
        this.load.image('node_null', 'Assets/node_null_scaled.png'); // gray node null

        // *************INIT PANEL AND EXPERT*************
        if (panel == null) {
            panel = this.scene.add('Panel', Panel, true);
        } else {
            this.scene.restart('Panel');
        }
        expert = this.scene.add('ExpertAlien', ExpertAlien, true);
    }

    create() {

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        var nodetoreturn = null;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background').setDepth(-1);

        // Text on top of the game world
        // var text1 = this.add.text(9_000,100, 'INSERTION BST', { fontSize: '30px', fill: '#000' });
        //Instructions
        // var text2 = this.add.text(10_300,100, 'Instructions: press ENTER to insert', { fontSize: '20px', fill: '#000' });

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
            // this.scene.restart('Insertion');
            this.scene.restart('Insertion', {task: 400, tree: [879, 384, 181, 509, 580, 978, 595, 219]});
            // this.scene.restart('ExpertAlien');
            // this.scene.restart('Panel');
            this.input.keyboard.removeAllKeys(true);
        });

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            // destroyEverything();
            // this.scene.stop('Insertion');
            this.scene.sleep('Panel');
            this.scene.sleep('ExpertAlien');
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
        this.cameras.main.zoom = 0.7;
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
        // Array of nodes to be inserted into BST automatically by insertNodes
        // var numsToInsert = [13,36,50,78,84,98,48,47,22,24,34,32,11];
        
        // *********************
        
        // GENERATE RANDOM
        // var numsToInsert = generateNumsToInsert(30);
        console.log(numsToInsert);

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
                scene.physics.add.overlap(player, node, checkInsertion, enterIsPressed, scene);
                // redraw
                // scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }

        // function redrawTree(node) {
        //     tree.checkCollisions(node);
        //     tree.redraw(this);
        // }
        
        
       // *************** TASKS + TASK ACTIONS ***************

        // elements to delete, one-by-one
        // var tasks = ['Min',48,'Max'];
        // var tasks = [99,6,3,1,42,48,25,7,9,8,0];
        // var tasks = [99,99,99,99,99,99,99,99,99,99]
        // var tasks = [473, 236, 346, 213, 182, 75, 175, 290];
        // var tasks = [408, 613, 779, 957, 813, 330, 461, 110, 695, 768]
        // var tasks = [33,1,14,5,17,16,55,50,70,48,53,60,80,3,77];
        // var tasks = generateNumsForInsertTask(2);

        // // displays what operations needs to be performed by the player
        var taskText = this.add.text(10_000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask();
        // // for displaying feedback after completing tasks
        var feedback = this.add.text(10_000,150, '', { fontSize: '20px', fill: '#000' });

        // //while there are still some tasks in the array, displays text indicating what needs to be done
        // //when tasks is empty then press P to continue to next lesson
        function displayTask() {
            if (tasks.length != 0) { 
                // taskText.setText('Insert ' + tasks[0]);
                panel.refreshTask('Insert ' + tasks[0]);
            } else {
                // taskText.setText('You did it!!! You did the thing!!!!'); 
                // taskText.setPosition(9000,1100);
                // taskText.setFill('#ff0062');
                // taskText.setFontSize(80);
                // panel.refreshTaskDone('You are done!\nPress SPACEBAR to learn deletion!');
                panel.refreshTaskDone('refresh the page to restart this level');
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tasks.shift();
            // feedback.setPosition(2000,150);
            // feedback.setText('Good job!!!');
            // displayTask(scene);
            // tree.calculateHeight();
            // tree.closeCurtains();
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
                        // insert(nodeThatPlayerStandsOn,scene);
                        insert(player,nodeThatPlayerStandsOn,scene);
                        // taskSucceededActions(this);
                        // tree.closeCurtains();
                        panel.greenFeedback('GOOD JOB!');
                    } else {
                        // feedback.setText('Try again');
                        panel.redFeedback('TRY AGAIN');
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    }
                } else if (node.key > tasks[0]) {
                    checkInsertionH(node.left,nodeThatPlayerStandsOn,player,scene);
                } else if (node.key < tasks[0]) {
                    checkInsertionH(node.right,nodeThatPlayerStandsOn,player,scene);
                }
            } else {
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                // tree.closeCurtains();
            }
        }

        function insert(player,node, scene) {
            if(node.key == 'null') {
                node.setKey(tasks[0]);
                node.setNodeGraphics();
                node.curtain.setVisible(false);

                // create left child
                var childL = new NodeBST(scene, node.posX-tree.w, node.posY+tree.z, 'null',node.dpth+1,node);
                childL.distanceFromParent = -tree.w;
                tree.nodearray.push(childL);

                // create right child
                var childR = new NodeBST(scene, node.posX+tree.w, node.posY+tree.z, 'null',node.dpth+1,node);
                childR.distanceFromParent = tree.w;
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

                scene.physics.add.collider(player, childL);
                scene.physics.add.collider(player, childR);
                // redraw
                // scene.physics.add.overlap(childL, tree.nodearray, redrawTree, null, scene);
                // scene.physics.add.overlap(childR, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
            
                // update depth of the tree
                if (childL.dpth > tree.treedpth) {
                    tree.treedpth = childL.dpth;
                }

                tree.traverseAndCheckCollisions(scene);
                tree.traverseAndCheckCrossings(tree.root,scene);
                tree.redraw(scene);

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
                    duration: 1000,
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

        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();

            // panel.destroy();
            // expert.destroy();

            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            // text1.destroy();
            // text2.destroy();
            // text3.destroy();
            // text4.destroy();
            feedback.destroy();
            taskText.destroy();
            tasks = null;
            numsToInsert = null;
        }
    }

    update() {

    }
}
