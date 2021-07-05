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
// window.innerWidth/3
const X = 400; 
// window.innerHeight/3   
const Y = 150;  


export class MenuRB extends Phaser.Scene {
    constructor() {
        super({ key:'MenuRB' })
    }

    preload() {
        this.load.image('background_space_red', 'Assets/Menu/background_menu_red_scaled.png');
        this.load.image('selectionSprite_longer', 'Assets/Menu/selectionSprite_longer.png');
        this.load.image('Drawbacks', 'Assets/Menu/button_rb_drawbacks.png');
        this.load.image('RotateLeft', 'Assets/Menu/button_rb_rotateLeft.png');
        this.load.image('RotateRight', 'Assets/Menu/button_rb_rotateRight.png');
        this.load.image('FlipColors', 'Assets/Menu/button_rb_flipColors.png');
        this.load.image('InsertSmaller', 'Assets/Menu/button_rb_insertSmaller.png');
        this.load.image('InsertLarger', 'Assets/Menu/button_rb_insertLarger.png');
        this.load.image('DeleteTwoChildren', 'Assets/Menu/button_bst_twoChildren.png')
        this.load.image('DeleteOneChild', 'Assets/Menu/button_bst_oneChild.png');
        this.load.image('Reward', 'Assets/Menu/button_reward.png');
        this.load.image('Lock', 'Assets/Menu/levelLock_longer.png');

        
    }

    create() {

        // background
        this.add.image(800,456,'background_space_red').setDepth(-1);


        var positions = [{name: "Drawbacks", x: 400, y:300}, {name: "RotateLeft", x: 800, y:300}, {name: "RotateRight", x: 1200, y:300},
                         {name: "FlipColors", x: 400, y:450}, {name: "InsertSmaller", x: 800, y:450}, {name: "InsertLarger", x: 1200, y:450},
                         {name: "Delete1", x: 400, y:600}, {name: "Delete2", x: 800, y:600}, {name: "Reward", x: 1200, y:600}         ]

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
           });


    
        // create the level buttons for BST
        positions.forEach(item => {
            var button = this.add.image(item.x,item.y,item.name);
            button.setName(item.name)
            buttons.push(button)
        });

        // create the lock
        this.add.image(1200-7,600-7,"Lock")

        }

        update () {

            // ********* CHOOSE BETWEEN LEVELES ********

            if(keyEnter.isDown) {
                enterAllowed = true;
            }
            if (enterAllowed && keyEnter.isUp) {
                currentButton = buttons[counter]
                // go to the scene the curentButton is associated with
                if (currentButton.name ==   "Drawbacks") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to drawbacks scene")
                    this.scene.switch('Sandbox');
                }
                if (currentButton.name ==   "RotateLeft") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to RotateLeft scene")
                    this.scene.switch('Sandbox');
                }
                if (currentButton.name ==   "RotateRight") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to RotateRight scene")
                    this.scene.switch('Sandbox');
                }
                if (currentButton.name ==   "FlipColors") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to FlipColors scene")
                    this.scene.switch('Sandbox');
                }
                if (currentButton.name ==   "InsertSmaller") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to InsertSmaller scene")
                    this.scene.switch('Sandbox');
                }
                if (currentButton.name ==   "InsertLarger") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to InsertLarger scene")
                    this.scene.switch('Sandbox');
                }
                if (currentButton.name ==   "Delete1") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to delete1 scene")
                    this.scene.switch('Sandbox');
                }
    
                if (currentButton.name ==   "Delete2") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to delete2 scene")
                    this.scene.switch('Sandbox');
                }
    
                if (currentButton.name ==   "Reward") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to reward scene")
                    this.scene.switch('Sandbox');
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