/**
 * Author:    3DPrintGen4Math
 * Created:   06.02.2024
 * 
 * Copyright License MIT
 **/

import { PerspectiveCamera } from "three";
import { Vector3 } from "three";
import { RenderDistance } from "../globalsSettings";

//Erstellen der camera
export let camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    RenderDistance
);

//Position/Einstellungen der Kamera
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 10;
camera.lookAt(new Vector3(0, 0, 0));
