"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
function provideRun(container, ethersProvider, chainIds, jsonRpcUrl, isProduction, cache, args) {
    (0, utils_1.assertExists)(container, 'container');
    (0, utils_1.assertExists)(cache, 'cache');
    (0, utils_1.assertExists)(chainIds, 'chainIds');
    (0, utils_1.assertExists)(ethersProvider, "ethersProvider");
    (0, utils_1.assertExists)(args, 'args');
    return function run(runtimeArgs) {
        if (runtimeArgs === void 0) { runtimeArgs = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var network, runTransaction, runBlock, runAlert, runSequence, runBlockRange, runFile, runProdServer, runLive, isShortLived;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = __assign(__assign({}, args), runtimeArgs);
                        if (!!isProduction) return [3, 2];
                        return [4, ethersProvider.getNetwork()];
                    case 1:
                        network = _a.sent();
                        if (!network || !chainIds.includes(network.chainId))
                            console.warn("Warning: Detected chainId mismatch between ".concat(jsonRpcUrl, " [chainId: ").concat(network.chainId, "] and package.json [chainIds: ").concat(chainIds, "]. \n"));
                        _a.label = 2;
                    case 2:
                        if (!args.tx) return [3, 4];
                        runTransaction = container.resolve("runTransaction");
                        return [4, runTransaction(args.tx)];
                    case 3:
                        _a.sent();
                        return [3, 18];
                    case 4:
                        if (!args.block) return [3, 6];
                        runBlock = container.resolve("runBlock");
                        return [4, runBlock(args.block)];
                    case 5:
                        _a.sent();
                        return [3, 18];
                    case 6:
                        if (!args.alert) return [3, 8];
                        runAlert = container.resolve("runAlert");
                        return [4, runAlert(args.alert)];
                    case 7:
                        _a.sent();
                        return [3, 18];
                    case 8:
                        if (!args.sequence) return [3, 10];
                        runSequence = container.resolve("runSequence");
                        return [4, runSequence(args.sequence)];
                    case 9:
                        _a.sent();
                        return [3, 18];
                    case 10:
                        if (!args.range) return [3, 12];
                        runBlockRange = container.resolve("runBlockRange");
                        return [4, runBlockRange(args.range)];
                    case 11:
                        _a.sent();
                        return [3, 18];
                    case 12:
                        if (!args.file) return [3, 14];
                        runFile = container.resolve("runFile");
                        return [4, runFile(args.file)];
                    case 13:
                        _a.sent();
                        return [3, 18];
                    case 14:
                        if (!args.prod) return [3, 16];
                        runProdServer = container.resolve("runProdServer");
                        return [4, runProdServer()];
                    case 15:
                        _a.sent();
                        return [3, 18];
                    case 16:
                        runLive = container.resolve("runLive");
                        return [4, runLive()];
                    case 17:
                        _a.sent();
                        _a.label = 18;
                    case 18:
                        if (!("nocache" in args)) {
                            cache.save(true);
                        }
                        isShortLived = args.tx || args.block || args.range || args.file || args.alert || args.sequence;
                        if (isShortLived)
                            process.exit();
                        return [2];
                }
            });
        });
    };
}
exports.default = provideRun;
