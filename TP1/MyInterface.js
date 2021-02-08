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

        // add a group of controls (and open/expand by defult)

        this.initKeys();
    
        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    createInterface(){
        this.displayAxisCheckbox();
        this.displayLightsCheckbox();
        this.addLightsGroup(this.scene.graph.lights);
        this.addViewsGroup(this.scene.camerasID);   
    }

    /**
     * Adds to interface a checkbox to display the axis.
     */
    displayAxisCheckbox(){
        this.gui.add(this.scene, "displayAxis").name("Display Axis");
    }

    /**
     * Adds to interface a checkbox to display the lights.
     */
    displayLightsCheckbox(){
        this.gui.add(this.scene, "displayLights").name("Display Lights");
    }
    
    /**
     * Adds to interface a dropdown of all cameras avaible.
     * @param {array with all the ids of the cameras} camerasID
    */
    addViewsGroup(camerasID){
        this.gui.add(this.scene, "camera", camerasID).name("Camera").onChange(val => this.scene.updateCamera(val));
    }

    /**
     * Adds to interface the light group and adds all the lights to it.
     * @param {array with all lights} lights
    */
    addLightsGroup(lights){

        let group = this.gui.addFolder("Lights");

        for(let key in lights){
            group.add(lights[key], "0").name(key);
        }
    }
    
    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}