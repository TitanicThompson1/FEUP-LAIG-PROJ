/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.created = false;
        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () {};
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    }

    createInterface() {
        this.created = true;
        this.displayAxisCheckbox();
        this.displayLightsCheckbox();
 
        this.addThemesGroup(this.scene.getAllThemes());

        this.displayRestartCheckbox();
        
        this.addLightsGroup(this.scene.getCurrentTheme().lights);
        this.addViewsGroup(this.scene.getCamerasID());
    }

    /**
     * Updates the interface. If an interface hasn't been created yet, it creates it.
     */
    updateInterface() {
        if(!this.created){
            this.createInterface();
            return;
        }

        // Deleting the lights and cameras from interface 
        this.gui.removeFolder(this.lightFolder);
        this.gui.remove(this.cameraController);
        
        this.addLightsGroup(this.scene.getCurrentTheme().lights);
        this.addViewsGroup(this.scene.getCamerasID());
        
    }

    /**
     * Adds to interface a checkbox to restart animations.
     */
    displayRestartCheckbox() {
        this.gui.add(this.scene, "resetAnimations").name("Restart Animations")
    }

    /**
     * Adds to interface a checkbox to display the axis.
     */
    displayAxisCheckbox() {
        this.gui.add(this.scene, "displayAxis").name("Display Axis");
    }

    /**
     * Adds to interface a checkbox to display the lights.
     */
    displayLightsCheckbox() {
        this.gui.add(this.scene, "displayLights").name("Display Lights");
    }

    /**
     * Adds to interface a dropdown of all cameras avaible.
     * @param {Array} camerasID array with all the ids of the cameras
     */
    addViewsGroup(camerasID) {
        this.cameraController = this.gui.add(this.scene, "selectedCamera", camerasID).name("Camera").onChange(val => this.scene.updateCamera(val));
    }

    addThemesGroup(themeNames){
        this.gui.add(this.scene, "selectedTheme", themeNames).name("Themes").onChange(val => this.scene.updateTheme(val));
    }

    /**
     * Adds to interface the light group and adds all the lights to it.
     * @param {Array} lights array with all lights
     */
    addLightsGroup(lights) {

        this.lightFolder = this.gui.addFolder("Lights");

        for (let key in lights) {
  
            this.lightFolder.add(lights[key], "0").name(key);
        }
    }

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}