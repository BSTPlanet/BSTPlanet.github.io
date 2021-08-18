import { Tree } from './Tree.js';
import { Panel } from './Panel.js';
import { ExpertAlien } from './ExpertAlien.js';

var numsToInsert;
var nodeSet;
var tasks;
var singleTon;
var panel;
var expert;
var controls;

export class About extends Phaser.Scene {

    preload () {
        this.scene.remove('Panel');
        this.scene.remove('ExpertAlien');
        panel = this.scene.add('Panel', Panel, true);
        expert = this.scene.add('ExpertAlien', ExpertAlien, true);
        panel.setLevelName('About Binary Search Trees');
    }
    
    constructor() {
        super({ key:'About' });
    }
    
    init (data) {
        numsToInsert = [];
        tasks = [];
        singleTon = data.singleTon
        numsToInsert = data.tree
        tasks = data.task.slice();
        nodeSet = [...singleTon.nodeSet]
    }
    
    create() { 

        // singleTon.nodeSet.forEach(item => this.add.image(item.x, item.y, item.name));
        panel.loopOverNodes(singleTon.nodeSet)

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;
        
        this.add.image(10_000,750,'background_planet_raisin').setDepth(-1);

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            destroyEverything();
            this.scene.stop('Panel');
            this.scene.stop('ExpertAlien');
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
            
        // *************INITIALIZE BST*************
        
        var tree = new Tree(singleTon.aboutColor, this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);
        tree.openCurtains();
        
        
        function setPhysicsTree(node,scene) {
            if (node != null) {
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
        
        //  Create the selectors
        var selector =  this.add.image(tree.root.posX, tree.root.posY, 'about_selector');
        var selectorChild  = this.add.image(tree.root.posX, tree.root.posY, 'about_selector');
        var parentSelector = this.add.image(tree.root.posX, tree.root.posY, 'about_selector');
        var subtree = this.add.image(10_325, 500, 'subtree')
        selector.visible = false;
        selectorChild.visible = false;
        parentSelector.visible = false;
        subtree.visible = false;

        this.keyBlink;
        this.linkBlink;
        this.nodeToDoThingsOn;
        
        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            console.log("Counter: " + expert.progressCounter)
            
            if (expert.talking == false) {
                expert.talking = true;
                if (expert.progressCounter == 1) {
                    displayKeys(this);
                } else if (expert.progressCounter == 2) {
                    // stop the blinking and reset color
                    this.keyBlink.remove();
                    tree.changeNodeColor(tree.root,this,"#000000");
                    // show links
                    displayLinks(this);
                } else if (expert.progressCounter == 3) {
                    // stop the blinking and reset color
                    this.linkBlink.remove();
                    tree.highlightLinkColor(tree.root,this,0xd0cfec);
                    // Find the root
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    keyEnter.enabled = true;
                    expert.disappearSpeech();
                    expert.resetTalk();
                    displayTask();
                } else if (expert.progressCounter == 4) {
                    // Find the parent
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    selector.visible = false;
                    keyEnter.enabled = true;
                    expert.disappearSpeech();
                    expert.resetTalk();
                    displayTask()
                } else if (expert.progressCounter == 5) {
                    //  Find the children
                    // Explain that the left child is smaler than the parent and the right child is grather than the parent
                    tree.highlightLinkColor(tree.root,this, 0xd0cfec)
                    selector.visible = false;
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    parentSelector.visible = false;
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    keyEnter.enabled = true;
                    expert.disappearSpeech();
                    expert.resetTalk();
                    displayTask()
                } else if (expert.progressCounter == 6) {
                    selectorChild.visible = true;
                    selector.visible = true;
                    parentSelector.visible = true;
                    parentSelector.setPosition(this.nodeToDoThingsOn.parent.posX, this.nodeToDoThingsOn.parent.posY)
                    this.nodeToDoThingsOn.highlightLinks(this.nodeToDoThingsOn,this, 0xFFFF00)
                    this.nodeToDoThingsOn.parent.right.highlightLinks(this.nodeToDoThingsOn.parent.right,this, 0xFFFF00)
                    expert.talk('about',7)
                    tasks.shift();
                } else if (expert.progressCounter == 7) {
                    // Find the subtree
                    tree.highlightLinkColor(tree.root,this, 0xd0cfec)
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    selectorChild.visible = false;
                    selector.visible = false;
                    parentSelector.visible = false;
                    keyEnter.enabled = true;
                    expert.disappearSpeech();
                    expert.resetTalk();
                    displayTask();
                } else if (expert.progressCounter == 8) {
                    // Find the depth
                    player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    subtree.visible = false;
                    keyEnter.enabled = true;
                    expert.disappearSpeech();
                    expert.resetTalk();
                    displayTask();
                } else if (expert.progressCounter == 9) {
                    this.scene.stop();
                    this.scene.launch("Searching", {task: singleTon.searchTasks, tree: singleTon.searchTree, singleTon: singleTon});
                    destroyEverything();
                    this.input.keyboard.removeAllKeys(true);
                }
            }
        });
        

        // Display the basic explanation of the BST
        expert.talking = true;
        // this.input.keyboard.ENTER.enabled = false;
        keyEnter.enabled = false;
        expert.talk('about',0)
        
        // highlight the nodes and the keys
        function displayKeys (scene) {
            keyEnter.enabled = false;
            var color = "#000000";
            expert.talk('about',1);
            scene.keyBlink = 
                scene.time.addEvent({
                    callback: function(scene) {
                        if(color == "#000000") {
                            tree.changeNodeColor(tree.root,scene,"#FFFFFF")
                            color = "#FFFFFF";    
                        } else {
                            tree.changeNodeColor(tree.root,scene,"#000000")
                            color = "#000000";     
                        } 
                    },
                    args: [scene],
                    repeat: 13, 
                    delay: 1000          
                });
        }

        // highlight the links set the color of the nodes back to default
        function displayLinks (scene) {
            keyEnter.enabled = false;
            var color = 0x000000;
            expert.talk('about',2);
            scene.linkBlink = 
                scene.time.addEvent({
                    callback: function(scene) {
                        if(color == 0x000000) {
                            tree.highlightLinkColor(tree.root,scene, 0x000000)
                            color = 0xFF0000
                        } else {
                            tree.highlightLinkColor(tree.root,scene, 0xd0cfec)
                            color = 0x000000
                        }
                    },
                    args: [scene],
                    repeat: 11, 
                    delay: 1200
                });
        }
        
        // // displays what operations needs to be performed by the player
        var taskText = this.add.text(9000,175, '', { fontSize: '22px', fill: '#000' });

        function displayTask() {
            if (tasks.length != 0) { 
                panel.refreshTask('Find ' + tasks[0]);
            } else {
                taskText.setText('You did it!!! You did the thing!!!!'); 
                taskText.setPosition(9000,1100);
                taskText.setFill('#ff0062');
                taskText.setFontSize(80);
            }
        }

        function checkSearch(player, node){
            if(node.key == tasks[0] && tasks[0] == 685) {
                keyEnter.enabled = false;
                expert.talk('about',3)
                // this.input.keyboard.enabled = false;
                selector.visible = true;
                tasks.shift();
                
            } else  if (node.key == tasks[0] && tasks[0] == 494){
                keyEnter.enabled = false;
                selector.visible = true;
                selector.setPosition(node.posX, node.posY)
                node.left.highlightLinks(node.left,this, 0xFFFF00)
                node.right.highlightLinks(node.right,this, 0xFFFF00)
                expert.talk('about',4)
                tasks.shift();

            } else  if (node.key == tasks[0] && tasks[0] == 472){
                this.nodeToDoThingsOn = node;
                keyEnter.enabled = false;
                selector.visible = true;
                selector.setPosition(node.posX, node.posY)
                selectorChild.setPosition(node.parent.right.posX, node.parent.right.posY)
                selectorChild.visible = true;
                node.highlightLinks(node,this, 0xFFFF00)
                node.parent.right.highlightLinks(node.parent.right,this, 0xFFFF00)
                expert.talk('about',5)

                // this.time.addEvent({
                //     delay: 8000,
                //     callback: function(scene, node) {
                        
                        
                //     },
                //     args: [this, node]
                // });
               

            } else if (node.key == tasks[0] && tasks[0] == 752) {
                keyEnter.enabled = false;
                expert.talk('about',6)
                // here add a selector for the subtree
                subtree.visible = true;
                player.setDepth(2)
                // this.input.keyboard.enabled = false;
                tasks.shift();

            } else  if (node.key == tasks[0] && tasks[0] == 173){
                keyEnter.enabled = false;
                tree.root.left.highlightLinks( tree.root.left,this, 0xFFFF00)
                tree.root.left.left.highlightLinks(tree.root.left.left,this, 0xFFFF00)
                tree.root.left.left.left.highlightLinks(tree.root.left.left.left,this, 0xFFFF00)
                expert.talk('about',8);
                tasks.shift();
                panel.allTasksDone();

            } else if (node.key != tasks[0]) {
                panel.redFeedback('TRY AGAIN');
                displayTask();
                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                selector.visible = false;
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

        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            tasks = null;
            numsToInsert = null;
            taskText.destroy();
            selector.destroy();
            selectorChild.destroy();
            parentSelector.destroy();
            nodeSet = null;
        }
    }

    update(time,delta) {
        controls.update(delta);
    }
}