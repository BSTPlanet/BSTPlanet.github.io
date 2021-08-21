import { HelpBubble } from './HelpBubble.js';

// initialise a database 
var firebaseApp = {
    apiKey: "AIzaSyBoqwQE-MXaIuP92jIHY9CSDLRCesebdoo",
    authDomain: "leaderboard-c7fc2.firebaseapp.com",
    projectId: "leaderboard-c7fc2",
    storageBucket: "leaderboard-c7fc2.appspot.com",
    messagingSenderId: "1030668633504",
    // appId: "1:1030668633504:web:6a1a1724fba7c9344710c5",
    // measurementId: "G-8LEC440EH5"
  };
firebase.initializeApp(firebaseApp);

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
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        });
    }

    create() {
        
        // this.scene.remove('HelpBubble');
        this.helpBubble_key = 'HelpBubble_title';
        this.helpBubble_scene = new HelpBubble('HelpBubble_title');
        this.helpBubble = this.scene.add(this.helpBubble_key, this.helpBubble_scene, true);
        this.helpBubble.setHelp('title');
        
        // background
        // 800,456 this is the middle of game canvas 
        this.add.image(800,456,'background_space_blue').setDepth(-1);
        
        // title
        this.add.image(800,170, 'title');
                        
        // init buttons array
        buttons = [];

        // learn button with physics enabled
        var learnButton = this.add.image(800,340,'button_learn');
        learnButton.setName("learn");
        buttons.push(learnButton);

        // sandbox button with physics enabled
        var sandboxButton = this.add.image(800,480,'button_practice');   // change graphics - TODO
        // this.add.text(800-60,480-20, 'SANDBOX / TRAIN(ING)', { fontFamily: 'audiowide', fontSize: '38px', fill: '#ffffff' });
        sandboxButton.setName("practice");
        buttons.push(sandboxButton);

        // play button with physics enabled
        var playButton = this.add.image(800,620,'button_play');
        playButton.setName("play");
        buttons.push(playButton);
        
        // leaderboard button with physics enabled
        var leaderboardButton = this.add.image(800,760,'button_leaderboard');  // change graphics - TODO
        // this.add.text(800-60,760-20, 'LEADERBOARD', { fontFamily: 'audiowide', fontSize: '38px', fill: '#ffffff' });
        leaderboardButton.setName("leaderboard");
        buttons.push(leaderboardButton);

        // selection sprite / selector (the "glowy" yellow thing)
        selector = this.add.image(800-5,340-10,'selectionSprite_large').setDepth(2);

        // init keyboard buttons
        cursors = this.input.keyboard.createCursorKeys();
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        counter = 0;
        currentButton = buttons[counter];

        // leaderboard
        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            this.leaderboard_container.setVisible(false);
            this.text_objects.forEach(item =>{
                item.destroy();
            });
        });

        this.leaderboard_window = this.add.image(0,0, 'help_window');
        this.exit_img = this.add.image(600,350,'key_esc');
        this.leaderboard_container = this.add.container(800,460).setDepth(5).setVisible(false);
        this.leaderboard_container.addAt(this.leaderboard_window,0);
        this.leaderboard_container.addAt(this.exit_img,1);

        // get 20 scores from the database
        this.scores = [['Nikol', 100],['Ugne', 90],['Agnieszka', 80],['Radu', 70],['ITU', 60],['Anna', 50],['Me', 40],['Myself', 30],['I', 20],['SkyboxStealer',1],['other1', 100],['other2', 90],['other3', 80],['other4', 70],['other5', 60],['other6', 50],['other7', 40],['other8', 30],['other9', 20],['other10',9]];
        this.text_objects = [];
    }

    // updateLeaderboardScores(scores){
    //     var bufferX = 450;
    //     var bufferY = 65;
    //     var posX = 250;
    //     var posY = 140;
    //     var position = 1;
    //     var counter = 0;
    //     scores.forEach(item => {
    //         if(counter == 10) {
    //             posX = 850;
    //             posY = 140;
    //         }
    //         var name = this.add.text(posX,posY, position + ". " + item[0], { fontFamily: 'audiowide', fontSize: '33px', fill: '#ffffff'}).setDepth(6);
    //         var points = this.add.text(posX+bufferX,posY, item[1], { fontFamily: 'audiowide', fontSize: '33px', fill: '#BAE4F6'}).setDepth(6);
    //         var diamond = this.add.image(posX+bufferX-34,posY+20, 'diamond').setDepth(6);
    //         this.text_objects.push(name);
    //         this.text_objects.push(points);
    //         this.text_objects.push(diamond);
    //         position++;
    //         posY = posY + bufferY;
    //         counter++;
    //     });
    // }

    updateLeaderboardScores(){
        var bufferX = 450;
        var bufferY = 65;
        var posX = 250;
        var posY = 140;
        var position = 1;
        var counter = 0;

        // db order the scores in asceding order and get only 20 elms
        this.db.collection('leaderboard').orderBy("Points","desc").limit(20).get()
        .then(snapshot => { 
            snapshot.docs.forEach(doc => {
                if(counter == 10) {
                    posX = 850;
                    posY = 140;
                }
                var name = this.add.text(posX,posY, position + ". " + doc.data().Name, { fontFamily: 'audiowide', fontSize: '33px', fill: '#ffffff'}).setDepth(6);
                var points = this.add.text(posX+bufferX,posY, doc.data().Points, { fontFamily: 'audiowide', fontSize: '33px', fill: '#BAE4F6'}).setDepth(6);
                var diamond = this.add.image(posX+bufferX-34,posY+20, 'diamond').setDepth(6);
                this.text_objects.push(name);
                this.text_objects.push(points);
                this.text_objects.push(diamond);
                position++;
                posY = posY + bufferY;
                counter++;
            });
        });
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
                this.scene.sleep('HelpBubble_title');
                this.scene.switch('LearnPage');
                this.scene.wake('HelpBubble_learn');
            } else if (currentButton.name == "play") {
                this.scene.sleep('HelpBubble_title');
                this.scene.launch('Play',{database: this.db});
                this.scene.wake('HelpBubble_play');
                this.scene.sleep();
            } else if (currentButton.name == "practice") {
                this.scene.sleep('HelpBubble_title');
                this.scene.switch('SandboxMenu');
                this.scene.wake('HelpBubble_sandbox');
            } else if (currentButton.name == "leaderboard") {
                if(this.leaderboard_container.visible == false) {
                    this.updateLeaderboardScores();
                    this.leaderboard_container.setVisible(true);
                }
            }
            enterAllowed = false;
        }
    }
}