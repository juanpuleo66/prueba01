"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var global_1 = require('../../global');
var S3Service = (function () {
    function S3Service(_http) {
        this._http = _http;
        this.url = global_1.globalVariables['base_api_url'];
    }
    S3Service.prototype.searchResources = function (token, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/aws/resources", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    S3Service.prototype.listObjects = function (token, config) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(config);
        json = encodeURIComponent(json);
        var params = "params=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/aws/listObjects", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    S3Service.prototype.copyTo = function (token, config) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(config);
        json = encodeURIComponent(json);
        var params = "params=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/aws/copyTo", params, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    S3Service.prototype.moveTo = function (token, config) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(config);
        json = encodeURIComponent(json);
        var params = "params=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/aws/moveTo", params, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    S3Service = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], S3Service);
    return S3Service;
}());
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map