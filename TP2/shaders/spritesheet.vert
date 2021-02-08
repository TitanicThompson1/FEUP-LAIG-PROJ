attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float fractionM;
uniform float fractionN;
uniform float nValue;
uniform float mValue;

void main() {

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
   
    vTextureCoord = (aTextureCoord * vec2(fractionM, fractionN)) + vec2(mValue*fractionM, nValue*fractionN);
}
