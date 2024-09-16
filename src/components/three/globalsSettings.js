/**
 * Author:    3DPrintGen4Math
 * Created:   06.02.2024
 * 
 * Copyright License MIT
 **/

//In dieser Datei werden Globale einstellungen von Three.js an einem Ort vestgelegt. So sind spätere "Feinanpassungen" leichter zu machen.

//  -World
//Camera. Stellt ein, wie weit gerendert wird
export let RenderDistance = 50000;

//  -Object
//Größe/Länge der Axes
export let axesSize = 500;

//light. Stellt die Helligkeit des Lichts ein.
export let lightIntensity = 50;

//Obj-Model-Settings 
//meshView wird verwendet um zwischen Solid und Grid View zu wechseln
export let meshView = false; // Use a local variable to hold the value
//Setzt die Farbe des Obj
export let hexColor = 0x0fffff;

export function setHexColor(value) {
  hexColor = value;
  setisUpdate(true);
}

//Update. Variable um ein update der generateObj Funktion zu triggern 
let isUpdate = false;

//Getter und Setter für isUpdate
export function setisUpdate(value){
  isUpdate = value;
}
export function getisUpdate() {
  return isUpdate;
}

// Exported function to modify _meshView
export function setMeshView(value) {
  meshView = value;
  setisUpdate(true);
}

// Getter to access the current value of _meshView
export function getMeshView() {
  return meshView;
}
