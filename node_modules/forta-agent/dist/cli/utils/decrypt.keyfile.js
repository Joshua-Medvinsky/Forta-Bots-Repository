"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideDecryptKeyfile = void 0;
var fs_1 = __importDefault(require("fs"));
var keythereum = require("keythereum");
function provideDecryptKeyfile() {
    return function decryptKeyfile(keyfilePath, password) {
        var keyObject = JSON.parse(fs_1.default.readFileSync(keyfilePath).toString());
        return {
            publicKey: "0x".concat(keyObject.address),
            privateKey: "0x".concat(keythereum.recover(password, keyObject).toString('hex'))
        };
    };
}
exports.provideDecryptKeyfile = provideDecryptKeyfile;
