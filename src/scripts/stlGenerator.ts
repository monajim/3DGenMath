/**
 * Author:    3DPrintGen4Math
 * Created:   06.02.2024
 * 
 * Copyright License MIT
 **/

import * as parser from './parser';

//Strings welche alle Daten der Modelle enthalten
export let objBlob : string;
let stlBlob : string;

//Einstellungen
var TRIANGLE_COUNT      :number;
var ARRAY_SIZE          :number;
var THICKNESS           :number;
var TRIANGLE_SIZE       = 0.2;
var LEN                 :number;
var SUPPORTS            = false;
var PRINT_LEN           = "1:30";
var SUPPORT_HEIGHT      = -6;
var SUPPORT_DISTANCE    = 2;

class Vertex {
    private x = 0.0;
    private y = 0.0;
    private z = 0.0;

    public getX() : number {
        return this.x;
    }

    public setX(pX : number) {
        this.x = pX;
    }

    public getY() : number {
        return this.y;
    }

    public setY(pY : number) {
        this.y = pY;
    }

    public getZ() : number {
        return this.z;
    }

    public setZ(pZ : number) {
        this.z = pZ;
    }
}

class Triangle {
    private v1 = new Vertex();
    private v2 = new Vertex();
    private v3 = new Vertex();

    public getV1() : Vertex {
        return this.v1;
    }

    public setV1(pV1 : Vertex) {
        this.v1 = pV1;
    }

    public getV2() : Vertex {
        return this.v2;
    }

    public setV2(pV2 : Vertex) {
        this.v2 = pV2;
    }

    public getV3() : Vertex {
        return this.v3;
    }
    
    public setV3(pV3 : Vertex) {
        this.v3 = pV3;
    }

    //Ueberpruefen ob das Dreieck leer ist und somit geloescht werden kann um Speicher zu sparen
    public isZero() : boolean {
        return (this.v1.getX() == 0 && this.v1.getY() == 0 && this.v1.getZ() == 0 && this.v2.getX() == 0 && this.v2.getY() == 0 && this.v2.getZ() == 0 && this.v3.getX() == 0 && this.v3.getY() == 0 && this.v3.getZ() == 0);
    }

    //Methode um das Dreieck in der richtigen Form in den STL string zu schreiben
    public printToFile() {
        (stlBlob += "facet normal 0 0 0\n\t\touter loop\n\t\t\tvertex " + this.v1.getX() + " " + this.v1.getY() + " " + this.v1.getZ() + "\n");
        (stlBlob += "\t\t\tvertex " + this.v2.getX() + " " + this.v2.getY() + " " + this.v2.getZ() + "\n");
        (stlBlob += "\t\t\tvertex " + this.v3.getX() + " " + this.v3.getY() + " " + this.v3.getZ() + "\n");
        (stlBlob += "\t\tendloop\n\tendfacet\n");
    }

    //Methode um das Dreieck in der richtigen Form in den OBJ string zu schreiben
    public printToObj(index: number, wireframe : boolean) {
        (objBlob += "v " + this.v3.getX() + " " + this.v3.getZ() + " " + this.v3.getY() + "\n");
        (objBlob += "v " + this.v2.getX() + " " + this.v2.getZ() + " " + this.v2.getY() + "\n");
        (objBlob += "v " + this.v1.getX() + " " + this.v1.getZ() + " " + this.v1.getY() + "\n");
        if (wireframe) {
            (objBlob += "l " + (index + 1) + " " + (index + 2) + " " + (index + 3) + "\n");
            return;
        }
        (objBlob += "f " + (index + 1) + " " + (index + 2) + " " + (index + 3) + "\n");
    }
}

let triangles : Triangle[] = [];

//Function welche 2 mal aufgerufen wird, somit wird das Modell 2 mal generiert, einmal auf der Z Achse nach oben verschoben und einmal nach unten; somit erzeugen wir die Ober- und Unterseite des Modells
function generateSTL(thickness: number) {
    let triangleIndex = 0;
    if (thickness != 0.0) {
        triangleIndex = TRIANGLE_COUNT / 2;
    }
    else {
        thickness = THICKNESS / 2 * -1.0;
    }
    
    //For Schleifen in denen wir die Koordinaten der Dreiecke berechnen und in einem Array speichern
    for (let i = LEN * -1; i < LEN; i++) {
        for (let j = LEN * -1; j < LEN; j++, triangleIndex++) {
            let x = i * TRIANGLE_SIZE;
            let y = j * TRIANGLE_SIZE;

            let height = parser.default.surface_function(x, y);
            let heightR = parser.default.surface_function(x + TRIANGLE_SIZE, y);
            let heightT = parser.default.surface_function(x, y + TRIANGLE_SIZE);
            let heightD = parser.default.surface_function(x + TRIANGLE_SIZE, y + TRIANGLE_SIZE);

            let v1 = new Vertex();
            let v2 = new Vertex();
            let v3 = new Vertex();

            v1.setX(x);
            v1.setY(y);
            v1.setZ(height + thickness);

            v2.setX(x + TRIANGLE_SIZE);
            v2.setY(y);
            v2.setZ(heightR + thickness);

            v3.setX(x);
            v3.setY(y + TRIANGLE_SIZE);
            v3.setZ(heightT + thickness);

            let v4 = new Vertex();

            v4.setX(x + TRIANGLE_SIZE);
            v4.setY(y + TRIANGLE_SIZE);
            v4.setZ(heightD + thickness);

            let t1 = new Triangle();
            let t2 = new Triangle();

            //Differenzierung ob wir an der Ober- oder Unterseite arbeiten, und Anpassung der Rotation des Dreiecks
            if (triangleIndex < TRIANGLE_COUNT / 2) {
                t1.setV1(v3);
                t1.setV2(v2);
                t1.setV3(v1);

                t2.setV1(v2);
                t2.setV2(v3);
                t2.setV3(v4);
            } else {
                t1.setV1(v1);
                t1.setV2(v2);
                t1.setV3(v3);

                t2.setV1(v4);
                t2.setV2(v3);
                t2.setV3(v2);
            }
            triangles[triangleIndex] = t1;
            triangleIndex++;
            triangles[triangleIndex] = t2;
        }
    }
}

//Function die mit 4 For Schleifen die Seiten des Modells entlang iteriert und die Seiten dabei schliesst
function addSides() {
    let maxX = LEN * TRIANGLE_SIZE; 
    let maxY = maxX;
    let minX = maxX * -1;
    let minY = minX;

    let counter = 0;

    for (let i = 0; i < LEN * 2; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = maxX;
        let y = maxY - (TRIANGLE_SIZE * i);

        v1.setX(x);
        v1.setY(y);
        v1.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) + THICKNESS / 2);

        v3.setX(x);
        v3.setY(y - TRIANGLE_SIZE);
        v3.setZ(parser.default.surface_function(x, y - TRIANGLE_SIZE) - THICKNESS / 2);

        v4.setX(x);
        v4.setY(y - TRIANGLE_SIZE);
        v4.setZ(parser.default.surface_function(x, y - TRIANGLE_SIZE) + THICKNESS / 2);

        t.setV1(v1);
        t.setV2(v2);
        t.setV3(v3);

        triangles[ARRAY_SIZE - (counter + 1)] = t;
        counter++;

        t1.setV1(v4);
        t1.setV2(v3);
        t1.setV3(v2);

        triangles[ARRAY_SIZE - (counter + 1)] = t1;
        counter++;
    }

    for (let i = 0; i < LEN * 2; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = minX;
        let y = minY + (TRIANGLE_SIZE * i);

        v1.setX(x);
        v1.setY(y);
        v1.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) + THICKNESS / 2);

        v3.setX(x);
        v3.setY(y + TRIANGLE_SIZE);
        v3.setZ(parser.default.surface_function(x, y + TRIANGLE_SIZE) - THICKNESS / 2);

        v4.setX(x);
        v4.setY(y + TRIANGLE_SIZE);
        v4.setZ(parser.default.surface_function(x, y + TRIANGLE_SIZE) + THICKNESS / 2);

        t.setV1(v1);
        t.setV2(v2);
        t.setV3(v3);

        triangles[ARRAY_SIZE - (counter + 1)] = t;
        counter++;

        t1.setV1(v4);
        t1.setV2(v3);
        t1.setV3(v2);

        triangles[ARRAY_SIZE - (counter + 1)] = t1;
        counter++;
    }

    for (let i = 0; i < LEN * 2; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = maxX - (TRIANGLE_SIZE * i);
        let y = maxY;

        v1.setX(x);
        v1.setY(y);
        v1.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) + THICKNESS / 2);

        v3.setX(x - TRIANGLE_SIZE);
        v3.setY(y);
        v3.setZ(parser.default.surface_function(x - TRIANGLE_SIZE, y) - THICKNESS / 2);

        v4.setX(x - TRIANGLE_SIZE);
        v4.setY(y);
        v4.setZ(parser.default.surface_function(x - TRIANGLE_SIZE, y) + THICKNESS / 2);

        t.setV1(v3);
        t.setV2(v2);
        t.setV3(v1);

        triangles[ARRAY_SIZE - (counter + 1)] = t;
        counter++;

        t1.setV1(v2);
        t1.setV2(v3);
        t1.setV3(v4);

        triangles[ARRAY_SIZE - (counter + 1)] = t1;
        counter++;
    }

    for (let i = 0; i < LEN * 2; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = minX + (TRIANGLE_SIZE * i);
        let y = minY;

        v1.setX(x);
        v1.setY(y);
        v1.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) + THICKNESS / 2);

        v3.setX(x + TRIANGLE_SIZE);
        v3.setY(y);
        v3.setZ(parser.default.surface_function(x + TRIANGLE_SIZE, y) - THICKNESS / 2);

        v4.setX(x + TRIANGLE_SIZE);
        v4.setY(y);
        v4.setZ(parser.default.surface_function(x + TRIANGLE_SIZE, y) + THICKNESS / 2);

        t.setV1(v3);
        t.setV2(v2);
        t.setV3(v1);

        triangles[ARRAY_SIZE - (counter + 1)] = t;
        counter++;

        t1.setV1(v2);
        t1.setV2(v3);
        t1.setV3(v4);

        triangles[ARRAY_SIZE - (counter + 1)] = t1;
        counter++;
    }
}

//Alle Dreiecke werden im STL Format in unserem String gespeichert
function printAllTriangles() {
    for (let i = 0; i < ARRAY_SIZE; i++) {

        if (triangles[i].isZero()) {
                continue;
        }

        triangles[i].printToFile();
    }
}

//Alle Dreiecke werden im OBJ Format in unserem String gespeichert
function makeOBJ(wireframe: boolean) {
    let counter: number = 0;
    objBlob += "usemtl mtl.mtl\n";
    for (let i = 0; i < ARRAY_SIZE; i++) {

        if (triangles[i].isZero()) {
            continue;
        }

        triangles[i].printToObj(counter, wireframe);
        counter += 3;
    }
}

//Initialisierung des Arrays mit leeren Dreiecken
function fillArray() {
    for (let i = 0; i < ARRAY_SIZE; i++) {
        let t = new Triangle();
        triangles[i] = t;
    }
}

//Funktion welche alle noetigen Funktionen aufruft um das Modell zu erzeugen
function makeSTL(supports: boolean) {
    (stlBlob += "solid model\n");

    fillArray();
    generateSTL(0.0);
    generateSTL(THICKNESS / 2);
    addSides();
    if (supports) {
        generateSupports();
    }
    printAllTriangles();

    (stlBlob += "endsolid model");
}

//Diese Funktionen initieren den Download der STL und OBJ Datei
function saveStl(fileName: string) {
    let bb = new Blob([stlBlob], {type: 'text/plain'});
    let a = document.createElement('a');
    a.download = fileName + ".stl";
    a.href = window.URL.createObjectURL(bb);
    a.click();
}

function saveObj(fileName: string) {
    let bb = new Blob([objBlob], {type: 'text/plain'});
    let a = document.createElement('a');
    a.download = fileName + ".obj";
    a.href = window.URL.createObjectURL(bb);
    a.click();
}

//Helper Funktion um den naechsten Index im Array zu finden welcher noch leer ist
function getNextZeroIndex() : number {
    for (let i = 0; i < ARRAY_SIZE; i++) {
        if (triangles[i].isZero()) {
            return i;
        }
    }
    return 0;
}

//Funktion mit welcher wir eine Support stelle generieren mit Nullpunkt auf x|y und mit breite width
function makeOneSupportLeg(x : number, y : number, width : number) {
    let supportHeight = SUPPORT_HEIGHT * -1;
    let gt1 = new Triangle();
    let gt2 = new Triangle();

    let v11 = new Vertex();
    let v12 = new Vertex();
    let v13 = new Vertex();
    let v14 = new Vertex();

    v11.setX(x);
    v11.setY(y);
    v11.setZ(supportHeight);

    v12.setX(x + width);
    v12.setY(y);
    v12.setZ(supportHeight);

    v13.setX(x);
    v13.setY(y + width);
    v13.setZ(supportHeight);

    gt1.setV1(v13);
    gt1.setV2(v12);
    gt1.setV3(v11);

    v14.setX(x + width);
    v14.setY(y + width);
    v14.setZ(supportHeight);

    gt2.setV1(v12);
    gt2.setV2(v13);
    gt2.setV3(v14);
    triangles[getNextZeroIndex()] = gt1;
    triangles[getNextZeroIndex()] = gt2;

    let maxX = x + width;
    let maxY = y + width;
    let minX = x;
    let minY = y;

    for (let i = 0; i < width / TRIANGLE_SIZE; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = maxX;
        let y = maxY - (TRIANGLE_SIZE * i);

        v1.setX(x);
        v1.setY(y);
        v1.setZ(supportHeight);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v3.setX(x);
        v3.setY(y - TRIANGLE_SIZE);
        v3.setZ(supportHeight);

        v4.setX(x);
        v4.setY(y - TRIANGLE_SIZE);
        v4.setZ(parser.default.surface_function(x, y - TRIANGLE_SIZE) - THICKNESS / 2);

        t.setV1(v1);
        t.setV2(v2);
        t.setV3(v3);

        triangles[getNextZeroIndex()] = t;

        t1.setV1(v4);
        t1.setV2(v3);
        t1.setV3(v2);

        triangles[getNextZeroIndex()] = t1;
    }

    for (let i = 0; i < width / TRIANGLE_SIZE; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = minX + (i * TRIANGLE_SIZE);
        let y = minY;

        v1.setX(x);
        v1.setY(y);
        v1.setZ(supportHeight);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v3.setX(x + TRIANGLE_SIZE);
        v3.setY(y);
        v3.setZ(supportHeight);

        v4.setX(x + TRIANGLE_SIZE);
        v4.setY(y);
        v4.setZ(parser.default.surface_function(x + TRIANGLE_SIZE, y) - THICKNESS / 2);

        t.setV1(v3);
        t.setV2(v2);
        t.setV3(v1);

        triangles[getNextZeroIndex()] = t;

        t1.setV1(v2);
        t1.setV2(v3);
        t1.setV3(v4);

        triangles[getNextZeroIndex()] = t1;
    }

    for (let i = 0; i < width / TRIANGLE_SIZE; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = minX;
        let y = minY + (TRIANGLE_SIZE * i);

        v1.setX(x);
        v1.setY(y);
        v1.setZ(supportHeight);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v3.setX(x);
        v3.setY(y + TRIANGLE_SIZE);
        v3.setZ(supportHeight);

        v4.setX(x);
        v4.setY(y + TRIANGLE_SIZE);
        v4.setZ(parser.default.surface_function(x, y + TRIANGLE_SIZE) - THICKNESS / 2);

        t.setV1(v1);
        t.setV2(v2);
        t.setV3(v3);

        triangles[getNextZeroIndex()] = t;

        t1.setV1(v4);
        t1.setV2(v3);
        t1.setV3(v2);

        triangles[getNextZeroIndex()] = t1;
    }

    for (let i = 0; i < width / TRIANGLE_SIZE; i++) {
        let t = new Triangle();
        let t1 = new Triangle();
        let v1 = new Vertex();
        let v2 = new Vertex();
        let v3 = new Vertex();
        let v4 = new Vertex();
        let x = maxX - (i * TRIANGLE_SIZE);
        let y = maxY;

        v1.setX(x);
        v1.setY(y);
        v1.setZ(supportHeight);

        v2.setX(x);
        v2.setY(y);
        v2.setZ(parser.default.surface_function(x, y) - THICKNESS / 2);

        v3.setX(x - TRIANGLE_SIZE);
        v3.setY(y);
        v3.setZ(supportHeight);

        v4.setX(x - TRIANGLE_SIZE);
        v4.setY(y);
        v4.setZ(parser.default.surface_function(x - TRIANGLE_SIZE, y) - THICKNESS / 2);

        t.setV1(v3);
        t.setV2(v2);
        t.setV3(v1);

        triangles[getNextZeroIndex()] = t;

        t1.setV1(v2);
        t1.setV2(v3);
        t1.setV3(v4);

        triangles[getNextZeroIndex()] = t1;
    }
}

//Eine allgemeine Verteilung von Stuetzstrukturen an der Unterseite des Modells
function generateSupports() {
    let maxCounter = SUPPORT_DISTANCE;
    let counter = maxCounter;
    let counter1 = maxCounter;
    for (let i = LEN * TRIANGLE_SIZE * -1; i < LEN * TRIANGLE_SIZE; i++) {
        if (counter1 == maxCounter) {
            for (let j = LEN * TRIANGLE_SIZE * -1; j < LEN * TRIANGLE_SIZE; j++) {
                if (counter == maxCounter) {
                    makeOneSupportLeg(i, j, TRIANGLE_SIZE * 4);
                    counter = 0;
                    continue;
                }
                counter++; 
            }
            counter1 = 0;
            continue;
        }
        counter1++;
    }
}

export function setThickness(t : number) {
    THICKNESS = t;
}

export function setLen(t : number) {
    LEN = t / TRIANGLE_SIZE / 2;
}

export function setSupport(t : boolean) {
    SUPPORTS = t;
}

export function getSupport() : boolean {
    return SUPPORTS;
}

export function getThickness() : number {
    return THICKNESS;
}

export function getLen() : number {
    return LEN * TRIANGLE_SIZE * 2;
}

export function getTriangleSize() : number {
    return TRIANGLE_SIZE;
}

export function getFactor() : number {
    return parser.default.getFactor();
}

export function getPrintLen() : string {
    return PRINT_LEN;
}

export function getSupportHeight() : number {
    return SUPPORT_HEIGHT;
}

export function getSupportDistance() : number {
    return SUPPORT_DISTANCE;
}

export function setSupportDistance(d : number) {
    SUPPORT_DISTANCE = d;
}

export function setFactor(f : number) {
    parser.default.setFactor(f);
}

export function setTriangleSize(s : number) {
    if (s == 0) {
        return;
    }
    TRIANGLE_SIZE = s;
}

export function setSupportHeight(h : number) {
    SUPPORT_HEIGHT = h;
}

//Exportierte Funktion welche von der UI aufgerufen wird um das Modell zu erzeugen und evtl. zu downloaden
export function make(th: number, l: number, name: string, save: boolean, wireframe: boolean, supports: boolean, triangleSize: number, factor: number, supportHeight: number, supportDistance: number) {
    if (triangleSize == 0) {
        return;
    }
    stlBlob = "";
    objBlob = "";
    parser.default.setFactor(factor);
    TRIANGLE_SIZE = triangleSize;
    LEN = l / TRIANGLE_SIZE / 2;
    TRIANGLE_COUNT = (LEN * 4) * (LEN * 4);
    THICKNESS = th;
    ARRAY_SIZE = TRIANGLE_COUNT * 4;
    SUPPORTS = supports;
    SUPPORT_HEIGHT = supportHeight;
    SUPPORT_DISTANCE = supportDistance;

    if (l + th > 13) {
        PRINT_LEN = "> 1";
    }
    else {
        PRINT_LEN = "ca. 0:30";
    }
    
    makeSTL(SUPPORTS);
    makeOBJ(wireframe);
    if (save) {
        saveObj(name);
        saveStl(name);
    }
}
