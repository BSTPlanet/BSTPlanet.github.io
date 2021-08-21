import { TextsDatabase } from "./TextsDatabase.js";

export class ExpertAlien extends Phaser.Scene {
    constructor() {
        super({ key:'ExpertAlien' });
    }

    preload() {
        this.texts = new TextsDatabase();
    }

    create() {

        this.typer;
        this.progressCounter = 0;
        this.talking = false;

        this.expert = this.add.image(100, 815, 'expert_hologram3').setScale(0.45).setDepth(3);

        this.talkBubble_nosymbol = this.add.image(258,640,'talkBubble3');
        this.talkBubble_nosymbol.setVisible(false);

        this.talkBubble_cont = this.add.image(258,590,'talkBubble_continue');
        this.talkBubble_cont.setVisible(false);

        this.talkBubble_close = this.add.image(258,590,'talkBubble_close');
        this.talkBubble_close.setVisible(false);

        // Texts:
        // this.text_small = this.add.text(62,520, '', { fontFamily: 'audiowide', fontSize: '20px', fill: '#ffffff', align: 'justify', wordWrap: { width: 400, useAdvancedWrap: true } }).setVisible(false);
        this.text_small = this.add.text(62,430, '', { fontFamily: 'audiowide', fontSize: '20px', fill: '#ffffff', align: 'justify', wordWrap: { width: 400, useAdvancedWrap: true } }).setVisible(false);

        this.speechTween = null;

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spacebar.on('down', () => {
            if(this.talkBubble_close.visible){
                this.resetTalk();
                this.spacebar.enabled = false;
            }
        });

        this.type;
        this.spacebar.enabled = false;
    }

    // usage example: 
        // Before class:
        // var expert;

        // In Preload:
        // this.scene.remove('ExpertAlien');
        // expert = this.scene.add('ExpertAlien', ExpertAlien, true);

        // In places you need expert to talk:
        // expert.talk('search',0);
        //  or
        // expert.talk('about',3);

    // types are: continue, close or nothing

    talk(operation,index,type) {
        this.resetTalk();
        if(type == 'continue'){
            this.type = type;
            this.talkBubble_cont.setVisible(true);
            this.text_small.setPosition(62,430);
        } else if (type == 'close') {
            this.type = type;
            this.talkBubble_close.setVisible(true);
            this.text_small.setPosition(62,430);
        } else if (type == 'nosymbol') {
            this.type = type;
            this.talkBubble_nosymbol.setVisible(true);
            this.text_small.setPosition(62,520);
        } else {     // default
            this.type = 'continue';
            this.talkBubble_cont.setVisible(true);
            this.text_small.setPosition(62,430);
        }
        this.text_small.setVisible(true);
        switch (operation) {
            case 'about':
                this.typewriteTextWrapped(this.texts.aboutTexts[index]);
                break;
            case 'search': 
                this.typewriteTextWrapped(this.texts.searchTexts[index]);
                break;
            case 'insert': 
                this.typewriteTextWrapped(this.texts.insertTexts[index]);
                break;
            case 'deleteMin': 
                this.typewriteTextWrapped(this.texts.deleteMinTexts[index]);
                break;
            case 'deleteMax': 
                this.typewriteTextWrapped(this.texts.deleteMaxTexts[index]);
                break;
            case 'deleteNoChild': 
                this.typewriteTextWrapped(this.texts.deleteNoChildTexts[index]);
                break;
            case 'deleteOneChild': 
                this.typewriteTextWrapped(this.texts.deleteOneChildTexts[index]);
                break;
            case 'deleteTwoChildren': 
                this.typewriteTextWrapped(this.texts.deleteTwoChildrenTexts[index]);
                break;
            case 'reward':
                this.typewriteTextWrapped(this.texts.rewardTexts[index]);
                break;
            case 'aboutRB': 
                this.typewriteTextWrapped(this.texts.aboutRBTexts[index]);
                break;
            case 'flipColors':
                this.typewriteTextWrapped(this.texts.flipColorsTexts[index]);
                break;
            case 'rotateLeft':
                this.typewriteTextWrapped(this.texts.rotateLeftTexts[index]);
                break;
            case 'rotateRight':
                this.typewriteTextWrapped(this.texts.rotateRightTexts[index]);
                break;
            case 'insertLarger':
                this.typewriteTextWrapped(this.texts.insertLargerTexts[index]);
                break;
            case 'insertSmaller':
                this.typewriteTextWrapped(this.texts.insertSmallerTexts[index]);
                break;
            case 'insertBetweenNodes':
                this.typewriteTextWrapped(this.texts.insertBetweenNodesTexts[index]);
                break;
            case 'insertLargeTree':
                this.typewriteTextWrapped(this.texts.insertLargeTreeTexts[index]);
                break;
            case 'rewardRB':
                this.typewriteTextWrapped(this.texts.rewardRBTexts[index]);
                break;
            case 'rewardLocked':
                this.typewriteTextWrapped('You haven\'t collected all of the nodes yet to unlock the Reward level! Finish all the levels to unlock it!');
                break;
            default:
                this.text_small.setText('no text selected from any available arrays');
        }
    }

    saySpacebarLine() {
        this.resetTalk();
        this.talkBubble_cont.setVisible(true);
        this.text_small.setVisible(true);
        this.typewriteTextNoCounter('Press SPACEBAR to continue...');
    }

    // *** Typewriting text effect functions ****

    typewriteTextWrapped(textToType) {
        this.text_small.setText('');
        const lines = this.text_small.getWrappedText(textToType);
        const wrappedText = lines.join('\n');

        this.typewriteText(wrappedText);
    }

    // prints two letters at a time - to increase the speed of typewriter even more
    // had to keep delay property because otherwise the getOverallProgress() was giving NaNs
    typewriteText(text) {
        this.talking = true;
        const length = text.length;
        const repeat = length/2;
        let i = 0;
        this.typer = 
            this.time.addEvent({
                callback: () => {
                    if(i < length) {
                        this.text_small.text += text[i];
                        ++i;
                    }
                    if(i < length) {
                        this.text_small.text += text[i];
                        ++i;
                    }
                    if (this.typer.getOverallProgress() >= 1) {
                        this.progressCounter = this.progressCounter + 1;
                        this.talking = false;
                        if(this.type == 'close') {
                            this.spacebar.enabled = true;
                        }
                    }
                },
                repeat: repeat,
                delay: 3,          // TYPEWRITER SPEED - the smaller,the faster
            });
    }

    typewriteTextNoCounter(text) {
        this.talking = true;
        const length = text.length;
        let i = 0;
        this.typer = 
            this.time.addEvent({
                callback: () => {
                    this.text_small.text += text[i];
                    ++i;
                    if (this.typer.getOverallProgress() == 1) {
                        this.talking = false;
                        // this.disappearSpeech();
                    }
                },
                repeat: length - 1,
                delay: 3,
            });
    }
    // ******

    disappearSpeech() {
        if (this.speechTween != null) {
            this.speechTween.remove();
        }
        this.talkBubble_cont.setVisible(false);
        this.text_small.setVisible(false);
        // this.speechTween = 
        //     this.add.tween({
        //         targets: [this.talkBubble_cont,this.text_small],
        //         // callbackScope: this.speechTween,
        //         delay: 7000,
        //         ease: 'Sine.easeOut',
        //         duration: 3000,
        //         alpha: '-=1',
        //         // onComplete: this.resetTalk(this),
        //         // onCompleteParams: [this]
        //     });
    }

    resetTalk() {
        // if (this.speechTween != null) {
        //     this.speechTween.remove();
        // }
        if (this.typer) {
            this.typer.destroy();
        }
        this.talkBubble_cont.setAlpha(100);
        this.talkBubble_close.setAlpha(100);
        this.talkBubble_nosymbol.setAlpha(100);
        this.text_small.setAlpha(100);
        this.talkBubble_cont.setVisible(false);
        this.talkBubble_close.setVisible(false);
        this.talkBubble_nosymbol.setVisible(false);
        this.text_small.setText('').setVisible(false);
    }

    // appearSmallBubble() {
    //     if (this.speechTween != null) {
    //         this.speechTween.remove();
    //     }
    //     this.talkBubble_cont.setVisible(true);
    //     this.text_small.setText('You haven\'t collected all of the nodes yet to unlock the Reward level! Finish all the levels to unlock it!');
    //     this.text_small.setVisible(true);
    //     this.speechTween = 
    //         this.add.tween({
    //             targets: [this.talkBubble_cont,this.text_small],
    //             delay: 8000,
    //             ease: 'Sine.easeOut',
    //             duration: 3000,
    //             alpha: '-=1',
    //             // onComplete: disappearSomeTextandBubble(scene),
    //             // onCompleteParams: [this]
    //         });

    //     // SOMETHING MIGHT NOT HAVE WORKED CUZ I SET ALPHA TO 0 SO THEY WILL NEVER BE VISIBLE IF I DONT SET IT TO 100


    //     // function disappearSomeTextandBubble(scene) {
    //     //     scene.talkBubble_cont.setVisible(false);
    //     //     scene.someText.setText('');
    //     // }
    // }
}