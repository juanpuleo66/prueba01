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
var ResourcesService = (function () {
    function ResourcesService(_http) {
        this._http = _http;
        this.url = global_1.globalVariables['base_api_url'];
    }
    ResourcesService.prototype.register = function (token, resource_to_register, contAttri, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(resource_to_register);
        json = encodeURIComponent(json);
        var jsonContAttri = encodeURIComponent(contAttri);
        var params = "json=" + json + "&jsonContAttri=" + jsonContAttri + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/resources/new", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.searchPlatforms = function (token) {
        token = encodeURIComponent(token);
        var json = JSON.stringify({ "": "" });
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var http;
        return this._http.post(this.url + "/resources/platforms", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.searchInstances = function (token, bid) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(bid);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var http;
        return this._http.post(this.url + "/resources/instances", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.searchAttributes = function (token, cid) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(cid);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var http;
        return this._http.post(this.url + "/resources/attributes", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.search = function (search, page, pagina, token, userowner, itemsPerPage, activeResourcePlatformId, activeResourceInstanceId, activeUserId) {
        if (search === void 0) { search = null; }
        if (page === void 0) { page = null; }
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json +
            "&authorization=" + token +
            "&items=" + itemsPerPage +
            "&activeResourcePlatformId=" + activeResourcePlatformId +
            "&activeResourceInstanceId=" + activeResourceInstanceId +
            "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (page == null) {
            page = 1;
        }
        var http;
        var cont;
        var cont1;
        if (search == null && pagina == null) {
            cont = "/resources/resource";
        }
        if (search == null && pagina != null) {
            cont = "/resources/resource?page=" + page;
        }
        if (search != null && pagina == null) {
            cont = "/resources/resource/" + search;
        }
        if (search != null && pagina != null) {
            cont = "/resources/resource/" + search + "?page=" + page;
        }
        // console.log(this.url+cont);				
        // console.log(params);				
        return this._http.post(this.url + cont, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.detail = function (token, userowner, id) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/resources/detail/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.update = function (token, resource_to_update, contAttri, id, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(resource_to_update);
        json = encodeURIComponent(json);
        var jsonContAttri = encodeURIComponent(contAttri);
        var params = "json=" + json + "&jsonContAttri=" + jsonContAttri + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/resources/update/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.delete = function (token, id) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/resources/delete/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.getResourcePlatforms = function (token, activeUserId) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token + "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/resources/getResourcePlatforms", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.getResourceInstances = function (token, activeUserId) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token + "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/resources/getResourceInstances", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService.prototype.saveFavorites = function (token, resourceFavorites) {
        token = encodeURIComponent(token);
        var jsonResourceFavorites = JSON.stringify(resourceFavorites);
        var params = "authorization=" + token + "&jsonResourceFavorites=" + jsonResourceFavorites;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/resources/saveFavorites", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    ResourcesService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ResourcesService);
    return ResourcesService;
}());
exports.ResourcesService = ResourcesService;
//# sourceMappingURL=resources.service.js.map