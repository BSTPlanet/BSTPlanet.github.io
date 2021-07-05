import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
var tasks = [];
var numsToInsert = []

export class About extends Phaser.Scene {

    constructor() {
        super({ key:'About' });
    }


    create() { 

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            this.scene.switch('MenuBST');
        });

    }

}