var buttons;
var currentButton;
var keyEnter;
var cursors;
var counter = 0;
var selector;
var downAllowed = false;
var upAllowed = false;
var leftAllowed = false;
var rightAllowed = false;
var enterAllowed = false;
var lock;
// window.innerWidth/3
const X = 400; 
// window.innerHeight/3   
const Y = 150; 
var positions = [{name: "About", x: 400, y:300, tree:[685, 494, 472, 173, 752, 53]}, {name: "Search", x: 800, y:300, tree: [957, 519, 722, 38, 566, 97, 55]}, {name: "Insert", x: 1200, y:300, tree: [879, 384, 181, 509, 580, 978, 595, 219]},
{name: "DeleteMin", x: 400, y:450, tree: [954, 833, 696, 649, 531, 129, 536, 910, 98]}, {name: "DeleteMax", x: 800, y:450, tree: [464, 26, 406, 759, 287, 780, 591, 266, 791, 992]}, {name: "DeleteNoChildren", x: 1200, y:450, tree: [50, 667, 54, 60, 815, 778, 335, 734, 293, 627, 421]},
{name: "DeleteOneChild", x: 400, y:600, tree: [450, 604, 507, 621, 76, 373, 655, 788, 151, 191, 147, 381]}, {name: "DeleteTwoChildren", x: 800, y:600, tree: [474, 266, 338, 11, 631, 791, 471, 423, 313, 880, 463, 206, 717]}, {name: "Reward", x: 1200, y:600, tree: [0]}]
var singleTon;



export class MenuBST extends Phaser.Scene {
    constructor() {
        super({ key:'MenuBST' })
    }

    init(database) {
        singleTon = database;
    }

    preload() {

    }

    create() {

        this.add.text(80,50, 'LEARN BST', { fontFamily: 'audiowide', fontSize: '38px', fill: '#9787cc' });

        // background
        this.add.image(800,456,'background_space_purple').setDepth(-1);

        buttons = [];

        // **** CREATE THE PLAYER
        selector = this.add.image(400-6,300-6,'selectionSprite_longer').setDepth(2);
       
        // add cursors and keys
        cursors = this.input.keyboard.createCursorKeys();
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // switch to another scene on Esc
        var keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEsc.on('down', () => {
            this.scene.switch('LearnPage');
            this.scene.wake('HelpBubble_learn');
        });


        // create the level buttons for BST
        positions.forEach(item => {
            var button = this.add.image(item.x,item.y,item.name);
            button.setName(item.name)
            buttons.push(button)
        });

        // create the lock 
        lock = this.add.image(1200 -7,600 -7,"Lock")

        }

        update () {

            // ********* CHOOSE BETWEEN LEVELS ********

            if(singleTon.set.size == 14) {
                lock.destroy()

            }

            if(keyEnter.isDown) {
                enterAllowed = true;
            }
            if (enterAllowed && keyEnter.isUp) {
                currentButton = buttons[counter]
                // this.input.keyboard.removeAllKeys(true);    ???
                // go to the scene the curentButton is associated with
                if (currentButton.name ==   "About") {
                    console.log("Move to about scene")
                    this.scene.launch("About", {task: singleTon.aboutTasks, tree: singleTon.aboutTree, singleTon: singleTon});
                    this.scene.sleep("MenuBST");
                } else if (currentButton.name ==   "Search") {
                    console.log("Move to search scene")
                    this.scene.launch("Searching", {task: singleTon.searchTasks, tree: singleTon.searchTree, singleTon: singleTon});
                    this.scene.sleep("MenuBST");
                } else if (currentButton.name ==   "Insert") {
                    console.log("Move to insertion scene")
                    this.scene.launch("Insertion", {task: singleTon.insertTasks, tree: singleTon.insertionTree, singleTon: singleTon});
                    this.scene.sleep("MenuBST");
                } else if (currentButton.name ==   "DeleteMin") {
                    console.log("Move to deleteMin scene")
                    this.scene.launch("Deletion", {task: singleTon.deleteMinTasks, tree: singleTon.deleteMinTree, singleTon: singleTon,  levelName: 'BST Delete min'});
                    this.scene.sleep("MenuBST");
                } else if (currentButton.name ==   "DeleteMax") {
                    console.log("Move to deleteMax scene")
                    this.scene.launch("Deletion", {task: singleTon.deleteMaxTasks, tree: singleTon.deleteMaxTree, singleTon: singleTon,  levelName: 'BST Delete max'});
                    this.scene.sleep("MenuBST");
                }else if (currentButton.name ==   "DeleteOneChild") {
                    console.log("Move to delete with one child scene")
                    this.scene.launch("Deletion", {task: singleTon.deleteOneChildTasks, tree: singleTon.deleteOneChildTree, singleTon: singleTon,  levelName: 'BST Delete node - one child'});
                    this.scene.sleep("MenuBST");
                } else if (currentButton.name ==   "DeleteNoChildren") {
                    console.log("Move to delete with no children scene")
                    this.scene.launch("Deletion", {task: singleTon.deleteNoChildrenTasks, tree: singleTon.deleteNoChildrenTree, singleTon: singleTon, levelName: 'BST Delete - no children'});
                    this.scene.sleep("MenuBST");
                } else if (currentButton.name ==   "DeleteTwoChildren") {
                    console.log("Move to delete with 2 child scene")
                    this.scene.launch("Deletion", {task: singleTon.deleteTwoChildrenTasks, tree: singleTon.deleteTwoChildrenTree, singleTon: singleTon, levelName: 'BST Delete - two children'});
                    this.scene.sleep("MenuBST");
                } else if (currentButton.name ==   "Reward" && singleTon.set.size == 14) {
                    console.log("Move to reward scene")
                    this.scene.launch("Insertion", {task: singleTon.rewardTasks, tree: singleTon.rewardTree, singleTon: singleTon});
                    this.scene.sleep("MenuBST");
                } 
                // else if (currentButton.name ==   "Reward" && singleTon.set.size < 14) {
                //     // play the sound that it is locked
                // }
                enterAllowed = false;
            }

            // ********* TELEPORT ********

            // press down logic
            if(cursors.down.isDown){
                downAllowed = true;
            }
            if (downAllowed && cursors.down.isUp) {

                 if(counter + 3 == 9) {
                    counter = 0
                 } else  if(counter + 3 == 11) {
                    counter = 2

                 } else if (counter + 3 == 10) {
                    counter = 1
                
                } else {
                    counter = counter + 3;
                }
                currentButton = buttons[counter];
                selector.setPosition(currentButton.x -5, currentButton.y - 10)
                downAllowed = false;
            }


            // press up logic
            if(cursors.up.isDown) {
                upAllowed = true;
            }

            if (upAllowed && cursors.up.isUp) {
                 if (counter - 3 == -3) {
                    counter = 6;
                } else if (counter - 3 == -2) {
                    counter = 7;
                } else if (counter - 3 == -1) {
                    counter = 8;   
                } else {
                    counter = counter - 3;
                }
                currentButton = buttons[counter];
                    var newX = currentButton.x -5
                    var newY = currentButton.y - 10
                    selector.setPosition(newX, newY)
                upAllowed = false;
            }

            // press left logic
            if(cursors.left.isDown){
                leftAllowed = true;
            }
            if (leftAllowed && cursors.left.isUp) {
                if (counter-1 < 0) {
                    counter = buttons.length-1;
                } else {
                    counter = counter-1;
                }
                currentButton = buttons[counter];
                var newX = currentButton.x -5
                var newY = currentButton.y - 10
                selector.setPosition(newX, newY)
                leftAllowed = false;
            }


            // press right logic
            if(cursors.right.isDown){
                rightAllowed = true;
            }
            if (rightAllowed && cursors.right.isUp) {
                if (counter + 1 == buttons.length) {
                    counter = 0;
                } else {
                    counter = counter + 1;
                }
                currentButton = buttons[counter];
                    var newX = currentButton.x -5 ;
                    var newY = currentButton.y - 10 ;
                    selector.setPosition(newX,newY);
                rightAllowed = false;
            }

        }

    }