export class HelpBubble extends Phaser.Scene {

    constructor(name) {
        super({ key: name })
    }

    preload() {
    }
    
    create() {

        // create help bubble at the corner of the screen
        this.help_bubble = this.add.image(1545,860,'help_bubble').setScale(0.5);
        this.help_bubble_selector = this.add.image(1545-4,860-4,'help_bubble_selector').setScale(0.5);

        // create container of the popup
        this.popup_container;

        // declare and init COMMON stuff that goes into container
        this.window = this.add.image(10,-130, 'help_window');
        this.keyH_img = this.add.image(605,215,'key_h');
        // this.closeText = this.add.text(505,215, 'to close', { fontFamily: 'nasalization-rg', fontSize: '25px', fill: '#ffff00', align: 'center', wordWrap: { width: 760, useAdvancedWrap: true }});
                
        // declare stuff that goes into container
        this.keyboardText;
        this.keyboardImg;
        this.img;
        this.explanation;

        // this.explainButtons = this.add.text(470,500, 'ENTER\nARROWS\nESC\nBACKSPACE\nP\nSPACEBAR', { fontFamily: 'nasalization-rg', fontSize: '30px', fill: '#ffffff', align: 'justify', wordWrap: { width: 760, useAdvancedWrap: true }});

        // '?' (question mark) key logic
        this.switcharoo = 1;
        // use this key also in game mode
        this.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keyH.on('down', () => {
            if (this.switcharoo == 0) {
                this.help_bubble_selector.setVisible(true);
                this.popup_container.setVisible(true);
                this.switcharoo = 1;
            } else {
                this.help_bubble_selector.setVisible(false);
                this.popup_container.setVisible(false);
                this.switcharoo = 0;
            }
        });
    }

    // FOR FINAL PRODUCT: SET switcharoo TO 1, MAKE CONTAINER VISIBLE, MAKE help_bubble_selector VISIBLE

    isHelpBubbleOpen() {
        if (this.switcharoo == 1) {
            return true;
        } else {
            return false;
        }
    }

    setHelp(string) {
        switch (string) {
            case 'title':
                // init container stuff
                this.keyboardImg = this.add.image(0,-330, 'keyboard_menu');
                this.keyboardText = this.add.text(-450,-500, 'The KEYBOARD will be your tool.\nUse the ARROW KEYS, ENTER, ESC and \'?\' key to navigate the menu.', { fontFamily: 'nasalization-rg', fontSize: '28px', fill: '#ffffff', align: 'center', wordWrap: { width: 1500, useAdvancedWrap: true }});
                var text = 'Help Alf to collect his tools and spaceship parts!\n\nIn Learn you will learn about the Binary Search Trees (BST) and Red-Black Binary Search Trees (RB-BST). Complete these levels to find Alf’s wrench and screwdriver, which he will use to fix the spaceship.\n\n\n\n\nIn Play you will test your knowledge of BSTs and RB-BSTs. Complete the game to find Alf’s spaceship parts and the assembly guide of the spaceship!\n\n\n\nYou are free to skip the Learn levels and just jump straight into Play!';
                this.explanation = this.add.text(-580,-190, text, { fontFamily: 'nasalization-rg', fontSize: '25px', fill: '#ffffff', align: 'justify', wordWrap: { width: 900, useAdvancedWrap: true }});
                this.img = this.add.image(470,-5, 'help_image_title');
                // init and add stuff to container
                this.setupContainer();
                break;

            case 'learn':
                // init container stuff
                this.keyboardImg = this.add.image(-275,-375, 'keyboard');
                this.keyboardText = this.add.text(70,-500, 'Q and E to zoom out/in.\nHold W, A, S, D keys to move camera.\nARROW KEYS to walk through the tree.\nENTER to insert node.\nBACKSPACE to delete node.\nM to select min node for deletion.\nL, R, F to perform RB operations.\nSPACEBAR to go to the next level.\nESC to go back to menu.', { fontFamily: 'nasalization-rg', fontSize: '23px', fill: '#ffffff', align: 'justify', wordWrap: { width: 500, useAdvancedWrap: true }});
                var text = 'In BST you will learn about Binary Search Trees. Complete the BST levels to find Alf’s wrench!\n\n\nIn RB-BST you will learn about Red-Black Binary Search Trees. Complete the RB-BST levels to find Alf’s screwdriver!\n\n\nBST and RB-BST are split into 9 levels. There are two tasks per each level (except About levels). You will be given a node for completing the second task. The reward level will be unlocked when you finish all of the levels and collect all of the nodes.\n\n\n\n\nIn the reward level you will have to insert all of the nodes correctly and you will be rewarded with a tool!';
                this.explanation = this.add.text(-580,-190, text, { fontFamily: 'nasalization-rg', fontSize: '25px', fill: '#ffffff', align: 'justify', wordWrap: { width: 900, useAdvancedWrap: true }});
                this.img = this.add.image(470,-5, 'help_image_learn').setScale(1.5);
                // init and add stuff to container
                this.setupContainer();
                break;

            case 'sandbox':
                // init container stuff
                this.keyboardImg = this.add.image(-275,-375, 'keyboard');
                this.keyboardText = this.add.text(70,-500, 'Q and E to zoom out/in.\nHold W, A, S, D keys to move camera.\nARROW KEYS to walk through the tree.\nENTER to insert node.\nBACKSPACE to delete node.\nM to select min node for deletion.\nL, R, F to perform RB operations.\nSPACEBAR to go to the next level.\nESC to go back to menu.', { fontFamily: 'nasalization-rg', fontSize: '23px', fill: '#ffffff', align: 'justify', wordWrap: { width: 500, useAdvancedWrap: true }});
                var text = 'Here you can practice what you learned!\n\n\nIn both levels you will be given a random tree and 20 random tasks for you to perform.\n\n\nYou can generate a new tree and new tasks by pressing R key.\n\n\nThe operations are animated so you can see what happens when you perform an operation.';
                this.explanation = this.add.text(-580,-170, text, { fontFamily: 'nasalization-rg', fontSize: '25px', fill: '#ffffff', align: 'justify', wordWrap: { width: 900, useAdvancedWrap: true }});
                this.img2 = this.add.image(470,-120, 'node_icyBlue_curtain').setScale(1.2);
                this.img1 = this.add.image(470,-20, 'node_dustyPink_curtain').setScale(1.2);
                this.img = this.add.image(470,80, 'node_purple_curtain').setScale(1.2);
                // init and add stuff to container
                this.setupContainer();
                this.popup_container.add(this.img1);
                this.popup_container.add(this.img2);
                break;

            case 'play':
                // this.help_bubble.setPosition(1510,835).setScale(0.6);
                // this.help_bubble_selector.setPosition(1510-4,835-4).setScale(0.6);
                // // init container stuff
                // this.keyboardImg = this.add.image(-275,-375, 'keyboard');
                // this.keyboardText = this.add.text(70,-500, 'Q and E to zoom out/in.\nHold W, A, S, D keys to move camera.\nARROW KEYS to walk through the tree.\nENTER to insert node.\nBACKSPACE to delete node.\nM to select min node for deletion.\nL, R, F to perform RB operations.\nSPACEBAR to go to the next level.\nESC to go back to menu.', { fontFamily: 'nasalization-rg', fontSize: '23px', fill: '#ffffff', align: 'justify', wordWrap: { width: 500, useAdvancedWrap: true }});
                // var text = 'Complete the levels to find the pieces of Alf’s spaceship and the assembly guide! Then Alf will be able to repair his spaceship and finally go home!\n\n\nThere are 7 levels in total. The difficulty increases with each level.\n\nAfter the first 2 levels you will get the legs of the spaceship.\n\nAfter 2 more levels you will get the glass top of the spaceship.\n\nAfter 2 more levels you will get the main body of the spaceship.\n\nAfter the last level you will get the spaceship’s assembly guide!';
                // this.explanation = this.add.text(-580,-190, text, { fontFamily: 'nasalization-rg', fontSize: '25px', fill: '#ffffff', align: 'justify', wordWrap: { width: 900, useAdvancedWrap: true }});
                // this.img = this.add.image(470,-5, 'help_image_play');
                // // init and add stuff to container
                // this.setupContainer();
                // this.popup_container.setPosition(830,500);
                // break;

                this.switcharoo = 0;
                this.help_bubble_selector.setVisible(false);

                this.help_bubble.setPosition(1510,835).setScale(0.6);
                this.help_bubble_selector.setPosition(1510-4,835-4).setScale(0.6);
                this.window.destroy();
                this.window = this.add.image(430,-190,'help_window_keyboard');
                // this.closeText.setPosition(485,120);
                this.keyH_img.setPosition(725,120);
                this.gamePaused_text = this.add.text(-630,-200,'GAME PAUSED', { fontFamily: 'nasalization-rg', fontSize: '70px', fill: '#ff3665'});

                // init container stuff
                this.keyboardImg = this.add.image(424,-460, 'keyboard').setScale(0.8);
                this.keyboardText = this.add.text(200,-370, 'Q and E to zoom out/in.\n\nHold W, A, S, D keys to move camera.\n\nARROW KEYS to walk through the tree.\n\nENTER to insert node.\n\nBACKSPACE to delete node.\n\nM to select min node for deletion.\n\nL to rotate left.\n\nR to rotate right.\n\nF to flip colors.\n\nSPACEBAR to go to the next level.\n\nESC to go back to menu.', { fontFamily: 'nasalization-rg', fontSize: '19px', fill: '#ffffff', align: 'justify'});

                // init and add stuff to container
                var container_children = [this.window,this.keyboardText,this.keyboardImg,this.keyH_img,this.gamePaused_text];    // ,this.closeText
                this.popup_container = this.add.container(800,600,container_children).setVisible(false);
                break;

            case 'keyboard_BST':
                this.switcharoo = 0;
                this.help_bubble_selector.setVisible(false);

                this.help_bubble.setPosition(1510,835).setScale(0.6);
                this.help_bubble_selector.setPosition(1510-4,835-4).setScale(0.6);
                this.window.destroy();
                this.window = this.add.image(430,-190,'help_window_keyboard');
                // this.closeText.setPosition(485,120);
                this.keyH_img.setPosition(725,120);

                // init container stuff
                this.keyboardImg = this.add.image(424,-420, 'keyboard_bst');
                this.keyboardText = this.add.text(190,-310, 'Q and E to zoom out/in.\n\nHold W, A, S, D keys to move camera.\n\nARROW KEYS to walk through the tree.\n\nENTER to insert node.\n\nBACKSPACE to delete node.\n\nM to select min node for deletion.\n\nSPACEBAR to go to the next level.\n\nESC to go back to menu.', { fontFamily: 'nasalization-rg', fontSize: '21px', fill: '#ffffff', align: 'justify'});

                // init and add stuff to container
                var container_children = [this.window,this.keyboardText,this.keyboardImg,this.keyH_img];    // ,this.closeText
                this.popup_container = this.add.container(800,600,container_children).setVisible(false);
                break;

            case 'keyboard_RB':
                this.switcharoo = 0;
                this.help_bubble_selector.setVisible(false);

                this.help_bubble.setPosition(1510,835).setScale(0.6);
                this.help_bubble_selector.setPosition(1510-4,835-4).setScale(0.6);
                this.window.destroy();
                this.window = this.add.image(430,-190,'help_window_keyboard');
                // this.closeText.setPosition(485,120);
                this.keyH_img.setPosition(725,120);

                // init container stuff
                this.keyboardImg = this.add.image(424,-420, 'keyboard_rb');
                this.keyboardText = this.add.text(190,-310, 'Q and E to zoom out/in.\n\nHold W, A, S, D keys to move camera.\n\nARROW KEYS to walk through the tree.\n\nENTER to insert node.\n\nL to rotate left.\n\nR to rotate right.\n\nF to flip colors.\n\nSPACEBAR to go to the next level.\n\nESC to go back to menu.', { fontFamily: 'nasalization-rg', fontSize: '21px', fill: '#ffffff', align: 'justify'});

                // init and add stuff to container
                var container_children = [this.window,this.keyboardText,this.keyboardImg,this.keyH_img];    // ,this.closeText
                this.popup_container = this.add.container(800,600,container_children).setVisible(false);
                break;

            default:
                this.explanation = this.add.text(200,400, 'NO HELP BUBBLE INITIALIZED and H KEY WILL GIVE AN ERROR', { fontFamily: 'nasalization-rg', fontSize: '40px', fill: '#ffffff', align: 'justify', wordWrap: { width: 1300, useAdvancedWrap: true }}).setDepth(10);
                break;
        }
    }
    
    setupContainer() {
        var container_children = [this.window,this.explanation,this.keyboardText,this.keyboardImg,this.img,this.keyH_img];  //,this.closeText
        this.popup_container = this.add.container(800,600,container_children);
    }
}