/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - sphere's radius
 * @param stacks - number of divisions between poles
 * @param slices - number of divisions around axis
 */

/*
properties:
 - center in origin 
 - central axis coincident with Z axis (blue)
 - poles in positive and negative Z axis
 - stacks: number of divisions between poles -> numero de fatias da semiesfera
 - slices: number of divisions around axis
*/

class MySphere extends CGFobject  {
	constructor(scene, radius, slices, stacks) { 
        super(scene);
        this.radius = radius;
        this.latDivs = stacks * 2;
        this.longDivs = slices;

        this.initBuffers();
    }
    
	initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var phi = 0;                                        //phi is the angle with the Y-axis
        var theta = 0;                                      //theta is the angle in xOz plane
        var phiInc = Math.PI / this.latDivs;
        var thetaInc = (2 * Math.PI) / this.longDivs;
        var latVertices = this.longDivs + 1;
        let sAdd = 1 / this.longDivs
        let tAdd = 1 / this.latDivs

        // build an all-around stack at a time, starting on "north pole" and proceeding "south"
        for (let latitude = 0; latitude <= this.latDivs; latitude++) {
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            // in each stack, build all the slices around, starting on longitude 0
            theta = 0;
            for (let longitude = 0; longitude <= this.longDivs; longitude++) {
                //--- Vertices coordinates
                var x = this.radius * Math.cos(theta) * sinPhi;
                var y = this.radius * cosPhi;
                var z = this.radius * Math.sin(-theta) * sinPhi;
                this.vertices.push(x, y, z);

                //--- Indices
                if (latitude < this.latDivs && longitude < this.longDivs) {
                    var current = latitude * latVertices + longitude;
                    var next = current + latVertices;
                    // pushing two triangles using indices from this round (current, current+1)
                    // and the ones directly south (next, next+1)
                    // (i.e. one full round of slices ahead)
                    
                    this.indices.push( current + 1, current, next);
                    this.indices.push( current + 1, next, next +1);
                }

                //--- Normals
                // at each vertex, the direction of the normal is equal to 
                // the vector from the center of the sphere to the vertex.
                // in a sphere of radius equal to one, the vector length is one.
                // therefore, the value of the normal is equal to the position vectro
                this.normals.push(x, y, z);
                theta += thetaInc;

                //--- Texture Coordinates
                
                this.texCoords.push(sAdd * longitude, tAdd * latitude)   

            }
            phi += phiInc;
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
  }

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

