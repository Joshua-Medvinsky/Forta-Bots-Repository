"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shelljs_1 = require("shelljs");
function provideAppendToFile() {
    return function appendToFile(msg, filename) {
        new shelljs_1.ShellString("".concat(msg, "\n")).toEnd(filename);
    };
}
exports.default = provideAppendToFile;
