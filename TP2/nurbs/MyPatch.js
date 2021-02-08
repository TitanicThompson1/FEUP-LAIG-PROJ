
/**
 * MyPatch
 * @constructor
 * @param scene - reference to MyScene object
 * @param uDivs - number of divisions along the u axis
 * @param vDivs - number of divisions along the v axis
 * @param uDegrees - the degree curve along the u axis
 * @param vDegrees - the degree curve along the v axis
 * @param controlVertexes - the control points of the curve
 */
class MyPatch extends CGFobject{
    constructor(scene, uDivs, vDivs, uDegrees, vDegrees, controlVertexes){
        super(scene);
        this.scene = scene

        this.nurbsSurface = new CGFnurbsSurface(uDegrees-1, vDegrees-1, controlVertexes);
        this.object =  new CGFnurbsObject(scene, uDivs, vDivs, this.nurbsSurface);
    }

    /**
     * display the Pacth
     */
    display(){
        this.object.display();
    }
}