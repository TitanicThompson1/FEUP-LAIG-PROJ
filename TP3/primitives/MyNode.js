class MyNode {
    constructor() {
        this.transformation = mat4.create();
        this.material = "";
        this.texture = {};
        this.descendants = [];
        this.animation = "";
    }

    setTransformation(transformation) {
        this.transformation = transformation;
    }

    setMaterial(material) {
        this.material = material;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setDescendants(descendants) {
        this.descendants = descendants;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    getTransformation() {
        return this.transformation
    }

    getMaterial() {
        return this.material
    }

    getTexture() {
        return this.texture
    }

    getDescendants() {
        return this.descendants
    }

    getAnimation() {
        return this.animation
    }


}