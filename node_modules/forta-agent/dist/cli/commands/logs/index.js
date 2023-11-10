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
exports.getNextMinute = exports.printLogToConsole = void 0;
var utils_1 = require("../../utils");
function provideLogs(agentId, getAgentLogs, args) {
    (0, utils_1.assertExists)(args, 'args');
    (0, utils_1.assertIsNonEmptyString)(agentId, "agentId");
    return function logs() {
        return __awaiter(this, void 0, void 0, function () {
            var cliAgentId, latestTimestamp, earliestTimestamp, finalAgentId, logs_1, earliestDateTime, latestDateTime, curMinute, logs_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cliAgentId = args.agentId;
                        latestTimestamp = args.before;
                        earliestTimestamp = args.after;
                        finalAgentId = cliAgentId ? cliAgentId : agentId;
                        if (!(!latestTimestamp && !earliestTimestamp)) return [3, 2];
                        return [4, getAgentLogs(finalAgentId)];
                    case 1:
                        logs_1 = _a.sent();
                        processLogs(logs_1);
                        return [3, 5];
                    case 2:
                        (0, utils_1.assertIsISOString)(latestTimestamp, "\'before\'");
                        (0, utils_1.assertIsISOString)(earliestTimestamp, "\'after\'");
                        earliestDateTime = new Date(Date.parse(earliestTimestamp));
                        latestDateTime = new Date(Date.parse(latestTimestamp));
                        if (!(0, utils_1.isValidTimeRange)(earliestDateTime, latestDateTime))
                            throw Error("Provided date range is invalid");
                        curMinute = earliestDateTime;
                        _a.label = 3;
                    case 3:
                        if (!curMinute) return [3, 5];
                        return [4, getAgentLogs(finalAgentId, curMinute)];
                    case 4:
                        logs_2 = _a.sent();
                        processLogs(logs_2);
                        curMinute = (0, exports.getNextMinute)(curMinute, latestDateTime);
                        return [3, 3];
                    case 5: return [2];
                }
            });
        });
    };
}
exports.default = provideLogs;
var processLogs = function (logs, scannerId) {
    if ((logs === null || logs === void 0 ? void 0 : logs.length) > 0) {
        logs.filter(function (log) { return !scannerId || log.scanner === scannerId; });
        logs.forEach(function (log) { return (0, exports.printLogToConsole)(log); });
    }
};
var printLogToConsole = function (log) {
    console.log("".concat(log.scanner, " - ").concat(log.timestamp));
    console.log('----------------------------------------------------------------- \n');
    console.log(log.logs);
};
exports.printLogToConsole = printLogToConsole;
var getNextMinute = function (curMinute, latestDateTime) {
    var nextMinute = new Date(curMinute.getTime() + (60 * 1000));
    return nextMinute <= latestDateTime ? nextMinute : undefined;
};
exports.getNextMinute = getNextMinute;
