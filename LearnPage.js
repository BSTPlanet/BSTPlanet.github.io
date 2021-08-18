import { HelpBubble } from './HelpBubble.js';
import { Database } from './Database.js';

var buttons;
var currentButton;
var keyEnter;
var cursors;
var counter;
var selector;
var downAllowed = false;
var upAllowed = false;
var enterAllowed = false;
var database = new Database();

export class LearnPage extends Phaser.Scene {
    constructor() {
        super({ key:'LearnPage' })
    }

    preload() {

    }

    create() {

        this.add.text(80,50, 'LEARN', { fontFamily: 'nasalization-rg', fontSize: '38px', fill: '#72d678' });

        // this.scene.remove('HelpBubble');
        this.helpBubble_key = 'HelpBubble_learn';
        this.helpBubble_scene = new HelpBubble('HelpBubble_learn');
        this.helpBubble = this.scene.add(this.helpBubble_key, this.helpBubble_scene, true);
        this.helpBubble.setHelp('learn');

        // switch to another scene on Esc
        var keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEsc.on('down', () => {
            // pause/remove/disable the helpBubble
            this.scene.sleep('HelpBubble_learn');
            this.scene.switch('TitlePage');
            this.scene.wake('HelpBubble_title');
        });
        
        // background
        // 800,456 this is the middle of game canvas 
        this.add.image(800,456,'background_space_green').setDepth(-1);
        
       
        // init buttons array
        buttons = [];

        // learn button with physics enabled
        var learnButton = this.add.image(800,380,'button_BST');

        learnButton.setName("BST");
        buttons.push(learnButton);

        // play button with physics enabled
        var playButton = this.add.image(800,580,'button_RB');

        playButton.setName("RB");
        buttons.push(playButton);

        // selection sprite / selector (the "glowy" yellow thing)
        selector = this.add.image(800-5,380-10,'selectionSprite_large').setDepth(2);

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
            this.scene.sleep('HelpBubble_learn');
            // go to the scene the curentButton is associated with
            if (currentButton.name == "BST") {
                this.scene.sleep();
                this.scene.run('MenuBST',database);
            } else if (currentButton.name == "RB") {
                this.scene.sleep();
                this.scene.run('MenuRB',database);
            }
            enterAllowed = false;
        }
    }
}