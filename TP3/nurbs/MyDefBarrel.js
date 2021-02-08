/**
 * MyDefBarrel
 * @constructor
 * @param scene - reference to MyScene object
 * @param baseRadius - the base radius of the barrel
 * @param middleRadius - the middle (and maximum) radius of the barrel
 * @param height - the height of the barrel
 * @param slices - number of divisions between poles
 * @param stacks - number of divisions around axis
 */
class MyDefBarrel extends CGFobject {
    constructor(scene, baseRadius, middleRadius, height, slices, stacks) {
        super(scene);
        this.scene = scene;

        this.baseRadius = baseRadius;
        this.middleRadius = middleRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.calculateControlVertexes();

        this.object = new MyPatch(this.scene, this.stacks, this.slices, 4, 4, this.controlVertexes);
    }

    /**
     * Calculates the control points of the NURB curve
     */
    calculateControlVertexes() {

        const H = (4 / 3) * (this.middleRadius - this.baseRadius);
        const h = (4 / 3) * this.baseRadius;

        this.controlVertexes = [
            [ //point P4 (baseRadius, 0, 0)
                [this.baseRadius, 0.0, 0.0, 1], //Q1
                [this.baseRadius + H, 0.0, this.height / 3, 1], //Q2
                [this.baseRadius + H, 0.0, (2 / 3) * this.height, 1], //Q3
                [this.baseRadius, 0.0, this.height, 1], //Q4
            ],

            [ //point P3 (baseRadius, h, 0)
                [this.baseRadius, h, 0.0, 1], //Q1
                [this.baseRadius + H, (4 / 3) * (this.baseRadius + H), this.height / 3, 1], //Q2
                [this.baseRadius + H, (4 / 3) * (this.baseRadius + H), (2 / 3) * this.height, 1], //Q3
                [this.baseRadius, h, this.height, 1], //Q4
            ],

            [ //point P2 (-baseRadius, h, 0)
                [-this.baseRadius, h, 0.0, 1], //Q1
                [-(this.baseRadius + H), (4 / 3) * (this.baseRadius + H), this.height / 3, 1], //Q2
                [-(this.baseRadius + H), (4 / 3) * (this.baseRadius + H), (2 / 3) * this.height, 1], //Q3
                [-this.baseRadius, h, this.height, 1], //Q4
            ],

            [ //point P1 (-baseRadius, 0, 0)
                [-this.baseRadius, 0.0, 0.0, 1], //Q1
                [-(this.baseRadius + H), 0.0, this.height / 3, 1], //Q2
                [-(this.baseRadius + H), 0.0, (2 / 3) * this.height, 1], //Q3
                [-this.baseRadius, 0.0, this.height, 1], //Q4
            ],
        ];
    }

    /**
     * display the barrel
     */
    display() {

        this.object.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0.0, 0.0, 1.0);
        this.object.display();
        this.scene.popMatrix();
    }
}