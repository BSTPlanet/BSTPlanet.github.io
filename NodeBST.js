export class NodeBST extends Phaser.GameObjects.Rectangle {

    constructor(scene, color, x, y, key, dpth, parent, isRBnode) {
        // BY DEFAULT node is displayed with null graphics

        // scene,x,y,width,height,node color (gray) 
        super(scene, x, y, 55, 55, 0xC3C596);
        this.setVisible(false); //make it invisible because we now use graphics

        // 0xb0b3b0 gray
        this.scene = scene;
        
        this.key = key;
        this.left = null;
        this.right = null;
        this.parent = parent;
        this.dpth = dpth;
        this.posX = x;
        this.posY = y;
        this.distanceFromParent = null;
        
        // RED BLACK
        this.isRBnode = isRBnode;

        if(this.key == 'null') {
            this.isRed = false;
        } else {
            this.isRed = true;
        }

        // colours && graphics
        this.color = color;

        this.nodeC;
        this.curtainC;
        this.linkC;
        this.textNodeC;
        this.textNullC = '#5e5e5e';

        this.nodeGraphics = null;
        this.nullGraphics = null;
        this.curtain = null;
        this.keyString = null;
        this.link = null;

        this.tweenedPos_event = null;
        
        this.initNode(scene);

        if (this.isRBnode) {
            this.drawLinkToParentRB(scene);
        } else {
            this.drawLinkToParent(scene);
        }

        scene.physics.add.existing(this, 1);
        scene.add.existing(this);
    }

    initNode(scene) {
        switch (this.color) {
            case 'brown':
                this.nodeC = 'node_brown';
                this.curtainC = 'node_brown_curtain';
                this.linkC = 0x876642;
                this.textNodeC = '#ffffff';
                break;
            case 'orange':
                this.nodeC = 'node_orange';
                this.curtainC = 'node_orange_curtain';
                this.linkC = 0xE5B623;
                this.textNodeC = '#ffffff';
                break;
            case 'raisin':          // about level
                this.nodeC = 'node_lightPurple';
                this.curtainC = 'node_lightPurple_curtain';
                this.linkC = 0xd0cfec;
                this.textNodeC = '#000000';
                break;
            case 'ice':
                this.nodeC = 'node_icyBlue';
                this.curtainC = 'node_icyBlue_curtain';
                this.linkC = 0x26bcb1;
                this.textNodeC = '#2e827a';
                break;
            case 'spring':
                this.nodeC = 'node_peach';
                this.curtainC = 'node_peach_curtain';
                this.linkC = 0xaf3b6e;
                this.textNodeC = '#af3b6e';
                break;
            case 'dreamy':
                this.nodeC = 'node_dustyPink';
                this.curtainC = 'node_dustyPink_curtain';
                this.linkC = 0xe0a6cb;
                this.textNodeC = '#000000';
                break;
            case 'mars':
                this.nodeC = 'node_dustyApple';
                this.curtainC = 'node_dustyApple_curtain';
                this.linkC = 0xf42c04;
                this.textNodeC = '#ffffff';
                break;
            case 'yellow':  // for red-black levels
                this.nodeC = 'node_yellow';
                this.curtainC = 'node_yellow_curtain';
                // link color for RB is hard-coded
                this.linkC = 0x000000;
                this.textNodeC = '#000000';
                break;
            case 'venus': // for red-black levels
                this.nodeC = 'node_powder';
                this.curtainC = 'node_powder_curtain';
                // link color for RB is hard-coded
                this.linkC = 0x000000;
                this.textNodeC = '#000000';
                break;
            case 'purple':  // for red-black levels
                this.nodeC = 'node_purple';
                this.curtainC = 'node_purple_curtain';
                // link color for RB is hard-coded
                this.linkC = 0x000000;
                this.textNodeC = '#000000';
                break;
            default:
                this.nodeC = 'node_brown';
                this.curtainC = 'node_brown_curtain';
                this.linkC = 0x876642;
                this.textNodeC = '#ffffff';
                break;
        }

        this.nodeGraphics = scene.add.image(this.posX, this.posY, this.nodeC).setDepth(0);
        this.curtain = scene.add.image(this.posX, this.posY, this.curtainC).setDepth(2);
        this.nullGraphics = scene.add.image(this.posX, this.posY, 'node_null').setDepth(0);
        this.keyString = scene.add.text(this.posX, this.posY, 'null', { fontFamily: 'nasalization-rg', fontSize: '20px', fill: this.textNullC }).setDepth(1);
        this.keyString.setOrigin(0.5);

        this.nodeGraphics.setVisible(false);
        scene.physics.add.existing(this.curtain, 1);
        this.curtain.setVisible(false);
        this.keyString.setOrigin(0.5);

        // this.nodeGraphics = scene.add.image(this.posX, this.posY, 'node_null').setDepth(0);
        // this.nodeGraphics.setTint('0xb5b5b5');
        // this.curtain = scene.add.rectangle(this.posX, this.posY, 55, 55, 0xE589AE);
        // this.curtain = scene.add.image(this.posX, this.posY, 'node_yellow').setScale(1.5).setTint('0xa2db9c');
        // this.curtain = scene.add.image(this.posX, this.posY, 'node_curtain');
        // 0xbd96d4
        // this.curtain.setDepth(2);

        // this.keyString = scene.add.text(this.posX, this.posY, 'null', { fontFamily: 'nasalization-rg', fontSize: '20px', fill: '#5e5e5e' });
        // this.keyString.setDepth(1);
        // Phaser.Display.Align.In.Center(this.keyString, this);
        // scene.add.image(this.posX, this.posY, 'node_yellow').setScale(1.5).setDepth(0);
        // b8b2a0 null color for node_yellow
    }

    setNullGraphics() {
        this.isRed = false;
        this.nodeGraphics.setVisible(false);
        this.nullGraphics.setVisible(true);
        // this.nodeGraphics.setTint('0xb5b5b5');
        // this.setFillStyle(0xC3C596, 1);
        // 0xb0b3b0
        this.curtain.setVisible(false);
        this.keyString.setText(''+this.key); //if it's not null
        this.keyString.setFill(this.textNullC);
        // Phaser.Display.Align.In.Center(this.keyString, this);
    }

    setNodeGraphics(){
        this.nodeGraphics.setVisible(true);
        this.nullGraphics.setVisible(false);
        // this.nodeGraphics.setTint('0xffffff');
        // this.setFillStyle(0xF5CBDD, 1);
        // 0xff7394
        this.curtain.setVisible(true);
        this.keyString.setText(''+this.key); //if it's not null
        this.keyString.setFill(this.textNodeC);
        // Phaser.Display.Align.In.Center(this.keyString, this);
    }

    setKey(key) {
        this.key = key;
        this.keyString.setText(''+this.key);
        // Phaser.Display.Align.In.Center(this.keyString, this);
    }

    setChildren(left,right) {
        this.left = left || null;
        this.right = right || null;
        
    }

    drawLinkToParent(scene) {
        if (this.link != null) {
            this.link.destroy();
        }
        if (this.parent != null) {
            this.link = scene.add.line(this.posX, this.posY, 0,0, -this.distanceFromParent, -150, this.linkC).setLineWidth(4);
            this.link.setOrigin(0);
            this.link.setDepth(-1);
        }
    }

    changePosition(scene, x, y) {
        this.posX = x;
        this.posY = y;

        // change position of the Rectangle
        this.setPosition(x,y);
        // update the Rectangle's physics body position 
        this.body.updateFromGameObject();

        this.curtain.setPosition(x,y);
        this.curtain.body.updateFromGameObject();
        // this.curtain.setVisible(true);

        this.keyString.setPosition(x,y);
        // Phaser.Display.Align.In.Center(this.keyString, this);

        this.nodeGraphics.setPosition(x,y);
        this.nullGraphics.setPosition(x,y);

        if (this.isRBnode) {
            this.drawLinkToParentRB(scene);
        } else {
            this.drawLinkToParent(scene);
        }
    }

    changePositionTweened(scene, x, y) {
        this.posX = x;
        this.posY = y;

        scene.add.tween({
            targets: [this.nodeGraphics, this.nullGraphics, this.curtain, this.keyString],
            x: this.posX, 
            y: this.posY,
            ease: 'Power2',
            duration: 1000
        });

        // move node link, rotate it and extend it
        if (this.parent != null && this.link != null) {

            var N = this.distanceFromParent;

            var Oo = null;
            if (this.distanceFromParent < 0) {
                Oo = (this.link.x - this.link.width) - this.link.x;
            } else {
                Oo = (this.link.x + this.link.width) - this.link.x;
            }
            
            // var oldAngle = calcAngle(tree.z,O);
            var oldAngle = this.calcAngle(150,Oo);
            var newAngle = this.calcAngle(150,N);
            var difference = oldAngle - newAngle;
            
            scene.add.tween({
                targets: this.link,
                x: this.posX, 
                y: this.posY,
                ease: 'Power2',
                duration: 1000
            });
            
            if (difference != 0) {
                // ROTATION TWEEN:
                scene.add.tween({
                    targets: this.link,
                    angle: -difference,
                    ease: 'Sine.easeInOut',
                    duration: 1000,
                    onComplete: drawLink,
                    onCompleteParams: [this,scene]
                });
                
                function drawLink(tween,targets,node,scene) {
                    if (node.isRBnode) {
                        node.drawLinkToParentRB(scene);
                    } else {
                        node.drawLinkToParent(scene);
                    }
                }
            } 
        }

        this.tweenedPos_event = 
            scene.time.addEvent({
                delay: 1000,
                callback: function(scene,node) {
                    // change position of the Rectangle
                    node.setPosition(x,y);
                    // update the Rectangle's physics body position 
                    node.body.updateFromGameObject();

                    node.curtain.setPosition(x,y);
                    node.curtain.body.updateFromGameObject();
                    // node.curtain.setVisible(true);

                    node.keyString.setPosition(x,y);
                    // Phaser.Display.Align.In.Center(node.keyString, node);

                    node.nodeGraphics.setPosition(x,y);
                    node.nullGraphics.setPosition(x,y);

                    if (node.isRBnode) {
                        node.drawLinkToParentRB(scene);
                    } else {
                        node.drawLinkToParent(scene);
                    }
                },
                args: [scene,this]
            });
    }

    calcAngle(z,smth) {
        return Math.atan(z/smth) * (180/Math.PI);
    }

    // *** for updatePos()
    changePositionNoMove(newX, newY) {
        this.posX = newX;
        this.posY = newY;
    }

    changeRecPosition (x, y) {
        this.setPosition(x,y);
        // update the Rectangle's physics body position 
        this.body.updateFromGameObject();
    }

    updatePhysicsBodies() {
        // update the Rectangle's physics body position 
        this.body.updateFromGameObject();

        // update curtains physics body position
        this.curtain.body.updateFromGameObject();
    }
    // *** END (for updatePos())

    drawLinkToParentRB(scene) {
        if (this.link != null) {
            this.link.destroy();
        }
        if (this.parent != null) {
            if (this.isRed) {
                var redColor;
                if (this.color == 'venus') {
                    redColor = 0xff2f00;
                } else {
                    redColor = 0xff0008;
                }
                this.link = scene.add.line(this.posX, this.posY, 0,0, -this.distanceFromParent, -150, redColor).setLineWidth(4);
            } else {
                this.link = scene.add.line(this.posX, this.posY, 0,0, -this.distanceFromParent, -150, 0x000000).setLineWidth(2);
            }
            this.link.setOrigin(0);
            this.link.setDepth(-1);
        }
    }

    changeLinkColour(scene) {
        if (this.link != null) {
            if (this.isRed) {
                var redColor;
                if (this.color == 'venus') {
                    redColor = 0xff2f00;
                } else {
                    redColor = 0xff0008;
                }
                this.link.destroy();
                this.link = scene.add.line(this.posX, this.posY, 0,0, -this.distanceFromParent, -150, redColor).setLineWidth(4);
            } else {
                this.link.destroy();
                this.link = scene.add.line(this.posX, this.posY, 0,0, -this.distanceFromParent, -150, 0x000000).setLineWidth(2);
            }
            this.link.setOrigin(0);
            this.link.setDepth(-1);
        }
    }

    // used in the about level in BST
    highlightLinks (node, scene, color) {
        if(node.link != null) {
            node.link.destroy();
            var line1 = new Phaser.Geom.Line(node.posX, node.posY, node.parent.posX, node.parent.posY);
            node.link = scene.add.graphics({ lineStyle: { width: 8, color: color } });
            node.link.strokeLineShape(line1);
            node.link.setDepth(-1);
        }
    }
    

    destroyNode() {
        
        this.key = null;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.dpth = null;
        this.posX = null;
        this.posY = null;
        this.distanceFromParent = null;
        
        // graphics
        this.curtain.destroy();
        this.keyString.destroy();

        // root doesn't have link graphics so it will be null
        if(this.link != null) {
            this.link.destroy();
        }
        
        this.nodeGraphics.destroy();
        this.nullGraphics.destroy();
        this.curtain = null;
        this.keyString = null;
        // this.shape = null;
        this.link = null;
        this.nodeGraphics = null;
        this.nullGraphics = null;

        if(this.tweenedPos_event != null) {
            this.tweenedPos_event.remove();
        }

        // DESTROY all the physics bodies
        
        // RED BLACK
        this.isRed = null;

        this.destroy(true);
    }

    setPhysicsNode(cursors,player,scene) {
        scene.physics.add.overlap(player, this, teleportLeft, cursorLeftIsPressed, scene);
        scene.physics.add.overlap(player, this, teleportRight, cursorRightIsPressed, scene);
        scene.physics.add.overlap(player, this, teleportUp, cursorUpIsPressed, scene);
        scene.physics.add.overlap(player, this.curtain, revealValue, ifCurtainIsVisible, scene);


        // Used to offset y of player so that it does not fall off the node during setPosition
        const BUFFER = 90; 

        // Left cursor logic on overlap with player:
        var leftAllowed = false;
        function cursorLeftIsPressed() {
            var moveAllowed = false;
            if(cursors.left.isDown){
                leftAllowed = true;
            }
            if (leftAllowed && cursors.left.isUp) {
                moveAllowed = true;
                leftAllowed = false;
            }
            return moveAllowed;
        }

        function teleportLeft(player, node) {
            if (node.left != null) {
                player.setPosition(node.left.posX,node.left.posY-BUFFER);
                // player.setPosition(node.left.posX,node.left.posY-BUFFER).play('player_teleport');
            }
        }

        // Right cursor logic on overlap with player:
        // this.physics.add.overlap(player, root, teleportRight, cursorRightIsPressed, this);

        var rightAllowed = false;
        function cursorRightIsPressed() {
            var moveAllowed = false;
            if(cursors.right.isDown){
                rightAllowed = true;
            }
            if (rightAllowed && cursors.right.isUp) {
                moveAllowed = true;
                rightAllowed = false;
            }
            return moveAllowed;
        }

        
        function teleportRight(player, node) {
            if (node.right != null) {
                player.setPosition(node.right.posX,node.right.posY-BUFFER);
            }
        }

        // Up cursor logic on overlap with player:
        // this.physics.add.overlap(player, root, teleportUp, cursorUpIsPressed, this);

        var upAllowed = false;
        function cursorUpIsPressed() {
            var moveAllowed = false;
            if(cursors.up.isDown){
                upAllowed = true;
            }
            if (upAllowed && cursors.up.isUp) {
                moveAllowed = true;
                upAllowed = false;
            }
            return moveAllowed;
        }

        function teleportUp(player, node) {
            if (node.parent != null) {
                player.setPosition(node.parent.posX,node.parent.posY-BUFFER);
            }
        }

        function ifCurtainIsVisible(player,curtain) {
            var revealAllowed = false;
            if (curtain.visible == true){
                revealAllowed = true;
            }
            return revealAllowed;
        }

        // For the curtain on overlap/collide
        function revealValue(player, curtain) {
            curtain.setVisible(false);
        }   
    }
}