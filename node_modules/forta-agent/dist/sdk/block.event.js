"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockEvent = void 0;
var BlockEvent = (function () {
    function BlockEvent(type, network, block) {
        this.type = type;
        this.network = network;
        this.block = block;
    }
    Object.defineProperty(BlockEvent.prototype, "blockHash", {
        get: function () {
            return this.block.hash;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BlockEvent.prototype, "blockNumber", {
        get: function () {
            return this.block.number;
        },
        enumerable: false,
        configurable: true
    });
    return BlockEvent;
}());
exports.BlockEvent = BlockEvent;
