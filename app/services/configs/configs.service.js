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
var ConfigsService = (function () {
    function ConfigsService(_http) {
        this._http = _http;
        this.url = global_1.globalVariables['base_api_url'];
    }
    ConfigsService.prototype.search = function (search, page, pagina, token, userowner, itemsPerPage, activeConfigScriptId, activeUserId) {
        if (search === void 0) { search = null; }
        if (page === void 0) { page = null; }
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json +
            "&authorization=" + token +
            "&items=" + itemsPerPage +
            "&activeConfigScriptId=" + activeConfigScriptId +
            "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (page == null) {
            page = 1;
        }
        var http;
        var cont;
        var cont1;
        if (search == null && pagina == null) {
            cont = "/configs/config";
        }
        if (search == null && pagina != null) {
            cont = "/configs/config?page=" + page;
        }
        if (search != null && pagina == null) {
            cont = "/configs/config/" + search;
        }
        if (search != null && pagina != null) {
            cont = "/configs/config/" + search + "?page=" + page;
        }
        // console.log(this.url+cont);
        // console.log(params);
        http = this._http.post(this.url + cont, params, { headers: headers }).map(function (res) { return res.json(); });
        return http;
    };
    ConfigsService.prototype.searchResources = function (token, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var http;
        http = this._http.post(this.url + "/configs/resources", params, { headers: headers }).map(function (res) { return res.json(); });
        return http;
    };
    ConfigsService.prototype.searchScripts = function (token) {
        token = encodeURIComponent(token);
        var json = JSON.stringify({ "": "" });
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var http;
        http = this._http.post(this.url + "/configs/scripts", params, { headers: headers }).map(function (res) { return res.json(); });
        return http;
    };
    ConfigsService.prototype.searchParameters = function (token, idScript) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(idScript);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var http;
        http = this._http.post(this.url + "/configs/parameters", params, { headers: headers }).map(function (res) { return res.json(); });
        return http;
    };
    ConfigsService.prototype.register = function (token, config_to_register, dataConfig, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(config_to_register);
        json = encodeURIComponent(json);
        dataConfig = encodeURIComponent(dataConfig);
        var jsonDataConfig = dataConfig;
        var params = "json=" + json + "&jsonDataConfig=" + jsonDataConfig + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        //		return this._http.post(this.url+"/configs/new", params, {headers: headers}).map(res => res.json());
        return this._http.post(this.url + "/configs/newduplicate/" + 1, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService.prototype.duplicate = function (token, config_to_update, dataConfig, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(config_to_update);
        json = encodeURIComponent(json);
        var jsonDataConfig = dataConfig;
        dataConfig = encodeURIComponent(dataConfig);
        var params = "json=" + json + "&jsonDataConfig=" + jsonDataConfig + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        //		return this._http.post(this.url+"/configs/duplicate", params, {headers: headers}).map(res => res.json());
        return this._http.post(this.url + "/configs/newduplicate/" + 2, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService.prototype.detail = function (token, userowner, id) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/configs/detail/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService.prototype.update = function (token, config_to_update, dataConfig, id, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(config_to_update);
        json = encodeURIComponent(json);
        dataConfig = encodeURIComponent(dataConfig);
        var jsonDataConfig = dataConfig;
        var params = "json=" + json + "&jsonDataConfig=" + jsonDataConfig + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/configs/update/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService.prototype.delete = function (token, id) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/configs/delete/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService.prototype.createTask = function (token, id, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/configs/createTask/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService.prototype.getConfigScriptNames = function (token, activeUserId) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token + "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/configs/getConfigScriptNames", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService.prototype.saveFavorites = function (token, configFavorites) {
        token = encodeURIComponent(token);
        var jsonConfigFavorites = JSON.stringify(configFavorites);
        var params = "authorization=" + token + "&jsonConfigFavorites=" + jsonConfigFavorites;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/configs/saveFavorites", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ConfigsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ConfigsService);
    return ConfigsService;
}());
exports.ConfigsService = ConfigsService;
//# sourceMappingURL=configs.service.js.map