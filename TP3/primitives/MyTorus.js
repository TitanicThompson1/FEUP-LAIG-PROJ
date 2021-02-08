/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - inner radius
 * @param outer - outer radius
 * @param loops - number of sections around the outer radius
 * @param slices - number of sections around the inner radius
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
		this.inner = inner;
		this.outer = outer;
		this.slices = slices;
		this.loops = loops;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var ang_slices = 2 * Math.PI / this.slices;
		var ang_loops = 2 * Math.PI / this.loops;

		var ang_slices_aux = 0.0;
		var ang_loops_aux = 0.0;

		for (let i = 0; i <= this.loops; i++) {
			for (let j = 0; j <= this.slices; j++) {

				let auxiliar = this.outer + this.inner * Math.cos(ang_slices_aux);

				this.vertices.push(auxiliar * Math.cos(ang_loops_aux), auxiliar * Math.sin(ang_loops_aux), this.inner * Math.sin(ang_slices_aux));

				this.normals.push(Math.cos(ang_loops_aux) * Math.cos(ang_slices_aux), Math.sin(ang_loops_aux) * Math.cos(ang_slices_aux), Math.sin(ang_slices_aux));

				this.texCoords.push(j / this.slices, i / this.loops);

				if (j < this.slices && i < this.loops) {
					var current = i * (this.slices + 1) + j;
					var next = current + (this.slices + 1);

					this.indices.push(current + 1, current, next);
					this.indices.push(current + 1, next, next + 1);
				}

				ang_slices_aux += ang_slices;
			}
			ang_loops_aux += ang_loops;
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