/**
 * Author:    3DPrintGen4Math
 * Created:   06.02.2024
 * 
 * Copyright License MIT
 **/

//Diese Datei ist dafuer zustaendig den Parser zu importieren, zu konfigurieren und die eingegebene Mathematische Funktion aufzurufen

const Parser = require('expr-eval').Parser;
var FACTOR          = 1.0;

const _ = {
    setExpr,
    surface_function,
    getFactor,
    setFactor
}

const parser = new Parser();
let expr = parser.parse('cos x * cos y')

export function setExpr(pExpr: string)
{
    try {
        expr = parser.parse(pExpr);
    } catch(error) {
        console.warn("Parse error " + error);
    }
}

function setFactor(f: number) {
    FACTOR = f;
}

function getFactor() {
    return FACTOR;
}

function surface_function(x : number, y : number) : number {
    return expr.evaluate({x : x, y : y}) / FACTOR;
}

export default _;
