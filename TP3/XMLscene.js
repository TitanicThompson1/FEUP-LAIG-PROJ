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
        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);
        this.setPickEnabled(true);
        
        this.gameOrchestrator = new MyGameOrchestrator(this);

        this.initCamera();

        this.onGraphLoaded();
    }

    /**
     * Disables all the ligths
     */
    disableAllLigths(){

        // Reads the lights from the scene graph.
        for (let i = 0; i < this.getCurrentTheme().lights.length; i++) {
            this.lights[i].disable();
            this.lights[i].update();
        }
    }

    getAllThemes(){
        return this.gameOrchestrator.getAllThemes();
    }

    /**
     * Gets scene graph of the current theme
     */
    getCurrentTheme() {
        return this.gameOrchestrator.getCurrentTheme();
    }

    updateInterface(){
        this.interface.updateInterface();
    }


    /**
     * Initializes the scene cameras.
     */
    initCamera() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(2.5, 2, 12), vec3.fromValues(2.5, 1, 0));
        //this.interface.setActiveCamera(null)
    }


    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.getCurrentTheme().lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebCGF on default shaders.

            if (this.getCurrentTheme().lights.hasOwnProperty(key)) {
                var graphLight = this.getCurrentTheme().lights[key];

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

    getCamerasID(){
        return this.getCurrentTheme().camerasID;
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.axis = new CGFaxis(this, this.getCurrentTheme().referenceLength);

        this.gl.clearColor(...this.getCurrentTheme().background);

        this.setGlobalAmbientLight(...this.getCurrentTheme().ambient);

        this.initLights();

        //this.selectedCamera = this.getCurrentTheme().defaultCameraID;
        //this.updateCamera(this.getCurrentTheme().defaultCameraID);

        this.setUpdatePeriod(100);

        this.sceneInited = true;        
    }

    activateSelectedCam(){
        let selCam = this.getCurrentTheme().views.get(this.selectedCamera);
        this.activateCamera(selCam);
    }

    activateCamera(camera){
        this.camera = camera;
        this.interface.setActiveCamera(this.camera);
    }

    setUpNewThemCam(){
        this.selectedCamera =this.getCurrentTheme().defaultCameraID;
        this.previousCamera = this.selectedCamera;
        this.activateSelectedCam();
    }

    /**
     * Updates the current camera (interaction with interface)
     * @param {String} val id of current camera
     */
    updateCamera(val) {
        
        if(this.selectedCamera == undefined){
            this.selectedCamera = val;
            this.previousCamera = val;
            this.activateSelectedCam();
            return;
        }
  
        this.selectedCamera = val;
        let cameras = this.getCurrentTheme().views;
        
        // Getting position
        let previousPos = cameras.get(this.previousCamera).getPosition();
        let nextPos = cameras.get(this.selectedCamera).getPosition();

        // Getting target
        let previousTarget = cameras.get(this.previousCamera).getTarget();
        let nextTarget = cameras.get(this.selectedCamera).getTarget();

        this.cameraAnimation = new CamAnimKF(this, this.camera, previousPos, nextPos, previousTarget, nextTarget);

        // Saving the 
        this.previousCamera = this.selectedCamera;
    }

    updateTheme(theme){
        this.gameOrchestrator.changeTheme(theme);
    }


    /**
     * Updates if the lights are visible or not (interaction with interface) 
     * @param {index of light to change visability} index
     */
    updateLightVisibility(index) {
        if (this.displayLights)
            this.lights[index].setVisible(true);
        else
            this.lights[index].setVisible(false);
    }

    /**
     * Disables/Enables a specific light (interaction with interface)
     * @param {light to disable/enable} light 
     * @param {index of light to disable/enable} index
     */
    updateLightState(light, index) {
        if (light[0])
            this.lights[index].enable();
        else
            this.lights[index].disable();
    }

    /**
     * Updates lights in the scene taking into account whether they are visible and/or active
     */
    updateLights() {
        var i = 0;
        // Lights index.
        let lights = this.getCurrentTheme().lights;
        // Reads the lights from the scene graph.
        for (var key in lights ) {
            if (i >= 8)
                break; // Only eight lights allowed by WebCGF on default shaders.

            if (lights.hasOwnProperty(key)) {
                var light = lights[key];

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
    resetAnimations() {
        if (this.sceneInited) {
            for (let animation of this.getCurrentTheme().animations.values()) {
                animation.reset();
            }
        }
    }

    undoMove() {
        this.gameOrchestrator.gameSequence.undoGameMove(this.gameOrchestrator);
    }

    update(time) {
        this.gameOrchestrator.update(time);
        if(this.cameraAnimation !== undefined){

            this.cameraAnimation.update(time);

            if(this.cameraAnimation.ended()){
                this.activateSelectedCam();
                this.cameraAnimation.reset();   
                this.cameraAnimation = undefined;
            }
        }

        if(this.sceneInited){
            for(let animation of this.getCurrentTheme().animations.values()){
                animation.update(time);
            }
            for(let spriteAnimation of this.getCurrentTheme().spriteAnim){
                spriteAnimation.update(time);
            }
        }

    }

    /**
     * Creates the shader that will be used on spritesheets
     */
    createShader() {
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
            if (this.displayAxis)
                this.axis.display();

            this.defaultAppearance.apply();

            
            //Gets the select camera and activates it
            //this.camera = this.getCurrentTheme().views.get(this.selectedCamera);
            //this.interface.setActiveCamera(this.camera);
    
            // Displays the scene (MySceneGraph function).

            if(this.cameraAnimation !== undefined)
                this.cameraAnimation.apply();


            this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
            this.gameOrchestrator.display();

        } else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();

        // ---- END Background, camera and axis setup
    }
}