
/**
 * MySpritesheet
 * @constructor
 * @param scene - reference to MyScene object
 * @param texture - reference to the texutre used on the spritesheet
 * @param sizeM - number of spritesheets in the M axis
 * @param sizeN - number of spritesheets in the N axis
 */
class MySpritesheet {

    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.fractionM = 1/this.sizeM;
        this.fractionN = 1/this.sizeN;

        //creates new shader object from .vert and .frag file
        this.shader = new CGFshader(this.scene.gl, "./shaders/spritesheet.vert", "./shaders/spritesheet.frag");
        this.shader.setUniformsValues({fractionM: this.fractionM, fractionN: this.fractionN, uSampler: 0});
    }

    activateCellMN(m, n){
        this.shader.setUniformsValues({mValue: m, nValue: n});
    }

    activateCellP(p){
        this.activateCellMN((p % this.sizeM), Math.floor(p / this.sizeM));
    }

    reset(){
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}