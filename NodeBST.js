export class NodeBST extends Phaser.GameObjects.Rectangle {

    constructor(scene, x, y, key, dpth, parent, isRBnode) {

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
        
        // graphics
        this.nodeGraphics = scene.add.image(this.posX, this.posY, 'node_yellow').setDepth(0);
        this.nullGraphics = scene.add.image(this.posX, this.posY, 'node_null').setDepth(0);

        // this.sizeOfGraphics = null;
        // this.nodeColor = 
        // this.nullColor = 
        // this.curtainColor = 
        // this.selectedColor =

        this.curtain = null;
        this.keyString = null;
        this.link = null;
        
        // RED BLACK
        this.isRBnode = isRBnode;

        if(this.key == 'null') {
            this.isRed = false;
        } else {
            this.isRed = true;
        }
        
        this.makeNullGraphics(scene);

        if (this.isRBnode) {
            this.drawLinkToParentRB(scene);
        } else {
            this.drawLinkToParent(scene);
        }
        
        scene.physics.add.existing(this, 1);
        scene.add.existing(this);
    }

    makeNullGraphics(scene) {
        // this.nodeGraphics = scene.add.image(this.posX, this.posY, 'node_null').setDepth(0);
        // this.nodeGraphics.setTint('0xb5b5b5');
        // this.curtain = scene.add.rectangle(this.posX, this.posY, 55, 55, 0xE589AE);
        // this.curtain = scene.add.image(this.posX, this.posY, 'node_yellow').setScale(1.5).setTint('0xa2db9c');
        this.nodeGraphics.setVisible(false);
        this.curtain = scene.add.image(this.posX, this.posY, 'node_curtain');
        // 0xbd96d4
        this.curtain.setDepth(2);
        scene.physics.add.existing(this.curtain, 1);
        this.curtain.setVisible(false);

        this.keyString = scene.add.text(this.posX, this.posY, 'null', { fontFamily: 'nasalization-rg', fontSize: '20px', fill: '#5e5e5e' });
        this.keyString.setDepth(1);
        // Phaser.Display.Align.In.Center(this.keyString, this);
        this.keyString.setOrigin(0.5);
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
        this.keyString.setFill('#5e5e5e');
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
        this.keyString.setFill('#000000');
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
        if (this.parent != null) {
            if (this.link != null) {
                this.link.destroy();
            }
            var line1 = new Phaser.Geom.Line(this.posX, this.posY, this.parent.posX, this.parent.posY);
            this.link = scene.add.graphics({ lineStyle: { width: 4, color: 0xff94c9 } });
            // 0xaa00aa
            this.link.strokeLineShape(line1);

            // this.link = scene.add.line(this.posX,40,0,this.posY,100,this.parent.posY,0xF3B5CB,100);
            // this.link = scene.add.line(Math.abs(this.parent.posX - this.posX),Math.abs(this.parent.posY - this.posY),this.posX,this.posY,this.parent.posX,this.parent.posY,0xF3B5CB,100).setOrigin(1);
            // this.link.setLineWidth(3);

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

    drawLinkToParentRB(scene) {
        if (this.link != null) {
            this.link.destroy();
        }
        if (this.parent != null) {
            if (this.isRed) {
                var line1 = new Phaser.Geom.Line(this.posX, this.posY, this.parent.posX, this.parent.posY);
                this.link = scene.add.graphics({ lineStyle: { width: 6, color: 0xff0008 } });
                this.link.strokeLineShape(line1);
            } else {
                var line1 = new Phaser.Geom.Line(this.posX, this.posY, this.parent.posX, this.parent.posY);
                this.link = scene.add.graphics({ lineStyle: { width: 4, color: 0x000000 } });
                this.link.strokeLineShape(line1);
            }
            this.link.setDepth(-1);
        }
    }

    changeLinkColour(scene) {
        if (this.link != null) {
            if (this.isRed) {
                this.link.destroy();
                var line1 = new Phaser.Geom.Line(this.x, this.y, this.parent.posX, this.parent.posY);
                this.link = scene.add.graphics({ lineStyle: { width: 6, color: 0xff0008 } });
                this.link.strokeLineShape(line1);
            } else {
                this.link.destroy();
                var line1 = new Phaser.Geom.Line(this.x, this.y, this.parent.posX, this.parent.posY);
                this.link = scene.add.graphics({ lineStyle: { width: 4, color: 0x000000 } });
                this.link.strokeLineShape(line1);
            }
            this.link.setDepth(-1);
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