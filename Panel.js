export class Panel extends Phaser.Scene {
    constructor() {
        super({ key:'Panel' });
    }

    preload() {
        
    }
    
    create() {
        
        // !!! The x and y are between 0 and whatever we chose for the game canvas size
        // feedback success color:   #33FF38
        // feedback fail color:      #FF99C3

        // NEW PANEL
        this.panel = this.add.image(815, 840, 'panel').setDepth(-1);

        // levels
        this.levelHeader = this.add.text(230,795, 'LEVEL:', { fontFamily: 'nasalization-rg', fontSize: '21px', fill: '#ffffff' });
        this.levelName = this.add.text(320,795, '', { fontFamily: 'nasalization-rg', fontSize: '21px', fill: '#ffffff' });

        // tasks
        // this.task_nextlevel = 'Press SPACEBAR to go to the next level';
        this.spacebar_img = this.add.image(550,855,'spacebar_continue').setVisible(false);
        this.task_done = 'You are done!';
        this.taskHeader_text = 'TASK:';
        this.taskHeader = this.add.text(230,840, this.taskHeader_text, { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#ffffff' });
        this.task = this.add.text(320,837, '', { fontFamily: 'nasalization-rg', fontSize: '32px', fill: '#ffff00' });

        // feedback
        this.feedback_default = 'Waiting for action...';
        this.feedback = this.add.text(915,842, this.feedback_default, { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#d1d1d1' });
        this.feedbackTween = null;

        // Reward Tools
        this.wrench_p = this.add.image(1320,833,'wrench_place');
        this.screw_p = this.add.image(1370,833,'screw_place');

        // Reward popups
        this.rewardPopup_BST = this.add.image(800,300,'reward_popup_BST').setAlpha(0).setVisible(false);
        this.rewardPopup_RB = this.add.image(800,300,'reward_popup_RB').setAlpha(0).setVisible(false);

        // Reward node collection:
        this.rewardNode1 = this.add.image(880,813,'node_place_2');
        this.rewardNode2 = this.add.image(935,813,'node_place_3');
        this.rewardNode3 = this.add.image(990,813,'node_place_4');
        this.rewardNode4 = this.add.image(1045,813,'node_place_5');
        this.rewardNode5 = this.add.image(1100,813,'node_place_6');
        this.rewardNode6 = this.add.image(1155,813,'node_place_7');
        this.rewardNode7 = this.add.image(1210,813,'node_place_8');
        this.nodesArray = [this.rewardNode1,this.rewardNode2,this.rewardNode3,this.rewardNode4,this.rewardNode5,this.rewardNode6,this.rewardNode7];
    }

    setLevelName(levelName){
        this.levelName.setText(levelName);
    }

    refreshTask(newTask) {
        this.taskHeader.setText(this.taskHeader_text);
        this.spacebar_img.setVisible(false);
        this.taskHeader.setVisible(true);
        this.task.setPosition(320,837);
        this.task.setText(newTask);
        this.task.setFontSize('32px');
        // this tween does a shaky-shake on the task text
        this.add.tween({
            targets: this.task,
            y: 820,
            ease: 'Bounce',
            duration: 200,
            yoyo: true
        });
    }

    allTasksDone() {
        // old - where text says to press spacebar
        // this.taskHeader.setVisible(false);
        // this.task.setText(this.task_nextlevel);
        // this.task.setPosition(230,840);
        // this.task.setFontSize('28px');

        // new - NEXT LEVEL:spacebar logo
        this.task.setVisible(false);
        this.spacebar_img.setVisible(true);
        this.spacebar_tween = 
            this.add.tween({
                targets: this.spacebar_img,
                scaleX: 1.2,
                scaleY: 1.2,
                repeat: -1,
                duration: 500,
                yoyo: true
            });
        this.taskHeader.setText('NEXT LEVEL:');
    }

    greenFeedback() {
        if (this.feedbackTween != null) {
            this.feedbackTween.remove();
        }
        this.feedback.setAlpha(100);
        this.feedback.setText('GOOD JOB!').setFill('#33FF38');
        this.feedback.setPosition(970,842);
        // this tween does a shaky-shake on the feedback text
        this.add.tween({
            targets: this.feedback,
            y: 825,
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
        this.feedback.setText('TRY AGAIN').setFill('#FF99C3');
        this.feedback.setPosition(970,842);
        // this tween does a shaky-shake on the feedback text
        this.add.tween({
            targets: this.feedback,
            y: 825,
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

    rewardNodeActions(nodeKey) {

        this.time.addEvent({
            delay: 1000,
            callback: function(scene,nodeKey) {

                if (scene.feedbackTween != null) {
                    scene.feedbackTween.remove();
                }
                scene.feedback.setAlpha(100);
                scene.feedback.setText('You collected a node!').setFill('#f8ff99');
                scene.feedback.setPosition(890,842);

                scene.add.tween({
                    targets: scene.feedback,
                    y: 828,
                    ease: 'Bounce',
                    duration: 200,
                    yoyo: true
                });

                scene.feedbackTween =
                    scene.add.tween({
                        targets: scene.feedback,
                        delay: 3000,
                        ease: 'Sine.easeOut',
                        duration: 3000,
                        alpha: '-=1',
                        onComplete: scene.setFeedbackToDefault,
                        onCompleteParams: [scene]
                    });

                // set nodes to placeholders
                if (nodeKey == 97) {
                    scene.nodesArray[0] = scene.add.image(scene.rewardNode1.x,scene.rewardNode1.y,'node_97').setScale(0.6);
                } else if (nodeKey == 400) {
                    scene.nodesArray[1] = scene.add.image(scene.rewardNode2.x,scene.rewardNode2.y,'node_400').setScale(0.6);
                } else if (nodeKey == 129) {
                    scene.nodesArray[2] = scene.add.image(scene.rewardNode3.x,scene.rewardNode3.y,'node_129').setScale(0.6);
                } else if (nodeKey == 791) {
                    scene.nodesArray[3] = scene.add.image(scene.rewardNode4.x,scene.rewardNode4.y,'node_791').setScale(0.6);
                } else if (nodeKey == 421) {
                    scene.nodesArray[4] = scene.add.image(scene.rewardNode5.x,scene.rewardNode5.y,'node_421').setScale(0.6);
                } else if (nodeKey == 655) {
                    scene.nodesArray[5] = scene.add.image(scene.rewardNode6.x,scene.rewardNode6.y,'node_655').setScale(0.6);
                } else if (nodeKey == 338) {
                    scene.nodesArray[6] = scene.add.image(scene.rewardNode7.x,scene.rewardNode7.y,'node_338').setScale(0.6);
                } else if (nodeKey == 77) {          //RB
                    scene.nodesArray[0] = scene.add.image(scene.rewardNode1.x,scene.rewardNode1.y,'node_77').setScale(0.6);
                } else if (nodeKey == 472) {
                    scene.nodesArray[1] = scene.add.image(scene.rewardNode2.x,scene.rewardNode2.y,'node_472').setScale(0.6);
                } else if (nodeKey == 27) {
                    scene.nodesArray[2] = scene.add.image(scene.rewardNode3.x,scene.rewardNode3.y,'node_27').setScale(0.6);
                } else if (nodeKey == 489) {
                    scene.nodesArray[3] = scene.add.image(scene.rewardNode4.x,scene.rewardNode4.y,'node_489').setScale(0.6);
                } else if (nodeKey == 63) {
                    scene.nodesArray[4] = scene.add.image(scene.rewardNode5.x,scene.rewardNode5.y,'node_63').setScale(0.6);
                } else if (nodeKey == 65) {
                    scene.nodesArray[5] = scene.add.image(scene.rewardNode6.x,scene.rewardNode6.y,'node_65').setScale(0.6);
                } else if (nodeKey == 210) {
                    scene.nodesArray[6] = scene.add.image(scene.rewardNode7.x,scene.rewardNode7.y,'node_210').setScale(0.6);
                } else {            // DEFAULT
                    scene.rewardNode1.setTint(0xa64dff);
                }
            },
            args: [this,nodeKey]
        });
    }

    
    loopOverNodes (array) {
        var index = 0;
        array.forEach(item => {
            this.nodesArray[index] = this.add.image(item.x, item.y, item.name).setScale(0.6);
            index++;
        });
    }

    loopOverTools (set) {
        set.forEach(item => {
            if (item.name == 'wrench') {
                this.wrench_p = this.add.image(1320,833,item.name);
            } else if (item.name == 'screw') {
                this.screw_p = this.add.image(1370,833,item.name);
            }
        });
    }

    destroyNode(node) {
        if (node == 97) {                   // BST
            this.nodesArray[0].destroy();
        } else if (node == 400) {
            this.nodesArray[1].destroy();
        } else if (node == 129) {
            this.nodesArray[2].destroy();
        } else if (node == 791) {
            this.nodesArray[3].destroy();
        } else if (node == 421) {
            this.nodesArray[4].destroy();
        } else if (node == 655) {
            this.nodesArray[5].destroy();
        } else if (node == 338) {
            this.nodesArray[6].destroy();
        } else if (node == 77) {              // RB
            this.nodesArray[0].destroy();
        } else if (node == 472) {
            this.nodesArray[1].destroy();
        } else if (node == 27) {
            this.nodesArray[2].destroy();
        } else if (node == 489) {
            this.nodesArray[3].destroy();
        } else if (node == 63) {
            this.nodesArray[4].destroy();
        } else if (node == 65) {
            this.nodesArray[5].destroy();
        } else if (node == 210) {
            this.nodesArray[6].destroy();
        }
    }

    displayRewardBST() {
        this.wrench_p = this.add.image(1320,833,'wrench');
        this.rewardPopup_BST.setVisible(true);
        this.add.tween({
            targets: this.rewardPopup_BST,
            ease: 'Sine.easeIn',
            duration: 700,
            alpha: '+=1'
        });
    }

    displayRewardRB() {
        this.screw_p = this.add.image(1370,833,'screw');
        this.rewardPopup_RB.setVisible(true);
        this.add.tween({
            targets: this.rewardPopup_RB,
            ease: 'Sine.easeIn',
            duration: 700,
            alpha: '+=1'
        });
    }

    // helper for feedback tween
    // tween's onComplete function must have these arguments:
    // tween, targets, and the rest are the things passed from onCompleteParams
    setFeedbackToDefault(tween,targets,scene) {
        // scene.feedback.setAlpha(100);
        scene.feedback.setText(scene.feedback_default);
        scene.feedback.setFill('#d1d1d1');
        scene.feedback.setPosition(915,842);
        scene.feedbackTween =
            scene.add.tween({
                targets: scene.feedback,
                ease: 'Sine.easeIn',
                duration: 1000,
                alpha: '+=1'
            });
    }

}