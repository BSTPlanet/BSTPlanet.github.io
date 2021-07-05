export class BSTNode extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, key, children)
    {
        super(scene, x, y, children);
        this.scene = scene;

        this.key = key;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.dpth = null;
        this.xX = x;
        this.yY = y;
        this.distanceFromParent = null;
        this.isRed = false;
       
        // TODO: non-destructive approach: maybe make it somehow that we update the value of the existing nodes when inserting and not destroy it.
        // maybe there is a method to change the position of the container so that we could change its position on expansion.
        // container.setPosition moves the children and not the container itself...

        // move link to children and use order of children in container to move the link graphics below node graphics?
        // container.sendToBack(child)
        this.link = null;
        scene.add.existing(this);
    }

    drawLinkToParent(scene) {
        if (this.parent != null) {
            var line1 = new Phaser.Geom.Line(this.x, this.y, this.parent.x, this.parent.y);
            this.link = scene.add.graphics({ lineStyle: { width: 2, color: 0xaa00aa } });
            this.link.strokeLineShape(line1);
        }
    }

    drawLinkToParentRB(scene) {
        if (this.parent != null) {
            if (this.isRed) {
                var line1 = new Phaser.Geom.Line(this.x, this.y, this.parent.x, this.parent.y);
                this.link = scene.add.graphics({ lineStyle: { width: 2, color: 0xff0008 } });
                this.link.strokeLineShape(line1);
            } else {
                var line1 = new Phaser.Geom.Line(this.x, this.y, this.parent.x, this.parent.y);
                this.link = scene.add.graphics({ lineStyle: { width: 2, color: 0x000000 } });
                this.link.strokeLineShape(line1);
            }
        }
    }

    changeLinkColour(scene) {
        if (this.link != null) {
            if (this.isRed) {
                this.link.destroy();
                var line1 = new Phaser.Geom.Line(this.x, this.y, this.parent.x, this.parent.y);
                this.link = scene.add.graphics({ lineStyle: { width: 2, color: 0xff0008 } });
                this.link.strokeLineShape(line1);
            } else {
                this.link.destroy();
                var line1 = new Phaser.Geom.Line(this.x, this.y, this.parent.x, this.parent.y);
                this.link = scene.add.graphics({ lineStyle: { width: 2, color: 0x000000 } });
                this.link.strokeLineShape(line1);
            }
        }
    }

}