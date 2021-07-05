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
var positions = [{name: "About", x: 400, y:300, tree:[685, 494, 472, 173, 752, 53]}, {name: "Search", x: 800, y:300, tree: [957, 519, 722, 38, 566, 97, 55]}, {name: "Insert", x: 1200, y:300, tree: [879, 384, 181, 509, 580, 978, 595, 219]},
{name: "DeleteMin", x: 400, y:450, tree: [954, 833, 696, 649, 531, 129, 536, 910, 98]}, {name: "DeleteMax", x: 800, y:450, tree: [464, 26, 406, 759, 287, 780, 591, 266, 791, 992]}, {name: "DeleteNoChildren", x: 1200, y:450, tree: [50, 667, 54, 60, 815, 778, 335, 734, 293, 627, 421]},
{name: "DeleteOneChild", x: 400, y:600, tree: [450, 604, 507, 621, 76, 373, 655, 788, 151, 191, 147, 381]}, {name: "DeleteTwoChildren", x: 800, y:600, tree: [474, 266, 338, 11, 631, 791, 471, 423, 313, 880, 463, 206, 717]}, {name: "Reward", x: 1200, y:600, tree: [0]}         ]

// var n = 6;


export class MenuBST extends Phaser.Scene {
    constructor() {
        super({ key:'MenuBST' })
    }

    preload() {
        this.load.image('background_space_purple', 'Assets/Menu/background_menu_purple_scaled.png');
        this.load.image('selectionSprite_longer', 'Assets/Menu/selectionSprite_longer.png');
        this.load.image('About', 'Assets/Menu/button_bst_about.png');
        this.load.image('Search', 'Assets/Menu/button_bst_search.png');
        this.load.image('Insert', 'Assets/Menu/button_bst_insert.png');
        this.load.image('DeleteMin', 'Assets/Menu/button_bst_deleteMin.png');
        this.load.image('DeleteMax', 'Assets/Menu/button_bst_deleteMax.png');
        this.load.image('DeleteNoChildren', 'Assets/Menu/button_bst_noChildren.png');
        this.load.image('DeleteOneChild', 'Assets/Menu/button_bst_oneChild.png');
        this.load.image('DeleteTwoChildren', 'Assets/Menu/button_bst_twoChildren.png');
        this.load.image('DeleteOneChild', 'Assets/Menu/button_bst_oneChild.png');
        this.load.image('Reward', 'Assets/Menu/button_reward.png');
        this.load.image('Lock', 'Assets/Menu/levelLock_longer.png');
    }

    create() {

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
           });


    
        // create the level buttons for BST
        positions.forEach(item => {
            var button = this.add.image(item.x,item.y,item.name);
            button.setName(item.name)
            buttons.push(button)

        // // // generate the trees for the levels
        // // if(item.name = "Insert") {
        // //     generateNumsForInsertTask(n)
        // // } else {
        // //     generateNumsToInsert(n)
        // // }
        // item.tree = generateNumsToInsert(n)
        // n++
        // console.log(item)
        });

        // create the lock 
        this.add.image(1200 -7,600 -7,"Lock")


        // ******** CODE FOR GENERATING THE TREE ********

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
        //     // var arr = [];
        //     var i;
        //     for(i=0;i<n;i++){
        //         var number = Math.floor(Math.random() * (999 - 1) + 1);
        //         if(!arr.includes(number) && !numsToInsert.includes(number)){
        //             arr.push(number);
        //         }
        //     }
        //     return arr;
        // }


        }

        update () {

            // ********* CHOOSE BETWEEN LEVELES ********

            if(keyEnter.isDown) {
                enterAllowed = true;
            }
            if (enterAllowed && keyEnter.isUp) {
                currentButton = buttons[counter]
                // go to the scene the curentButton is associated with
                if (currentButton.name ==   "About") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to about scene")
                    this.scene.run("About", {task: 97, tree: positions[1].tree});
                    this.scene.sleep("MenuBST");
                }
                if (currentButton.name ==   "Search") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to search scene")
                    this.scene.run("Searching", {task: 97, tree: positions[1].tree});
                    this.scene.sleep("MenuBST");
                }
                if (currentButton.name ==   "Insert") {
                    // this.input.keyboard.removeAllKeys(true);
                    if(this.scene.isSleeping('Insertion')) {
                        console.log('is sleeping');
                        // this.scene.stop('Insertion');
                        this.scene.run("Insertion", {task: 400, tree: positions[2].tree});
                        this.scene.wake('Panel');
                        this.scene.wake('ExpertAlien');
                    } else {
                        console.log('is NOT active');
                        this.scene.run("Insertion", {task: 400, tree: positions[2].tree});
                    }
                    // this.scene.run("Insertion", {task: 400, tree: positions[2].tree});
                    this.scene.sleep("MenuBST");
                }
                if (currentButton.name ==   "DeleteMin") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to deleteMin scene")
                    this.scene.run("Deletion", {task: "Min", tree: positions[3].tree});
                    this.scene.sleep("MenuBST");
                }
                if (currentButton.name ==   "DeleteMax") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to deleteMax scene")
                    this.scene.run("Deletion", {task: "Max", tree: positions[4].tree});
                    this.scene.sleep("MenuBST");;
                }
                if (currentButton.name ==   "DeleteOneChild") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to delete with one child scene")
                    this.scene.run("Deletion", {task: 655, tree: positions[6].tree});
                    this.scene.sleep("MenuBST");
                }
                if (currentButton.name ==   "DeleteNoChildren") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to delete with no children scene")
                    this.scene.run("Deletion", {task: 421, tree: positions[5].tree});
                    this.scene.sleep("MenuBST");
                }
    
                if (currentButton.name ==   "DeleteTwoChildren") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to delete with 2 child scene")
                    this.scene.run("Deletion", {task: 338, tree: positions[7].tree});
                    this.scene.sleep("MenuBST");
                }
    
                if (currentButton.name ==   "Reward") {
                    // this.input.keyboard.removeAllKeys(true);
                    console.log("Move to reward scene")
                    this.scene.run("Reward", {task: 97, tree: positions[1].tree});
                    this.scene.sleep("MenuBST");
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