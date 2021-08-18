export class Database{

    constructor(scene) {
        this.aboutTree = [685, 494, 520, 472, 173, 752, 690, 800, 53];
        this.searchTree = [957, 519, 722, 38, 566, 97, 55];
        this.insertionTree = [879, 384, 181, 509, 580, 978, 595, 219] ;
        this.deleteMinTree = [954, 833, 696, 649, 531, 129, 220, 536, 910, 98, 312];
        this.deleteMaxTree = [464, 26, 406, 759, 287, 780, 591, 266, 791, 785, 992];
        this.deleteNoChildrenTree = [50, 667, 54, 60, 815, 778, 335, 734, 293, 627, 421] ;
        this.deleteOneChildTree = [450, 604, 507, 621, 76, 373, 655, 788, 151, 191, 147, 381];
        this.deleteTwoChildrenTree =  [474, 266, 338, 11, 631, 791, 471, 313, 880, 206, 717, 88, 480, 742];
        this.rewardTree = []

        this.aboutTasks = [685, 494, 472, 752, 173];
        this.searchTasks = [566,97];
        this.insertTasks = [600,400] ;
        this.deleteMinTasks = ["Min", "Min"];
        this.deleteMaxTasks = ["Max", "Max"];
        this.deleteNoChildrenTasks = [734, 421] ;
        this.deleteOneChildTasks = [76,655];
        this.deleteTwoChildrenTasks =  [631,338];
        this.rewardTasks = [97,400,129,791,421,655,338]
        this.set = new Set()
        this.nodeSet = new Set();

        // RB Tree Code 
        this.aboutRBTree = [400, 380, 300, 275, 211, 169, 100];
        this.flipColorsTree = [[519, 300, 900, 38, 330, 797, 920],[77,50,95,12,55, 85,237]];
        this.rotateLeftTree = [[696, 533, 714, 700, 954],[79,64,472,246,730]];
        this.rotateRightTree = [[800, 400, 900 , 200, 512],[75,27,95,17,33]];
        this.insertLargerTree = [[464, 26], [356, 294]];
        this.insertSmallerTree = [[667, 54,],[ 815,123,]] ;
        this.insertBetweenNodesTree = [[600, 400],[80, 50]];
        this.insertLargeTreeTree =  [[300,200,380,98,360],[123,71,,218,66, 191]];
        this.rewardRBTree = []

        this.aboutRBTasks = [400, 380, 300, 275, 211, 169, 100, 78, 70, 50];
        this.flipColorsTasks = ["Flip Colors", "Flip Colors Again"];
        this.rotateLeftTasks = ["Rotate Left", "Rotate Left Again"] ;
        this.rotateRightTasks = ["Rotate Right", "Rotate Right Again"];
        this.insertSmallerTasks = [20, 63];
        this.insertLargerTasks = [547, 489] ;
        this.insertBetweenNodesTasks = [502, 65];
        this.insertLargeTreeTasks =  [320, 210];
        this.rewardRBTasks = [77, 472, 27, 489, 63, 65, 210]
        this.setRB = new Set()
        this.nodeSetRB = new Set();

        this.toolSet = new Set();

        // Node colors for the levels
        // if we change a color here, the background needs to be changed in the appropriate file 
        this.sandboxBSTColor = 'dreamy';        //background_planet_purple
        // this.sandboxRBColor = 'venus';        //background_planet_venus


        this.aboutColor = 'raisin';     // background_planet_raisin
        this.searchColor = 'ice';       // background_planet_darkBlue
        this.insertColor = 'orange';        // background_planet_raisin
        this.deleteMinColor = 'raisin';     // background_planet_raisin
        this.deleteMaxColor = 'ice';        // background_planet_darkBlue
        this.deleteNoChildrenColor =  'orange';     // background_planet_raisin
        this.deleteOneChildColor = 'raisin';        // background_planet_raisin
        this.deleteTwoChildrenColor = 'ice';        // background_planet_darkBlue
        // this.rewardBST = 'orange';      // background_planet_raisin   // it uses the insertion color

        this.redBlackColor = 'purple';      // background_planet_purple
        this.redBlackColor2 = 'venus';      // background_planet_venus

    }

    updateSet(element) {
        this.set.add(element)
    }

    addNode(element) {
        this.nodeSet.add(element)
    }

    updateSetRB(element) {
        this.setRB.add(element)
    }

    addNodeRB(element) {
        this.nodeSetRB.add(element)
    }
    
    addTool(elm) {
        this.toolSet.add(elm);
    }
}