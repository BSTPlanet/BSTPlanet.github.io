export class ExpertAlien extends Phaser.Scene {
    constructor() {
        super({ key:'ExpertAlien' });
    }

    preload() {
        this.load.image('alien_expert', 'Assets/Characters/alien_expert_window.png');
        this.load.image('talkBubble_begin', 'Assets/Characters/talkBubble_begin.png');
        this.load.image('talkBubble_hint', 'Assets/Characters/talkBubble_hint.png');
        this.load.image('talkBubble_keyboard', 'Assets/Characters/talkBubble_keyboard.png');

        // talk bubble
    }

    create() {
        this.expert = this.add.image(100, 700, 'alien_expert');
        this.talkBubble_keyboard = this.add.image(410,630,'talkBubble_keyboard');
        this.talkBubble_keyboard.setVisible(false);

        var keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyK.on('down', () => {
            var instructions = this.add.text(240,600, 'ARROW LEFT to go left\nARROW RIGHT to go right\nARROW UP to go up\nENTER to insert', { fontSize: '20px', fill: '#ffffff' });
            this.talkBubble_keyboard.setVisible(true);
        });


        // this.panel = this.add.image(360, 820, 'panel_bigger').setScale(0.9);
        // this.levelName = this.add.text(93,780, 'LEVEL: BST Insertion', { fontFamily: 'nasalization-rg', fontSize: '21px', fill: '#ffffff' });
        // this.taskHeader = this.add.text(93,817, 'TASK:', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#ffffff' });
        // this.task = this.add.text(190,813, '', { fontFamily: 'nasalization-rg', fontSize: '32px', fill: '#ffff00' });
        // this.feedback = this.add.text(410,798, '', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#33FF38' });
        // this.task = this.add.text(190,813, 'Insert 42', { fontFamily: 'nasalization-rg', fontSize: '32px', fill: '#ffff00' });
        // this.feedback = this.add.text(410,798, 'GOOD JOB!', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#33FF38' });
        // this.feedback = this.add.text(410,798, 'TRY AGAIN', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#FF99C3' });

        // feedback success color:   #33FF38

        // feedback fail color:      #FF99C3
    }

    update() {
        
    }

    // var text2 = this.add.text(10_300,100, 'Instructions: press ENTER to insert', { fontSize: '20px', fill: '#000' });

    // refreshTask(newTask) {
    //     this.task.setText(newTask);
    // }

    // greenFeedback(newFeedback) {
    //     this.feedback.setText(newFeedback).setFill('#33FF38');
    // }

    // redFeedback(newFeedback) {
    //     this.feedback.setText(newFeedback).setFill('#FF99C3');
    // }
}