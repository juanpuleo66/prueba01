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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var global_1 = require('../../global');
var QuerysService = (function () {
    function QuerysService(_http) {
        this._http = _http;
        this.url = global_1.globalVariables['base_api_url'];
    }
    QuerysService.prototype.searchQuerys = function (token, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/querys/querys", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    QuerysService.prototype.searchResources = function (token, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/querys/resources", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    QuerysService.prototype.searchLogs = function (token, userowner, id) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/querys/logs/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    QuerysService.prototype.addResources = function (token, dataJson) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(dataJson);
        json = encodeURIComponent(json);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/querys/addResource", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    QuerysService.prototype.executeQuery = function (token, dataJson) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(dataJson);
        json = encodeURIComponent(json);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/querys/execute", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    QuerysService.prototype.register = function (token, query_to_register, logs_to_register) {
        token = encodeURIComponent(token);
        var json1 = JSON.stringify(query_to_register);
        json1 = encodeURIComponent(json1);
        var json2 = JSON.stringify(logs_to_register);
        json2 = encodeURIComponent(json2);
        var params = "json1=" + json1 + "&json2=" + json2 + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (query_to_register.id == 0) {
            return this._http.post(this.url + "/querys/new", params, { headers: headers }).map(function (res) { return res.json(); });
        }
        else {
            return this._http.post(this.url + "/querys/update", params, { headers: headers }).map(function (res) { return res.json(); });
        }
    };
    QuerysService.prototype.delete = function (token, id) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/querys/delete/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    QuerysService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], QuerysService);
    return QuerysService;
}());
exports.QuerysService = QuerysService;
//# sourceMappingURL=querys.service.js.map