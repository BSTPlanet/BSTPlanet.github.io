var buttons;
var currentButton;
var keyEnter;
var cursors;
var counter;
var selector;
var downAllowed = false;
var upAllowed = false;
var enterAllowed = false;

export class LearnPage extends Phaser.Scene {
    constructor() {
        super({ key:'LearnPage' })
    }

    preload() {
        this.load.image('selectionSprite_large', 'Assets/Menu/selectionSprite_large.png');
        this.load.image('background_space_green', 'Assets/Menu/background_menu_green_scaled.png');
        this.load.image('button_BST', 'Assets/Menu/button_bst.png');
        this.load.image('button_RB', 'Assets/Menu/button_rbbst.png');
    }

    create() {

        // switch to another scene on Esc
        var keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEsc.on('down', () => {
            this.scene.switch('TitlePage');
        });
        
        // background
        // 800,456 this is the middle of game canvas 
        this.add.image(800,456,'background_space_green').setDepth(-1);
        
       
        // init buttons array
        buttons = [];

        // learn button with physics enabled
        var learnButton = this.add.image(800,350,'button_BST');

        learnButton.setName("BST");
        buttons.push(learnButton);

        // play button with physics enabled
        var playButton = this.add.image(800,550,'button_RB');

        playButton.setName("RB");
        buttons.push(playButton);

        // selection sprite / selector (the "glowy" yellow thing)
        selector = this.add.image(800-5,350-10,'selectionSprite_large').setDepth(2);

        // init keyboard buttons
        cursors = this.input.keyboard.createCursorKeys();
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        counter = 0;
        currentButton = buttons[counter];
    }

    update() {    
        
        // press down logic
        if(cursors.down.isDown){
            downAllowed = true;
        }
        if (downAllowed && cursors.down.isUp) {
            if (counter+1 == buttons.length) {
                counter = 0;
            } else {
                counter = counter+1;
            }
            currentButton = buttons[counter];
            selector.setPosition(currentButton.x-5,currentButton.y-10);
            downAllowed = false;
        }

        // press up logic
        if(cursors.up.isDown){
            upAllowed = true;
        }
        if (upAllowed && cursors.up.isUp) {
            if (counter-1 < 0) {
                counter = buttons.length-1;
            } else {
                counter = counter-1;
            }
            currentButton = buttons[counter];
            selector.setPosition(currentButton.x-5,currentButton.y-10);
            upAllowed = false;
        }

        // press enter logic
        if(keyEnter.isDown){
            enterAllowed = true;
        }
        if (enterAllowed && keyEnter.isUp) {
            // go to the scene the curentButton is associated with
            if (currentButton.name == "BST") {
                // this.input.keyboard.removeAllKeys(true);
                this.scene.switch('MenuBST');
            } else if (currentButton.name == "RB") {
                // this.input.keyboard.removeAllKeys(true);
                this.scene.switch('MenuRB');
            }
            enterAllowed = false;
        }
    }
}