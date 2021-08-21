export class PlayPanel extends Phaser.Scene {
    constructor() {
        super({ key:'PlayPanel' });
    }

    preload() {
        
    }
    
    create() {
        
        // !!! The x and y are between 0 and whatever we chose for the game canvas size
        // feedback success color:   #33FF38
        // feedback fail color:      #FF99C3

        // NEW PANEL
        this.panel = this.add.image(815, 840, 'panel_sandbox').setDepth(-1);

        // levels
        this.levelHeader = this.add.text(240,798, 'LEVEL:', { fontFamily: 'audiowide', fontSize: '21px', fill: '#ffffff' });
        this.levelName = this.add.text(330,798, '', { fontFamily: 'audiowide', fontSize: '21px', fill: '#ffffff' });

        // tasks
        // this.task_nextlevel = 'Press SPACEBAR to go to the next level';
        this.tasks_done = 'No more tasks!';
        this.taskHeader = this.add.text(240,843, 'TASK:', { fontFamily: 'audiowide', fontSize: '28px', fill: '#ffffff' });
        this.task = this.add.text(340,840, '', { fontFamily: 'audiowide', fontSize: '32px', fill: '#ffff00' });

        // feedback
        this.feedback_default = 'Waiting for action...';
        this.feedback = this.add.text(745,820, this.feedback_default, { fontFamily: 'audiowide', fontSize: '28px', fill: '#d1d1d1' });
        this.feedbackTween = null;

        // Reward popups
        this.rewardPopup_BST = this.add.image(800,300,'reward_popup_level1').setAlpha(0).setVisible(false);
        this.rewardPopup_RB = this.add.image(800,300,'reward_popup_level2').setAlpha(0).setVisible(false);

        // Diamonds/points
        this.diamond = this.add.image(1300,833,'diamond');
        this.points = 0;
        this.points_text = this.add.text(1325,810,'0'+this.points,{ fontFamily: 'audiowide', fontSize: '34px', fill: '#BAE4F6' });
        this.points_text.setOrigin(0,0);
        this.total_points = 0;

        // Time
        this.timer = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true, paused: true });
        this.time_default = 120; // 2 minutes
        this.time = this.time_default;
        this.minutes = Math.floor(this.time / 60);
        this.seconds = this.time % 60;
        this.time_text = this.add.text(1130,810,'0'+this.minutes + ':0' + this.seconds,{ fontFamily: 'audiowide', fontSize: '34px', fill: '#ffffff', align: 'center' });

        // spacebar key symbol
        this.spacebar_img = this.add.image(540, 835, 'spacebar_continue').setVisible(false);
        this.spacebar_tween = 
            this.add.tween({
                targets: this.spacebar_img,
                scaleX: 1.2,
                scaleY: 1.2,
                repeat: -1,
                duration: 500,
                yoyo: true
                // paused: true
            });
    }

    setLevelName(levelName){
        this.levelName.setText(levelName);
    }

    // ************************* TIMER *****************************
    updateTime() {
        this.time = this.time - 1;
        this.minutes = Math.floor(this.time / 60);
        this.seconds = this.time % 60;
        if (this.seconds < 10) {
            if (this.minutes == 0 && this.seconds == 3){
                this.time_text.setFill('#FF99C3');
            }
            this.time_text.setText('0'+this.minutes + ':0' + this.seconds);
        } else {
            this.time_text.setText('0'+this.minutes + ':' + this.seconds);
        }
        if (this.time == 0) {
            this.timer.paused = true;
        }
    }

    // sets new time, time given in seconds
    setTime(time) {
        // if timer paused
        if (time > 0) {
            this.time = time;
        } else {
            this.time = this.time_default;  
        }
        this.minutes = Math.floor(this.time / 60);
        this.seconds = this.time % 60;
        if (this.seconds < 10) {
            if (this.minutes == 0 && this.seconds == 3){
                this.time_text.setFill('#FF99C3');
            }
            this.time_text.setText('0'+this.minutes + ':0' + this.seconds);
        } else {
            this.time_text.setText('0'+this.minutes + ':' + this.seconds);
        }
    }

    // sets time and changes color
    resetTimer(time) {
        this.timer.paused = true;
        if (time > 0) {
            this.time = time;
        } else {
            this.time = this.time_default;  
        }
        this.time_text.setFill('#ffffff');
        this.minutes = Math.floor(this.time / 60);
        this.seconds = this.time % 60;
        if (this.seconds < 10) {
            if (this.minutes == 0 && this.seconds == 3){
                this.time_text.setFill('#FF99C3');
            }
            this.time_text.setText('0'+this.minutes + ':0' + this.seconds);
        } else {
            this.time_text.setText('0'+this.minutes + ':' + this.seconds);
        }
    }

    startTimer() {
        this.timer.paused = false;
    }

    pauseTimer() {
        this.timer.paused = true;
    }

    isTimerDone() {
        if(this.time == 0) {
            return true;
        } else {
            return false;
        }
    }

    // ************************* POINTS *****************************
    addPoint() {
        this.points = this.points + 1;
        if(this.points > 9) {
            this.points_text.setText(this.points);
        } else {
            this.points_text.setText('0'+this.points);
        }
        this.add.tween({
            targets: this.points_text,
            scaleX: 1.5,
            scaleY: 1.5,
            repeat: 1,
            duration: 200,
            yoyo: true
        });
    }

    // updates total points 
    updateTotalPoints() {
        this.total_points = this.total_points + this.points;
    }

    // resets points to 0
    resetPoints() {
        this.points = 0;
        this.points_text.setText('0'+this.points);
    }

    // ************************* TASK *****************************
    refreshTask(newTask) {
        this.spacebar_img.setVisible(false);
        // this.spacebar_tween.pause();
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
        this.task.setText(this.tasks_done);
        this.task.setPosition(240,843);
        this.task.setFontSize('28px');
    }

    noMoreTimeText(){
        this.spacebar_img.setVisible(true);
        // this.spacebar_tween.resume();
        this.taskHeader.setVisible(false);
        this.task.setText('Time\'s up!');
        this.task.setPosition(240,843);
        this.task.setFontSize('28px');
    }

    // ************************* FEEDBACK *****************************
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

    // ************************* REWARD *****************************
    displayRewardBST() {
        this.rewardPopup_BST.setVisible(true);
        this.add.tween({
            targets: this.rewardPopup_BST,
            ease: 'Sine.easeIn',
            duration: 700,
            alpha: '+=1'
        });
    }

    displayRewardRB() {
        this.rewardPopup_RB.setVisible(true);
        this.add.tween({
            targets: this.rewardPopup_RB,
            ease: 'Sine.easeIn',
            duration: 700,
            alpha: '+=1'
        });
    }

    removeRewardPopups() {
        this.rewardPopup_BST.setVisible(false);
        this.rewardPopup_RB.setVisible(false);
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