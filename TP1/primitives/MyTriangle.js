/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param v1 - coordinates of first vertex
 * @param v2 - coordinates of second vertex
 * @param v3 - coordinates of third vertex
 */
class MyTriangle extends CGFobject  {
	constructor(scene, v1, v2, v3) { 
        super(scene);
		this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.v1[0], this.v1[1], 0,	//0
			this.v2[0], this.v2[1], 0,	//1
            this.v3[0], this.v3[1], 0,	//2       
		];

		//Counter-clockwise reference of vertices
		this.indices = [
            0, 1, 2
		];

		this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
		];
		
        //"Triangle UV texture mapping coordinates calculation" pwp, slide 3
        
        this.a = Math.sqrt(Math.pow(this.v2[0]-this.v1[0], 2) + Math.pow(this.v2[1]-this.v1[1], 2));
        this.b = Math.sqrt(Math.pow(this.v3[0]-this.v2[0], 2) + Math.pow(this.v3[1]-this.v2[1], 2));
        this.c = Math.sqrt(Math.pow(this.v1[0]-this.v3[0], 2) + Math.pow(this.v1[1]-this.v3[1], 2));

        this.alpha_cos = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2))/(2*this.a*this.c);
        this.alpha_sin = Math.sqrt(1 - Math.pow(this.alpha_cos, 2)); 

        //assuming length_u=lenght_v=1
		this.texCoords = [
			0, 1,
			this.a, 1,
			(this.c*this.alpha_cos), 1-(this.c*this.alpha_sin)
		]
        
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinate
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		let afs = coords[0];
		let aft = coords[1];

		this.texCoords = [
			0, 1,
			this.a/afs, 1,
			(this.c*this.alpha_cos)/afs, 1-(this.c*this.alpha_sin)/aft
		];
		this.updateTexCoordsGLBuffers();
	}
}

