"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
var bloom_filter_1 = require("./bloom.filter");
var label_1 = require("./label");
var Alert = (function () {
    function Alert(addresses, alertId, hash, contracts, createdAt, description, findingType, name, protocol, scanNodeCount, severity, alertDocumentType, relatedAlerts, chainId, labels, source, metadata, projects, addressBloomFilter) {
        this.addresses = addresses;
        this.alertId = alertId;
        this.hash = hash;
        this.contracts = contracts;
        this.createdAt = createdAt;
        this.description = description;
        this.findingType = findingType;
        this.name = name;
        this.protocol = protocol;
        this.scanNodeCount = scanNodeCount;
        this.severity = severity;
        this.alertDocumentType = alertDocumentType;
        this.relatedAlerts = relatedAlerts;
        this.chainId = chainId;
        this.labels = labels;
        this.source = source;
        this.metadata = metadata;
        this.projects = projects;
        this.addressBloomFilter = addressBloomFilter;
        this.addressFilter = addressBloomFilter
            ? new bloom_filter_1.BloomFilter(addressBloomFilter.m, addressBloomFilter.k, addressBloomFilter.bitset)
            : undefined;
    }
    Alert.prototype.hasAddress = function (address) {
        var _a;
        if (this.addressFilter) {
            return this.addressFilter.has(address);
        }
        if ((_a = this.addresses) === null || _a === void 0 ? void 0 : _a.length) {
            return this.addresses.includes(address);
        }
        return false;
    };
    Alert.prototype.toString = function () {
        return JSON.stringify(this, function (key, value) {
            if (key === "addressFilter")
                return undefined;
            return value;
        });
    };
    Alert.fromObject = function (_a) {
        var addresses = _a.addresses, alertId = _a.alertId, hash = _a.hash, contracts = _a.contracts, createdAt = _a.createdAt, description = _a.description, findingType = _a.findingType, name = _a.name, protocol = _a.protocol, scanNodeCount = _a.scanNodeCount, severity = _a.severity, alertDocumentType = _a.alertDocumentType, relatedAlerts = _a.relatedAlerts, chainId = _a.chainId, labels = _a.labels, source = _a.source, metadata = _a.metadata, projects = _a.projects, addressBloomFilter = _a.addressBloomFilter;
        labels = labels ? labels.map(function (l) { return label_1.Label.fromObject(l); }) : [];
        return new Alert(addresses, alertId, hash, contracts, createdAt, description, findingType, name, protocol, scanNodeCount, severity, alertDocumentType, relatedAlerts, chainId, labels, source, metadata, projects, addressBloomFilter);
    };
    return Alert;
}());
exports.Alert = Alert;
