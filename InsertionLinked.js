import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';

export class InsertionLinked extends Phaser.Scene {

    constructor() {
        super({ key:'InsertionLinked' });
    }

    preload() {
        this.load.spritesheet('onion', 'Assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 60;

        // *************SCENE SPECIFIC CODE*************
        // Text on top of the game world
        var text1 = this.add.text(2000,100, 'Level 2: Insert', { fontSize: '30px', fill: '#000' });
        //Instructions
        // var text2 = this.add.text(2700,100, 'Instructions:\nPress ENTER to insert while standing on null node\nPress left arrow to move to the left child\nPress right arrow to move to the right child\nPress up arrow to move to the parent', { fontSize: '20px', fill: '#000' });

        // Clafifications on the Insert Operation
        // var text3 = this.make.text({
        //     x: 2700,
        //     y: 900,
        //     text: 'You always start searching from the root. To find a key in the tree you have to compare it with the root key and go left if it’s smaller than the root key or go right if it’s bigger than the root key. You have to repeat this step until you reach a null node - that’s where you insert (by pressing ENTER).',
        //     origin: { x: 0.5, y: 0.5 },
        //     style: {
        //         fontSize:'28px ',
        //         fill: 'black',
        //         align: 'justify',
        //         wordWrap: { width: 1600 }
        //     },
        // });

        // var text4 = this.add.text(2300,1030, 'To go back to the home page press ESC', { fontSize: '30px', fill: '#000' });

        // Go back to the home page
        // var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        // keyEscape.on('down', () => {
        //     this.scene.switch('BSTIntroduction');
        // });

        // Switches from this scene to InsertionLinked
        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            this.scene.switch('DeleteLinked');
        });

        // Restart the current scene
        var keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyR.on('down', () => {
            destroyEverything();
            this.scene.restart('InsertionLinked');
            this.input.keyboard.removeAllKeys(true);
        });

        // *************PLAYER*************
        // var player = this.physics.add.sprite(2500, 300, 'onion');
        var player = this.physics.add.sprite(10_000, 300, 'onion');

        player.setBounce(0.1);

       // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

      

        // *************CAMERA AND ZOOM*************
        // this.cameras.main.setBounds(0, 0, 5000, 5000);
        this.cameras.main.setBounds(0, 0, 20_000, 20_000);
        // this.cameras.main.startFollow(player, true, 0.08, 0.08);
        // this.cameras.main.centerOn(2700,500);
        this.cameras.main.zoom = 0.75;
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

        // *************INITIALIZE BST*************
        // Array of nodes to be inserted into BST automatically by insertNodes
        var numsToInsert = [33,1,14,5,17,16,55,50,70,48,53,60,80];
        //var numsToInsert = [28,13,77,7,21,50,100,18];
        // var numsToInsert = [33,11,44,10,12,55,5,13,50,70,3,8,17,48,53,60,80,4];
        // var numsToInsert = ["S","E","X","A","R","C","H","M"]
        
        var tree = new Tree(this);
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
                // redraw
                scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }

        function redrawTree(node) {
            tree.updateDistances(node.parent, node.posX);
            tree.redraw(tree.root,this);
        }

        //***************INSERTION***************

        // elements to insert
        var tasks = [3,77];
        // displays what operations needs to be performed by the player
        var taskText = this.add.text(2000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask(this);
        // for displaying feedback after completing tasks
        var feedback = this.add.text(2000,150, '', { fontSize: '20px', fill: '#000' });;

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
                        insert(nodeThatPlayerStandsOn,scene);
                        taskSucceededActions(this);
                        // tree.closeCurtains();
                    } else {
                        feedback.setText('Try again');
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

        function insert(node,scene) {
            if(node.key == 'null') {
                node.setKey(tasks[0]);
                node.setNodeGraphics();
                node.curtain.setVisible(false);

                // create left child
                var childL = new NodeBST(scene, node.posX-tree.w, node.posY+tree.w, 'null',node.dpth+1,node);
                childL.distanceFromParent = -tree.w;
                tree.nodearray.push(childL);

                // create right child
                var childR = new NodeBST(scene, node.posX+tree.w, node.posY+tree.w, 'null',node.dpth+1,node);
                childR.distanceFromParent = tree.w;
                tree.nodearray.push(childR);

                node.setChildren(childL,childR);
            
                // update depth of the tree
                if (childL.dpth > tree.treedpth) {
                    tree.treedpth = childL.dpth;
                }
            }
        }

        //while there are still some tasks in the array, displays text indicating what needs to be done
        //when tasks is empty then press P to continue to next lesson
        function displayTask(scene) {
            if (tasks.length != 0) { 
                taskText.setText('Insert ' + tasks[0]);
            } else {
                // feedback.destroy();
                taskText.setText('Press SPACEBAR to learn new operation'); 
                taskText.setPosition(1900,1100);
                taskText.setFill('#0356f0');
                taskText.setFontSize(60);
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tasks.shift();
            feedback.setPosition(2000,150);
            feedback.setText('Good job!!!');
            displayTask(scene);
        }
       
        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            text1.destroy();
            // text2.destroy();
            // text3.destroy();
            // text4.destroy();
            feedback.destroy();
            taskText.destroy();
        }  
    }

    update() {

    }
}