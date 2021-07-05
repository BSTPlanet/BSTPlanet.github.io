var buttons;
var currentButton;
var keyEnter;
var cursors;
var counter;
var selector;
var downAllowed = false;
var upAllowed = false;
var enterAllowed = false;

export class TitlePage extends Phaser.Scene {
    constructor() {
        super({ key:'TitlePage' })
    }

    preload() {
        this.load.image('title', 'Assets/Menu/title.png');
        this.load.image('selection_sprite', 'Assets/Menu/selectionSprite_large.png');
        this.load.image('background_space_blue', 'Assets/Menu/background_menu_blue_scaled.png');
        this.load.image('button_learn', 'Assets/Menu/button_learn.png');
        this.load.image('button_play', 'Assets/Menu/button_play.png');
    }

    create() {

        // switch to another scene on Spacebar
        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            this.scene.switch('Sandbox');
        });
        
        // background
        // 800,456 this is the middle of game canvas 
        this.add.image(800,456,'background_space_blue').setDepth(-1);
        
        // title
        this.add.image(800,260, 'title');
        // this.add.text(350,200, 'THE GALAXY OF THE ALGORITHMS:\n   The escape from the BST Planet', { fontFamily: 'nasalization-rg', fontSize: '50px', fill: '#ffffff', textAlign: 'center'});
                
        // init buttons array
        buttons = [];

        // learn button with physics enabled
        var learnButton = this.add.image(800,500,'button_learn');
        learnButton.setName("learn");
        buttons.push(learnButton);

        // play button with physics enabled
        var playButton = this.add.image(800,700,'button_play');
        playButton.setName("play");
        buttons.push(playButton);

        // selection sprite / selector (the "glowy" yellow thing)
        selector = this.add.image(800-5,500-10,'selection_sprite').setDepth(2);

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
            if (currentButton.name == "learn") {
                this.scene.switch('LearnPage');
            } else if (currentButton.name == "play") {
                this.scene.switch('Play');
            }
            enterAllowed = false;
        }
    }
}