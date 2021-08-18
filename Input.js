export class Input extends Phaser.Scene {
    constructor() {
        super({ key:'Input' })
    }

    init(data) {
        this.totalpoints = data.totalpoints;
        this.db = data.database;
    }

    preload() {
        // *************IMPORT THE HTML INPUT FORM*************
        this.load.html("form", "form.html");
    }

    create() {

        this.add.image(800,456,'background_space_blue').setDepth(-1);
        this.leaderboard_window = this.add.image(800,450, 'help_window');

        // at this point Phaser has some keys captured and doesn't allow the DOM element to use them,
        // so we release the keys from the grasp of Phaser by doing this:
        this.input.keyboard.clearCaptures();
  
        // *************ADD THE HTML INPUT FORM*************
        // add the input form that asks user to type their name
        this.nameInput = this.add.dom(800, 460).createFromCache("form");

        // *************DISPLAY TOTAL POINTS AND OTHER INFO*************
        this.points_text = this.add.text(630,230, 'Total points: ' + this.totalpoints, { fontFamily: 'nasalization-rg', fontSize: '45px', fill: '#ffffff' });
        this.info_text = this.add.text(370,340, 'Enter your name and see the leaderboard!', { fontFamily: 'nasalization-rg', fontSize: '40px', fill: '#ffffff' });

        // *************ALF FLIES AWAY*************
        this.alf_fly = this.add.image(1500,900,'alf_takeoff');
        //add a tween that upon loading of the scene show how alf flies away
        this.add.tween({
            targets: this.alf_fly,
            duration: 6000,
            y: -200,
            ease: 'Power2'
        });

        // *************INIT LEADERBOARD DISPLAY THINGS*************
        this.exit_img = this.add.image(1400,800,'key_esc');
        this.leaderboard_text_objects = [];
        // fake scores
        // this.fake_scores = [['Nikol', 100],['Ugne', 90],['Agnieszka', 80],['Radu', 70],['ITU', 60],['Anna', 50],['Me', 40],['Myself', 30],['I', 20],['SkyboxStealer',1],['other1', 100],['other2', 90],['other3', 80],['other4', 70],['other5', 60],['other6', 50],['other7', 40],['other8', 30],['other9', 20],['other10',9]];

        // real scores
        this.scores = [];

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyEnter.on("down", () => {
            let name = this.nameInput.getChildByName("name");
            if(name.value != "") {
                this.points_text.setVisible(false);
                this.info_text.setVisible(false);
                this.nameInput.setVisible(false);

                // if the username is already taken - display warning
                // else add to db and display leaderboard

                // insert the name and total points into the database
                this.db.collection('leaderboard').add({ Name: name.value, Points: this.totalpoints });

                // // db order the scores in asceding order and get only 20 elms
                // this.db.collection('leaderboard').orderBy("Points","desc").limit(20).get()
                // .then(snapshot => { 
                //     snapshot.docs.forEach(doc => {
                //         // var name = doc.data().Name;
                //         // var points = doc.data().Points;
                //         // var entry = [name,points];
                //         this.scores.push({doc: doc.data()});
                //     });
                // });

                // show the leaderboard
                this.updateLeaderboardScores(name.value);

                // to allow the user to press Enter only once:
                this.keyEnter.enabled = false;
            }
        });

        // on esc go back to title page
        this.keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keyEscape.on('down', () => {
            this.scene.stop();
            this.scene.wake('HelpBubble_title');
            this.scene.wake('TitlePage');
            this.input.keyboard.removeAllKeys(true);
            this.input.keyboard.clearCaptures();
        });
    }

    updateLeaderboardScores(username){
        var bufferX = 450;
        var bufferY = 65;
        var posX = 250;
        var posY = 100;
        var position = 1;
        var counter = 0;

        // db order the scores in asceding order and get only 20 elms
        this.db.collection('leaderboard').orderBy("Points","desc").limit(20).get()
        .then(snapshot => { 
            snapshot.docs.forEach(doc => {
                if(counter == 10) {
                    posX = 850;
                    posY = 100;
                }
                var name = this.add.text(posX,posY, position + ". " + doc.data().Name, { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#ffffff'}).setDepth(6);
                var points = this.add.text(posX+bufferX,posY, doc.data().Points, { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#BAE4F6'}).setDepth(6);
                var diamond = this.add.image(posX+bufferX-34,posY+20, 'diamond').setDepth(6);
                if(doc.data().Name == username) {
                    name.setFill('#ffff00');
                    points.setFill('#ffff00');
                }
                this.leaderboard_text_objects.push(name);
                this.leaderboard_text_objects.push(points);
                this.leaderboard_text_objects.push(diamond);
                position++;
                posY = posY + bufferY;
                counter++;
            });
        });

        // scores.forEach(item => {
        //     if(counter == 10) {
        //         posX = 850;
        //         posY = 100;
        //     }
        //     var name = this.add.text(posX,posY, position + ". " + item[0], { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#ffffff'}).setDepth(6);
        //     var points = this.add.text(posX+bufferX,posY, item[1], { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#BAE4F6'}).setDepth(6);
        //     var diamond = this.add.image(posX+bufferX-34,posY+20, 'diamond').setDepth(6);
        //     if(item[0] == username) {
        //         name.setFill('#ffff00');
        //     }
        //     this.leaderboard_text_objects.push(name);
        //     this.leaderboard_text_objects.push(points);
        //     this.leaderboard_text_objects.push(diamond);
        //     position++;
        //     posY = posY + bufferY;
        //     counter++;
        // });
        
        // find user's position in the database
        // var pos = 1;
        // var player_pos;
        // // var currPlayer;
        // this.db.collection('leaderboard').get()
        // .then(snapshot => { 
        //     snapshot.docs.forEach(doc => {
        //         if(doc.data().Name == username) {
        //             player_pos = pos;
        //         }
        //         pos++;
        //     });
        // });
    
        // // var user_position = find in db;
        // if(player_pos > 20) { // or 19?
        //                                             // position + ". " + username
        //     var user_name = this.add.text(550,760, player_pos + username, { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#ffff00'}).setDepth(6);
        //     var points = this.add.text(550+bufferX,760, this.totalpoints, { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#BAE4F6'}).setDepth(6);
        //     var diamond = this.add.image(550+bufferX-34,760+20, 'diamond').setDepth(6);
        //     this.leaderboard_text_objects.push(user_name);
        //     this.leaderboard_text_objects.push(points);
        //     this.leaderboard_text_objects.push(diamond);
        // }

        var user_name = this.add.text(550,760, "Your score", { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#ffff00'}).setDepth(6);
        var points = this.add.text(550+bufferX,760, this.totalpoints, { fontFamily: 'nasalization-rg', fontSize: '33px', fill: '#ffff00'}).setDepth(6);
        var diamond = this.add.image(550+bufferX-34,760+20, 'diamond').setDepth(6);
        this.leaderboard_text_objects.push(user_name);
        this.leaderboard_text_objects.push(points);
        this.leaderboard_text_objects.push(diamond);
    }
}




// Phaser wasn't allowing the dom element to use some keys
// solutions found here:
// https://www.html5gamedevs.com/topic/11715-help-with-phaser-stealing-keypress-focus/
// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/