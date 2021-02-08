/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        //Variable that indicates if XML is already parsed
        this.sceneInited = false;
        
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.displayAxis = false;

        this.displayLights = false;

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance = new CGFappearance(this);

        this.initCamera();
    }

    /**
     * Initializes the scene cameras.
     */
    initCamera(){
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.updateLightVisibility(i);
                this.updateLightState(graphLight, i);

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.updateCamera(this.graph.defaultCameraID);

        this.interface.createInterface();

        this.setUpdatePeriod(100);

        this.sceneInited = true;
    }

    /**
     * Updates the current camera (interaction with interface)
    * @param {id of current camera} val
    */
    updateCamera(val){
        this.selectedCamera = val;
        this.camera = this.graph.views.get(this.selectedCamera);
        this.interface.setActiveCamera(this.camera);
    }
    
    /**
     * Updates if the lights are visible or not (interaction with interface) 
     * @param {index of light to change visability} index
     */
    updateLightVisibility(index){
        if(this.displayLights)
            this.lights[index].setVisible(true);
        else
            this.lights[index].setVisible(false);
    }

    /**
     * Disables/Enables a specific light (interaction with interface)
     * @param {light to disable/enable} light 
     * @param {index of light to disable/enable} index
    */
    updateLightState(light, index){
        if (light[0])
            this.lights[index].enable();
        else
            this.lights[index].disable();
    }

    /**
     * Updates lights in the scene taking into account whether they are visible and/or active
     */
    updateLights(){
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.updateLightVisibility(i);
                this.updateLightState(light, i);

                this.lights[i].update();

                i++;
            }
        }
    }

    /**
     * Resets all animations in the scene
     */
    resetAnimations(){
        if(this.sceneInited){
            for(let animation of this.graph.animations.values()){
                animation.reset();
            }
        }
    }

    update(currTime){
        if(this.sceneInited){
            for(let animation of this.graph.animations.values()){
                animation.update(currTime);
            }
            for(let spriteAnimation of this.graph.spriteAnim){
                spriteAnimation.update(currTime);
            }
        }
    }

    /**
     * Creates the shader that will be used on spritesheets
     */
    createShader(){
        this.shader = new CGFshader(this.gl, "./shaders/spritesheet.vert", "./shaders/spritesheet.frag");
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.updateLights();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            if(this.displayAxis)
                this.axis.display();
        
            this.defaultAppearance.apply();
            
            //Gets the select camera and activates it
            this.camera = this.graph.views.get(this.selectedCamera);
            this.interface.setActiveCamera(this.camera);
            
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }
        
        this.popMatrix();
        
        // ---- END Background, camera and axis setup
    }
}
