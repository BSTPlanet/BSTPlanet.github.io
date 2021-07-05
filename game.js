// const gameState = {

// }
import { TitlePage } from './TitlePage.js';
import { LearnPage } from './LearnPage.js';
import { MenuBST } from './MenuBST.js';
import { MenuRB } from './MenuRB.js';
import { Play } from './Play.js';
import { RB } from './RB.js';
import { Sandbox } from './Sandbox.js';
import { About } from './About.js';
import { IncorrectBST } from './IncorrectBST.js';
import { SearchLinked } from './SearchLinked.js';
import { InsertionLinked } from './InsertionLinked.js';
import { DeleteLinked } from './DeleteLinked.js';
import { Searching } from './Searching.js';
import { Insertion } from './Insertion.js';
import { Deletion } from './Deletion.js';
import { Reward } from './Reward.js';
import { Expanding } from './Expanding.js';

var config = {

    type: Phaser.AUTO, //canvas or WebGL
    // #FFFFFF
    // #f2e5d7 mix1
    backgroundColor: '#e4f5e8',
    width: 1600,
    height: 912,
    // width: 800,
    // height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            // debug: true
        }
    },
    scene: [TitlePage, LearnPage, MenuBST, MenuRB, RB, Play, Sandbox, About, IncorrectBST, SearchLinked, InsertionLinked, DeleteLinked, Searching, Insertion, Deletion, Reward, Expanding],
    // scene: {
    //     preload: preload,
    //     create: create,
    //     update: update
    // },
    // pixelArt: true
};

var game = new Phaser.Game(config);