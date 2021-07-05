import { Tree } from './Tree.js';

export class DeleteLinked extends Phaser.Scene {

    constructor() {
        super({ key:'DeleteLinked' });
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
        var text1 = this.add.text(2000,100, 'Level 3: Delete', { fontSize: '30px', fill: '#000' });
        //Instructions
        // var text2 = this.add.text(2700,100, 'Instructions:\nPress BACKSPACE to delete\nPress left arrow to move to the left child\nPress right arrow to move to the right child\nPress up arrow to move to the parent', { fontSize: '20px', fill: '#000' });

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
        //     this.scene.stop('DeleteLinked');
        //     this.scene.start('SearchLinked');
        // });

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            this.scene.switch('Expanding');
        });

         // Restart the current scene
        var keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyR.on('down', () => {
            destroyEverything();
            this.scene.restart('DeleteLinked');
            this.input.keyboard.removeAllKeys(true);
        });

        // *************PLAYER*************
        var player = this.physics.add.sprite(2500, 300, 'onion');
        player.setBounce(0.1);

        // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        var keybackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        // *************CAMERA AND ZOOM*************
        this.cameras.main.setBounds(0, 0, 5000, 5000);
        // this.cameras.main.startFollow(player, true, 0.08, 0.08);
        this.cameras.main.centerOn(2700,500);
        this.cameras.main.zoom = 0.7;
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
        var numsToInsert = [33,1,14,5,17,16,55,50,70,48,53,60,80,3,77];
        // var numsToInsert = [1,0,-1,-2,-3,23,24,25];
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
                scene.physics.add.overlap(player, node, deleteNode, backspaceIsPressed, scene);
                scene.physics.add.overlap(player, node, checkAndDeleteSecondNode, enterIsPressed, scene);
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

        function redrawTreeStandalone(node,scene) {
            if (node.parent == null){ // when node is root
                tree.updateDistances(node, node.posX);
            } else {
                tree.updateDistances(node.parent, node.posX);
            }
            tree.redraw(tree.root,scene);
        }
        
        // scene.physics.add.overlap(player, childL, deleteMin, cursorDownIsPressed, scene);

        
       // ***************DELETION***************

        // elements to delete, one-by-one
        var tasks = ['Min',48,'Max'];
        // displays what operations needs to be performed by the player
        var taskText = this.add.text(2000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask(this);
        // for displaying feedback after completing tasks
        var feedback = this.add.text(2000,150, '', { fontSize: '20px', fill: '#000' });

        //while there are still some tasks in the array, displays text indicating what needs to be done
        //when tasks is empty then press P to continue to next lesson
        function displayTask(scene) {
            if (tasks.length != 0) { 
                taskText.setText('Delete ' + tasks[0] + ' using BACKSPACE');
            } else {
                taskText.setText('You did it!!! You did the thing!!!!'); 
                taskText.setPosition(1900,1100);
                taskText.setFill('#ff0062');
                taskText.setFontSize(80);
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tasks.shift();
            feedback.setPosition(2000,150);
            feedback.setText('Good job!!!');
            displayTask(scene);
            tree.calculateHeight();
            tree.closeCurtains();
        }

        // //**************MVP ONLY - BUTTON FOR FEEDBACK */
        // function createButton(scene){
        //     var button = scene.add.text(1900,800, 'Click here to give us feedback', { fontSize: '60px', fill: '#F25278' }).setInteractive();
        //     button.on('pointerup', openExternalLink, scene);
        //     return button;
        // }

        // function openExternalLink ()
        // {
        //     //TODO: add questions to the form 
        //     var url = 'https://forms.gle/N2PCDMRtzGG4JsAj8';
        //     var s = window.open(url);
        //     if (s && s.focus)
        //     {
        //         s.focus();
        //     }
        //     else if (!s)
        //     {
        //         window.location.href = url;
        //     }
        // }

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

        function deleteNode(player, node) {
            if (tasks.length != 0) {
                if (node.key != 'null' && (tasks[0] == node.key || (tasks[0] == 'Min' && node.key == min(tree.root)) || (tasks[0] == 'Max' && node.key == max(tree.root))) && nodeToDelete == null) {
                    if (node.left.key =='null' && node.right.key =='null') { //  both children are null 
                        node.setKey('null');
                        node.setNullGraphics();
                        node.left.destroyNode();
                        node.right.destroyNode();
                        node.setChildren(); // set children as null
                        taskSucceededActions(this);
                    } else if (node.right.key == 'null' || node.left.key  == 'null') { // one child is null
                        if (node.right.key == 'null') { // right child is null
                            node.setKey(node.left.key);
                            var newL = node.left.left;
                            var newR = node.left.right;
                        } else {  // left child is null
                            node.setKey(node.right.key);
                            var newL = node.right.left;
                            var newR = node.right.right;
                        }
                        node.left.destroyNode();
                        node.right.destroyNode();
                        node.setChildren(newL, newR);
                        node.left.parent = node;
                        node.right.parent = node;
                        taskSucceededActions(this);
                        redrawTreeStandalone(node,this);                     
                    } else { // both children are NOT null
                        // setting a value of nodeToDelete to use it after user clicks Enter
                        nodeToDelete = node;
                        nodeToDelete.setFillStyle(0xff0090, 1);
                        feedback.setPosition(nodeToDelete.x-700,250);
                        feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.');
                    }
                } else {
                    feedback.setPosition(2000,150);
                    feedback.setText('Try again');                
                    if(nodeToDelete != null) //node.left.key  != 'null' && node.right.key  != 'null' && 
                    {
                        feedback.setPosition(nodeToDelete.x,185);
                        feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.\n\nTRY AGAIN'); 
                    } else {
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    }
                }
            }
        }

        //code used on overlap when the user clicks Enter - part of the deleteNode logic for deleting nodes with two children

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

        function checkAndDeleteSecondNode(player, node){
            if(nodeToDelete != null && node.key != 'null'){
                var key = min(nodeToDelete.right);
                if(node.key == key){
                    nodeToDelete.setKey(node.key);
                    nodeToDelete.setFillStyle(0xff7394, 1);
                    deleteMin(node);
                    nodeToDelete = null; 
                    taskSucceededActions(this);
                    redrawTreeStandalone(node,this);
                }
                else{
                    player.setPosition(nodeToDelete.x,nodeToDelete.y-BUFFER);
                    feedback.setPosition(nodeToDelete.x,175); 
                    feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.\n\nTRY AGAIN');
                }
            }
        }

        // HELPER FOR deleteNode
        // THIS FUNCTION IS USED IN THE checkAndDeleteSecondNode FUNCTION
        // deletes the min node
        function deleteMin(node){
            if (node.right.key != 'null') {
                node.setKey(node.right.key);
                var newL = node.right.left;
                var newR = node.right.right;
                node.left.destroyNode();
                node.right.destroyNode();
                node.setChildren(newL, newR);
                node.left.parent = node;
                node.right.parent = node;
            } else {
                node.setKey('null');
                node.setNullGraphics();
                node.left.destroyNode();
                node.right.destroyNode();
                node.setChildren(); // set children as null
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


        //NOT USED - TO DELETE?
        //CODE FOR OLD(!!!) DELETEMIN AND DELETEMAX

        // var keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // keyD.on('down', () => {
        //     deleteMin(root,this);
        //     redraw(root, this);
        // });

        // var keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        // keyM.on('down', () => {
        //     deleteMax(root,this);
        //     redraw(root, this);
        // });

        // function deleteMin(node,scene) { 
        //     // The null nodes at the end of the tree will have null links
        //     if (node != null && node.key != 'null'){
        //         if (node.left.key != 'null') {
        //             deleteMin(node.left,scene);
        //         } else if (node.parent==null) { //root
        //             if (node.left == 'null' && node.right == 'null') { // when root has no children
        //                 node.destroy();
        //                 node.left.link.destroy()
        //                 node.left.destroy()
        //                 node.right.link.destroy()
        //                 node.right.destroy()
        //                 root = createRoot(scene);
        //                 treedpth = height(root);
        //                 console.log(root.key)
        //                 return root.key
        //             } else { // when root has one child (root will be right child)
        //                 var x = root.x;
        //                 var y = root.y;
        //                 root = node.right
        //                 root.x = x;
        //                 root.y = y;
        //                 root.parent = null;
        //                 root.dpth = 0
        //                 node.left.link.destroy()
        //                 node.left.destroy()
        //                 node.right.link.destroy()
        //                 node.destroy()
        //                 treedpth = height(root)
        //             }
        //         } else { //any other node
        //             node.key = node.right.key;
        //             node.left.link.destroy();
        //             node.right.link.destroy();
        //             node.left.destroy();
        //             node.right.destroy();
        //             // update children
        //             node.left = node.right.left;
        //             node.right = node.right.right;
        //             treedpth = height(root);
        //         }
        //     }
        // }

        // function deleteMax(node,scene) {
        //     // The null nodes at the end of the tree will have null links
        //     if (node != null && node.key != 'null'){
        //         if (node.right.key != 'null') {
        //             deleteMax(node.right,scene);
        //         } else if (node.parent==null) { //root
        //             if (node.left == 'null' && node.right == 'null') { // when root has no children
        //                 node.destroy();
        //                 node.left.link.destroy()
        //                 node.left.destroy()
        //                 node.right.link.destroy()
        //                 node.right.destroy()
        //                 root = createRoot(scene);
        //                 treedpth = height(root);
        //             } else { // when root has one child (root will be left child)
        //                 var x = root.x;
        //                 var y = root.y;
        //                 root = node.left
        //                 root.x = x;
        //                 root.y = y;
        //                 root.parent = null;
        //                 root.dpth = 0
        //                 node.right.link.destroy()
        //                 node.left.link.destroy()
        //                 node.right.destroy()
        //                 node.destroy()
        //                 treedpth = height(root)
        //             }
        //         } else { //any other node
        //             node.key = node.left.key;
        //             node.left.link.destroy();
        //             node.right.link.destroy();
        //             node.left.destroy();
        //             node.right.destroy();
        //             // update children
        //             node.right = node.left.right;
        //             node.left = node.left.left;
        //             treedpth = height(root);
        //         }
        //     }
        // }

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
