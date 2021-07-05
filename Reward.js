import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
var tasks = [];
var numsToInsert = []

export class Reward extends Phaser.Scene {

    constructor() {
        super({ key:'Reward' });
    }


    create() { 

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            this.scene.switch('MenuBST');
        });

    }
}