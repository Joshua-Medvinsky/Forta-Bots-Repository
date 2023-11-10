"use strict";
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
exports.provideRunFile = void 0;
var utils_1 = require("../../utils");
function provideRunFile(getAgentHandlers, getJsonFile, runHandlersOnBlock, runHandlersOnTransaction, runHandlersOnAlert, runSequence) {
    (0, utils_1.assertExists)(getAgentHandlers, 'getAgentHandlers');
    (0, utils_1.assertExists)(getJsonFile, 'getJsonFile');
    (0, utils_1.assertExists)(runHandlersOnBlock, 'runHandlersOnBlock');
    (0, utils_1.assertExists)(runHandlersOnTransaction, 'runHandlersOnTransaction');
    (0, utils_1.assertExists)(runHandlersOnAlert, 'runHandlersOnAlert');
    (0, utils_1.assertExists)(runSequence, 'runSequence');
    return function runFile(filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, handleBlock, handleTransaction, handleAlert, _b, transactionEvents, blockEvents, alertEvents, sequenceEvents, _i, blockEvents_1, blockEvent, findings, _c, transactionEvents_1, transactionEvent, findings, _d, alertEvents_1, alertEvent, findings, _e, sequenceEvents_1, sequence;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4, getAgentHandlers()];
                    case 1:
                        _a = _f.sent(), handleBlock = _a.handleBlock, handleTransaction = _a.handleTransaction, handleAlert = _a.handleAlert;
                        if (!handleBlock && !handleTransaction && !handleAlert) {
                            throw new Error("no block/transaction/alert handler found");
                        }
                        console.log('parsing file data...');
                        _b = getJsonFile(filePath), transactionEvents = _b.transactionEvents, blockEvents = _b.blockEvents, alertEvents = _b.alertEvents, sequenceEvents = _b.sequenceEvents;
                        if (!(handleBlock && (blockEvents === null || blockEvents === void 0 ? void 0 : blockEvents.length))) return [3, 7];
                        console.log('running block events...');
                        _i = 0, blockEvents_1 = blockEvents;
                        _f.label = 2;
                    case 2:
                        if (!(_i < blockEvents_1.length)) return [3, 7];
                        blockEvent = blockEvents_1[_i];
                        if (!(typeof blockEvent === 'string' || typeof blockEvent === 'number')) return [3, 4];
                        return [4, runHandlersOnBlock(blockEvent)];
                    case 3:
                        _f.sent();
                        return [3, 6];
                    case 4: return [4, handleBlock(blockEvent)];
                    case 5:
                        findings = _f.sent();
                        console.log("".concat(findings.length, " findings for block ").concat(blockEvent.hash, " ").concat(findings));
                        _f.label = 6;
                    case 6:
                        _i++;
                        return [3, 2];
                    case 7:
                        if (!(handleTransaction && (transactionEvents === null || transactionEvents === void 0 ? void 0 : transactionEvents.length))) return [3, 13];
                        console.log('running transaction events...');
                        _c = 0, transactionEvents_1 = transactionEvents;
                        _f.label = 8;
                    case 8:
                        if (!(_c < transactionEvents_1.length)) return [3, 13];
                        transactionEvent = transactionEvents_1[_c];
                        if (!(typeof transactionEvent === 'string')) return [3, 10];
                        return [4, runHandlersOnTransaction(transactionEvent)];
                    case 9:
                        _f.sent();
                        return [3, 12];
                    case 10: return [4, handleTransaction(transactionEvent)];
                    case 11:
                        findings = _f.sent();
                        console.log("".concat(findings.length, " findings for transaction ").concat(transactionEvent.transaction.hash, " ").concat(findings));
                        _f.label = 12;
                    case 12:
                        _c++;
                        return [3, 8];
                    case 13:
                        if (!(handleAlert && (alertEvents === null || alertEvents === void 0 ? void 0 : alertEvents.length))) return [3, 19];
                        console.log('running alert events...');
                        _d = 0, alertEvents_1 = alertEvents;
                        _f.label = 14;
                    case 14:
                        if (!(_d < alertEvents_1.length)) return [3, 19];
                        alertEvent = alertEvents_1[_d];
                        if (!(typeof alertEvent === 'string')) return [3, 16];
                        return [4, runHandlersOnAlert(alertEvent)];
                    case 15:
                        _f.sent();
                        return [3, 18];
                    case 16: return [4, handleAlert(alertEvent)];
                    case 17:
                        findings = _f.sent();
                        console.log("".concat(findings.length, " findings for alert ").concat(alertEvent.alert.hash, " ").concat(findings));
                        _f.label = 18;
                    case 18:
                        _d++;
                        return [3, 14];
                    case 19:
                        if (!(sequenceEvents === null || sequenceEvents === void 0 ? void 0 : sequenceEvents.length)) return [3, 23];
                        _e = 0, sequenceEvents_1 = sequenceEvents;
                        _f.label = 20;
                    case 20:
                        if (!(_e < sequenceEvents_1.length)) return [3, 23];
                        sequence = sequenceEvents_1[_e];
                        return [4, runSequence(sequence)];
                    case 21:
                        _f.sent();
                        _f.label = 22;
                    case 22:
                        _e++;
                        return [3, 20];
                    case 23: return [2];
                }
            });
        });
    };
}
exports.provideRunFile = provideRunFile;
