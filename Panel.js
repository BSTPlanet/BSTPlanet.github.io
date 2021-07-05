export class Panel extends Phaser.Scene {
    constructor() {
        super({ key:'Panel' });
    }

    preload() {
        this.load.image('panel_bigger', 'Assets/Menu/panel_bigger.png');
        this.load.image('panel_smaller', 'Assets/Menu/panel_smaller.png');
        this.load.image('panel_smaller_text', 'Assets/Menu/panel_smaller_withText.png');
        // this.load.image('expert_talkBubble', 'Assets/Menu/.png');

    }

    create() {

        // !!! The x and y are between 0 and whatever we chose for the game canvas size

        this.panel_big = this.add.image(320, 840, 'panel_bigger').setScale(0.9);
        this.panel_small = this.add.image(1470, 840, 'panel_smaller_text').setScale(0.9);
        this.levelName = this.add.text(50,795, 'LEVEL: BST Insertion', { fontFamily: 'nasalization-rg', fontSize: '21px', fill: '#ffffff' });
        this.taskHeader = this.add.text(50,840, 'TASK:', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#ffffff' });
        this.task = this.add.text(140,837, '', { fontFamily: 'nasalization-rg', fontSize: '32px', fill: '#ffff00' });
        this.feedback = this.add.text(390,820, '', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#33FF38' });
        // this.task = this.add.text(190,813, 'Insert 42', { fontFamily: 'nasalization-rg', fontSize: '32px', fill: '#ffff00' });
        // this.feedback = this.add.text(410,798, 'GOOD JOB!', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#33FF38' });
        // this.feedback = this.add.text(410,798, 'TRY AGAIN', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#FF99C3' });

        // feedback success color:   #33FF38

        // feedback fail color:      #FF99C3
    }

    update() {
        
    }

    refreshTask(newTask) {
        this.task.setText(newTask);
    }

    refreshTaskDone(newTask) {
        this.taskHeader.destroy();
        // this.feedback.destroy();
        this.task.setText(newTask);
        this.task.setPosition(50,840);
        this.task.setFontSize('28px');
    }

    greenFeedback(newFeedback) {
        this.feedback.setText(newFeedback).setFill('#33FF38');
    }

    redFeedback(newFeedback) {
        this.feedback.setText(newFeedback).setFill('#FF99C3');
    }
}