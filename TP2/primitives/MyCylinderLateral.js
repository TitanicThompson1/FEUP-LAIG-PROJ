/**
 * MyCilinderLateral
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius - bottom's radius
 * @param topRadius - top's radius
 * @param height - cilinder's height
 * @param stacks - number of divisions between poles
 * @param slices - number of divisions around axis
 */

class MyCylinderLateral extends CGFobject  {
	constructor(scene, height, topRadius, bottomRadius, stacks, slices) { 
        super(scene);	
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
		
		this.initBuffers();
	}
	
	initBuffers() {
        //x = r*cos(o)
        //y = r*sin(o)
		//z = current_height
		//N = (cos(o), sin(o), 0)

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let ang = 0;
        let alphaAng = 2 * Math.PI/this.slices;
		let height_step = this.height/this.stacks;
		let radius_step = (this.topRadius - this.bottomRadius) / this.stacks;

        for(let i = 0; i <= this.slices; i++){
            for(let j = 0; j <= this.stacks; j++){

				let current_height = j*height_step;
				let current_radius = j * radius_step + this.bottomRadius;

				this.vertices.push(current_radius*Math.cos(ang), current_radius*Math.sin(ang), current_height);

				this.normals.push(Math.cos(ang), Math.sin(ang), 0);

				this.texCoords.push(i/this.slices, j/this.stacks);

				if (i < this.slices && j < this.stacks) {

					// pushing two triangles using indices from this round (current, current+1)
					// and the ones directly south (next, next+1)

                    var current = i * (this.stacks+1) + j;
                    var next = current + (this.stacks+1);
                    
					                    
                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }
            }
            ang += alphaAng;
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
