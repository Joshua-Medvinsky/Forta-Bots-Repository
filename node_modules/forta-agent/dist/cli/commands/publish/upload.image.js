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
var utils_1 = require("../../utils");
function provideUploadImage(shell, imageRepositoryUrl, imageRepositoryUsername, imageRepositoryPassword, agentName, contextPath) {
    (0, utils_1.assertExists)(shell, 'shell');
    (0, utils_1.assertIsNonEmptyString)(imageRepositoryUrl, 'imageRepositoryUrl');
    (0, utils_1.assertIsNonEmptyString)(agentName, 'agentName');
    (0, utils_1.assertIsNonEmptyString)(contextPath, 'contextPath');
    return function uploadImage(runtimeArgs) {
        if (runtimeArgs === void 0) { runtimeArgs = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var imageTagSuffix, loginResult, imageTag, buildCommand, buildResult, tagResult, pushResult, digestLine, digestStartIndex, imageDigest, pullResult, cidLine, cidStartIndex, cidEndIndex, imageIpfsCid, imageReference;
            return __generator(this, function (_a) {
                imageTagSuffix = runtimeArgs.imageTagSuffix;
                shell.cd(contextPath);
                if (imageRepositoryUsername && imageRepositoryPassword) {
                    loginResult = shell.exec("docker login ".concat(imageRepositoryUrl, " -u ").concat(imageRepositoryUsername, " -p ").concat(imageRepositoryPassword));
                    (0, utils_1.assertShellResult)(loginResult, 'error authenticating with image repository');
                }
                console.log('building agent image...');
                imageTag = "".concat(agentName, "-intermediate").concat(imageTagSuffix ? "-".concat(imageTagSuffix) : '');
                buildCommand = "docker buildx build --load --platform linux/amd64 --tag ".concat(imageTag, " .");
                buildResult = shell.exec(buildCommand);
                (0, utils_1.assertShellResult)(buildResult, 'error building agent image');
                console.log('pushing agent image to repository...');
                tagResult = shell.exec("docker tag ".concat(imageTag, " ").concat(imageRepositoryUrl, "/").concat(imageTag));
                (0, utils_1.assertShellResult)(tagResult, 'error tagging agent image');
                pushResult = shell.exec("docker push ".concat(imageRepositoryUrl, "/").concat(imageTag));
                (0, utils_1.assertShellResult)(pushResult, 'error pushing agent image');
                digestLine = pushResult.grep('sha256').toString();
                digestStartIndex = digestLine.indexOf('sha256:') + 7;
                imageDigest = digestLine.substring(digestStartIndex, digestStartIndex + 64);
                pullResult = shell.exec("docker pull -a ".concat(imageRepositoryUrl, "/").concat(imageDigest));
                (0, utils_1.assertShellResult)(pullResult, 'error pulling tagged agent images');
                cidLine = pullResult.grep('bafy').toString();
                cidStartIndex = cidLine.indexOf('bafy');
                cidEndIndex = cidLine.indexOf(':', cidStartIndex);
                imageIpfsCid = cidLine.substring(cidStartIndex, cidEndIndex);
                imageReference = "".concat(imageIpfsCid, "@sha256:").concat(imageDigest);
                return [2, imageReference];
            });
        });
    };
}
exports.default = provideUploadImage;
