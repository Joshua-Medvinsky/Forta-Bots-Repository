"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloomFilter = void 0;
var murmurhash3js_1 = __importDefault(require("murmurhash3js"));
var base64_arraybuffer_1 = require("base64-arraybuffer");
var BloomFilter = (function () {
    function BloomFilter(m, k, base64Data) {
        this.m = m;
        this.k = k;
        this.base64Data = base64Data;
        if (typeof this.m === "string") {
            this.m = Number(this.m);
        }
        if (typeof this.k === "string") {
            this.k = Number(this.k);
        }
        this.bitSet = undefined;
    }
    BloomFilter.prototype.has = function (key) {
        if (this.bitSet == undefined) {
            this.bitSet = new BitSet(Number(this.m), this.base64Data);
        }
        var indices = this.getIndices(key);
        for (var i = 0; i < indices.length; i++) {
            if (!this.bitSet.has(indices[i])) {
                return false;
            }
        }
        return true;
    };
    BloomFilter.prototype.getIndices = function (key) {
        var indices = [];
        var baseHashes = this.getBaseHashes(key);
        for (var i = 0; i < this.k; i++) {
            var ii = BigInt(i);
            var a = baseHashes[Number(ii % BigInt(2))];
            var b = (ii + (ii % BigInt(2))) % BigInt(4);
            var c = BigInt(2) + b / BigInt(2);
            var d = BigInt.asUintN(64, ii * baseHashes[Number(c)]);
            var location_1 = BigInt.asUintN(64, a + d);
            indices.push(Number(location_1 % BigInt(this.m)));
        }
        return indices;
    };
    BloomFilter.prototype.getBaseHashes = function (key) {
        var keyBuffer = Buffer.from(key);
        var hash1 = murmurhash3js_1.default.x64.hash128(key);
        var val1 = Buffer.from(hash1.substring(0, 16), "hex").readBigUInt64BE();
        var val2 = Buffer.from(hash1.substring(16), "hex").readBigUInt64BE();
        var hash2 = murmurhash3js_1.default.x64.hash128(Buffer.concat([keyBuffer, Buffer.from([1])]).toString());
        var val3 = Buffer.from(hash2.substring(0, 16), "hex").readBigUInt64BE();
        var val4 = Buffer.from(hash2.substring(16), "hex").readBigUInt64BE();
        return [val1, val2, val3, val4];
    };
    return BloomFilter;
}());
exports.BloomFilter = BloomFilter;
var BitSet = (function () {
    function BitSet(m, base64Data) {
        this.m = m;
        this.base64Data = base64Data;
        var buffer = (0, base64_arraybuffer_1.decode)(base64Data).slice(8 * 3);
        var dataView = new DataView(buffer);
        var arrayLength = Math.ceil(this.m / 64);
        this.data = new BigUint64Array(arrayLength);
        for (var i = 0; i < arrayLength; i++) {
            this.data[i] = dataView.getBigUint64(8 * i, false);
        }
    }
    BitSet.prototype.has = function (index) {
        var wordIndex = index >> 6;
        var wordsIndexI = index & (64 - 1);
        var mask = BigInt(Math.pow(2, wordsIndexI));
        var word = this.data[wordIndex];
        return (word & mask) !== BigInt(0);
    };
    return BitSet;
}());
