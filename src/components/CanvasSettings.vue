<script setup>
/**
 * Author:    3DPrintGen4Math
 * Created:   06.02.2024
 * 
 * Copyright License MIT
 **/

//Import Three
import { onMounted, onUnmounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//es werden nicht alle Lib von Three importiert sondern nur alle verwendeten.
import { Scene,WebGLRenderer,PointLight,AmbientLight } from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

//Import World
import { camera } from "./three/world/camera.js";

//Import Objects
import { axesHelper } from "./three/objects/axesHelper.js"
// import objdata from "../assets/model.obj"
import { lightIntensity, getMeshView, hexColor} from "./three/globalsSettings.js"
import { objBlob,make,getLen, getThickness, getSupport, getTriangleSize, getFactor, getSupportDistance, getSupportHeight} from "../dist/stlGenerator"

//Anlegen der Scene, in der gearbeitet wird
let scene = new Scene();

//Erstellen des Lichts
let pointLight = new PointLight( 0xffffff );
let light = new AmbientLight( 0x444444 );

//Einstellungen der Lichts
pointLight.position.set(0,0,0);
light.position.set(0,0,0);
pointLight.intensity = lightIntensity;
pointLight.castShadow = true;
light.castShadow = true;

//Hinzufügen aller Elemente in die Scene 
scene.add( light );
camera.add(pointLight);
scene.add(camera);
scene.add(axesHelper);

//Variablen für die Lokale verwendung 
let canvasRef = ref();
let renderer;
let controls;
let objLoader = new OBJLoader();
make(0.4, 10, "test", false, false, false, 0.2, 1, 20);

//generateOBJ lädt die ./assets/model.obj Datei. Muss auch zum neuladen des Obj aufgerufen werden
function generateOBJ() {
    make(getThickness(), getLen(), "test", false, getMeshView(), getSupport(), getTriangleSize(), getFactor(), getSupportHeight(), getSupportDistance());
    
    //laden des Obj
    var obj = objLoader.parse(objBlob);
    
    //Setzen der Farbe
    obj.traverse ( function (o) {
        if (o.isMesh) {
            o.material.color.set(hexColor);
        }
    });

    //Der name wird für das löschen des Obj gebraucht
    obj.name = "MyObject";
    scene.add(obj)
}

//setisUpdate und getisUpdate werden gebracht weil die updatefunktion generateOBJ nicht exportiert werden kann und daher auch nicht von außen aufgerufen wird
import { setisUpdate, getisUpdate } from "./three/globalsSettings.js"
let loop = () => {
    controls.update();
    renderer.render(scene, camera);
    //Check auf Update erforderlich
    if(getisUpdate() == true){
        //Löschen und neu laden des obj
        let selectedObject = scene.getObjectByName("MyObject");
        scene.remove( selectedObject );
        setisUpdate(false);
        generateOBJ();
    }
};

// -ab hier kommen alle Callbackfunktionen von Three.js
//Callback für die Größenveränderung des Fensters
let resizeCallback = () => {
    let container = document.getElementById("canvasContainer");
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

//Callback, onMounted wird einmal als Init function aufgerufen
onMounted(() => {
    generateOBJ();
    renderer = new WebGLRenderer({
        canvas: canvasRef.value,
        antialias: true,
        alpha: true,
    });

    //Setzt den Canvas in HTML div canvasContainer
    let container = document.getElementById("canvasContainer");

    //Einstellungen des Renderers
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(scene, camera);
    renderer.setAnimationLoop(loop);

    //Einstellungen zum bewegen der camera um 0,0,0
    controls = new OrbitControls(camera, canvasRef.value);
    controls.enableDamping = true;

    //Mounten der Callbackfunction resizeCallback
    window.addEventListener("resize", resizeCallback);
    
});

//wird beim entfernen des Canvas aufgerufen und wird eigentlich nicht verwendet.
onUnmounted(() => {
    renderer.setAnimationLoop(null);
    window.removeEventListener("resize", resizeCallback);
});

</script>

<template>
    <div id="canvasContainer">
        <canvas ref="canvasRef">

        </canvas>
    </div>
</template>

<style scoped></style>../scipts/modelLoader.js
