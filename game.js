import { StoryBegin } from './StoryBegin.js';
import { TitlePage } from './TitlePage.js';
import { LearnPage } from './LearnPage.js';
import { MenuBST } from './MenuBST.js';
import { MenuRB } from './MenuRB.js';
import { SandboxMenu } from './SandboxMenu.js';
import { SandboxBST } from './SandboxBST.js';
import { SandboxRB } from './SandboxRB.js';
import { Play } from './Play.js';
import { About } from './About.js';
import { Searching } from './Searching.js';
import { Insertion } from './Insertion.js';
import { Deletion } from './Deletion.js';
import { Database } from './Database.js';

import {AboutRB} from './AboutRB.js';
import {FlipColors} from './FlipColors.js';
import {RotateLeft} from './RotateLeft.js';
import {RotateRight} from './RotateRight.js';
import {InsertSmaller} from './InsertSmaller.js';
import {InsertLarger} from './InsertLarger.js';
import {InsertBetweenNodes} from './InsertBetweenNodes.js';
import {InsertLargeTree} from './InsertLargeTree.js';
import {RewardRB} from './RewardRB.js';

import { Input } from './Input.js';


var config = {

    type: Phaser.AUTO,  //canvas or WebGL
    parent: 'input-form' , 
    backgroundColor: '#00506e',
    width: 1600,
    height: 912,
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            // debug: true
        }
    },
    scene: [StoryBegin, TitlePage, LearnPage, MenuBST, MenuRB, SandboxMenu, SandboxBST, SandboxRB, Play, About, Searching, Insertion, Deletion, Database, AboutRB, FlipColors, RotateLeft, RotateRight, InsertSmaller, InsertLarger, InsertBetweenNodes, InsertLargeTree, RewardRB, Input]
};

var game = new Phaser.Game(config);