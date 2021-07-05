import { Tree } from './Tree.js';

export class SearchLinked extends Phaser.Scene {

    constructor() {
        super({ key:'SearchLinked' });
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
        var text1 = this.add.text(2000,100, 'REFACTORED Level 1: Search', { fontSize: '30px', fill: '#000' });
        //Instructions
        // var text2 = this.add.text(2700,100, 'Instructions:\nPress ENTER to select the node\nPress left arrow to move to the left child\nPress right arrow to move to the right child\nPress up arrow to move to the parent', { fontSize: '20px', fill: '#000' });
        // Clafifications on the Search Operation
        // var text3 = this.make.text({
        //     x: 2700,
        //     y: 900,
        //     text: 'You always start searching from the root. To find a key in the tree you have to compare it with the root key and go left if it’s smaller than the root key or go right if it’s bigger than the root key. You have to repeat this step until the key of the node you are on is equal to the key you’re looking for - that’s when you stop because you found the node you are looking for (press ENTER to indicate you’ve found it).',
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
        var keySpacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySpacebar.on('down', () => {
            this.scene.switch('InsertionLinked');
        });

        // Restart the current scene
        var keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyR.on('down', () => {
            destroyEverything();
            this.scene.restart('SearchLinked');
            // Remove the keys (events) (cursors, spacebar and R)
            // The events was the reason why we had memory leak - the nodes were duplicating for some reason
            // maybe because of the colliders we had more events waiting for the nodes and player to collide,
            // so maybe the player was duplicated also?
            // then we set the root to null (in destroyEverything) because when root was printed it was still an object 
            this.input.keyboard.removeAllKeys(true);
        });


        // *************PLAYER*************
        var player = this.physics.add.sprite(2500, 300, 'onion');
        player.setBounce(0.1);

        // function sendPlayerToRoot() {
        //     player.setPosition(root.x,root.y-BUFFER);
        //     playerIsAtRoot = true;
        // }

        // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

      
        // *************CAMERA AND ZOOM*************
        this.cameras.main.setBounds(0, 0, 5000, 5000);
        // this.cameras.main.startFollow(player, true, 0.08, 0.08);
        this.cameras.main.centerOn(2700,500);
        this.cameras.main.zoom = 0.75;
        // this.cameras.main.startFollow(player, true, 0.05, 0.05);

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
        // var numsToInsert = [33,1,16,34];

        //var numsToInsert = [28,13,77,7,21,50,100,18];
        // var numsToInsert = [33,11,44,10,12,55,5,13,50,70,3,8,17,48,53,60,80,4];
        // var numsToInsert = ["S","E","X","A","R","C","H","M"]\

        var tree = new Tree(this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this); //this function is defined below

        // switch overlaps for correctness here
        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkSearch, enterIsPressed, scene);
                // redraw
                scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene); //redraw tree is defined below
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

        //***************SEARCH STUFF***************
        // on overlap with a node press Enter to select a node

        // elements to find, one-by-one
        var tasks = [16,53];
        // displays what operations needs to be performed by the player
        var taskText = this.add.text(2000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask(this);
        // for displaying feedback after completing tasks
        var feedback = this.add.text(2000,150, '', { fontSize: '20px', fill: '#000' });
      
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
            
        // on overlap with a node and when Enter is pressed, the function checks if the selected node's key
        // equals the key that the task asked to find
        function checkSearch(player, node){
            if(node.key == tasks[0]){
                tasks.shift();
                feedback.setText('Good job!!!');
                displayTask(this);
            }
            else if (tasks.length != 0) {
                feedback.setText('Try again');
                displayTask(this);
            }
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.closeCurtains();
        }

        //while there are still some tasks in the array, displays text indicating what needs to be done
        //when tasks is empty then press P to continue to next lesson
        function displayTask(scene) {
            if (tasks.length != 0) { 
                taskText.setText('Find ' + tasks[0] + ' and click ENTER');
            } else {
                feedback.destroy();
                taskText.setText('Press SPACEBAR to learn new operation'); 
                taskText.setPosition(1900,1100);
                taskText.setFill('#0356f0');
                taskText.setFontSize(60);
            }
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

        // ***************HELPERS***************

        // calculates the the dpth of the tree
        // here we give the root node as a parameter
        function calcdpth(node) {
            if (node.key === "null"){
                return 0
            } else {
                var left = calcdpth(node.left)
                var right =  calcdpth(node.right)
                return Math.max(left, right) + 1
            }  
        }

        // traverses BST recursively, starting from root and prints all keys
        // call should look like this: traverseBST(root,0);
        // I think it's Pre-Order?
        function traverseBST(node, index) {
            if (node != null) {
                traverseBST(node.left, (2*index)+1);
                traverseBST(node.right, (2*index)+2);
            }
        }
    }

    update() {

    }
}