import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
import { Panel } from './Panel.js';
import { ExpertAlien } from './ExpertAlien.js';
import { HelpBubble } from './HelpBubble.js';

var data;
var singleTon;
var numsToInsert;
var tasks;
var tasks2;

var panel;
var expert;
var controls;
var keyEnter;

export class AboutRB extends Phaser.Scene {

    constructor() {
        super({ key:'AboutRB' });
    }

    init (data1) {
        data = data1;
        singleTon = data.singleTon;
        numsToInsert = data.tree;
        tasks = [...data.task];
        tasks2 = [...data.task];
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
        panel.setLevelName('About Red-black Binary Search Trees');
        expert.talk('aboutRB',0);
    }

    create() {
        // create the nodes for the reward level
        panel.loopOverTools(singleTon.toolSet)

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background_planet_purple').setDepth(-1);

        this.RB_events = [];
        this.bb_texts = [];

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            // console.log(expert.progressCounter);
            if (expert.talking == false) {
                expert.talking = true;
                if (expert.progressCounter == 1) {          // talk about rb and balance
                    expert.talk('aboutRB',1);
                } else if (expert.progressCounter == 2) {     // BST insertion
                    // block spacebar   
                    // present what will be done BST line 2
                    // give the first element
                    // on element 6-7 say line 3
                    // when done inserting, present tasks RB line 4
                    // unblock spacebar
                    // when done inserting say line 5 
                    expert.talk('aboutRB',2,'close');
                } else if (expert.progressCounter == 3) {
                    playBSTsection(this);                   // BST insertion continued
                } else if (expert.progressCounter == 5) {
                    playRBsection(this);                // RB insertion
                } else if (expert.progressCounter == 6) {  // no two red links
                    this.cameras.main.zoom = 0.4;
                    expert.talk('aboutRB',6);
                    // add a bit of delay (in the calling function add something to 0)
                    blinkChildrenLinks(this);
                } else if (expert.progressCounter == 7) {  // prefect black balance
                    // remove previous tweens
                    this.RB_events.forEach(tween => {
                        tween.stop();
                        tween.remove();
                    });
                    fixLinksAlpha();

                    expert.talk('aboutRB',7);
                    var balanceNodes = [[275,169,78,70,50,'null'],[275,169,78,70,70,'null'],[275,169,78,100,100,'null'],[275,169,169,211,211,'null']];

                    this.event1 =
                        this.time.addEvent({
                            delay: 6000,
                            callback: function(scene) {
                                perfectBlackBalance(scene,balanceNodes[0]);
                            },
                            args: [this]
                        });
                    this.event2 =
                        this.time.addEvent({
                            delay: 13_000,
                            callback: function(scene) {
                                perfectBlackBalance(scene,balanceNodes[1]);
                            },
                            args: [this]
                        });
                    this.event3 =
                        this.time.addEvent({
                            delay: 20_000,
                            callback: function(scene) {
                                perfectBlackBalance(scene,balanceNodes[3]);
                            },
                            args: [this]
                        });
                    
                } else if (expert.progressCounter == 8) {  // red lean left
                    // remove previous tweens
                    this.RB_events.forEach(tween => {
                        tween.stop();
                        tween.remove();
                    });
                    // remove initiated time events from before
                    // if (event1) then remove
                    this.event1.remove();
                    this.event2.remove();
                    this.event3.remove();

                    // remove any possiblly added texts that weren't deleted
                    this.bb_texts.forEach(item => {
                        item.destroy();
                    });

                    fixLinksAlpha();

                    expert.talk('aboutRB',8);
                    blinkRedLinks(this);
                } else if (expert.progressCounter == 9) {  // last line, tasks and expert says to press spacebar to go to next level
                    // remove previous tweens
                    this.RB_events.forEach(tween => {
                        tween.stop();
                        tween.remove();
                    });
                    fixLinksAlpha();

                    expert.talk('aboutRB',9);
                    panel.allTasksDone();
                } else if (expert.progressCounter == 10) {
                    destroyEverything();
                    this.scene.stop();
                    this.scene.launch("FlipColors", {task: singleTon.flipColorsTasks, tree: singleTon.flipColorsTree, singleTon: singleTon});
                    this.input.keyboard.removeAllKeys(true);
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
            this.scene.wake('MenuRB')
            this.input.keyboard.removeAllKeys(true);
        });

        // *************PLAYER*************
        var player = this.physics.add.sprite(10_000, 100, 'onion');
        player.setBounce(0.1);

        // *************KEYBOARD*************
        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

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
        this.cameras.main.zoom = 0.6;
        
        // *************INITIALIZE BST*************

        var tree;
        makeTree([],false,'orange',this);
        keyEnter.enabled = false;
        
        // makeTree([400, 380, 300, 275, 211, 169, 100, 78, 70, 50],true,'yellow',this);


        function makeTree(treeNums,isRB,color,scene) {
            numsToInsert = treeNums;
            tree = new Tree(color, scene);
            // BST (intially an empty/null root node)
            tree.isRB = isRB;
            tree.createRoot(scene);
            if (numsToInsert.length > 0) {
                tree.createTree(numsToInsert,scene);
            }
            tree.openCurtains();
            setPhysicsTree(tree.root,scene);
        }

        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, checkInsertion, enterkeyIsPressed, scene);

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


        // ********************** ABOUT RB FUNCTIONS **************************

        function playBSTsection() {
            spacebar.enabled = false;
            displayTask();
        }

        function playRBsection(scene) {
            expert.resetTalk();
            spacebar.enabled = false;
            tree.destroyTree();
            makeTree(numsToInsert,true,'purple',scene);
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tasks = tasks2;
            displayTask();
        }

        // no node has two red links
        function blinkChildrenLinks(scene) {
            blinkChildrenLinksH(tree.root,5000,scene);
        }
        
        function blinkChildrenLinksH(node,delay,scene) {
            if (node != null) {
                if (node.left != null && node.right != null) {
                    var rb_tween = 
                        scene.tweens.add({
                            targets: [node.left.link,node.right.link],
                            delay: delay,
                            duration: 400,
                            ease: 'Sine.easeOut',
                            alpha: '-=1',
                            yoyo: true,
                            repeat: 1
                        });
                    scene.RB_events.push(rb_tween);
                }
                blinkChildrenLinksH(node.left,delay+2300,scene);
                blinkChildrenLinksH(node.right,delay+2300,scene);
            }
        }

        // perfect black balance
        function perfectBlackBalance(scene,path) {
            perfectBlackBalanceH(tree.root,path,0,0,1,scene)
        }

        function onStartHandlerLeft(tween,tragets,textvar,count) {
            textvar.setText(''+count);
        }

        function onStartHandlerRight(tween,tragets,textvar,count) {
            textvar.setText(''+count);
        }

        function onCompleteHandler(tween,targets,text) {
            text.destroy();
        }

        function perfectBlackBalanceH(node,path,index,delay,count,scene) {
            if (node != null) {
                if(node.key == path[index]) {
                    if (node.left != null && node.right != null) {
                        if (node.left.key == path[index+1]) {
                            var bb_text = scene.add.text(node.left.link.x,node.left.link.y - 150,'', { fontFamily: 'nasalization-rg', fontSize: '40px', fill: '#000000' });
                            var RB_tween = scene.tweens.add({
                                targets: node.left.link,
                                delay: delay,
                                duration: 400,
                                ease: 'Sine.easeOut',
                                alpha: '-=1',
                                yoyo: true,
                                repeat: 1,
                                onStart: onStartHandlerLeft,
                                onStartParams: [bb_text,count],
                                onComplete: onCompleteHandler,
                                onCompleteParams: [bb_text]
                            });
                        } else if (node.right.key == path[index+1]) {
                            var bb_text = scene.add.text(node.right.link.x,node.right.link.y - 150,'', { fontFamily: 'nasalization-rg', fontSize: '40px', fill: '#000000' });
                            var RB_tween =  scene.tweens.add({
                                targets: node.right.link,
                                delay: delay,
                                duration: 400,
                                ease: 'Sine.easeOut',
                                alpha: '-=1',
                                yoyo: true,
                                repeat: 1,
                                onStart: onStartHandlerRight,
                                onStartParams: [bb_text,count],
                                onComplete: onCompleteHandler,
                                onCompleteParams: [bb_text]
                            });
                        }
                        scene.RB_events.push(RB_tween);
                        scene.bb_texts.push(bb_text);
                    }
                    perfectBlackBalanceH(node.left,path,index+2,delay+2300,count+1,scene);
                    perfectBlackBalanceH(node.right,path,index+2,delay+2300,count+1,scene);
                } else {
                    perfectBlackBalanceH(node.left,path,index,delay,count,scene);
                    perfectBlackBalanceH(node.right,path,index,delay,count,scene);
                }
            }
        }

        function blinkRedLinks(scene) {
            blinkRedLinksH(tree.root,scene);
        }

        function blinkRedLinksH(node,scene) {
            if (node != null) {
                if (node.isRed) {
                    var RB_tween =  scene.tweens.add({
                        targets: node.link,
                        delay: 3000,
                        duration: 400,
                        ease: 'Sine.easeOut',
                        alpha: '-=1',
                        yoyo: true,
                        repeat: 7
                    });
                    scene.RB_events.push(RB_tween);
                }
                blinkRedLinksH(node.left,scene);
                blinkRedLinksH(node.right,scene);
            }
        }

        function fixLinksAlpha() {
            fixLinksAlphaH(tree.root);
        }

        function fixLinksAlphaH(node) {
            if(node != null) {
                if(node.link != null) {
                    node.link.setAlpha(100);
                }
                fixLinksAlphaH(node.left);
                fixLinksAlphaH(node.right);
            }
        }

        // scene.time.addEvent({
        //     delay: 6000,
        //     callback: function() {

        //     },
        //     args: []
        // });

        // function onStartHandler(tween,targets,link) {
        //     console.log('start handler');
        //     link.setVisible(false);
        // }

        // tween that shakes the link and does that twice
        // scene.tweens.add({
        //     targets: node.left.link,
        //     delay: delay,
        //     x: node.left.link.x-15,
        //     ease: 'Bounce',
        //     duration: 200,
        //     yoyo: true,
        //     repeat: 2
        // });

        // *************** TASKS + TASK ACTIONS ***************
        // displays what operations needs to be performed by the player
        // while there are still some tasks in the array, displays text on the panel indicating what needs to be done
        // else tells to go to the next level on spacebar press
        function displayTask() {
            keyEnter.enabled = true;
            if (tasks.length != 0) { 
                panel.refreshTask('Insert ' + tasks[0]);
            } else {
                if (expert.progressCounter == 4) {
                    spacebar.enabled = true;
                    panel.refreshTask('');
                    expert.talk('aboutRB',4);
                } else if (expert.progressCounter == 5) {
                    spacebar.enabled = true;
                    panel.refreshTask('');
                    expert.talk('aboutRB',5);
                } else {
                    panel.allTasksDone();
                }
            }
        }

        function taskSucceededActions() {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tree.closeCurtains()
            tasks.shift();
            if (tasks[0] == 78 && expert.progressCounter == 3) {
                expert.talking = true;
                expert.talk('aboutRB',3,'close');
            }
        }


        // *************** COMMON INSERTION CODE ***************
        
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
            if (tree.isRB) {
                checkInsertionRBH(tree.root,nodeThatPlayerStandsOn,player,this);  // RB
            } else {
                checkInsertionH(tree.root,nodeThatPlayerStandsOn,player,this);    // BST
            }
        }

        // *************** RB INSERTION ***************
   
        function checkInsertionRBH(node, nodeThatPlayerStandsOn, player,scene) {
            if (tasks.length != 0) {
                if (node.key == 'null') {
                    if (node == nodeThatPlayerStandsOn) {
                        tree.insertManual(nodeThatPlayerStandsOn, tasks[0], scene);
                        nodeThatPlayerStandsOn.curtain.visible = false;
                        setPhysicsTree(nodeThatPlayerStandsOn, scene);
                        animateInsertionRB(node, scene)
                        scene.time.addEvent({
                            delay: 1500,
                            callback: function(scene) {
                                player.setPosition(tree.root.x,tree.root.y-BUFFER);
                                panel.greenFeedback();
                                tree.checkRBLinksInserted(scene,node);
                                tree.check(scene);
                                tree.redraw(scene);
                                taskSucceededActions();
                                displayTask();
                                scene.input.keyboard.enabled = true;
                            },
                            args: [scene]
                        });

                    } else {
                        panel.redFeedback();
                        player.setPosition(tree.root.x,tree.root.y-BUFFER);
                    }
                } else if (node.key > tasks[0]) {
                    checkInsertionRBH(node.left,nodeThatPlayerStandsOn,player,scene);
                } else if (node.key < tasks[0]) {
                    checkInsertionRBH(node.right,nodeThatPlayerStandsOn,player,scene);
                }
            }
        }   

        function animateInsertionRB(node, scene) {
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

            // scene.time.addEvent({
            //     delay: 1500,
            //     callback: function(scene) {
            //         taskSucceededActions();
            //         displayTask();
            //         scene.input.keyboard.enabled = true;
            //     },
            //     args: [scene]
            // });
        }

        // ********************** BST INSERTION **************************

        function checkInsertionH(node, nodeThatPlayerStandsOn, player,scene) {
            if (tasks.length != 0) {
                if (node.key == 'null') {
                    if (node == nodeThatPlayerStandsOn) {
                        // insert(nodeThatPlayerStandsOn,scene);
                        insert(player,nodeThatPlayerStandsOn,scene);
                        // taskSucceededActions(this);
                        // tree.closeCurtains();
                        panel.greenFeedback();
                    } else {
                        // feedback.setText('Try again');
                        panel.redFeedback();
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
                scene.physics.add.overlap(player, childL, checkInsertion, enterkeyIsPressed, scene);
                scene.physics.add.overlap(player, childR, checkInsertion, enterkeyIsPressed, scene);

                scene.physics.add.collider(player, childL);
                scene.physics.add.collider(player, childR);
                // old redraw:
                // scene.physics.add.overlap(childL, tree.nodearray, redrawTree, null, scene);
                // scene.physics.add.overlap(childR, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
            
                // update depth of the tree
                if (childL.dpth > tree.treedpth) {
                    tree.treedpth = childL.dpth;
                }

                tree.traverseAndCheckCollisions(scene);
                tree.traverseAndCheckCrossings(scene);
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
                        taskSucceededActions();
                        displayTask();
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
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            tasks = null;
            numsToInsert = null;
        }

    }

    update(time,delta) {
        controls.update(delta); // needed for camera moving and zooming

        // if (expert.talking) {   // only allow to perform operation when expert is done talking
        //     keyF.enabled = false;
        //     keyEnter.enable = false;
        // } else {
        //     keyF.enabled = true;
        //     keyEnter.enable = true;
        // }
    }
}