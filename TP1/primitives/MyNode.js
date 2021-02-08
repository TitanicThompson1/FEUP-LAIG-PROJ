/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class MyNode {
	constructor() {
        this.transformation = mat4.create();
        this.material = "";
        this.texture = {};
        this.descendants = [];
	}
    
    setTransformation(transformation){
        this.transformation = transformation;
    }

    setMaterial(material){
        this.material = material;
    }

    setTexture(texture){
        this.texture = texture;
    }

    setDescendants(descendants){
        this.descendants = descendants;
    }

    getTransformation(){return this.transformation}

    getMaterial(){return this.material}

    getTexture(){ return this.texture}

    getDescendants(){return this.descendants}




}

