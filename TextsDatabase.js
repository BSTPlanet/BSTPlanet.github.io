export class TextsDatabase {
    constructor() {
        this.aboutTexts = ['Alright, I will teach you all the things you need to know in order to escape this planet! But first, try walking through the tree using ARROW UP, ARROW LEFT and ARROW RIGHT keys. Try moving the camera by holding W, A, S, D keys and try zooming out and in with Q and E keys.', 
                  'Let’s move to some basics! A Binary Search Tree (BST) is a data structure composed of nodes which contain keys, values and references to other nodes. To move around the planet you only need to know the keys.',
                  'In this tree, the reference is represented as a line between two nodes called a link. As the name suggests, the data structure is binary - each node contains only two references.',
                  'The root (685) is the topmost node of the BST.', 
                  'Parent node (494) has a reference to a left node and a right node also called the parent’s children. The left child of 494 is 472. The right child of 494 is 520.',  
                  'A child can be a node or a null (nil) - indicating that no child node exists.',
                  'A subtree is a part of a tree which is also a valid tree that has a root. The root of this subtree is 752.',
                  'The key of any node is greater than a key of its left child and smaller than a key of its right child. Node 494 is bigger than node 472 and smaller than node 520.',
                  'The depth of a node is the number of links from the root to the node (root has a depth 0). The depth of node 173 is 3.\n\n\n\n\nAlrighty! Let\'s go now and learn the Search operation!'];

        this.searchTexts = ['Let’s learn the search operation! First, we will perform the operation together and then you will try to do it on your own!',
                            'The task is to find the node 566. You are standing on the node 957. Let’s compare! 566 is smaller than 957, therefore go to the left subtree.',
                            'Now the node you are standing on is 519. 566 is greater than 519, therefore go to the right subtree! Do this comparison until you find 566!',
                            'There it is, the node 566! Press Enter to select it.', 
                            'Great! Now perform the next task on your own!',
                            'You did it! Now let’s learn the insertion operation!'];

        this.insertTexts = ['Let’s learn the insertion operation! A node can be inserted in a place of null. So you would need to find a null where you can insert a node.',
                            'To find the null use what you learned from the search operation. Your task is to insert the node 600, so compare the nodes and walk through the tree.',
                            'Oh! You reached a null! This indicates that you found the place to insert the node! Do that by pressing Enter.', 
                            'Great! Now perform the next task on your own!',
                            'Nicely done! Now let’s dive into deletions!'];

        this.deleteMinTexts = ['Let’s learn the delete min operation! A minimum (min) of a tree is the smallest node existing in the tree.',
                                'It is quite easy to find - walk left until the node has a null on the left. Try to find a min node in this tree!',
                                'You found it! It\'s the node 98! Delete it by pressing Backspace.',            
                                'Great! Now perform the next task on your own!',            
                                'Easy peasy! Now let’s learn a very similar operation - delete max!'];

        this.deleteMaxTexts = ['Let’s learn the delete max operation! A maximum (max) of a tree is the largest node existing in the tree.',
                                'The approach is similar to delete min, only now you need to walk right until the node has a null on the right. Try to find a max node in this tree!',            
                                'You found it! It\'s the node 992! Delete it by pressing Backspace.',            
                                'Great! Now perform the next task on your own!',            
                                'You’re doing great! Let’s move on to the deletion of a node with no children.'];

        this.deleteNoChildTexts = ['Let’s learn the delete operation! I divided it into 3 cases. This level is the first case - when a node has no children.',
                                    'Your task is to delete the node 734. As you have done so far, just find it in the tree!',            
                                    'You found it! Now just delete it by pressing Backspace.',            
                                    'Great! Since it has no children we just delete the node 734 with it’s nulls and put a null instead of 734. Now perform the next task on your own!',            
                                    'You got this! Let’s move on to the deletion of a node with one child.'];

        this.deleteOneChildTexts = ['This is the deletion case when a node has one child! It could be either a left or a right child. In this deletion we have to switch the deleted node with the existing child.',
                                    'By the way, those children could also have children, so we would need to move the whole subtree up! Let me show you! Your task is to delete 76. Try to find it first!',            
                                    'You found it! Notice that it has the right child. And there’s many more nodes beyond it! This whole subtree will have to move up. Now delete 76 by pressing Backspace.',            
                                    'Great! Node 76 was replaced by 373 and all the subtree nodes moved up as well! Now perform the next task on your own!',
                                    'You’re doing great! Let’s look at the last deletion case - when a node has two children!'];

        this.deleteTwoChildrenTexts = ['This is the deletion case when a node has two children! Now there will be more work to be done. In this case you will have to switch the deleted node with another node. That another node is going to be the deleted node’s right subtree’s min node! Wow! Let’s break this down!',
                                        'Your task is to delete 631. Try to find it! ',            
                                        'You found it! Let’s mark it as the node we want to delete by pressing Backspace.',            
                                        'Now onto the search for the other node! When we find it, we will switch it with the deleted node. We will look for the other node in the right subtree of the deleted node. Go to the right child!',             
                                        'Alrighty, that is 791! Now all you have to do is to find the min node of this subtree! It’s similar to what you have done in delete min operation - just go left until you reach a node with a null on the left.',            
                                        'You found it! It’s the node 717! Select it as min by pressing M key. This will initiate the deletion and switching process.',             
                                        'Great! The node 631 was deleted and 717 was placed there instead. Since the node 717 had a right child, a delete node with one child operation was performed - the right child switched places with the node 717. Now perform the next task on your own!',            
                                        'That was tough, but you did great!'];

        this.rewardTexts = ['Wow, your hard work paid off! You’ve finished all the levels and collected all of the nodes! Now insert all of the collected nodes into this tree and find the lost wrench!'];


        // RB
        this.aboutRBTexts = ['Wow, you\’re fast! You just entered a region called Left-Leaning Red-Black Binary Search Tree (we\’ll refer to it as RB BST). The rules here are a bit different than what you already know. Let\’s start with the basics.',
                             'Red-black trees are designed to prevent imbalanced insertion in the trees, no matter what the inserted element sequence is. That makes the insertion much quicker!',
                             'Let\'s see how the same sequence of elements is inserted in a BST and in a RB-BST. I will give you 10 elements which will come in sorted decreasing order, try to insert them into a BST and see how the tree looks! Hit SPACEBAR to begin!',
                             'Wow, it\'s getting a little tiresome!',
                             'Alright, so this is how the binary search tree looks! It took a while to insert the node 50... Let\'s now insert the same elements into a RB-BST! I will perform the operations of the red-black tree for you, all you\’ve got to do is insert. Hit SPACEBAR to begin!',
                             'That\'s it! You see, the tree is much more balanced! The special red-black tree properties and operations enable the tree to balance itself.',
                             'There are some things to notice about the red-black trees. First, all links are assigned a color - either red or black. The link assigned to the node is on top of the node. A newly inserted node has a red link to its parent, while a null has a black link to its parent. But remember that the root of the tree always has a black link, which is invisible!',
                             'Second, no node has two red links connected to it, and a red node cannot be a child or a parent of another red node. That is not allowed! Look at the tree!',
                             'Third, every path from root to null link has the same number of black links. This property is called perfect black balance. I will show you on the tree, see?',
                             'And lastly, all red links lean left. See those two red links? They lean left. And all of the right leaning links are black!',
                             'Now that you are a bit familiar with the red-black trees, let\'s learn the red-black tree operations that will allow you to maintain those properties!'];

        this.flipColorsTexts = ['Let’s learn how to flip the colors of the links!  First, we will perform the operation together and then you will try to do it on your own! Press F while standing on 519 to flip the colors.',
                                'Great! Now press SPACEBAR to perform the next task on your own and on a different tree!',
                                'Try to flip colors of 77s children links.',
                                'You did it! Now let\’s learn how to rotate left!'];

        this.rotateLeftTexts = ['Let\’s learn how to rotate left! The node with the red right link is 714 - this link must be rotated. Notice that 700 is a left child of 714 and 714\'s parent is 696. Press L while standing on 714 to rotate it left.',
                            'Great! As you might have noticed the old parent (696) of 714 is now the left child of 714. 700 (the old left child of 714) is now a right child of 696. The red right link is now a red left link. Now perform the next task on your own on a different tree!',
                            'Try to rotate the red right link.',
                            'Nicely done! Let\'s keep up the good work and learn how to rotate right.' ];

        this.rotateRightTexts = ['Let\’s learn how to rotate right! It sounds like it\’s similar to the rotate left, but in reality it differs quite a lot, so don\'t be fooled!',
                                    'The node with the red left link that must be rotated to the right is 400. Notice that the parent of 400 is 800 and the right child of 400 is 512. Press R while standing on 400 to rotate right. ',
                                    'Great! As you have noticed the old parent (800) of 400 is now the right child of 400. 513 (the old right child of 400) is now a left child of 800. The red left link is now a red right link. Now try rotating by yourself on a different tree!',
                                    'Try to rotate the top red left link.',
                                    'Easy peasy! Now let’s try and use your skills in real-life situations!'];

        this.insertLargerTexts = ['After you\’ve learned the RB operations, let\'s practice them, by inserting new nodes and maintaining the RB properties. Try to do the task.',
                                    'Now you need to maintain the tree. Let me help you - when you have a node with two red children you always need to flip the colours - use the F button.',
                                    'Great! Now try it out in the next task on your own on a different tree!',
                                    'Insert the node and maintain the tree.',
                                    'You’re doing great! Let’s move on to the next exercise.' ];

        this.insertSmallerTexts = ['Let\'s try something different. Try to do the task.',
                                    'Now you need to maintain the tree. Let me give you a hint - whenever having two consecutive red links, the top red link must be rotated right.',
                                    'Now you have a node with two red children… yes, you need to flip colors!',
                                    'Great! Now try it out in the next task on your own on a different tree!',
                                    'Insert the node and maintain the tree.',
                                    'You got this! Let’s move on to the next exercise.'];

        this.insertBetweenNodesTexts = ['Let\'s try something more complex. Try to do the task.',
                                        'Now you need to maintain the tree. Let me help you - whenever you have a node with a red right link, you need to rotate that link to the left.',
                                        'Now you have two consecutive red links… yes, you need to rotate right!',
                                        'Good job! You know the last part, don\’t you? Flip the colors!',
                                        'Great! Now try it out in the next task on your own on a different tree!',
                                        'Insert the node and maintain the tree.',
                                        'You got this! Let’s move on to the last exercise!'];

        this.insertLargeTreeTexts = ['Now let\'s try those operations on a bigger tree. Try to do the task.',
                                    'Now you need to maintain the tree. My hint is: two consecutive red links.',
                                    'Two children with red links..? Something\’s not right.',
                                    'Okay, one right red link is still in our way!',
                                    'Great! Now try it out in the next task on your own on a different tree!',
                                    'Insert the node and do the rotations yourself. I believe in you!',
                                    'I’m starting to prepare a welcoming party for you! You did great!'];

        this.rewardRBTexts = [ 'Wow, your hard work paid off! You’ve finished all the levels and collected all of the nodes! Now insert all of the collected nodes into this tree, maintain the tree, and find the lost screwdriver!',
                                'Now you need to maintain the tree.',
                                'If you don\'t know how to continue from here, I can give you a small tip. No node can have two children with red links. Fix the links and celebrate your success soon.',
                                'When you feel unsure what to do follow the rule that no node can have a red right link. Try to rotate the link!',
                                'Now you have two consecutive red links… yes, you need to rotate right!',
                                'Looks like it’s super easy for you! Maybe we should start going to BST planet for holidays?',
                                'Yes, that\’s right!. Keep up the good work and you will be home soon!',
                                'Great job! Keep going!'];

                            
    }
}