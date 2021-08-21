export class SandboxPanel extends Phaser.Scene {
    constructor() {
        super({ key:'SandboxPanel' });
    }

    preload() {
        
    }
    
    create() {
        
        // !!! The x and y are between 0 and whatever we chose for the game canvas size
        // feedback success color:   #33FF38
        // feedback fail color:      #FF99C3

        this.panel = this.add.image(815, 840, 'panel_sandbox').setDepth(-1);

        // levels
        this.levelHeader = this.add.text(240,798, 'LEVEL:', { fontFamily: 'audiowide', fontSize: '21px', fill: '#ffffff' });
        this.levelName = this.add.text(330,798, '', { fontFamily: 'audiowide', fontSize: '21px', fill: '#ffffff' });

        // tasks
        // this.task_nextlevel = 'Press SPACEBAR to go to the next level';
        this.task_done = 'No more tasks!';
        this.taskHeader = this.add.text(240,843, 'TASK:', { fontFamily: 'audiowide', fontSize: '28px', fill: '#ffffff' });
        this.task = this.add.text(340,840, '', { fontFamily: 'audiowide', fontSize: '32px', fill: '#ffff00' });

        // feedback
        this.feedback_default = 'Waiting for action...';
        this.feedback = this.add.text(745,820, this.feedback_default, { fontFamily: 'audiowide', fontSize: '28px', fill: '#d1d1d1' });
        this.feedbackTween = null;

        // restart info
        this.restart_key_img = this.add.image(1170, 835, 'key_n');
        this.restart_text = this.add.text(1200,810, 'generate new tree and tasks', { fontFamily: 'audiowide', fontSize: '21px', fill: '#ffffff', align: 'left', wordWrap: { width: 200, useAdvancedWrap: true } });
    }

    setLevelName(levelName){
        this.levelName.setText(levelName);
    }

    refreshTask(newTask) {
        this.taskHeader.setVisible(true);
        this.task.setPosition(340,840);
        this.task.setText(newTask);
        this.task.setFontSize('32px');
        // this tween does a shaky-shake on the task text
        this.add.tween({
            targets: this.task,
            y: 830,
            ease: 'Bounce',
            duration: 200,
            yoyo: true
        });
    }

    allTasksDone() {
        this.taskHeader.setVisible(false);
        this.task.setText(this.task_done);
        this.task.setPosition(240,843);
        this.task.setFontSize('28px');
    }

    greenFeedback() {
        if (this.feedbackTween != null) {
            this.feedbackTween.remove();
        }
        this.feedback.setAlpha(100);
        this.feedback.setFontSize('45px');
        this.feedback.setText('GOOD JOB!').setFill('#33FF38');
        this.feedback.setPosition(745,810);
        // this tween does a shaky-shake on the feedback text
        this.add.tween({
            targets: this.feedback,
            y: 800,
            ease: 'Bounce',
            duration: 200,
            yoyo: true
        });
        this.feedbackTween =
            this.add.tween({
                targets: this.feedback,
                delay: 3000,
                ease: 'Sine.easeOut',
                duration: 3000,
                alpha: '-=1',
                onComplete: this.setFeedbackToDefault,
                onCompleteParams: [this]
            });
    }

    redFeedback() {
        if (this.feedbackTween != null) {
            this.feedbackTween.remove();
        }
        this.feedback.setAlpha(100);
        this.feedback.setFontSize('45px');
        this.feedback.setText('TRY AGAIN').setFill('#FF99C3');
        this.feedback.setPosition(745,810);
        // this tween does a shaky-shake on the feedback text
        this.add.tween({
            targets: this.feedback,
            y: 800,
            ease: 'Bounce',
            duration: 200,
            yoyo: true
        });
        this.feedbackTween =
            this.add.tween({
                targets: this.feedback,
                delay: 3000,
                ease: 'Sine.easeOut',
                duration: 2000,
                alpha: '-=1',
                onComplete: this.setFeedbackToDefault,
                onCompleteParams: [this]
            });
    }

    // helper for feedback tween
    // tween's onComplete function must have these arguments:
    // tween, targets, and the rest are the things passed from onCompleteParams
    setFeedbackToDefault(tween,targets,scene) {
        // scene.feedback.setAlpha(100);
        scene.feedback.setText(scene.feedback_default);
        scene.feedback.setFontSize('28px');
        scene.feedback.setFill('#d1d1d1');
        scene.feedback.setPosition(745,820);
        scene.feedbackTween =
            scene.add.tween({
                targets: scene.feedback,
                ease: 'Sine.easeIn',
                duration: 1000,
                alpha: '+=1'
            });
    }

}