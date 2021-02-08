const DEGREE_TO_RAD = Math.PI / 180;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        //Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = new Map();

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.reader = new CGFXMLreader();  //File reading 

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /**
     * Callback to be executed after successful reading
    */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        //Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        //As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf") return "root tag <lsf> missing";

        var nodes = rootElement.children;

        //Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++)
            nodeNames.push(nodes[i].nodeName);

        var error;
        var index;

        //Processes each node, verifying errors.
        var indexCompontent = 0;

        //<initials>
        if ((index = nodeNames.indexOf("initials")) == -1) return "tag <initials> missing";
        else {
            if (index != indexCompontent) this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null) return error;
            indexCompontent++;
        }

        //<views>
        if ((index = nodeNames.indexOf("views")) == -1) return "tag <views> missing";
        else {
            if (index != indexCompontent) this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null) return error;
            indexCompontent++;
        }

        //<illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1) return "tag <illumination> missing";
        else {
            if (index != indexCompontent) this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null) return error;
            indexCompontent++;
        }

        //<lights>
        if ((index = nodeNames.indexOf("lights")) == -1) return "tag <lights> missing";
        else {
            if (index != indexCompontent) this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null) return error;
            indexCompontent++;
        }

        //<textures>
        if ((index = nodeNames.indexOf("textures")) == -1) return "tag <textures> missing";
        else {
            if (index != indexCompontent) this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null) return error;
            indexCompontent++;
        }

        //<spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) != -1) {
            if (index != indexCompontent) this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpritesheets(nodes[index])) != null) return error;
            indexCompontent++;
        }

        //<materials>
        if ((index = nodeNames.indexOf("materials")) == -1) return "tag <materials> missing";
        else {
            if (index != indexCompontent) this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null) return error;
            indexCompontent++;
        }

        //animations
        if ((index = nodeNames.indexOf("animations")) != -1) {

            if (index != indexCompontent) this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null) return error;
            indexCompontent++;
        }
        else {
            this.animations = new Map();
        }

        //<nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1) return "tag <nodes> missing";
        else {

            if (index != indexCompontent) this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null) return error;
        }

        this.log("All parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        //Get root of the scene
        if (rootIndex == -1) return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null) return "No root id defined for scene.";

        this.idRoot = id;

        //Get axis length        
        if (referenceIndex == -1) this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null) this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        let children = viewsNode.children;

        this.views = new Map();

        this.scene.camerasID = [];
        this.numCameras = 0;

        this.defaultCameraID = this.reader.getString(viewsNode, 'default');

        for (let i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.nodeName == "perspective") {
                let pID = this.reader.getString(child, "id");
                this.parsePerspective(child, pID);
            }
            else if (child.nodeName == "ortho") {
                let oID = this.reader.getString(child, "id");
                this.parseOrtho(child, oID);
            }
            else
                this.onXMLMinorError("Unrecognized tag " + child.nodeName + " found. Ignoring it.");
        }

        if (this.numCameras == 0) {
            this.onXMLMinorError("No cameras detected. Using default camera!")
            this.views.set("default", new CGFcamera(Math.PI / 6, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0)));
            this.scene.camerasID[this.numCameras++] = "default";
            this.defaultCameraID = "default";
        }

        this.log("Parsed Cameras.");
        return null;
    }

    /**
     * Parses and creates a perspective camera 
     * @param {block element} perspectiveNode 
     * @param {number} pID
     */
    parsePerspective(perspectiveNode, pID) {
        let near = this.reader.getFloat(perspectiveNode, "near");
        if (near == null || isNaN(near) || near < 0) {
            this.onXMLMinorError("Error in reading near attribute of camera " + pID + ". Using default camera.");
            return null;
        }

        let far = this.reader.getFloat(perspectiveNode, "far");
        if (far == null || isNaN(far) || far < 0) {
            this.onXMLMinorError("Error in reading far attribute of camera " + pID + ". Using default camera.");
            return null;
        }

        let angle = this.reader.getFloat(perspectiveNode, "angle");
        if (angle == null || isNaN(angle)) {
            this.onXMLMinorError("Error in reading angle attribute of camera " + pID + ". Using default camera.");
            return null;
        }

        //Variables to store from and to x, y, z
        let xF; let yF; let zF; let xT; let yT; let zT;
        let hasFrom = false;
        let hasTo = false;

        for (let i = 0; i < perspectiveNode.children.length; i++) {
            let perspectiveChild = perspectiveNode.children[i];

            if (perspectiveChild.nodeName == "from") {
                //parseCoordinates3D
                xF = this.reader.getFloat(perspectiveChild, 'x');
                yF = this.reader.getFloat(perspectiveChild, 'y');
                zF = this.reader.getFloat(perspectiveChild, 'z');

                if (xF == null || isNaN(xF) || yF == null || isNaN(yF) || yF == null || isNaN(yF)) {
                    this.onXMLMinorError("Error in reading <from> tag of camera " + pID + ". Using default camera.");
                    return null;
                }
                hasFrom = true;
            }
            else if (perspectiveChild.nodeName == "to") {
                //parseCoordinates3D
                xT = this.reader.getFloat(perspectiveChild, 'x');
                yT = this.reader.getFloat(perspectiveChild, 'y');
                zT = this.reader.getFloat(perspectiveChild, 'z');
                if (xT == null || isNaN(xT) || yT == null || isNaN(yT) || zT == null || isNaN(zT)) {
                    this.onXMLMinorError("Error in reading <to> tag  of camera " + pID + ". Using default camera.");
                    return null;
                }
                hasTo = true;
            }
            else
                this.onXMLMinorError("Unknown tag in camera " + pID + ". Ignoring it.");
        }

        if (!hasTo || !hasFrom) {
            this.onXMLMinorError("Missing tag of camera " + pID + ".");
            return null;
        }

        this.views.set(pID, new CGFcamera(angle * DEGREE_TO_RAD, near, far, vec3.fromValues(xF, yF, zF), vec3.fromValues(xT, yT, zT)));
        this.scene.camerasID[this.numCameras++] = pID;

        return null;
    }

    /**
     * Parses and creates an ortho camera 
     * @param {block element} orthoNode 
     * @param {number} oID 
     */
    parseOrtho(orthoNode, oID) {
        //this.defaultCameraOrtho = new CGFcameraOrtho(-0.2, 0.2, -0.2, 0.2, 0.1, 100, vec3.fromValues(5, 0, 10), vec3.fromValues(5, 0, 0), vec3.fromValues(0, 1, 0));
        let near = this.reader.getFloat(orthoNode, "near");
        if (near == null || isNaN(near) || near < 0) {
            this.onXMLMinorError("Error in reading near attribute of camera " + oID + ". Using default camera.");
            this.scene.cameraOrtho = this.defaultCameraOrtho;
            return null;
        }

        let far = this.reader.getFloat(orthoNode, "far");
        if (far == null || isNaN(far) || far < 0) {
            this.onXMLMinorError("Error in reading far attribute of camera " + oID + ". Using default camera.");
            this.scene.cameraOrtho = this.defaultCameraOrtho;
            return null;
        }

        let left = this.reader.getFloat(orthoNode, "left");
        let right = this.reader.getFloat(orthoNode, "right");
        let top = this.reader.getFloat(orthoNode, "top");
        let bottom = this.reader.getFloat(orthoNode, "bottom");

        if (left == null || isNaN(left) || right == null || isNaN(right) || top == null || isNaN(top) || bottom == null || isNaN(bottom)) {
            this.onXMLMinorError("Error in reading angle attribute of camera " + oID + ". Using default camera.");
            this.scene.cameraOrtho = this.defaultCameraOrtho;
            return null;
        }

        let from, to, up;
        let hasFrom = false;
        let hasTo = false;
        let hasUp = false;

        for (let i = 0; i < orthoNode.children.length; i++) {
            let perspectiveChild = orthoNode.children[i];

            if (perspectiveChild.nodeName == "from") {
                from = this.parseCoordinates3D(perspectiveChild, oID);
                if (typeof (from) == "string") {
                    this.onXMLMinorError("Error in reading <from> tag of camera " + oID + ". Using default camera.");
                    this.scene.cameraOrtho = this.defaultCameraOrtho;
                    return null;
                }
                hasFrom = true;
            }
            else if (perspectiveChild.nodeName == "to") {
                to = this.parseCoordinates3D(perspectiveChild, oID);
                if (typeof (to) == "string") {
                    this.onXMLMinorError("Error in reading <to> tag  of camera " + oID + ". Using default camera.");
                    this.scene.cameraOrtho = this.defaultCameraOrtho;
                    return null;
                }
                hasTo = true;
            }
            else if (perspectiveChild.nodeName == "up") {
                up = this.parseCoordinates3D(perspectiveChild, oID);
                if (typeof (up) == "string")
                    this.onXMLMinorError("Error in reading <up> tag  of camera " + oID + ". Using default value.");
                else
                    hasUp = true;
            }
            else
                this.onXMLMinorError("Unknown tag in camera " + oID + ". Ignoring it.");
        }

        if (!hasTo || !hasFrom) {
            this.onXMLMinorError("Missing tag of camera " + oID + ". Using default camera.");
            this.scene.cameraOrtho = this.defaultCameraOrtho;
            return null;
        }
        else if (!hasUp)
            up = [0, 1, 0];

        this.views.set(oID, new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up));
        this.scene.camerasID[this.numCameras++] = oID;
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {
        var children = illuminationsNode.children;
        this.ambient = [];
        this.background = [];

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color)) return color;
        else this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color)) return color;
        else this.background = color;

        this.log("Parsed Illumination.");
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        //Any number of lights.
        for (var i = 0; i < children.length; i++) {

            //Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            //Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null) {
                this.onXMLMinorError("no ID defined for light" + (i + 1));
                continue;
            }

            //Checks for repeated IDs.
            if (this.lights[lightId] != null) {
                this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + lightId + "). Ignoring it");
                continue;
            }

            grandChildren = children[i].children; //Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);


            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0) {
            this.onXMLMinorError("No lights detected. Using default light");
            let light = []
            light.push(true);
            light.push([5, 5, 5])
            light.push([0.3, 1, 1, 1])
            light.push([0.3, 1, 1, 1])
            light.push([0.3, 1, 1, 1])
            light.push([0, 0, 0, 1])
            this.lights["default"] = light;



        } else if (numLights > 8) {
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");
        }
        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        let children = texturesNode.children;

        this.textures = new Map();

        //verifies if there are any textures
        if (children.length == 0) return null;

        //For each texture in textures block, check ID and file URL
        for (var i = 0; i < children.length; i++) {

            //Gets current texture and id
            let currentTexture = children[i];
            let currentId = this.reader.getString(currentTexture, 'id');

            //Checks if id exists
            if (currentId == null) {
                this.onXMLMinorError("no ID defined for texture " + (i + 1));
                continue;
            }

            //Checks for repeated IDs.
            if (this.textures.has(currentId)) {
                this.onXMLMinorError("ID must be unique for each texture (conflict: ID = " + currentId + "). Ignoring it");
                continue;
            }

            let textureURL = this.reader.getString(currentTexture, 'path');

            let texture = new CGFtexture(this.scene, textureURL);
            this.textures.set(currentId, texture);
        }

        this.log("Parsed textures.");
        return null;
    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spritesheetsNode
    */
    parseSpritesheets(spritesheetsNode) {
        let children = spritesheetsNode.children;

        this.spritesheets = new Map();
        this.spriteAnim = [];

        //verifies if there are any textures
        if (children.length == 0) return null;

        //For each spritesheet in spritesheets block, check ID, number of columns and number of rows
        for (var i = 0; i < children.length; i++) {

            //Gets current spritesheet and id
            let currentSpritesheet = children[i];
            let currentId = this.reader.getString(currentSpritesheet, 'id');

            //Checks if id exists
            if (currentId == null) {
                this.onXMLMinorError("no ID defined for spritesheet " + (i + 1));
                continue;
            }

            //Checks for repeated IDs.
            if (this.spritesheets.has(currentId)) {
                this.onXMLMinorError("ID must be unique for each spritesheet (conflict: ID = " + currentId + "). Ignoring it");
                continue;
            }


            let path = this.reader.getString(currentSpritesheet, 'path');
            let sizeM = this.reader.getString(currentSpritesheet, 'sizeM');

            //Checks if sizeM is valid
            if(!(sizeM != null && !isNaN(sizeM) && sizeM > 0)){
                this.onXMLMinorError("sizeM of spritesheet " + currentId + " is not a positive number. Ignoring it!");
                continue;
            }

            let sizeN = this.reader.getString(currentSpritesheet, 'sizeN');

            //Checks if sizeM is valid
            if(!(sizeN != null && !isNaN(sizeN) && sizeN > 0)){
                this.onXMLMinorError("sizeN of spritesheet " + currentId + " is not a positive number. Ignoring it!");
                continue;
            }

            //Create a texture with the given path
            let texture = new CGFtexture(this.scene, path);

            //Create new spritesheet and add it to the spritesheets map
            let spritesheet = new MySpritesheet(this.scene, texture, sizeM, sizeN);
            this.spritesheets.set(currentId, spritesheet);
        }
        this.log("Parsed spritesheets.");
        return null;
    }


    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = new Map();
        let grandChildren = [];

        //Creates a default material to be used when some error occurs
        this.createDefaultMaterial();

        //For each material in materials block, check ID, shininess, ambient, diffuse, specular and emissive
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Ignoring it!");
                continue;
            }

            //Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null) return "no ID defined for material";

            //Checks for repeated IDs.
            if (this.materials.has(materialID)) {
                this.onXMLMinorError("ID must be unique for each material (conflict: ID = " + materialID + "). Ignoring it");
                continue;
            }

            let hasShininess = false;
            let hasAmbient = false; let hasDiffuse = false;
            let hasSpecular = false; let hasEmissive = false;

            let material = new CGFappearance(this.scene);
            grandChildren = children[i].children;

            for (let j = 0; j < grandChildren.length; j++) {
                let component = grandChildren[j];

                //Parse shininess
                if (component.nodeName == "shininess") {
                    let shininess = this.reader.getFloat(component, "value");
                    if ((shininess == null) || isNaN(shininess)) {
                        this.onXMLMinorError("Shininess component from material " + materialID + "is incorrect. Using default value of 40.");
                        shininess = 40.0;
                    }
                    material.setShininess(shininess);
                    hasShininess = true;
                }

                //Parse ambient
                else if (component.nodeName == "ambient") {
                    let ambient = this.parseColor(component, materialID);

                    if (typeof (ambient) == "string") {
                        this.onXMLMinorError(ambient);
                        material.setAmbient(0.8, 1.0, 1.0, 1.0);
                    }
                    else
                        material.setAmbient(...ambient);

                    hasAmbient = true;
                }
                //Parse Diffuse
                else if (component.nodeName == "diffuse") {
                    let diffuse = this.parseColor(component, materialID);

                    if (typeof (diffuse) == "string") {
                        this.onXMLMinorError(diffuse);
                        material.setDiffuse(0.8, 1.0, 1.0, 1.0);
                    }
                    else
                        material.setDiffuse(...diffuse);

                    hasDiffuse = true;
                }
                //Parse specular
                else if (component.nodeName == "specular") {
                    let specular = this.parseColor(component, materialID);

                    if (typeof (specular) == "string") {
                        this.onXMLMinorError(specular);
                        material.setSpecular(0.8, 1.0, 1.0, 1.0);
                    }
                    else
                        material.setSpecular(...specular);

                    hasSpecular = true;
                }
                //Parse emissive
                else if (component.nodeName == "emissive") {
                    let emissive = this.parseColor(component, materialID);
                    if (typeof (emissive) == "string") {
                        this.onXMLMinorError(emissive);
                        material.setEmission(0.8, 1.0, 1.0, 1.0);
                    }
                    else
                        material.setEmission(...emissive);

                    hasEmissive = true;
                }
                else {
                    this.onXMLMinorError("Unknow tag in material " + materialID + ". Now ignoring it")
                }
            }

            //Verifies if node has all tags
            if (!hasShininess || !hasAmbient || !hasDiffuse || !hasSpecular || !hasEmissive) {
                this.onXMLMinorError("Missing tags on material" + materialID + ". Using default material.")
                material = this.defaultMaterial;
            }

            //Stores material in map
            this.materials.set(materialID, material);
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Creates a default fluorescent material to be used when there are errors in a specific material
     */
    createDefaultMaterial() {
        this.defaultMaterial = new CGFappearance(this.scene);
        this.defaultMaterial.setAmbient(0.8, 1.0, 0.0, 1);
        this.defaultMaterial.setDiffuse(0.8, 1.0, 0.0, 1);
        this.defaultMaterial.setSpecular(0.8, 1.0, 0.0, 1);
        this.defaultMaterial.setEmission(0.0, 0.0, 0.0, 1);
        this.defaultMaterial.setShininess(40);
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) { //pode não existir e até ser vazio
        let children = animationsNode.children;
        if (children.length == 0) return null;

        this.animations = new Map();

        //For each animation in animations block, check keyframes
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Ignoring it!");
                continue;
            }

            //Get id of the current animation.
            let animationID = this.reader.getString(children[i], 'id');
            if (animationID == null) {
                this.onXMLMinorError("no ID defined for animation. Ignoring it!");
                continue;
            }

            //Checks for repeated IDs.
            if (this.animations.has(animationID)) {
                this.onXMLMinorError("ID must be unique for each animation (conflict: ID = " + animationID + "). Ignoring it");
                continue;
            }

            let grandChildren = children[i].children;
            if ((grandChildren == null) || grandChildren.length < 1) {
                this.onXMLMinorError("There isn't any keyframe tag in animation " + animationID + ". Ignoring it.");
                continue;
            }

            let keyframes = this.parseAnimation(grandChildren, animationID);
            let animation = new KeyFrameAnimation(keyframes);
            
            this.animations.set(animationID, animation);
        }

        this.log("Parsed animations");
        return null;
    }

    /**
     * Parses the <animation> block.
     * @param {animation block element} animationNode
     * @param {string} animationID
     */
    parseAnimation(animationNode, animationID) {
        let keyframes = [];
        let last = -1;

        for (let i = 0; i < animationNode.length; i++) {
            
            if (animationNode[i].nodeName != "keyframe") {
                this.onXMLMinorError("Unknown tag <" + animationNode[i].nodeName + ">. Ignoring it!");
                continue;
            }

            //Get instant of the current keyframe.
            let keyframeInstant = this.reader.getFloat(animationNode[i], 'instant');
            
            if (keyframeInstant == null || isNaN(keyframeInstant) ) {
                this.onXMLMinorError("No instant " + keyframeInstant     + " defined for keyframe in animation " + animationID + ". Ignoring it!");
                continue;
            }
            
            if (keyframeInstant < 0 || keyframeInstant < last ) {
                this.onXMLMinorError("Instant " + keyframeInstant + " invalid defined for keyframe in animation " + animationID + ". Ignoring it!");
                continue;
            }

            let children = animationNode[i].children;
            if ((children == null )|| (children.length != 5)) {
                this.onXMLMinorError("Missing one or more transformations in animation " + animationID + ". Ignoring it!");
                continue;
            }
            let keyframe = new KeyFrame(keyframeInstant);
            let aux = this.parseKeyFrame(children, animationID, keyframe);

            if (typeof aux == "string") {
                this.onXMLMinorError(aux);
                continue;
            }
            keyframes.push(keyframe);
            last = keyframeInstant; 
        }
        return keyframes;
    }

    /**
     * Parses the <keyframe> block.
     * @param {keyframe block element} keyframeNode
     * @param {string} animationID
     * @param {KeyFrame} keyframe
     */
    parseKeyFrame(keyframeNode, animationID, keyframe) {
        
        let translation;
        let rotationX;
        let rotationY;
        let rotationZ;
        let scale;

        for (let i = 0; i < keyframeNode.length; i++) {
            let transformation = keyframeNode[i];

            if (transformation.nodeName == "translation") {
                if (translation == undefined){
                    translation = this.parseCoordinates3D(transformation, animationID);
                    if(typeof translation == "string")
                        return translation + " Ignoring keyframe!";
                }
                else
                    return "More that one translation in animation " + animationID + ". Ignoring keyframe!";
            }
            else if(transformation.nodeName == "rotation"){
                let angle = this.reader.getFloat(transformation, "angle");
                if (angle == null || isNaN(angle))
                    return this.onXMLMinorError("Value of angle invalid in animation " + animationID + ". Ignoring keyframe!");
                    
                angle *= DEGREE_TO_RAD;
                let axis = this.reader.getString(transformation, "axis");

                if ((axis == "x") && (rotationX == undefined)) rotationX = [angle, 0, 0];
                else if ((axis == "y") && (rotationY == undefined)) rotationY = [0, angle, 0];
                else if ((axis == "z") && (rotationZ == undefined)) rotationZ = [0, 0, angle];
                else return this.onXMLMinorError("Error in rotation of animation " + animationID + ". Ignoring keyframe!")       
            }
            else if(transformation.nodeName == "scale"){
                if(scale == undefined){
                    scale = this.parseCoordinatesScale(transformation, animationID);
                    if(typeof scale == "string")
                        return scale + ". Ignoring keyframe!";
                }
                else
                    return "More that one scale in animation " + animationID + ". Ignoring keyframe!";
            }
        }

        let transformations = [translation, rotationX, rotationY, rotationZ, scale];
        keyframe.setTransformations(transformations);
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {

        var children = nodesNode.children;

        this.nodes = new Map();
        var grandChildren = [];
        var grandgrandChildren = [];

        //For each node in nodes block, check ID, transformations, material, texture and descendants
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Ignoring it!");
                continue;
            }

            //Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null) return "no ID defined for nodeID";

            //Checks for repeated IDs.
            if (this.nodes.has(nodeID)) return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            let nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);


            let nodeInfo = new MyNode();

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var animationIndex = nodeNames.indexOf("animationref");
            var descendantsIndex = nodeNames.indexOf("descendants");

            //Parse Transformations
            if (transformationsIndex != -1) {
                let transformationsNode = grandChildren[transformationsIndex];

                let transformationMatrix = mat4.create();

                for (let j = 0; j < transformationsNode.children.length; j++) {

                    let transformation = transformationsNode.children[j];

                    //Parse Translation
                    if (transformation.nodeName == "translation") {
                        let vector = this.parseCoordinates3D(transformation, nodeID);
                        if (typeof vector == "string")
                            this.onXMLMinorError(vector + ". Ignoring transformation!");
                        else
                            mat4.translate(transformationMatrix, transformationMatrix, vector); //Translates the transformationMatrix by the given vector
                    }
                    //Parse Rotation
                    else if (transformation.nodeName == "rotation") {
                        let angle = this.reader.getFloat(transformation, "angle");
                        if (angle == null || isNaN(angle)) {
                            this.onXMLMinorError("Value of angle invalid in node " + nodeID + ". Ignoring transformation!");
                            continue;
                        }

                        let axis = this.reader.getString(transformation, "axis");

                        if (axis == "x") axis = [1, 0, 0];
                        else if (axis == "y") axis = [0, 1, 0];
                        else if (axis == "z") axis = [0, 0, 1];
                        else {
                            this.onXMLMinorError("Error in axis of node " + nodeID + ". Ignoring transformation!")
                            continue;
                        }

                        //Rotates the transformationMatrix by the given angle around the given axis
                        mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, axis);
                    }
                    //Parse Scale
                    else if (transformation.nodeName == "scale") {
                        let scale = this.parseCoordinatesScale(transformation, nodeID);

                        if(typeof scale == "string"){
                            this.this.onXMLMinorError(scale + ". Ignoring transformation!");
                            continue;
                        }
                        //Scales the transformation matrix by the dimensions in the given array
                        mat4.scale(transformationMatrix, transformationMatrix, scale);
                    }
                    else
                        this.onXMLMinorError("Unrecognized tag in node " + nodeID);
                }
                nodeInfo.setTransformation(transformationMatrix);
            }
            else {
                this.onXMLMinorError("There is no transformation tag in node " + nodeID);
            }

            //Parse Material
            if (materialIndex != -1) {
                let materialID = this.reader.getString(grandChildren[materialIndex], 'id');

                if (materialID != "null" && !this.materials.has(materialID)) {
                    this.onXMLMinorError("There is no material with id " + materialID + ". Using parent material.")
                    materialID = "null";
                }

                nodeInfo.setMaterial(materialID);
            }
            else {
                this.onXMLMinorError("There is no material tag in node " + nodeID + ". Using parent material.");
                nodeInfo.setMaterial("null");
            }

            //Parse Texture
            let texture = {};
            if (textureIndex != -1) {
                texture.id = this.reader.getString(grandChildren[textureIndex], 'id');

                grandgrandChildren = grandChildren[textureIndex].children;

                if ((texture.id != "null") && (texture.id != "clear") && (!this.textures.has(texture.id))) {
                    this.onXMLMinorError("There is no texture with id " + texture.id + ". Clearing node's texture.")
                    texture.id = "clear";
                }
                if ((grandgrandChildren.length == 0) && (texture.id != "clear")) {
                    this.onXMLMinorError("There is no tag amplification in node " + nodeID + ". Using default value.")
                    texture.afs = 1.0;
                    texture.aft = 1.0;
                }
                else if (texture.id != "clear") {
                    texture.afs = this.reader.getFloat(grandgrandChildren[0], 'afs');
                    texture.aft = this.reader.getFloat(grandgrandChildren[0], 'aft');
                }

                nodeInfo.setTexture(texture);
            }
            else {
                this.onXMLMinorError("There is no texture tag in node " + nodeID + ". Using parent texture and default values of afs and aft.");
                texture.id = "null";
                texture.afs = 1.0;
                texture.aft = 1.0;
                nodeInfo.setMaterial(texture);
            }
            
            // Parse Animation
            if(animationIndex != -1){
                let animationTag = grandChildren[animationIndex];
                let animationID = this.reader.getString(animationTag, "id")
                if((animationID == null) || (!this.animations.has(animationID))){
                    this.onXMLMinorError("Animation ID invalid in node " + nodeID + " . Ignoring it");
                    nodeInfo.setAnimation(null);
                }else
                    nodeInfo.setAnimation(animationID);
            }
            else 
                nodeInfo.setAnimation(null);


            //Parse Descendants
            if (descendantsIndex != -1) {
                let descendants = [];
                grandgrandChildren = grandChildren[descendantsIndex].children;
                let noLeaf = 0;

                for (let j = 0; j < grandgrandChildren.length; j++) {
                    /*descendant can have different types: compost, rectangle, triangle, sphere, torus, cylinder, spritetext, spriteanim, plane, patch, defbarrel
                    if is not compost, it will be created a primitive with the given info and will be stored in 'info'
                    */
                    let descendant = {};
                    let errorLeaf = false;

                    if (grandgrandChildren[j].nodeName == "noderef") {
                        descendant.type = "compost";
                        descendant.id = this.reader.getString(grandgrandChildren[j], 'id');
                    }
                    else if (grandgrandChildren[j].nodeName == "leaf") {
                        let message = this.parseLeaf(grandgrandChildren[j], descendant, nodeID);
                        if ((typeof message == "string") || (typeof descendant.info == "string")) errorLeaf = true;
                        else if (texture.id != "clear" && ((descendant.type == "rectangle") || (descendant.type == "triangle")))
                            descendant.info.updateTexCoords([texture.afs, texture.aft]);
                        if(!errorLeaf) noLeaf++;
                    }
                    if (!errorLeaf){descendants.push(descendant)};

                    errorLeaf = false;
                }
                if(noLeaf > 1) this.onXMLMinorError("More that one leaf in node " + nodeID + ". Scene may not be what was expected!");
                nodeInfo.setDescendants(descendants);
            }
            else
                return "There is no descendants tag in node " + nodeID;

            this.nodes.set(nodeID, nodeInfo);
        }

        this.log("Parsed nodes");
        return this.verifyNodesExistance();
    }

    /**
     * Calls the function that will parse and create the given type of primitive
     * @param {block element} node 
     * @param {object} descendant object where it will be stored the primitive's information
     * @param {string} messageError message to be displayed in case of error
     */
    parseLeaf(node, descendant, messageError) {
        let type = this.reader.getString(node, 'type');

        descendant.type = type;

        if (type == "rectangle") descendant.info = this.parseRectangle(node, messageError);
        else if (type == "triangle") descendant.info = this.parseTriangle(node, messageError);
        else if (type == "sphere") descendant.info = this.parseSphere(node, messageError);
        else if (type == "torus") descendant.info = this.parseTorus(node, messageError);
        else if (type == "cylinder") descendant.info = this.parseCylinder(node, messageError);
        else if (type == "spritetext") descendant.info = this.parseSpriteText(node, messageError);
        else if (type == "spriteanim") descendant.info = this.parseSpriteAnim(node, messageError);
        else if (type == "plane") descendant.info = this.parsePlane(node, messageError);
        else if (type == "patch") descendant.info = this.parsePatch(node, messageError);
        else if (type == "defbarrel") descendant.info = this.parseDefbarrel(node, messageError);
        else {
            this.onXMLMinorError("Primitive not recognized in node " + messageError + ". Ignoring it");
            return "Error";
        }
        return null;
    }
    
    /**
     * Parses and creates a rectangle
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseRectangle(node, messageError) {
        let x1 = this.reader.getFloat(node, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            this.onXMLMinorError("Unable to parse x1-coordinate of the node " + messageError + ". Ignoring Rectangle!");
            return "Error";
        }
        let x2 = this.reader.getFloat(node, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            this.onXMLMinorError("Unable to parse x2-coordinate of the node " + messageError + ". Ignoring Rectangle!");
            return "Error";
        }
        let y1 = this.reader.getFloat(node, 'y1');
        if (!(y1 != null && !isNaN(y1))) {
            this.onXMLMinorError("Unable to parse y1-coordinate of the node " + messageError + ". Ignoring Rectangle!");
            return "Error";
        }
        let y2 = this.reader.getFloat(node, 'y2');
        if (!(y2 != null && !isNaN(y2))) {
            this.onXMLMinorError("Unable to parse y2-coordinate of the node " + messageError + ". Ignoring Rectangle!");
            return "Error";
        }
        return new MyRectangle(this.scene, x1, y1, x2, y2);
    }

    /**
     * Parses and creates a triangle
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseTriangle(node, messageError) {
        let x1 = this.reader.getFloat(node, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            this.onXMLMinorError("Unable to parse x1-coordinate of the node " + messageError + ". Ignoring Triangle!");
            return "Error";
        }

        let x2 = this.reader.getFloat(node, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            this.onXMLMinorError("Unable to parse x2-coordinate of the node " + messageError + ". Ignoring Triangle!");
            return "Error";
        }

        let x3 = this.reader.getFloat(node, 'x3');
        if (!(x3 != null && !isNaN(x3))) {
            this.onXMLMinorError("Unable to parse x3-coordinate of the node " + messageError + ". Ignoring Triangle!");
            return "Error";
        }

        let y1 = this.reader.getFloat(node, 'y1');
        if (!(y1 != null && !isNaN(y1))) {
            this.onXMLMinorError("Unable to parse y1-coordinate of the node " + messageError + ". Ignoring Triangle!");
            return "Error";
        }
        let y2 = this.reader.getFloat(node, 'y2');
        if (!(y2 != null && !isNaN(y2))) {
            this.onXMLMinorError("Unable to parse y2-coordinate of the node " + messageError + ". Ignoring Triangle!");
            return "Error";
        }

        let y3 = this.reader.getFloat(node, 'y3');
        if (!(y3 != null && !isNaN(y3))) {
            this.onXMLMinorError("Unable to parse y1-coordinate of the node " + messageError + ". Ignoring Triangle!");
            return "Error";
        }
        return new MyTriangle(this.scene, [x1, y1], [x2, y2], [x3, y3]);
    }

    /**
     * Parses and creates a sphere
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseSphere(node, messageError) {
        let radius = this.reader.getFloat(node, 'radius');
        if (!(radius != null && !isNaN(radius) && radius >= 0)) {
            this.onXMLMinorError("Unable to parse radius of the node " + messageError + ". Ignoring Sphere!");
            return "Error";
        }

        let slices = this.reader.getFloat(node, 'slices');
        if (!(slices != null && !isNaN(slices) && slices >= 0)) {
            this.onXMLMinorError("Unable to parse slices of the node " + messageError + ". Ignoring Sphere!");
            return "Error";
        }

        let stacks = this.reader.getFloat(node, 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks >= 0)) {
            this.onXMLMinorError("Unable to parse stacks of the node " + messageError + ". Ignoring Sphere!");
            return "Error";
        }

        return new MySphere(this.scene, radius, slices, stacks);
    }

    /**
     * Parses and creates a torus
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseTorus(node, messageError) {
        let inner = this.reader.getFloat(node, 'inner');
        if (!(inner != null && !isNaN(inner) && inner >= 0)) {
            this.onXMLMinorError("Unable to parse inner of the node " + messageError + ". Ignoring Torus.");
            return "Error";
        }

        let outer = this.reader.getFloat(node, 'outer');
        if (!(outer != null && !isNaN(outer) && outer >= 0)) {
            this.onXMLMinorError("Unable to parse outer of the node " + messageError + ". Ignoring Torus.");
            return "Error";
        }

        let slices = this.reader.getFloat(node, 'slices');
        if (!(slices != null && !isNaN(slices) && slices >= 0)) {
            this.onXMLMinorError("Unable to parse slices of the node " + messageError + ". Ignoring Torus.");
            return "Error";
        }

        let loops = this.reader.getFloat(node, 'loops');
        if (!(loops != null && !isNaN(loops) && loops >= 0)) {
            this.onXMLMinorError("Unable to parse loops of the node " + messageError + ". Ignoring Torus.");
            return "Error";
        }

        return new MyTorus(this.scene, inner, outer, slices, loops);
    }

    /**
     * Parses and creates a cylinder
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseCylinder(node, messageError) {
        let height = this.reader.getFloat(node, 'height');
        if (!(height != null && !isNaN(height) && height >= 0)) {
            this.onXMLMinorError("Unable to parse height of the node " + messageError + ". Ignoring Cylinder!");
            return "Error";
        }

        let topRadius = this.reader.getFloat(node, 'topRadius');
        if (!(topRadius != null && !isNaN(topRadius) && topRadius >= 0)) {
            this.onXMLMinorError("Unable to parse topRadius of the node " + messageError + ". Ignoring Cylinder!");
            return "Error";
        }
        let bottomRadius = this.reader.getFloat(node, 'bottomRadius');
        if (!(bottomRadius != null && !isNaN(bottomRadius) && bottomRadius >= 0)) {
            this.onXMLMinorError("Unable to parse bottomRadius of the node " + messageError + ". Ignoring Cylinder!");
            return "Error";
        }
        let slices = this.reader.getFloat(node, 'slices');
        if (!(slices != null && !isNaN(slices) && slices >= 0)) {
            this.onXMLMinorError("Unable to parse slices of the node " + messageError + ". Ignoring Cylinder!");
            return "Error";
        }

        let stacks = this.reader.getFloat(node, 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks >= 0)) {
            this.onXMLMinorError("Unable to parse stacks of the node " + messageError + ". Ignoring Cylinder!");
            return "Error";
        }

        return new MyCylinder(this.scene, height, topRadius, bottomRadius, stacks, slices);
    }

    /**
     * Parses and creates a SpriteText
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseSpriteText(node, messageError) {
        let text = this.reader.getString(node, 'text');
        if(text == null){
            this.onXMLMinorError("Unable to parse text of the node " + messageError + "Ignoring SpriteText!");
            return "Error";
        }

        return new MySpriteText(this.scene, text);
    }

    /**
     * Parses and creates a SpriteAnimimation
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseSpriteAnim(node, messageError) {
        let ssid = this.reader.getString(node, 'ssid');
        if(ssid == null){
            this.onXMLMinorError("Unable to parse ssid of the node " + messageError + "Ignoring SpriteAnimation!");
            return "Error";
        }
        else if(!this.spritesheets.has(ssid)){
            this.onXMLMinorError("There isn't a spritesheet with id " + ssid + " . Ignoring SpriteAnimation of node " + messageError + "!");
            return "Error";
        }
        let spritesheet = this.spritesheets.get(ssid);

        let startCell = this.reader.getFloat(node, 'startCell');
        if(!(startCell != null && !isNaN(startCell)  && (startCell >= 0))){
            this.onXMLMinorError("Unable to parse startCell of the node " + messageError + "Ignoring SpriteAnimation!");
            return "Error";
        } 

        let endCell = this.reader.getFloat(node, 'endCell');
        if(!(endCell != null && !isNaN(endCell)  && (endCell >= 0))){
            this.onXMLMinorError("Unable to parse endCell of the node " + messageError + "Ignoring SpriteAnimation!");
            return "Error";
        }

        let duration = this.reader.getFloat(node, 'duration');
        if(!(duration != null && !isNaN(duration) && (duration > 0))){
            this.onXMLMinorError("Unable to parse duration of the node " + messageError + "Ignoring SpriteAnimation!");
            return "Error";
        }
        
        let anim = new MySpriteAnimation(this.scene, spritesheet, duration, startCell, endCell);
        this.spriteAnim.push(anim);

        return anim;
    }

    /**
     * Parses and creates a plane
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parsePlane(node, messageError) {
        let npartsU = this.reader.getFloat(node, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && npartsU >= 0)) {
            this.onXMLMinorError("Unable to parse npartsU of the node " + messageError + ". Ignoring Plane!");
            return "Error";
        }

        let npartsV = this.reader.getFloat(node, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && npartsV >= 0)) {
            this.onXMLMinorError("Unable to parse npartsV of the node " + messageError + ". Ignoring Plane!");
            return "Error";
        }
        
        return new MyPlane(this.scene, npartsU, npartsV);
    }

    /**
     * Parses and creates a patch
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parsePatch(node, messageError) {

        let npointsU = this.reader.getFloat(node, 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU) && npointsU >= 0)) {
            this.onXMLMinorError("Unable to parse npointsU of the node " + messageError + ". Ignoring Patch!");
            return "Error";
        }

        let npointsV = this.reader.getFloat(node, 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV) && npointsV >= 0)) {
            this.onXMLMinorError("Unable to parse npointsV of the node " + messageError + ". Ignoring Patch!");
            return "Error";
        }

        let npartsU = this.reader.getFloat(node, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && npartsU >= 0)) {
            this.onXMLMinorError("Unable to parse npartsU of the node " + messageError + ". Ignoring Patch!");
            return "Error";
        }

        let npartsV = this.reader.getFloat(node, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && npartsV >= 0)) {
            this.onXMLMinorError("Unable to parse npartsV of the node " + messageError + ". Ignoring Patch!");
            return "Error";
        }
        
        let children = node.children;
        if ((children == null) || (children.length != npointsU*npointsV)) {
            this.onXMLMinorError("The number of control points in node " + messageError + " is not correct. Ignoring Patch.");
            return "Error";
        }

        let controlPoints = this.parseControlPoints(children, messageError, npointsU, npointsV);
        if (controlPoints.length != npointsU){
            this.onXMLMinorError("The number of control points in node " + messageError + " is not correct. Ignoring Patch.");
            return "Error";
        }
        
        return new MyPatch(this.scene, npartsU, npartsV, npointsU, npointsV, controlPoints);
    }

    /**
     * Parses list of control points
     * @param {block element} controlPoints 
     * @param {string} messageError message to be displayed in case of error
     */
    parseControlPoints(controlPoints, messageError, uPoints, vPoints) {
        
        let listU = [];
        let listFinal = [];
        
        for(let i = 0; i < uPoints; i++){
            listU = [];
            for(let j = 0; j < vPoints; j++){
                let controlPoint = controlPoints[i*vPoints + j];
                
                if (controlPoint.nodeName != "controlpoint") {
                    this.onXMLMinorError("unknown tag <" + controlPoint.nodeName + ">. Ignoring it!");
                    continue;
                }
    
                let coords = this.parseCoordinates3D(controlPoint, messageError);
                if (typeof(coords) == "string") {
                    this.onXMLMinorError(coords);
                    continue;
                }

                //In LAIG, the weight is always equal to 1
                coords.push(1);

                listU.push(coords);
            }
            listFinal.push(listU);
        }
        return listFinal;
    }

    /**
     * Parses and creates a defbarrel
     * @param {block element} node 
     * @param {string} messageError message to be displayed in case of error
     */
    parseDefbarrel(node, messageError) {
        let height = this.reader.getFloat(node, 'height');
        if (!(height != null && !isNaN(height) && height >= 0)) {
            this.onXMLMinorError("Unable to parse height of the node " + messageError + ". Ignoring Defbarrel!");
            return "Error";
        }

        let base = this.reader.getFloat(node, 'base');
        if (!(base != null && !isNaN(base) && base >= 0)) {
            this.onXMLMinorError("Unable to parse base of the node " + messageError + ". Ignoring Defbarrel!");
            return "Error";
        }
        let middle = this.reader.getFloat(node, 'middle');
        if (!(middle != null && !isNaN(middle) && middle >= 0)) {
            this.onXMLMinorError("Unable to parse middle of the node " + messageError + ". Ignoring Defbarrel!");
            return "Error";
        }
        let slices = this.reader.getFloat(node, 'slices');
        if (!(slices != null && !isNaN(slices) && slices >= 0)) {
            this.onXMLMinorError("Unable to parse slices of the node " + messageError + ". Ignoring Defbarrel!");
            return "Error";
        }

        let stacks = this.reader.getFloat(node, 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks >= 0)) {
            this.onXMLMinorError("Unable to parse stacks of the node " + messageError + ". Ignoring Defbarrel!");
            return "Error";
        }

        return new MyDefBarrel(this.scene, base, middle, height, slices, stacks);
    }

    /**
     * Verifies if there are any descendants with an nonexistent id and ignores them
     */
    verifyNodesExistance() {

        if (!this.nodes.has(this.idRoot)) {
            return "There isn't a root node with id " + this.idRoot + "!";
        }

        for (let [key, value] of this.nodes) {
            let descendants = value.getDescendants();
            let toEliminate = [];
            for (let j = 0; j < descendants.length; j++) {
                let descendant = descendants[j];
                if (descendant.type == "compost") {
                    if (!this.nodes.has(descendant.id)) {
                        this.onXMLMinorError("There isn't a node with id " + descendant.id + ". Ignoring it!");
                        toEliminate.push(j);
                    }
                }
            }
            for (let i = toEliminate.length - 1; i >= 0; i--) {
                descendants.splice(toEliminate[i], 1);
            }
        }

        return null;
    }

    /**
     * Parses Scale coordinates from a node transformation
     * @param {block element} node
     * @param {string} messageError message to be displayed in case of error
     */
    parseCoordinatesScale(node, messageError) {
        var position = [];

        //sx
        var sx = this.reader.getFloat(node, 'sx');
        if (!(sx != null && !isNaN(sx))) return "unable to parse sx-coordinate of the " + messageError;

        //sy
        var sy = this.reader.getFloat(node, 'sy');
        if (!(sy != null && !isNaN(sy))) return "unable to parse sy-coordinate of the " + messageError;

        //sz
        var sz = this.reader.getFloat(node, 'sz');
        if (!(sz != null && !isNaN(sz))) return "unable to parse sz-coordinate of the " + messageError;

        position.push(...[sx, sy, sz]);
        return position;
    }

    /**
     * Parses 3D coordinates from a node
     * @param {block element} node
     * @param {string} messageError message to be displayed in case of error
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        //x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x))) return "unable to parse x-coordinate of the " + messageError;

        //y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y))) return "unable to parse y-coordinate of the " + messageError;

        //z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z))) return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);
        return position;
    }

    /**
     * Parses 4D coordinates from a node
     * @param {block element} node
     * @param {string} messageError message to be displayed in case of error
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);
        if (!Array.isArray(position)) return position;

        //Get w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w))) return "unable to parse w-coordinate of the " + messageError;
        position.push(w);

        return position;
    }

    /**
     * Parses the color components from a node
     * @param {block element} node
     * @param {string} messageError message to be displayed in case of error
     */
    parseColor(node, messageError) {
        var color = [];

        //R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        //G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        //B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        //A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);
        return color;
    }

    /**
     * Parses a boolean from a node 
     * @param {node} node block element
     * @param {string} name
     * @param {string} messageError message to be displayed in case of error
     */
    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            return true;
        }
        return boolVal;
    }

    /**
     * Processes and displays the current node
     * @param {object} currentNode 
     * @param {string} mat id of parent's material
     * @param {string} text id of parent's texture
     */
    displayNodes(currentNode, mat, text) {
        this.scene.multMatrix(currentNode.getTransformation()); // aplies node's transformation  

        // Adicionar return 
        if (currentNode.getAnimation() != null) {
            let currentAnimation = this.animations.get(currentNode.getAnimation());
            currentAnimation.apply(this.scene);            // Applies node animation            
        }

        let textureID = currentNode.getTexture().id;
        let materialID = currentNode.getMaterial();

        //If the id of child texture is null, it inherits the texture from parent
        if (textureID == "null")
            textureID = text;

        //If the id of child material is null, it inherits the material from parent
        if (materialID == "null")
            materialID = mat;

        this.updateMaterialsAndTexture(materialID, textureID);

        let descendants = currentNode.getDescendants();

        for (let j = 0; j < descendants.length; j++) {
            let descendant = descendants[j];

            /*
            if the descendant is compost, displayNodes will be recursively called, 
            but at this time this descendant is the parent node.
            if it's a leaf, it will be displayed
            */
            if (descendant.type == "compost") {
                this.scene.pushMatrix();

                let message = this.displayNodes(this.nodes.get(descendant.id), materialID, textureID);
                if (typeof message == "string") return message;

                this.updateMaterialsAndTexture(materialID, textureID);

                this.scene.popMatrix();
            }
            else
                descendant.info.display();
        }
    }

    /**
     * Updates material and texture and applies them
     * @param {number} materialID 
     * @param {number} textureID  
     */
    updateMaterialsAndTexture(materialID, textureID) {
        if (materialID != "null") {
            let material = this.materials.get(materialID);
            material.setTexture(null);

            if (textureID != "clear") {
                var texture = this.textures.get(textureID);
                material.setTexture(texture);
            }

            material.apply(); //applies node's material
        } else { //material=null

            if (textureID != "clear") {
                var texture = this.textures.get(textureID);
                this.defaultMaterial.setTexture(texture);
            }
            this.defaultMaterial.apply();
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        let rootNode = this.nodes.get(this.idRoot);
        this.scene.pushMatrix()
        let message = this.displayNodes(rootNode, rootNode.material, rootNode.texture.id);
        this.scene.popMatrix()
        if (message != null) this.onXMLError(message);
    }
}