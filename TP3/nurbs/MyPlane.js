/**
 * MyPlane
 * @constructor
 * @param scene - reference to MyScene object
 * @param uDivs - number of divisions along the u axis
 * @param vDivs - number of divisions along the v axis
 */
class MyPlane extends CGFobject {
    constructor(scene, uDivs, vDivs) {
        super(scene);
        this.scene = scene;

        let controlVertexes = [ // U = 0
            [ // V = 0..1;
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1]

            ],
            // U = 1
            [ // V = 0..1
                [0.5, 0.0, 0.5, 1],
                [0.5, 0.0, -0.5, 1]
            ]
        ]

        this.nurbsSurface = new CGFnurbsSurface(1, 1, controlVertexes);
        this.plane = new CGFnurbsObject(scene, uDivs, vDivs, this.nurbsSurface);
    }
    display() {
        this.plane.display();
    }
}