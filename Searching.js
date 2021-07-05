import { Tree } from './Tree.js';
import { NodeBST } from './NodeBST.js';
var numsToInsert = [];
var tasks = []


export class Searching extends Phaser.Scene {

    constructor() {
        super({ key:'Searching' });
    }

    init (data) {
        console.log(data)
        numsToInsert = data.tree
        console.log(numsToInsert)
        tasks.push(data.task)
        console.log("Task: " + data.task)
    }

    preload() {
        // this.load.image('onion', 'Assets/onion.png');
        this.load.image('background', 'Assets/background_planet_green_singleLarge.png');
        this.load.image('onion', 'Assets/alien_pink.png');
        this.load.image('node_yellow', 'Assets/node_yellow_scaled.png'); // yellow node
        this.load.image('node_curtain', 'Assets/node_curtain.png'); // yellow node curtain
        this.load.image('node_null', 'Assets/node_null_scaled.png'); // gray node null
    }

    create() {

        // *************VARIABLES*************
        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90;

        var nodetoreturn = null;

        // *************SCENE SPECIFIC CODE*************

        this.add.image(10_000,750,'background').setDepth(-1);

        // Text on top of the game world
        var text1 = this.add.text(9_000,100, 'SEARCHING BST', { fontSize: '30px', fill: '#000' });
        //Instructions
        var text2 = this.add.text(10_500,100, 'Instructions:\nBACKSPACE to delete\nBACKSPACE + P to delete node with 2 children\nENTER to insert', { fontSize: '20px', fill: '#000' });

         // Clafifications on the Insert Operation
        //  var text3 = this.make.text({
        //     x: 2700,
        //     y: 1000,
        //     text: 'You always start searching from the root. To find a key in the tree you have to compare it with the root key and go left if it’s smaller or go right if it’s bigger than the root key. You have to repeat this step until the key of node you are on is equal to the key you’re looking for - that’s when you stop and delete (press BACKSPACE). Sometimes the delete operation is more complicated than that - if the node you’re deleting has two children, you need to replace the deleted node with the leftmost node in the right subtree of the deleted node. In this case you’ll be asked to show which node should replace the node you want to delete (by pressing ENTER).',
        //     origin: { x: 0.5, y: 0.5 },
        //     style: {
        //         fontSize:'28px ',
        //         fill: 'black',
        //         align: 'justify',
        //         wordWrap: { width: 1600 }
        //     },
        // });

        // var text4 = this.add.text(2300,1130, 'To go back to the home page press ESC', { fontSize: '30px', fill: '#000' });

        // Go back to the home page
        // var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        // keyEscape.on('down', () => {
        //     this.scene.switch('BSTIntroduction');
        // });

        // Switches from this scene to InsertionLinked
        // var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // spacebar.on('down', () => {
        //     this.scene.stop('Sandbox');
        //     this.scene.start('SearchLinked');
        // });

        var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spacebar.on('down', () => {
            this.scene.switch('IncorrectBST');
        });

         // Restart the current scene
        var keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyR.on('down', () => {
            destroyEverything();
            this.scene.restart('Sandbox');
            this.input.keyboard.removeAllKeys(true);
        });

        var keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEscape.on('down', () => {
            this.scene.switch('MenuBST');
        });

        // *************PLAYER*************
        var player = this.physics.add.sprite(10_000, 300, 'onion');
        player.setBounce(0.1);

        // *************KEYBOARD*************

        // arrows, spacebar, shift
        var cursors = this.input.keyboard.createCursorKeys();

        var keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        var keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        var keybackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        // *************CAMERA AND ZOOM*************
        this.cameras.main.setBounds(0, 0, 20_000, 20_000);
        // this.cameras.main.startFollow(player, true, 0.08, 0.08);
        // this.cameras.main.centerOn(2700,500);
        this.cameras.main.zoom = 0.5;
        this.cameras.main.startFollow(player, true, 0.05, 0.05);

        // var isZoomed = true;
        // var keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // keyZ.on('down', function () {
        //     var cam = this.cameras.main;
        //     if(isZoomed) {  // zoom out
        //         cam.stopFollow();
        //         cam.pan(root.x, root.y, 2000, 'Power2'); //x to pan to, y to pan to, pan speed?, pan mode
        //         cam.zoomTo(0.5, 1000);//zoom distance, duration/speed of zoom
        //         isZoomed = false;
        //     } else { // zoom in
        //         cam.startFollow(player, true, 0.05, 0.05);
        //         // cam.pan(player.x, player.y, 2000, 'Power2'); //x to pan to, y to pan to, pan speed?, pan mode
        //         cam.zoomTo(1, 1000);//zoom distance, duration/speed of zoom
        //         isZoomed = true;
        //     }
        // }, this);

        // this.cameras.world.setBounds(0, 0, 600, 2000);
        // player.setCollideWorldBounds(true);

        // ************* NUMBERS TO INSERT *************
        // Array of nodes to be inserted into BST automatically by insertNodes
        // var numsToInsert = [33,1,14,5,17,16,55,50,70,48,53,60,80,3,77];
        // var numsToInsert = [10,9,8,7,6,5,4,3,2,1];

        // same nums, different insertion order:
        // var numsToInsert = [13,98,48,47,22,36,50,78,84,24,34,32,11];

        // for working on tweening:
        // var numsToInsert = [10,15,8,5,20,25,16,13,4,7,6];

        // TREE WE WORKED ON FOR DELETION ANIMATIONS:
        // var numsToInsert = [20,15,9,4,14,13,11,12,24,33,67];

        // var numsToInsert = [10,15,20,25,30,35,40,45,50,21,29,28,27,26,22];
        // var numsToInsert = [10,15,20,25,30,35,40,45,50,21,29,28,27,26];

        // var numsToInsert = [10,15,20,25,30,35,22,23,29];

        // var numsToInsert = [];
        // var numsToInsert = [1,0,-1,-2,-3,23,24,25];
        // var numsToInsert = [28,13,77,7,21,50,100,18];
        // var numsToInsert = [33,11,44,10,12,55,5,13,50,70,3,8,17,48,53,60,80,4];
        // var numsToInsert = ["S","E","X","A","R","C","H","M"]
        

        // merging (NOTHING IS MERGING ANYMORE)
        // var numsToInsert = [268, 470, 499, 173, 286, 91, 214, 226, 114, 196, 456, 434, 59, 341, 242, 40, 301, 74, 
        //                     402, 369, 294, 388, 390, 487, 291, 404, 15, 282, 465, 367, 97, 271, 221, 280, 383, 
        //                     473, 236, 346, 213, 182, 75, 175, 290]
        // var numsToInsert = [371, 616, 709, 497, 601, 939, 941, 81, 85, 127, 584, 923, 554, 607, 889, 429, 994, 401, 396, 879, 147, 596, 1, 618, 955, 717, 4, 948, 906, 474, 738, 725, 449, 21, 465, 611, 666, 203, 478, 723, 116, 756, 576, 149, 668, 353, 20, 221, 700]
        
        // crossing examples: (SHOULDN"T BE CROSSING ANYMORE)
        // var numsToInsert = [376, 955, 905, 454, 412, 124, 815, 475, 47, 599, 870, 287, 989, 356, 837, 949, 296, 784, 37, 511, 121, 447, 21, 11, 562, 400, 743, 689, 492, 966, 310, 891, 17, 526, 716, 256, 700, 184, 745, 482, 793, 181, 674, 173, 566, 731, 971, 419, 96]
        
        // var numsToInsert = [979, 162, 592, 407, 428, 810, 251, 856, 975, 231, 936, 691, 700, 318, 170, 133, 991, 968, 22, 781, 66, 510, 884, 811, 549, 128, 782, 367, 294, 161, 437, 826, 77, 12, 815, 185, 987, 816, 784, 246, 948, 481, 264, 295, 512, 289, 960, 721]
        // var numsToInsert = [987, 17, 773, 18, 235, 763, 349, 637, 718, 573, 655, 432, 174, 588, 644, 431, 262, 884, 925, 968, 630, 569, 712, 426, 892, 741, 36, 120, 977, 76, 171, 30, 446, 289, 755, 172, 242, 913, 442, 485, 526, 327, 225, 891, 56, 494, 319, 542]
        // var numsToInsert = [277, 264, 768, 511, 372, 258, 950, 700, 365, 472, 902, 981, 321, 387, 699, 751, 77, 118, 106, 213, 897, 239, 989, 113, 261, 833, 977, 571, 530, 966, 449, 209, 709, 804, 30, 395, 371, 211, 92, 519, 76, 885, 165, 747, 589, 108, 214, 513, 598]
        // var numsToInsert = [756, 315, 274, 728, 93, 97, 836, 240, 915, 547, 327, 63, 552, 852, 596, 145, 467, 157, 238, 435, 888, 911, 111, 313, 856, 949, 580, 979, 396, 255, 730, 795, 737, 908, 975, 223, 325, 21, 25, 155, 123, 477, 486, 71, 965, 723, 124, 940, 681, 271]
        // var numsToInsert = [619, 408, 479, 416, 379, 548, 358, 65, 442, 888, 592, 499, 206, 401, 381, 462, 732, 875, 434, 777, 591, 326, 899, 418, 669, 212, 928, 560, 194, 884, 429, 172, 443, 165, 334, 643, 242, 758, 236, 836, 934, 15, 77, 910, 16, 719, 749, 474, 814, 53, 974, 786, 24, 829, 679, 630, 475, 879, 62, 611, 789, 648, 372, 391, 547, 69, 757, 785, 913, 199, 501, 628, 716, 103, 364, 656, 906, 201, 106, 864, 252, 895, 644, 92, 186, 859, 7, 534, 596, 664, 17, 313, 572, 144]
        // var numsToInsert = [199, 639, 808, 149, 124, 723, 566, 333, 155, 628, 535, 471, 790, 511, 587, 322, 681, 212, 939, 418, 320, 440, 456, 117, 849, 236, 917, 775, 749, 919, 442, 611, 277, 347, 154, 468, 964, 294, 542, 200, 428, 159, 241, 256, 787, 479, 776, 386, 450, 665]
        // var numsToInsert = [966, 835, 944, 402, 792, 220, 310, 764, 510, 576, 185, 286, 622, 749, 125, 867, 470, 431, 169, 549, 979, 610, 132, 47, 869, 251, 971, 482, 629, 635, 730, 291, 771, 465, 778, 226, 718, 827, 69, 14, 400, 655, 44, 476, 676, 116, 540, 739, 958]
        // var numsToInsert = [161, 974, 202, 663, 350, 459, 890, 424, 855, 73, 973, 199, 896, 684, 947, 533, 678, 686, 613, 220, 204, 594, 826, 569, 401, 788, 736, 359, 667, 546, 565, 42, 916, 129, 281, 307, 191, 192, 633, 567, 806, 868, 881, 133, 823, 705, 461]
        // var numsToInsert = [958, 758, 887, 231, 581, 648, 1, 416, 399, 619, 229, 159, 94, 990, 795, 799, 580, 965, 478, 438, 917, 803, 808, 664, 849, 979, 164, 654, 215, 382, 401, 347, 657, 497, 268, 140, 356, 686, 532, 841, 750, 31, 205, 56, 170, 818, 559, 522, 370, 669]
        // var numsToInsert = [78, 944, 234, 415, 488, 693, 106, 817, 448, 559, 718, 280, 771, 858, 789, 804, 433, 628, 402, 833, 286, 219, 235, 667, 806, 495, 317, 192, 8, 277, 95, 808, 936, 100, 961, 634, 55, 815, 857, 985, 614, 451, 540, 633, 805, 841, 209, 922, 780, 339, 44, 891, 369, 929, 338, 990, 377, 629, 426]
        
        // var numsToInsert = [210, 42, 243, 402, 496, 498, 665, 630, 172, 260, 519, 963, 625, 688, 568, 444, 895, 80, 86, 918, 554, 401, 899, 598, 91, 376, 981, 867, 775, 501, 117, 278, 819, 807, 37, 356, 21, 965, 706, 216, 151, 922, 225, 312, 322, 535, 898, 514, 207, 227, 870, 951, 143, 718, 61, 628, 844]
        
        // delete 292 - merges - DELETES FINE NOW, NO MERGING
        // var numsToInsert = [352, 264, 232, 666, 915, 65, 481, 668, 702, 73, 462, 741, 333, 465, 939, 835, 721, 872, 978, 886, 488, 795, 967, 255, 131, 696, 217, 918, 207, 223, 300, 379, 294, 778, 862, 240, 750, 446, 701, 555, 651, 159, 133, 849, 906, 600, 781, 983, 990, 473, 787, 292, 45, 820, 885, 422, 773, 400, 279, 13, 261, 551, 714, 767, 525, 82, 959, 486, 901, 539, 805, 160, 97, 855, 286, 241, 604, 947, 989, 634, 924, 29, 60, 219, 358, 934, 873, 813, 560, 68, 297, 289, 55, 218, 265, 250, 307]
        
        // nodes merge!! - NOT ANYMORE
        // var numsToInsert = [626,95,930,681,445,131,31,863,482,715,959,427,295,835,659,796,375,532,9,721,928,322,841,775,493,501,946,814,723,569,316,40,786,408,326,840,713,701,925,766,490,414,38,885,593,221,769,431]
        // var numsToInsert = [777, 727, 720, 497, 825, 611, 734, 816, 488, 11, 242, 506, 102, 311, 977, 919, 629, 976, 481, 114, 806, 768, 682, 111, 987, 101, 350, 750, 808, 967, 130, 290, 679, 6, 357, 855, 899, 642, 848, 585, 209, 657, 610, 427, 441, 580, 206, 308]

        // TODO: too large distances - still is a problem
        // the order and amount of checks of collisions and crossings in the insert automatic changes the distances in many different ways for the first case below
        // var numsToInsert = [538,334,611,174,896,648,432,35,146,678,820,269,93,68,270,339,33,890,12,623,24,733,133,213,441,127,746,507,947,374,867,846,860,930,882,818,626,367,377,997,679,798,790,587,761,881,710,254,98,651]
        // var numsToInsert = [123, 212, 535, 415, 51, 214, 524, 612, 869, 539, 72, 201, 901, 281, 987, 94, 623, 409, 522, 226, 21, 68, 247, 413, 443, 658, 293, 666, 942, 286, 318, 430, 260, 742, 904, 48, 638, 862, 139, 322, 511, 808, 466, 22, 575, 508, 773, 28, 974, 252]
        // var numsToInsert = [493, 556, 736, 218, 622, 773, 747, 457, 534, 751, 270, 638, 436, 165, 524, 520, 723, 645, 124, 444, 226, 328, 992, 714, 366, 212, 879, 891, 702, 511, 475, 613, 499, 991, 311, 872, 562, 908, 744, 320, 987, 459, 496, 529, 452, 988, 17, 748, 49, 58]

        // Delete 862 
        // var numsToInsert = [524, 368, 587, 865, 862, 367, 573, 261, 154, 121, 288, 266, 984, 867, 440, 657, 196, 293, 817, 342, 214, 141, 283, 897, 942, 102, 324, 361, 375, 149, 307, 352, 769, 753, 708, 875, 859, 540, 928, 350, 220, 160, 873, 517, 185, 452, 792, 921, 85];
        // var numsToInsert = [33,5,77,1,6,70,80,2,60,79];
        // var numsToInsert = [13,36,50,78,84,98,48,47,22,24,34,32,11];
        
        
        // *********************
        // THINGS THAT GO WRONG IN EXPANSION:

        // NODES MERGE UPON LOADING:
        // var numsToInsert = [323, 240, 918, 907, 582, 814, 21, 944, 428, 855, 174, 959, 908, 943, 778, 3, 209, 71, 949, 49, 107, 511, 766, 234, 834, 259, 830, 47, 677, 93, 730, 178, 284, 64, 161, 75, 972, 424, 479, 436, 326, 277, 6, 207, 926, 689, 9, 160, 70, 488]
        // right branch expands too much:
        // var numsToInsert = [190, 795, 717, 247, 431, 775, 322, 682, 857, 994, 563, 375, 672, 704, 729, 344, 364, 255, 211, 804, 642, 593, 420, 232, 544, 471, 280, 278, 291, 342, 581, 560, 43, 286, 788, 650, 659, 198, 721, 348, 499, 709, 381, 140, 343, 630, 164, 737, 512, 241];

        // *********************

        // SOME INTERESTING CASES:

        // delete 766 - case when node is deleted with one child and the branch moves up and collides
        // var numsToInsert = [763, 752, 532, 588, 288, 987, 561, 122, 539, 875, 109, 584, 558, 766, 708, 996, 100, 160, 414, 196, 849, 839, 828, 495, 15, 274, 927, 117, 817, 99, 424, 383, 518, 381, 705, 842, 286, 475, 600, 214, 453, 393, 943, 147, 598, 295, 287, 978, 377, 920];
        
        // case when nodes are inserted more down than to the sides:
        // var numsToInsert = [972, 19, 296, 381, 62, 264, 937, 660, 526, 263, 534, 744, 524, 949, 68, 868, 620, 667, 506, 717, 578, 160, 392, 842, 166, 224, 175, 181, 290, 170, 649, 97, 194, 893, 541, 507, 730, 466, 719, 134, 656, 653, 711, 344, 941, 417, 992, 220, 953];
        
        // delete 252 - case when min's right moves up and collides
        // var numsToInsert = [600, 808, 28, 451, 558, 952, 252, 684, 30, 453, 784, 192, 99, 115, 422, 2, 498, 917, 824, 963, 279, 618, 142, 149, 1, 669, 930, 659, 965, 581, 426, 119, 336, 69, 14, 535, 820, 389, 299, 122, 64, 864, 18, 556, 740, 985, 935, 663, 868];

        // *********************
        
        // GENERATE RANDOM
        // var numsToInsert = generateNumsToInsert(30);
        console.log(numsToInsert);

        function generateNumsToInsert(n) {
            var arr = [];
            var i;
            for(i=0;i<n;i++){
                var number = Math.floor(Math.random() * (999 - 1) + 1);
                if(!arr.includes(number)){
                    arr.push(number);
                }
            }
            return arr;
        }

        function generateNumsForInsertTask(n) {
            var arr = [];
            var i;
            for(i=0;i<n;i++){
                var number = Math.floor(Math.random() * (999 - 1) + 1);
                if(!arr.includes(number) && !numsToInsert.includes(number)){
                    arr.push(number);
                }
            }
            return arr;
        }
        
        // *************INITIALIZE BST*************

        var tree = new Tree(this);
        // BST (intially an empty/null root node)
        tree.createRoot(this);
        tree.createTree(numsToInsert,this);
        setPhysicsTree(tree.root,this);
        // tree.root.left.drawLinkToParentRB(this);


        function setPhysicsTree(node,scene) {
            if (node != null) {
                // teleporting + curtains
                node.setPhysicsNode(cursors,player,scene);
                // checks
                scene.physics.add.overlap(player, node, insert, enterIsPressed, scene);
                scene.physics.add.overlap(player, node, deleteNode, backspaceIsPressed, scene);
                scene.physics.add.overlap(player, node, checkAndDeleteSecondNode, pIsPressed, scene);
                // redraw
                // scene.physics.add.overlap(node, tree.nodearray, redrawTree, null, scene);
                // to stand on the node
                scene.physics.add.collider(player, node);

                setPhysicsTree(node.left,scene);
                setPhysicsTree(node.right,scene);
            }
        }

        // function redrawTree(node) {
        //     tree.checkCollisions(node);
        //     tree.redraw(this);
        // }
        
        
       // *************** TASKS + TASK ACTIONS ***************

        // elements to delete, one-by-one
        // var tasks = ['Min',48,'Max'];
        // var tasks = [99,6,3,1,42,48,25,7,9,8,0];
        // var tasks = [99,99,99,99,99,99,99,99,99,99]
        // var tasks = [473, 236, 346, 213, 182, 75, 175, 290];
        // var tasks = [408, 613, 779, 957, 813, 330, 461, 110, 695, 768]
        // var tasks = [33,1,14,5,17,16,55,50,70,48,53,60,80,3,77];
        // var tasks = generateNumsForInsertTask(20);

        // // displays what operations needs to be performed by the player
        var taskText = this.add.text(9000,175, '', { fontSize: '22px', fill: '#000' });
        displayTask(this);
        // // for displaying feedback after completing tasks
        // var feedback = this.add.text(2000,150, '', { fontSize: '20px', fill: '#000' });

        // //while there are still some tasks in the array, displays text indicating what needs to be done
        // //when tasks is empty then press P to continue to next lesson
        function displayTask(scene) {
            if (tasks.length != 0) { 
                taskText.setText('Find ' + tasks[0]);
            } else {
                taskText.setText('You did it!!! You did the thing!!!!'); 
                taskText.setPosition(9000,1100);
                taskText.setFill('#ff0062');
                taskText.setFontSize(80);
            }
        }

        function taskSucceededActions(scene) {
            player.setPosition(tree.root.x,tree.root.y-BUFFER);
            tasks.shift();
            // feedback.setPosition(2000,150);
            // feedback.setText('Good job!!!');
            // displayTask(scene);
            // tree.calculateHeight();
            // tree.closeCurtains();
        }

        // ***************DELETION***************

        var backspaceAllowed = false;
        function backspaceIsPressed() {
            var moveAllowed = false;
            if (keybackspace.isDown) {
                backspaceAllowed = true;
            }
            if (backspaceAllowed && keybackspace.isUp) {
                moveAllowed = true;
                backspaceAllowed = false;
            }
            return moveAllowed;
        }

        var nodeToDelete = null;

        // code for deletion when both children are null and one child is null (and only selection when both children are NOT null)
        function deleteNode(player, node) {
            if (nodeToDelete == null) {
                if (node.key != 'null') {
                // if (node.key != 'null' && (tasks[0] == node.key || (tasks[0] == 'Min' && node.key == min(tree.root)) || (tasks[0] == 'Max' && node.key == max(tree.root))) && nodeToDelete == null) {
                    if (node.left.key =='null' && node.right.key =='null') { //  both children are null 

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.parent != null) {
                            player.setPosition(node.parent.x,node.parent.y-BUFFER);
                        }

                        // node.left, node.right, node
                        // hide links and nodes
                        this.add.tween({
                            targets: [node.left.link, node.right.link, node.left.nullGraphics, node.right.nullGraphics, node.nodeGraphics, node.keyString, node.left.keyString,node.right.keyString],
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        this.time.addEvent({
                            delay: 1000,
                            callback: function(node) {
                                node.setKey('null');
                                node.setNullGraphics();
                                node.nullGraphics.setAlpha(0);
                                node.left.destroyNode();
                                node.right.destroyNode();
                                node.setChildren(); // set children as null
                            },
                            args: [node]
                        });

                        this.add.tween({
                            targets: [node.nullGraphics, node.keyString],
                            ease: 'Sine.easeIn',
                            delay: 2000,
                            duration: 1000,
                            alpha: '+=1',
                            onComplete: taskSucceededActions,
                            onCompleteParams: [this]
                        });

                        this.time.addEvent({
                            delay: 3000,
                            callback: function(scene) {
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });

                    } else if (node.right.key == 'null' || node.left.key  == 'null') { // one child is null

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        if (node.right.key == 'null') { // right child is null

                            player.setPosition(node.left.x,node.left.y-BUFFER);

                            // hide links
                            this.add.tween({
                                targets: [node.left.link, node.right.link, node.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // hide right null of deleted node and the deleted node
                            this.add.tween({
                                targets: [node.right.nullGraphics, node.nodeGraphics, node.keyString, node.right.keyString],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // branch moves to the right
                            this.time.addEvent({
                                delay: 1000,
                                callback: function(node,scene) {

                                    if (node.parent == null) {
                                        node.left.parent = null;
                                        tree.root = node.left;
                                        tree.root.dpth = 0;
                                    } else if (node.parent.left == node) {
                                        node.parent.left = node.left;
                                        node.left.parent = node.parent;
                                    } else if (node.parent.right == node) {
                                        node.parent.right = node.left;
                                        node.left.parent = node.parent;
                                    }
                                    
                                    var distanceX = node.left.posX-node.posX;
                                    // moveBranch(node.left,distanceX,scene); //v1
                                    updateBranch(node.left,distanceX); //v2

                                    // TO PREVENT COLLAPSING:
                                    node.left.distanceFromParent = node.distanceFromParent;

                                    tree.updateNodeDepths(node.left); // starting from 9 (the node that changes deleted node)

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: node.left.posX,
                                        y: node.left.posY - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    actuallyMoveBranch(node.left,distanceX,scene); //v2

                                    // // destroy 15.right
                                    // node.right.destroyNode();
                                    // // destroy 15
                                    // node.destroyNode();
                                },
                                args: [node,this]
                            });

                            // move player to root, update tasks, enable keyboard
                            this.time.addEvent({
                                delay: 3000,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    // tree.traverseAndCheckCrossings(scene);

                                    tree.redraw(scene);

                                    appearLinksOneChild(node.left, scene);
                                    // destroy 15.right
                                    node.right.destroyNode();
                                    // destroy 15
                                    node.destroyNode();

                                },
                                args: [this]
                            });

                        } else {                        // left child is null

                            player.setPosition(node.right.x,node.right.y-BUFFER);

                            // hide links
                            this.add.tween({
                                targets: [node.left.link, node.right.link, node.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // hide left null of deleted node and the deleted node
                            this.add.tween({
                                targets: [node.left.nullGraphics, node.nodeGraphics, node.keyString, node.left.keyString],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            // branch moves to the left up
                            this.time.addEvent({
                                delay: 1000,
                                callback: function(node,scene) {

                                    if (node.parent == null) {
                                        node.right.parent = null;
                                        tree.root = node.right;
                                        tree.root.dpth = 0;
                                    } else if (node.parent.left == node) {
                                        node.parent.left = node.right;
                                        node.right.parent = node.parent;
                                    } else if (node.parent.right == node) {
                                        node.parent.right = node.right;
                                        node.right.parent = node.parent;
                                    }

                                    // TODO:
                                    // not here:
                                    // 2.the collisions are checked only once? the crossings are not checked?

                                    var distanceX = node.right.posX-node.posX;
                                    // moveBranch(node.right,distanceX,scene); //v1
                                    updateBranch(node.right,distanceX); //v2

                                    // TO PREVENT COLLAPSING:
                                    node.right.distanceFromParent = node.distanceFromParent;

                                    tree.updateNodeDepths(node.right); // starting from 33 (the node that changes deletd node)

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: node.right.posX,
                                        y: node.right.posY - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    actuallyMoveBranch(node.right,distanceX,scene); //v2

                                    // appearLinks(node.right, scene);

                                    // // destroy 24.left
                                    // node.left.destroyNode();
                                    // // destroy 24
                                    // node.destroyNode();
                                },
                                args: [node,this]
                            });

                            // move player to root, update tasks, enable keyboard
                            this.time.addEvent({
                                delay: 3000,
                                callback: function(scene) {
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    // tree.traverseAndCheckCrossings(scene);
    
                                    tree.redraw(scene);
    
                                    appearLinksOneChild(node.right, scene);
                                    // destroy 24.left
                                    node.left.destroyNode();
                                    // destroy 24
                                    node.destroyNode();
    
                                },
                                args: [this]
                            });
                        } //end of if else
     

                        this.time.addEvent({
                            delay: 6000,
                            callback: function(scene) {
                                taskSucceededActions(scene);
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });

                        // player.setPosition(tree.root.x,tree.root.y-BUFFER);
                        // taskSucceededActions(this);
                    } else { // both children are NOT null
                        // setting a value of nodeToDelete to use it after user clicks Enter
                        nodeToDelete = node;
                        // nodeToDelete.nodeGraphics.setFillStyle(0xff0090, 1);
                        nodeToDelete.nodeGraphics.setTint(0xff0090);
                        // feedback.setPosition(nodeToDelete.x-700,250);
                        // feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.');
                    }
                }
                // } else {
                //     // feedback.setPosition(2000,150);
                //     // feedback.setText('Try again');                
                //     if(nodeToDelete != null) //node.left.key  != 'null' && node.right.key  != 'null' && 
                //     {
                //         // feedback.setPosition(nodeToDelete.x,185);
                //         // feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.\n\nTRY AGAIN'); 
                //     } else {
                //         player.setPosition(tree.root.x,tree.root.y-BUFFER);
                //     }
                // }
            }
        }

        function checking(node) {
            if (node != null) {
                // console.log("Key: " + node.key + " x: " + node.posX);
                if (node.key == 80) {
                    console.log("80");
                    node.left.setPosition(100,100);
                }
                checking(node.left);
                checking(node.right);
            }
        }

        //code used on overlap when the user clicks Enter - part of the deleteNode logic for deleting nodes with two children

        var enterAllowed = false;
        function enterIsPressed() {
            var moveAllowed = false;
            if(keyEnter.isDown){
                enterAllowed = true;
            }
            if (enterAllowed && keyEnter.isUp) {
                moveAllowed = true;
                enterAllowed = false;
            }
            return moveAllowed;
        }

        var pAllowed = false;
        function pIsPressed() {
            var moveAllowed = false;
            if(keyP.isDown){
                pAllowed = true;
            }
            if (pAllowed && keyP.isUp) {
                moveAllowed = true;
                pAllowed = false;
            }
            return moveAllowed;
        }

        // code for deletion when both children are NOT null
        function checkAndDeleteSecondNode(player, node){
            if(nodeToDelete != null && node.key != 'null'){
                var key = min(nodeToDelete.right);
                if(node.key == key){

                    // Main cases:
                    // if the right child has nothing on the left - DONE
                    // if the right child has a left child and it has nulls - IN PROGRESS
                    // Other cases:
                    // if the right child has left child and it has right subtree

                    if (nodeToDelete.right.left.key == 'null') { // when nodeToDelete's right child IS min (move min and its right subtree up)

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        // hide links:
                        if (nodeToDelete.parent != null) {
                            this.add.tween({
                                targets: [nodeToDelete.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });
                        }

                        this.add.tween({
                            targets: [nodeToDelete.left.link, nodeToDelete.right.link, node.left.link],
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        // nodes and their components:
                        this.add.tween({
                            targets: [nodeToDelete.nodeGraphics, nodeToDelete.curtain, nodeToDelete.keyString, node.left.nullGraphics, node.left.keyString],
                            delay: 1000,
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        // destroy left child(null) of 15 and update some stuff
                        this.time.addEvent({
                            delay: 2100,
                            callback: function(nodeToDelete,node) {
                                node.left.destroyNode(); // destroy null left child of 15
                                node.left = null;
                                node.parent = nodeToDelete.parent; // set 15s parent as what 10 had (null) || set 25s parent to 15
                                node.dpth = nodeToDelete.dpth;
                            },
                            args: [nodeToDelete,node]
                        });

                        // abs(10 x - 15 x) + node x
                        this.time.addEvent({
                            delay: 2500,
                            callback: function(nodeToDelete,node,scene) {
                                var distanceX = Math.abs(nodeToDelete.posX-node.posX);

                                // Version 1
                                // scene.add.tween({
                                //     targets: player,
                                //     x: player.x - distanceX, // if 15 is on left branch then we should do +
                                //     y: player.y - tree.z, // 10 is Buffer
                                //     ease: 'Power2',
                                //     duration: 1500,
                                // });

                                // moveBranch(node,distanceX,scene);

                                // Version 2
                                updateBranch(node,distanceX);
                            },
                            args: [nodeToDelete,node,this]
                        });

                        // Version 1
                        // this.time.addEvent({
                        //     delay: 4500,
                        //     callback: function(nodeToDelete,node,scene) {
                        //         if (nodeToDelete == tree.root) { // if deleted node is root
                        //             tree.root = node;
                        //             node.left = nodeToDelete.left;  // move 10's left branch to 15
                        //             node.left.parent = node; // change left branch's parent to 15
                        //         } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                        //             node.left = nodeToDelete.left;  // set 25s left to 16 (move 20's left branch to 25)
                        //             node.left.parent = node; // set 16s parent to 25 (change left branch's parent to 25)
                        //             node.parent.right = node; // set 15's right child to 25
                        //         } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                        //             node.left = nodeToDelete.left;
                        //             node.left.parent = node;
                        //             node.parent.left = node; 
                        //         }
                        //         node.distanceFromParent = nodeToDelete.distanceFromParent;
                        //         node.left.drawLinkToParent(scene);
                        //         node.left.link.setAlpha(0);
                        //         scene.add.tween({
                        //             targets: node.left.link,
                        //             ease: 'Sine.easeOut',
                        //             duration: 1000,
                        //             alpha: '+=1'
                        //         });
                        //         tree.updateNodeDepths(tree.root);
                        //         nodeToDelete.destroyNode();
                        //     },
                        //     args: [nodeToDelete,node,this]
                        // });

                        // Version 2
                        this.time.addEvent({
                            delay: 3000,
                            callback: function(nodeToDelete,node,scene) {
                                var distanceX = Math.abs(nodeToDelete.posX-node.posX);

                                if (nodeToDelete == tree.root) { // if deleted node is root
                                    tree.root = node;
                                    node.left = nodeToDelete.left;  // move 10's left branch to 15
                                    node.left.parent = node; // change left branch's parent to 15
                                } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                                    node.left = nodeToDelete.left;  // set 25s left to 16 (move 20's left branch to 25)
                                    node.left.parent = node; // set 16s parent to 25 (change left branch's parent to 25)
                                    node.parent.right = node; // set 15's right child to 25
                                } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                                    node.left = nodeToDelete.left;
                                    node.left.parent = node;
                                    node.parent.left = node; 
                                }
                                node.distanceFromParent = nodeToDelete.distanceFromParent;
                                tree.updateNodeDepths(tree.root);
                                // nodeToDelete.destroyNode();

                                tree.traverseAndCheckCollisions(scene);
                                tree.traverseAndCheckCrossings(scene);

                                scene.add.tween({
                                    targets: player,
                                    x: node.posX, // if 15 is on left branch then we should do +
                                    y: node.posY - BUFFER, // 10 is Buffer
                                    ease: 'Power2',
                                    duration: 1500,
                                });
                                actuallyMoveBranch(node,distanceX,scene);
                                appearLinks(node,scene);
                            },
                            args: [nodeToDelete,node,this]
                        });

                        // need to appear movedNodes's link to parent and left link

                        this.time.addEvent({
                            delay: 4500,
                            callback: function(node,scene) {
                                // node.left.drawLinkToParent(scene);
                                // node.left.link.setAlpha(0);
                                scene.add.tween({
                                    targets: node.left.link,
                                    ease: 'Sine.easeIn',
                                    duration: 1000,
                                    alpha: '+=1'
                                });
                            },
                            args: [node,this]
                        });
                        // end of Version 2

                        this.time.addEvent({
                            delay: 5800,
                            callback: function(node,scene) {
                                // nodeToDelete.setKey(node.key);
                                // nodeToDelete.setFillStyle(0xF5CBDD, 1);
                                // deleteMin(node);
                                nodeToDelete.destroyNode();
                                nodeToDelete = null;
                                tree.updateNodeDepths(node);
                                // tree.updateNodePosX();

                                // Version 1
                                // tree.traverseAndCheckCollisions(scene);
                                // tree.traverseAndCheckCrossings(scene);
                                // tree.redraw(scene);

                                // Version 2
                                // A way to move the branch together with already expanded branch:
                                // in moveBranch only update the posX - line 643
                                // then check for collisions - line 
                                // then actually move the branch nodes (change x to updated posX) - line
                                // redraw
                                tree.traverseAndCheckCollisions(scene);
                                tree.traverseAndCheckCrossings(scene);
                                tree.redraw(scene);
                            },
                            args: [node,this]
                        });

                        this.time.addEvent({
                            delay: 7500,
                            callback: function(scene) {
                                taskSucceededActions(scene);
                                displayTask(scene);
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });
                                
                        
                    } else if (nodeToDelete.right.left.key != 'null') { // when nodeToDelete's right child's left exists (it means there will be a min somewhere on the left from right child)

                        var nodeToUseForAppear = node.parent;

                        // DISABLE KEYBOARD
                        this.input.keyboard.enabled = false;

                        // hide links:
                        if (nodeToDelete.parent != null) {
                            this.add.tween({
                                targets: [nodeToDelete.link],
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });
                        }

                        this.add.tween({
                            targets: [nodeToDelete.left.link, nodeToDelete.right.link, node.left.link, node.right.link, node.link],
                            ease: 'Sine.easeOut',
                            duration: 1000,
                            alpha: '-=1'
                        });

                        // when min doesn't have children on the right
                        if (node.right.key == 'null') {

                            // hide nodes and their components:
                            this.add.tween({
                                targets: [nodeToDelete.nodeGraphics, nodeToDelete.curtain, nodeToDelete.keyString, node.left.nullGraphics, node.left.keyString, node.right.nullGraphics, node.right.keyString],
                                delay: 1000,
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });
                            
                            // create null for 20 and destroy 16's both null children and update some stuff
                            this.time.addEvent({
                                delay: 2100,
                                callback: function(nodeToDelete,node,scene) {
                                    // make null for 20
                                    var childL = new NodeBST(scene,node.parent.posX-tree.w, node.parent.posY+tree.z, 'null',node.parent.dpth+1,node.parent);
                                    childL.distanceFromParent = -tree.w;
                                    node.parent.left = childL;
                                    childL.nullGraphics.setAlpha(0);
                                    childL.keyString.setAlpha(0);
                                    childL.link.setAlpha(0);

                                    tree.checkCollisions(childL);

                                    // teleporting + curtains
                                    childL.setPhysicsNode(cursors,player,scene);

                                    // physics
                                    scene.physics.add.overlap(player, childL, insert, enterIsPressed, scene);
                                    scene.physics.add.overlap(player, childL, deleteNode, backspaceIsPressed, scene);
                                    scene.physics.add.overlap(player, childL, checkAndDeleteSecondNode, pIsPressed, scene);
                                    scene.physics.add.collider(player, childL);
                                    
                                    node.left.destroyNode(); // destroy null left child of 16
                                    node.right.destroyNode(); // destroy null right child of 16
                                    node.left = null;
                                    node.right = null;
                                    node.parent = nodeToDelete.parent; // set 16s parent as what 15 had (null)
                                    node.dpth = nodeToDelete.dpth;
                                },
                                args: [nodeToDelete,node,this]
                            });

                            // move 16 to the place of 15
                            this.time.addEvent({
                                delay: 2500,
                                callback: function(nodeToDelete,node,scene) {
                                    
                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    // 16 shape and curtain moves up
                                    scene.add.tween({
                                        targets: [node, node.nodeGraphics, node.curtain],
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y, 
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    var distanceX = Math.abs(node.keyString.x-node.posX);
                                    
                                    // 16s keystring moves up
                                    scene.add.tween({
                                        targets: node.keyString,
                                        x: nodeToDelete.x - distanceX,
                                        y: nodeToDelete.keyString.y, // - (tree.z*(node.dpth-nodeToDelete.dpth))
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    // draw 16s link to parent, update physics bodies
                                    scene.time.addEvent({
                                        delay: 1500,
                                        callback: function(node,scene) {
                                            node.drawLinkToParent(scene);
                                            node.link.setAlpha(0);
                                            node.body.updateFromGameObject();
                                            node.curtain.body.updateFromGameObject();
                                        },
                                        args: [node,scene]
                                    });

                                    // update 16s x and y
                                    node.posX = nodeToDelete.posX;
                                    node.posY = nodeToDelete.posY;

                                },
                                args: [nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 4500,
                                callback: function(nodeToUseForAppear,nodeToDelete,node,scene) {
                                    if (nodeToDelete == tree.root) { // if deleted node is root
                                        tree.root = node;
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.right = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.left = node; 
                                    }

                                    // put/appear null on the left of 20
                                    scene.add.tween({
                                        targets: [nodeToUseForAppear.left.nullGraphics, nodeToUseForAppear.left.nodeGraphics, nodeToUseForAppear.left.keyString],
                                        ease: 'Sine.easeIn',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    node.distanceFromParent = nodeToDelete.distanceFromParent;
                                    
                                    if (node.parent != null) {
                                        scene.add.tween({
                                            targets: [node.link],
                                            delay: 1000,
                                            ease: 'Sine.easeOut',
                                            duration: 1000,
                                            alpha: '+=1'
                                        });
                                    }

                                    scene.add.tween({
                                        targets: [node.left.link, node.right.link, nodeToUseForAppear.left.link], //node.right.left.link
                                        delay: 1000,
                                        ease: 'Sine.easeOut',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    tree.updateNodeDepths(tree.root);
                                    nodeToDelete.destroyNode();
                                },
                                args: [nodeToUseForAppear,nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 8000,
                                callback: function(node,scene) {
                                    // nodeToDelete.setKey(node.key);
                                    // nodeToDelete.setFillStyle(0xF5CBDD, 1);
                                    // deleteMin(node);
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
                                    // tree.updateNodePosX();
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redraw(scene);  
                                },
                                args: [node,this]
                            });

                        } else if (node.right.key != 'null') { // when min has children on the right (need to move the right branch up)
                            
                            // hide nodes and their components:
                            this.add.tween({
                                targets: [nodeToDelete, nodeToDelete.nodeGraphics, nodeToDelete.curtain, nodeToDelete.keyString, node.left, node.left.nullGraphics, node.left.keyString],
                                delay: 1000,
                                ease: 'Sine.easeOut',
                                duration: 1000,
                                alpha: '-=1'
                            });

                            this.time.addEvent({
                                delay: 2100,
                                callback: function(nodeToDelete,node,scene) {
                                    node.left.destroyNode(); // node is min. we destroy its left child because it wont be needed anymore/it will be replaced
                                    // node.right.destroyNode();
                                    node.left = null;
                                    // node.right = null;
                                    node.parent = nodeToDelete.parent;
                                    node.dpth = nodeToDelete.dpth;
                                },
                                args: [nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 2500,
                                callback: function(nodeToDelete,node,scene) {
                                    
                                    // player moves up
                                    scene.add.tween({
                                        targets: player,
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y - BUFFER,
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    // 11 shape and curtain moves up
                                    scene.add.tween({
                                        targets: [node, node.nodeGraphics, node.curtain],
                                        x: nodeToDelete.x,
                                        y: nodeToDelete.y, 
                                        ease: 'Power2',
                                        duration: 1500,
                                    });
                                    
                                    var distanceX = Math.abs(node.keyString.x-node.posX);
                                    
                                    // 11s keystring moves up
                                    scene.add.tween({
                                        targets: node.keyString,
                                        x: nodeToDelete.x - distanceX,
                                        y: nodeToDelete.keyString.y, // - (tree.z*(node.dpth-nodeToDelete.dpth))
                                        ease: 'Power2',
                                        duration: 1500,
                                    });

                                    // draw 11s link to parent, update physics bodies
                                    scene.time.addEvent({
                                        delay: 1500,
                                        callback: function(node,scene) {
                                            // node.drawLinkToParent(scene);
                                            // node.link.setAlpha(0);
                                            node.body.updateFromGameObject();
                                            node.curtain.body.updateFromGameObject();
                                        },
                                        args: [node,scene]
                                    });

                                },
                                args: [nodeToDelete,node,this]
                            });

                            // this.time.addEvent({
                            //     delay: 5500,
                            //     callback: function(nodeToDelete,node,scene) {
                            //         // var distanceX = Math.abs(node.posX-node.right.posX);
    
                            //         // updateBranch(node.right,distanceX); //v2

                            //         // moveBranch(node.right,distanceX,scene);

                            //     },
                            //     args: [nodeToDelete,node,this]
                            // });

                            this.time.addEvent({
                                delay: 6000,
                                callback: function(nodeToUseForAppear,nodeToDelete,node,scene) {

                                    var distanceX = Math.abs(node.posX-node.right.posX);
    
                                    updateBranch(node.right,distanceX); //v2

                                    // update 11s x and y - just to be sure it doesn't get updated before moveBranch 
                                    node.posX = nodeToDelete.posX;
                                    node.posY = nodeToDelete.posY;

                                    // draw 11s links - have to have it here after we update 11s posX and posY
                                    node.drawLinkToParent(scene);
                                    node.link.setAlpha(0);
                                    
                                    // update 12s distance from parent
                                    node.right.distanceFromParent = node.distanceFromParent; // <-- 11s.distancefromparent // nodeToUseForAppear.left.distanceFromParent; <-- 13s.left
                                    nodeToUseForAppear.left = node.right; // here nodeToUseForAppear is the parent of node(min)
                                    node.right.parent = nodeToUseForAppear;

                                    if (nodeToDelete == tree.root) { // if deleted node is root
                                        tree.root = node;
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.right){ // if deleted node is right child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.right = node;
                                    } else if (nodeToDelete == nodeToDelete.parent.left) { // if deleted node is left child
                                        node.left = nodeToDelete.left;
                                        node.left.parent = node;
                                        node.right = nodeToDelete.right;
                                        node.right.parent = node;
                                        node.parent.left = node; 
                                    }

                                    // update distancefromparent for 11
                                    node.distanceFromParent = nodeToDelete.distanceFromParent;


                                    // tree.updateNodeDepths(node.right);
                                    tree.updateNodeDepths(tree.root);

                                    tree.traverseAndCheckCollisions(scene); //v2
                                    tree.traverseAndCheckCrossings(scene); //v2

                                    actuallyMoveBranch(nodeToUseForAppear.left,distanceX,scene); //v2

                                    // appearLinks(node.right, scene);
                                    
                                    if (node.parent != null) {
                                        scene.add.tween({
                                            targets: [node.link],
                                            delay: 1000,
                                            ease: 'Sine.easeOut',
                                            duration: 1000,
                                            alpha: '+=1'
                                        });
                                    }

                                    scene.add.tween({
                                        targets: [node.left.link, node.right.link, nodeToUseForAppear.left.link], //node.right.left.link
                                        delay: 1000,
                                        ease: 'Sine.easeOut',
                                        duration: 1000,
                                        alpha: '+=1'
                                    });

                                    // tree.updateNodeDepths(tree.root);
                                    nodeToDelete.destroyNode();
                                },
                                args: [nodeToUseForAppear,nodeToDelete,node,this]
                            });

                            this.time.addEvent({
                                delay: 8000,
                                callback: function(nodeToUseForAppear,node,scene) {
                                    // nodeToDelete.setKey(node.key);
                                    // nodeToDelete.setFillStyle(0xF5CBDD, 1);
                                    // deleteMin(node);
                                    nodeToDelete = null;
                                    tree.updateNodeDepths(node);
                                    // tree.updateNodePosX();
                                    tree.traverseAndCheckCollisions(scene);
                                    tree.traverseAndCheckCrossings(scene);
                                    tree.redraw(scene);
    
                                    appearLinksOneChild(nodeToUseForAppear.left,scene);
    
                                },
                                args: [nodeToUseForAppear,node,this]
                            });

                        } //end of else if

                        this.time.addEvent({
                            delay: 9000,
                            callback: function(scene) {
                                taskSucceededActions(scene);
                                displayTask(scene);
                                // ENABLE KEYBOARD
                                scene.input.keyboard.enabled = true;
                            },
                            args: [this]
                        });


                    } //end of else if

                } else {
                    player.setPosition(nodeToDelete.x,nodeToDelete.y-BUFFER);
                    // feedback.setPosition(nodeToDelete.x,175); 
                    // feedback.setText('Now select the node you want to exchange the deleted node with.\nUse Enter.\n\nTRY AGAIN');
                }
            }
        }

        // How to delay functions:
        // usage of time.addEvent
        // this.time.addEvent({
        //     delay: 1900,
        //     callback: console.log,
        //     args: ["TELL ME WHY"]
        // });

        // Version 1
        function moveBranch(node,distanceX,scene) {
            if (node != null) {

                node.link.destroy();

                scene.add.tween({
                    targets: [node, node.curtain, node.keyString],
                    x: node.posX - distanceX, // if 15 is on left branch then we should do +
                    y: node.posY - tree.z,
                    ease: 'Power2',
                    duration: 1500,
                });


                // move links:
                // scene.add.tween({
                //     targets: [node.x1,node.y1,node.x2,node.y2],
                //     x: 20000,
                //     y: 10000,
                //     // x1: { from: node.link.x1, to: node.link.x1+100 },
                //     // y1: { from: node.link.y1, to: node.link.y1+100 },
                //     // x2: 10080,
                //     // y2: 10080,
                //     ease: 'Power2',
                //     duration: 1000
                // });

                scene.time.addEvent({
                    delay: 1500,
                    callback: function(node,scene) {
                        node.drawLinkToParent(scene);
                        node.body.updateFromGameObject();
                        node.curtain.body.updateFromGameObject();
                    },
                    args: [node,scene]
                });

                node.posX = node.posX - distanceX; // if 15 is on left branch then we should do + - maybe should always be minus ?
                node.posY = node.posY - tree.z;

                moveBranch(node.left,distanceX,scene);
                moveBranch(node.right,distanceX,scene);
            }
        }

        // Version 2 - Nikol's suggested 
        function updateBranch(node,distanceX) {
            if (node != null) {

                node.posX = node.posX - distanceX;
                node.posY = node.posY - tree.z;

                updateBranch(node.left,distanceX);
                updateBranch(node.right,distanceX);
            }
        }

        function actuallyMoveBranch(node,distanceX,scene) {
            if (node != null && node.x != node.posX) {

                node.link.destroy();

                scene.add.tween({
                    targets: [node.nodeGraphics, node.nullGraphics, node.curtain, node.keyString],
                    x: node.posX,
                    y: node.posY,
                    ease: 'Power2',
                    duration: 1500,
                });

                // move links - probably not anymore

                scene.time.addEvent({
                    delay: 1500,
                    callback: function(node,scene) {
                        // node.drawLinkToParent(scene);
                        // node.link.setAlpha(0);
                        node.body.updateFromGameObject();
                        node.curtain.body.updateFromGameObject();

                        // //tween for appearing links
                        // scene.add.tween({
                        //     targets: node.link,
                        //     ease: 'Sine.easeIn',
                        //     duration: 1000,
                        //     alpha: '+=1'
                        // });
                    },
                    args: [node,scene]
                });

                actuallyMoveBranch(node.left,distanceX,scene);
                actuallyMoveBranch(node.right,distanceX,scene);
            }
        }

        // when deleted node has two children - when right child IS min
        function appearLinks(node,scene) {
            if (node != null && node.x != node.posX){
                //tween for appearing links
                node.drawLinkToParent(scene);
                node.link.setAlpha(0);
                scene.add.tween({
                    delay: 1500,
                    targets: node.link,
                    ease: 'Sine.easeIn',
                    duration: 1000,
                    alpha: '+=1'
                });

                appearLinks(node.left,scene);
                appearLinks(node.right,scene);
            }
        }

        function appearLinksOneChild(node,scene) {
            if (node != null){
                //tween for appearing links
                node.link.setAlpha(0);
                scene.add.tween({
                    targets: node.link,
                    ease: 'Sine.easeIn',
                    duration: 1000,
                    alpha: '+=1'
                });

                appearLinksOneChild(node.left,scene);
                appearLinksOneChild(node.right,scene);
            }
        }

        function printBST(node) {
            if (node != null) {
                console.log(node.key + ":");
                console.log("x: "+ node.x +" posX: " + node.posX);
                console.log("y: "+ node.x +" posY: " + node.posX);
                printBST(node.left);
                printBST(node.right);
            }
        }

        // HELPER FOR deleteNode
        // THIS FUNCTION IS USED IN THE checkAndDeleteSecondNode FUNCTION
        // deletes the min node
        function deleteMin(node){
            if (node.right.key != 'null') {
                node.setKey(node.right.key);
                var newL = node.right.left;
                var newR = node.right.right;
                node.left.destroyNode();
                node.right.destroyNode();
                node.setChildren(newL, newR);
                node.left.parent = node;
                node.right.parent = node;
            } else {
                node.setKey('null');
                node.setNullGraphics();
                node.left.destroyNode();
                node.right.destroyNode();
                node.setChildren(); // set children as null
            }
        }

        // HELPER FOR deleteNode
        // THIS FUNCTION IS USED IN THE checkAndDeleteSecondNode FUNCTION
        // Returns min node.key of a tree
        function min(node) { 
            var keyToReturn = node.key;
            if (node != null && node.key != 'null'){
                if (node.left.key != 'null') {
                    keyToReturn = min(node.left);
                } else {
                    keyToReturn = node.key;
                    //deleteMin(node);
                }
            }
            return keyToReturn;
        }

        // HELPER FOR deleteNode
        // THIS FUNCTION IS USED IN THE checkAndDeleteSecondNode FUNCTION
        // Returns max node.key of a tree
        function max(node) { 
            var keyToReturn = node.key;
            if (node != null && node.key != 'null'){
                if (node.right.key != 'null') {
                    keyToReturn = max(node.right);
                } else {
                    keyToReturn = node.key;
                    //deleteMin(node);
                }
            }
            return keyToReturn;
        }


        function insert(player,node) {
            if(node.key == 'null') {
                node.setKey(tasks[0]);
                node.setNodeGraphics();
                node.curtain.setVisible(false);

                // create left child
                var childL = new NodeBST(this, node.posX-tree.w, node.posY+tree.z, 'null',node.dpth+1,node);
                childL.distanceFromParent = -tree.w;
                tree.nodearray.push(childL);

                // create right child
                var childR = new NodeBST(this, node.posX+tree.w, node.posY+tree.z, 'null',node.dpth+1,node);
                childR.distanceFromParent = tree.w;
                tree.nodearray.push(childR);

                node.setChildren(childL,childR);

                tree.checkCollisions(childL);
                tree.checkCollisions(childR);

                // teleporting + curtains
                childL.setPhysicsNode(cursors,player,this);
                childR.setPhysicsNode(cursors,player,this);

                // checks
                this.physics.add.overlap(player, childL, insert, enterIsPressed, this);
                this.physics.add.overlap(player, childL, deleteNode, backspaceIsPressed, this);
                this.physics.add.overlap(player, childL, checkAndDeleteSecondNode, pIsPressed, this);
                this.physics.add.overlap(player, childR, insert, enterIsPressed, this);
                this.physics.add.overlap(player, childR, deleteNode, backspaceIsPressed, this);
                this.physics.add.overlap(player, childR, checkAndDeleteSecondNode, pIsPressed, this);

                this.physics.add.collider(player, childL);
                this.physics.add.collider(player, childR);
                // redraw
                // this.physics.add.overlap(childL, tree.nodearray, redrawTree, null, this);
                // this.physics.add.overlap(childR, tree.nodearray, redrawTree, null, this);
                // to stand on the node
            
                // update depth of the tree
                if (childL.dpth > tree.treedpth) {
                    tree.treedpth = childL.dpth;
                }

                tree.traverseAndCheckCollisions(this);
                tree.traverseAndCheckCrossings(tree.root,this);
                tree.redraw(this);

                // PLAY 'BACKSTREET BOYS - TELL ME WHY' HERE

                // DISABLE KEYBOARD
                this.input.keyboard.enabled = false;

                node.nodeGraphics.setAlpha(0);
                // node.setAlpha(0);
                node.keyString.setAlpha(0);
                node.curtain.setAlpha(0);
                childL.nullGraphics.setAlpha(0);
                // childL.setAlpha(0);
                childL.keyString.setAlpha(0);
                childL.link.setAlpha(0);
                childR.nullGraphics.setAlpha(0);
                // childR.setAlpha(0);
                childR.keyString.setAlpha(0);
                childR.link.setAlpha(0);

                this.add.tween({
                    targets: [node.nodeGraphics, node.keyString, node.curtain, childL.nullGraphics, childL.keyString, childL.link, childR.nullGraphics, childR.keyString, childR.link],
                    ease: 'Sine.easeIn',
                    duration: 1000,
                    alpha: "+=1"
                });
                
                this.time.addEvent({
                    delay: 1500,
                    callback: function(scene) {
                        taskSucceededActions(this);
                        displayTask(this);
                        scene.input.keyboard.enabled = true;
                    },
                    args: [this]
                });
            }
        }

        // ***************DESTROY***************

        function destroyEverything() {
            // destroy tree and nodes
            tree.destroyTree();
            
            // destroy everything in the scene (text, player, keyboard)
            player.destroy();
            text1.destroy();
            // text2.destroy();
            // text3.destroy();
            // text4.destroy();
            feedback.destroy();
            taskText.destroy();
        }
    }

    update() {

    }
}
