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
exports.provideRunHandlersOnTransaction = void 0;
var _1 = require(".");
function provideRunHandlersOnTransaction(getAgentHandlers, getNetworkId, getTransactionReceipt, getBlockWithTransactions, getTraceData, createTransactionEvent) {
    (0, _1.assertExists)(getAgentHandlers, 'getAgentHandlers');
    (0, _1.assertExists)(getNetworkId, 'getNetworkId');
    (0, _1.assertExists)(getTransactionReceipt, 'getTransactionReceipt');
    (0, _1.assertExists)(getBlockWithTransactions, 'getBlockWithTransactions');
    (0, _1.assertExists)(getTraceData, 'getTraceData');
    (0, _1.assertExists)(createTransactionEvent, 'createTransactionEvent');
    return function runHandlersOnTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var handleTransaction, _a, networkId, receipt, traces, block, transaction, txEvent, findings;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, getAgentHandlers()];
                    case 1:
                        handleTransaction = (_b.sent()).handleTransaction;
                        if (!handleTransaction) {
                            throw new Error("no transaction handler found");
                        }
                        return [4, Promise.all([
                                getNetworkId(),
                                getTransactionReceipt(txHash),
                                getTraceData(txHash)
                            ])];
                    case 2:
                        _a = _b.sent(), networkId = _a[0], receipt = _a[1], traces = _a[2];
                        return [4, getBlockWithTransactions(parseInt(receipt.blockNumber))];
                    case 3:
                        block = _b.sent();
                        txHash = txHash.toLowerCase();
                        transaction = block.transactions.find(function (tx) { return tx.hash.toLowerCase() === txHash; });
                        txEvent = createTransactionEvent(transaction, block, networkId, traces, receipt.logs);
                        return [4, handleTransaction(txEvent)];
                    case 4:
                        findings = _b.sent();
                        (0, _1.assertFindings)(findings);
                        console.log("".concat(findings.length, " findings for transaction ").concat(txHash, " ").concat(findings));
                        return [2, findings];
                }
            });
        });
    };
}
exports.provideRunHandlersOnTransaction = provideRunHandlersOnTransaction;
