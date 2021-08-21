var storyText = 'The alien Alf was on a mission in the far far edge of the galaxy when its ship exploded. Alf was stranded on a distant rocky planet of the binary search trees (BST). The ship got lost in the depths of the planet. In order to find it, Alf needs to navigate through the planet, but it’s tricky! The only way to navigate is to solve the binary search trees! The lost alien contacts his friend Exero through a hologram phone. He is a planet scientist and has knowledge about the BST planet. With Exero’s help, Alf tries to navigate through the planet to collect his scattered tools and find the ship!';
var dialogue = ['Hi! What\'s up?', 'My spaceship exploded and I landed on some strange planet. I don’t know how to move here! Can you help me, please?!',
                'Oh my… Wait, I’ll try to locate you… Give me a moment… Oh, I can see you, you’re on a Binary Search Tree Planet… That’s a long way from home, how did you end up there? Anyway... Let me try to find a book about it… Hm… Okay, it will take a while but we can make it! Don’t worry!'];

// Story before the title page + loading assets + LOADING SCREEN
export class StoryBegin extends Phaser.Scene {
    constructor() {
        super({ key:'StoryBegin' });
    }

    preload() {

        // ***** LOADING SCREEN *****

        // ***** Progress bar graphics *****

        var loadingText = this.add.text(680,300, 'Loading...', { fontFamily: 'audiowide', fontSize: '40px', fill: '#ffffff'});
        var progressBar = this.add.graphics().setDepth(4);
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x277ea3, 0.8);
        progressBox.fillRect(620, 430, 320, 50);

        // ***** Loading screen event listeners *****

        this.load.on('progress', function (value) {
            // console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(630, 440, 300 * value, 30);
        });
                    
        // this.load.on('fileprogress', function (file) {
        //     console.log(file.src);
        // });
        
        this.load.on('complete', function () {
            // console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // ***** Preload assets for the game *****
        
        // Title
        this.load.image('title', 'Assets/Menu/title.png');
        this.load.image('story_title', 'Assets/Menu/gameTitle_story.png');
        
        // Menu - Backgrounds
        this.load.image('background_space_blue', 'Assets/Menu/background_menu_blue_scaled.png');
        this.load.image('background_space_green', 'Assets/Menu/background_menu_green_scaled.png');
        this.load.image('background_space_purple', 'Assets/Menu/background_menu_purple_scaled.png');
        this.load.image('background_space_red', 'Assets/Menu/background_menu_red_scaled.png');
        this.load.image('background_space_violet', 'Assets/Menu/background_space_violet.png');
        
        // Menu - Selectors
        this.load.image('selectionSprite_large', 'Assets/Menu/selectionSprite_large.png');
        this.load.image('selectionSprite_longer', 'Assets/Menu/selectionSprite_longer.png');
        
        // Menu - Buttons
        this.load.image('button_learn', 'Assets/Menu/button_learn.png');
        this.load.image('button_practice', 'Assets/Menu/button_practice.png');
        this.load.image('button_play', 'Assets/Menu/button_play.png');
        this.load.image('button_leaderboard', 'Assets/Menu/button_leaderboard.png');
        this.load.image('button_BST', 'Assets/Menu/button_bst.png');
        this.load.image('button_RB', 'Assets/Menu/button_rbbst.png');
        this.load.image('About', 'Assets/Menu/button_bst_about.png');
        this.load.image('Search', 'Assets/Menu/button_bst_search.png');
        this.load.image('Insert', 'Assets/Menu/button_bst_insert.png');
        this.load.image('DeleteMin', 'Assets/Menu/button_bst_deleteMin.png');
        this.load.image('DeleteMax', 'Assets/Menu/button_bst_deleteMax.png');
        this.load.image('DeleteNoChildren', 'Assets/Menu/button_bst_noChildren.png');
        this.load.image('DeleteOneChild', 'Assets/Menu/button_bst_oneChild.png');
        this.load.image('DeleteTwoChildren', 'Assets/Menu/button_bst_twoChildren.png');
        this.load.image('DeleteOneChild', 'Assets/Menu/button_bst_oneChild.png');

        this.load.image('AboutRB', 'Assets/Menu/buttonRB_about.png');
        this.load.image('RotateLeft', 'Assets/Menu/buttonRB_rotateLeft.png');
        this.load.image('RotateRight', 'Assets/Menu/buttonRB_rotateRight.png');
        this.load.image('FlipColors', 'Assets/Menu/buttonRB_flipColors.png');
        this.load.image('InsertSmaller', 'Assets/Menu/buttonRB_smallerNode.png');
        this.load.image('InsertLarger', 'Assets/Menu/buttonRB_largerNode.png');
        this.load.image('InsertBetweenNodes', 'Assets/Menu/buttonRB_betweenNodes.png');
        this.load.image('InsertLargeTree', 'Assets/Menu/buttonRB_largeTree.png');

        this.load.image('Reward', 'Assets/Menu/button_reward.png');
        
        // Menu - others
        this.load.image('Lock', 'Assets/Menu/levelLock_longer.png');
        
        // Characters
        this.load.image('onion', 'Assets/Characters/alien_pink.png');
        this.load.image('expert_hologram3', 'Assets/Characters/alien_expert3.png');
        // this.load.image('alien_dialogue', 'Assets/Characters/alien_dialogue.png');
        this.load.image('dialogue_planet', 'Assets/Characters/dialogue_planet.png');
        this.load.image('alf_takeoff', 'Assets/Characters/alf_takeoff.png');

        // Expert - talk bubbles
        this.load.image('talkBubble3', 'Assets/Characters/talkBubble3.png');
        this.load.image('talkBubble_continue', 'Assets/Characters/talkBubble_continue.png');
        this.load.image('talkBubble_close', 'Assets/Characters/talkBubble_close.png');

        // Level backgrounds
        this.load.image('background_planet_beige', 'Assets/Backgrounds/background_planet_beige.png');
        this.load.image('background_planet_darkBlue', 'Assets/Backgrounds/background_planet_darkBlue.png');
        this.load.image('background_planet_raisin', 'Assets/Backgrounds/background_planet_raisin.png');
        this.load.image('background_planet_venus', 'Assets/Backgrounds/background_planet_venus.png');
        this.load.image('background_planet_purple', 'Assets/Backgrounds/background_planet_purple.png');
        // this.load.image('background_planet_grayRed', 'Assets/Backgrounds/background_planet_grayRed.png');
        // this.load.image('background_planet_graphite', 'Assets/Backgrounds/background_planet_graphite.png');
        // this.load.image('background_planet_turmeric', 'Assets/Backgrounds/background_planet_turmeric.png');
        // this.load.image('background_planet_green', 'Assets/Backgrounds/background_planet_green.png');
        // this.load.image('background_planet_pink', 'Assets/Backgrounds/background_planet_pink.png');
        // this.load.image('background_planet_redGray', 'Assets/Backgrounds/background_planet_redGray.png');
        // this.load.image('background_planet_rusty', 'Assets/Backgrounds/background_planet_rusty.png');
        // this.load.image('background_planet_azure', 'Assets/Backgrounds/background_planet_azure.png');
        // this.load.image('background_planet_darkGreen', 'Assets/Backgrounds/background_planet_darkGreen.png');
        
        // Nodes
        this.load.image('node_null', 'Assets/Nodes/node_null.png');

        this.load.image('node_brown', 'Assets/Nodes/node_brown.png');
        this.load.image('node_brown_curtain', 'Assets/Nodes/node_brown_curtain.png');
        this.load.image('node_orange', 'Assets/Nodes/node_orange.png');
        this.load.image('node_orange_curtain', 'Assets/Nodes/node_orange_curtain.png');
        this.load.image('node_purple', 'Assets/Nodes/node_purple.png');
        this.load.image('node_purple_curtain', 'Assets/Nodes/node_purple_curtain.png');
        this.load.image('node_icyBlue', 'Assets/Nodes/node_icyBlue.png');
        this.load.image('node_icyBlue_curtain', 'Assets/Nodes/node_icyBlue_curtain.png');
        this.load.image('node_dustyPink', 'Assets/Nodes/node_dustyPink.png');
        this.load.image('node_dustyPink_curtain', 'Assets/Nodes/node_dustyPink_curtain.png');
        this.load.image('node_lightPurple', 'Assets/Nodes/node_lightPurple.png');
        this.load.image('node_lightPurple_curtain', 'Assets/Nodes/node_lightPurple_curtain.png');
        this.load.image('node_peach', 'Assets/Nodes/node_peach.png');
        this.load.image('node_peach_curtain', 'Assets/Nodes/node_peach_curtain.png');
        this.load.image('node_powder', 'Assets/Nodes/node_powder.png');
        this.load.image('node_powder_curtain', 'Assets/Nodes/node_powder_curtain.png');
        // this.load.image('node_yellow', 'Assets/Nodes/node_yellow.png');
        // this.load.image('node_yellow_curtain', 'Assets/Nodes/node_yellow_curtain.png');
        // this.load.image('node_dustyApple', 'Assets/Nodes/node_dustyApple.png');
        // this.load.image('node_dustyApple_curtain', 'Assets/Nodes/node_dustyApple_curtain.png');

        // Panels
        this.load.image('panel', 'Assets/Panels/panel.png');
        // this.load.image('node_place', 'Assets/Panels/node_placeholder.png');
        this.load.image('node_place_2', 'Assets/Panels/node_placeholder_2.png');
        this.load.image('node_place_3', 'Assets/Panels/node_placeholder_3.png');
        this.load.image('node_place_4', 'Assets/Panels/node_placeholder_4.png');
        this.load.image('node_place_5', 'Assets/Panels/node_placeholder_5.png');
        this.load.image('node_place_6', 'Assets/Panels/node_placeholder_6.png');
        this.load.image('node_place_7', 'Assets/Panels/node_placeholder_7.png');
        this.load.image('node_place_8', 'Assets/Panels/node_placeholder_8.png');
        this.load.image('wrench_place', 'Assets/Panels/wrench_placeholder.png');
        this.load.image('screw_place', 'Assets/Panels/screwdriver_placeholder.png');
        this.load.image('panel_sandbox', 'Assets/Panels/panel_sandbox.png');
        this.load.image('diamond', 'Assets/Panels/diamond.png');
        this.load.image('key_esc', 'Assets/Panels/key_esc.png');
        this.load.image('key_h', 'Assets/Panels/key_h.png');
        this.load.image('spacebar_close', 'Assets/Panels/spacebar_close.png');
        this.load.image('spacebar_continue', 'Assets/Panels/spacebar_continue.png');
        this.load.image('key_enter', 'Assets/Panels/key_enter.png');
        this.load.image('key_n', 'Assets/Panels/key_n.png');

        // Rewarded Tools
        this.load.image('screw', 'Assets/Panels/screwdriver.png');
        this.load.image('wrench', 'Assets/Panels/wrench.png');
        
        // Reward Nodes
        this.load.image('node_97', 'Assets/Nodes/Reward/BST/node_97.png');
        this.load.image('node_400', 'Assets/Nodes/Reward/BST/node_400.png');
        this.load.image('node_129', 'Assets/Nodes/Reward/BST/node_129.png');
        this.load.image('node_791', 'Assets/Nodes/Reward/BST/node_791.png');
        this.load.image('node_421', 'Assets/Nodes/Reward/BST/node_421.png');
        this.load.image('node_655', 'Assets/Nodes/Reward/BST/node_655.png');
        this.load.image('node_338', 'Assets/Nodes/Reward/BST/node_338.png');

        this.load.image('node_77', 'Assets/Nodes/Reward/RB/node_77.png');
        this.load.image('node_472', 'Assets/Nodes/Reward/RB/node_472.png');
        this.load.image('node_27', 'Assets/Nodes/Reward/RB/node_27.png');
        this.load.image('node_489', 'Assets/Nodes/Reward/RB/node_489.png');
        this.load.image('node_63', 'Assets/Nodes/Reward/RB/node_63.png');
        this.load.image('node_65', 'Assets/Nodes/Reward/RB/node_65.png');
        this.load.image('node_210', 'Assets/Nodes/Reward/RB/node_210.png');

        // Help Bubble
        this.load.image('help_window', 'Assets/Panels/help_window.png');
        this.load.image('help_window_keyboard', 'Assets/Panels/window_keyboard.png');
        this.load.image('help_bubble', 'Assets/Panels/help_bubble.png');
        this.load.image('help_bubble_selector', 'Assets/Panels/help_bubble_selector.png');
        this.load.image('keyboard', 'Assets/Panels/keyboard.png');
        this.load.image('keyboard_menu', 'Assets/Panels/keyboard_menu.png');
        this.load.image('keyboard_bst', 'Assets/Panels/keyboard_bst.png');
        this.load.image('keyboard_rb', 'Assets/Panels/keyboard_RB.png');
        this.load.image('help_image_title', 'Assets/Panels/help_image_title.png');
        this.load.image('help_image_learn', 'Assets/Panels/help_image_learn.png');
        this.load.image('help_image_play', 'Assets/Panels/help_image_play.png');

        // Reward Popups
        this.load.image('reward_popup_BST', 'Assets/Panels/reward_popup_BST.png');
        this.load.image('reward_popup_RB', 'Assets/Panels/reward_popup_RB.png');
        this.load.image('reward_popup_level1', 'Assets/Panels/reward_popup_level1.png');
        this.load.image('reward_popup_level2', 'Assets/Panels/reward_popup_level2.png');

        // About level selector
        this.load.image('about_selector', 'Assets/Nodes/About/node_selector_more.png');
        this.load.image('subtree','Assets/Nodes/About/subtreeSelector.png');
    }

    create() {

        this.typer;
        this.talkIsOn = false;

        // background
        this.background = this.add.image(800,456,'background_space_blue').setDepth(-1);

        // title to appear with a tween
        this.title = this.add.image(800,450, 'story_title').setAlpha(0);

        this.add.tween({
            targets: this.title,
            ease: 'Sine.easeIn',
            duration: 4000,
            alpha: '+=1'
        });

        this.progressCounter = 0;
        this.story = this.add.text(200,100, '', { fontFamily: 'audiowide', fontSize: '32px', fill: '#ffffff', align: 'justify', wordWrap: { width: 1200, useAdvancedWrap: true }, lineSpacing: 30 });
        this.spacebar_img = this.add.image(800,840,'spacebar_continue').setScale(1.2).setDepth(2);
        this.tween_spacebar = 
            this.add.tween({
                targets: this.spacebar_img,
                scaleX: 1.4,
                scaleY: 1.4,
                repeat: -1,
                duration: 500,
                yoyo: true
            });

        this.enter_img = this.add.image(1550,870,'key_enter').setScale(0.7).setDepth(2);
        this.skipText = this.add.text(1420,845, 'skip\nthe story', { fontFamily: 'audiowide', fontSize: '20px', fill: '#7b9de0', align: 'right' }).setDepth(2);


        // this.continueText = this.add.text(1250,830, 'Press SPACEBAR to continue...', { fontFamily: 'audiowide', fontSize: '20px', fill: '#ffffff' });
        // this.skipText = this.add.text(1250,860, 'Press ENTER to skip the story', { fontFamily: 'audiowide', fontSize: '20px', fill: '#ffffff' });

        this.dialoguePic = this.add.image(790,800,'dialogue_planet').setVisible(false);  // alien_dialogue
        this.exeroText = this.add.text(1130,380, '', { fontFamily: 'audiowide', fontSize: '30px', fill: '#d4fffd', wordWrap: { width: 450, useAdvancedWrap: true }, lineSpacing: 20 });
        this.alfText = this.add.text(120,300, '', { fontFamily: 'audiowide', fontSize: '30px', fill: '#ffd4ed', wordWrap: { width: 500, useAdvancedWrap: true }, lineSpacing: 20 });


        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            if (this.talkIsOn == false) {
                this.talkIsOn = true;
                if (this.progressCounter == 0) {             // typewrite the story
                    this.title.destroy();
                    this.typewriteTextWrapped(this.story,storyText);
                } else if (this.progressCounter == 1) {      // display aliens' dialogue, Exero's line 1
                    this.story.setText('');
                    // display both aliens
                    this.dialoguePic.setVisible(true);
                    // type Exero's line beside Exero's graphic
                    this.typewriteTextWrapped(this.exeroText,dialogue[0]);
                } else if (this.progressCounter == 2) {     // display Alf's line 
                    this.typewriteTextWrapped(this.alfText,dialogue[1]);
                } else if (this.progressCounter == 3) {     // display Exero's line 2
                    this.exeroText.setPosition(1134,70);
                    this.typewriteTextWrapped(this.exeroText,dialogue[2]);
                } else if (this.progressCounter == 4) {     // move to TitlePage
                    this.dialoguePic.setVisible(false);
                    //destroyEverything();                    <-----                 // need to implement this (maybe if every variable is assigned as 'this.', everything gets destroyed when we stop the scene?)
                    this.scene.stop();
                    this.scene.start('TitlePage');
                }
            } else {
                this.typer.destroy();
                if (this.progressCounter == 0) {
                    // console.log('the typer should be stopping');
                    this.story.setText(storyText);
                    this.progressCounter = 1;
                } else if (this.progressCounter == 1) {
                    this.exeroText.setText(dialogue[0]);
                    this.progressCounter = 2;
                } else if (this.progressCounter == 2) {
                    this.alfText.setText(dialogue[1]);
                    this.progressCounter = 3;
                } else if (this.progressCounter == 3) {
                    this.exeroText.setText(dialogue[2]);
                    this.progressCounter = 4;
                }

                this.talkIsOn = false;
            }
        });

        // press Enter to skip the story - maybe show keyboard usage popup on title page?
        var enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        enterKey.on('down', () => {
            storyText = null;
            dialogue = null;
            this.scene.stop();
            this.scene.start('TitlePage');
            this.input.keyboard.removeAllKeys(true);
        });
    }

    update() {
        
    }

    // *** Typewriting text effect functions ****

    typewriteTextWrapped(targetText,textToType) {
        targetText.setText('');
        const lines = targetText.getWrappedText(textToType);
        const wrappedText = lines.join('\n');

        this.typewriteText(targetText,wrappedText);
    }

    typewriteText(targetText,text) {
        const length = text.length;
        let i = 0;
        this.typer = 
            this.time.addEvent({
                callback: () => {
                    targetText.text += text[i];
                    ++i;
                    if (this.typer.getOverallProgress() == 1) {
                        this.progressCounter = this.progressCounter + 1;
                        this.talkIsOn = false;
                    }
                },
                repeat: length - 1,
                delay: 40,
            });
    }
    // ******

    destroyEverything() {

    }
}