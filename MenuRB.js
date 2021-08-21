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
var positions = [{name: "AboutRB", x: 400, y:300}, {name: "FlipColors", x: 800, y:300}, {name: "RotateLeft", x: 1200, y:300},
                         {name: "RotateRight", x: 400, y:450}, {name: "InsertLarger", x: 800, y:450}, {name: "InsertSmaller", x: 1200, y:450},
                         {name: "InsertBetweenNodes", x: 400, y:600}, {name: "InsertLargeTree", x: 800, y:600}, {name: "Reward", x: 1200, y:600}  ]                         
var singleTon;

export class MenuRB extends Phaser.Scene {
    constructor() {
        super({ key:'MenuRB' })
    }

    init(database) {
        singleTon = database;
    }

    preload() {

    }

    create() {

        this.add.text(80,50, 'LEARN RB', { fontFamily: 'audiowide', fontSize: '38px', fill: '#bf746b' });

        // background
        this.add.image(800,456,'background_space_red').setDepth(-1);

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
        lock = this.add.image(1200-7,600-7,"Lock")

    }

    update () {

        // ********* CHOOSE BETWEEN LEVELES ********

        if(singleTon.setRB.size == 14) {
            lock.destroy()

        }

        if(keyEnter.isDown) {
            enterAllowed = true;
        }
        if (enterAllowed && keyEnter.isUp) {
            currentButton = buttons[counter]
            // go to the scene the curentButton is associated with
            if (currentButton.name ==   "AboutRB") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to AboutRB scene")
                this.scene.launch("AboutRB", {task: singleTon.aboutRBTasks, tree: singleTon.aboutRBTree, singleTon: singleTon});
                // this.scene.launch("RB");
                this.scene.sleep("MenuRB");

            } else if (currentButton.name ==   "FlipColors") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to FlipColors scene")
                this.scene.launch("FlipColors", {task: singleTon.flipColorsTasks, tree: singleTon.flipColorsTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");

            } else if (currentButton.name ==   "RotateLeft") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to RotateLeft scene")
                this.scene.launch("RotateLeft", {task: singleTon.rotateLeftTasks, tree: singleTon.rotateLeftTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");

            } else if (currentButton.name ==   "RotateRight") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to RotateRight scene")
                this.scene.launch("RotateRight", {task: singleTon.rotateRightTasks, tree: singleTon.rotateRightTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");

            } else if (currentButton.name ==   "InsertLarger") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to InsertLarger scene")
                this.scene.launch("InsertLarger", {task: singleTon.insertLargerTasks, tree: singleTon.insertLargerTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");

            } else if (currentButton.name ==   "InsertSmaller") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to InsertSmaller scene")
                this.scene.launch("InsertSmaller", {task: singleTon.insertSmallerTasks, tree: singleTon.insertSmallerTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");

            } else  if (currentButton.name ==   "InsertBetweenNodes") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to insert between nodes scene")
                this.scene.launch("InsertBetweenNodes", {task: singleTon.insertBetweenNodesTasks, tree: singleTon.insertBetweenNodesTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");

            } else if (currentButton.name ==   "InsertLargeTree") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to insert in a large tree scene")
                this.scene.launch("InsertLargeTree", {task: singleTon.insertLargeTreeTasks, tree: singleTon.insertLargeTreeTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");
                
            } else if (currentButton.name ==   "Reward" && singleTon.setRB.size == 14) {
            // } else if (currentButton.name ==   "Reward") {
                // this.input.keyboard.removeAllKeys(true);
                console.log("Move to RewardRB scene")
                this.scene.launch("RewardRB", {task: singleTon.rewardRBTasks, tree: singleTon.rewardRBTree, singleTon: singleTon});
                this.scene.sleep("MenuRB");
            }
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