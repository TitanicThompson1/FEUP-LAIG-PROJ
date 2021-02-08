
/**
 * MySpriteText
 * @constructor
 * @param scene - reference to MyScene object
 * @param text - the text to be displayed
 */
class MySpriteText {
    constructor(scene, text){
        this.scene = scene;
        this.text = text;

        this.geometry = new MyRectangle(scene, 0, 0, 0.5, 0.5);
        this.texture = new CGFtexture(scene, "./scenes/images/font.jpg");
        //Declarar no SceneGraph 
        this.spritesheet = new MySpritesheet(this.scene, this.texture, 10, 7);

        this.characterMap = {
            'A':0, 'B':1, 'C':2, 'D':3, 'E':4, 'F':5, 'G':6, 'H':7, 'I':8, 'J':9, 'K':10,
            'L':11, 'M':12, 'N':13, 'O':14, 'P':15, 'Q':16, 'R':17, 'S':18, 'T':19, 'U':20,
            'V':21, 'W':22, 'X':23, 'Y':24, 'Z':25, 'a':26, 'b':27, 'c':28, 'd':29, 'e':30,
            'f':31, 'g':32, 'h':33, 'i':34, 'j':35, 'k':36, 'l':37, 'm':38, 'n':39, 'o':40,
            'p':41, 'q':42, 'r':43, 's':44, 't':45, 'u':46, 'v':47, 'w':48, 'x':49, 'y':50,
            'z':51, '1':52, '2':53, '3':54, '4':55, '5':56, '6':57, '7':58, '8':59, '9':60,
            '0':61, '@':62, '&':63, '!':64, '?':65, '=':66, '-':67, '.':68, ' ':69
        };
    }

    getCharacterPosition(character){
        let pos =  this.characterMap[character];
        if(pos == null) return 69;
        return pos;
    }

    display(){

        //activate shader
        this.scene.setActiveShaderSimple(this.spritesheet.shader);
        this.spritesheet.texture.bind(0); //activate the texture shader

        this.scene.pushMatrix();
        for(let character of this.text){
            let pos = this.getCharacterPosition(character);
            this.spritesheet.activateCellP(pos);
            this.geometry.display();
            this.scene.translate(0.5, 0, 0);
        }
        this.scene.popMatrix();
        
        //resume default shader
        this.spritesheet.reset();
    }
}