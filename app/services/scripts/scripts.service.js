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
var ScriptsService = (function () {
    function ScriptsService(_http) {
        this._http = _http;
        this.url = global_1.globalVariables['base_api_url'];
    }
    ScriptsService.prototype.search = function (search, page, pagina, token, userowner, items, activeUserId) {
        if (search === void 0) { search = null; }
        if (page === void 0) { page = null; }
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token + "&items=" + items + "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (page == null) {
            page = 1;
        }
        var http;
        var cont;
        var cont1;
        if (search == null && pagina == null) {
            cont = "/scripts/script";
        }
        if (search == null && pagina != null) {
            cont = "/scripts/script?page=" + page;
        }
        if (search != null && pagina == null) {
            cont = "/scripts/script/" + search;
        }
        if (search != null && pagina != null) {
            cont = "/scripts/script/" + search + "?page=" + page;
        }
        http = this._http.post(this.url + cont, params, { headers: headers }).map(function (res) { return res.json(); });
        return http;
    };
    ScriptsService.prototype.detail = function (token, userowner, id, tp) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/scripts/detail/" + id + "/" + tp, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ScriptsService.prototype.update = function (token, script_to_update, contParam, id, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(script_to_update);
        var jsonContParam = encodeURIComponent(contParam);
        var params = "json=" + json + "&jsonContParam=" + jsonContParam + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/scripts/update/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ScriptsService.prototype.register = function (token, script_to_register, contParam, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(script_to_register);
        var jsonContParam = encodeURIComponent(contParam);
        var params = "json=" + json + "&jsonContParam=" + contParam + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/scripts/new", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ScriptsService.prototype.delete = function (token, id, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/scripts/delete/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ScriptsService.prototype.saveFavorites = function (token, scriptFavorites) {
        token = encodeURIComponent(token);
        var jsonScriptFavorites = JSON.stringify(scriptFavorites);
        var params = "authorization=" + token + "&jsonScriptFavorites=" + jsonScriptFavorites;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/scripts/saveFavorites", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ScriptsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ScriptsService);
    return ScriptsService;
}());
exports.ScriptsService = ScriptsService;
//# sourceMappingURL=scripts.service.js.map