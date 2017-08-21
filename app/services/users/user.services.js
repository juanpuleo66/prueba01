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
var UserService = (function () {
    function UserService(_http) {
        this._http = _http;
        this.url = global_1.globalVariables['base_api_url'];
    }
    UserService.prototype.register = function (user_to_register, token) {
        var json = JSON.stringify(user_to_register);
        var json1 = encodeURIComponent(json);
        var token1 = encodeURIComponent(token);
        var params = "json=" + json1 + "&authorization=" + token1;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/users/new", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    UserService.prototype.getUserById = function (id_user, token) {
        var token1 = encodeURIComponent(token);
        var params = "authorization=" + token1;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/users/user-details/" + id_user, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    UserService.prototype.getUserGroups = function (token) {
        var token1 = encodeURIComponent(token);
        var params = "authorization=" + token1;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/users/groups", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    UserService.prototype.edit = function (user_to_edit, token, id) {
        var json = JSON.stringify(user_to_edit);
        var json1 = encodeURIComponent(json);
        var token1 = encodeURIComponent(token);
        var params = "json=" + json + "&authorization=" + token1;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (id == undefined) {
            return this._http.post(this.url + "/users/edit", params, { headers: headers }).map(function (res) { return res.json(); });
        }
        else {
            return this._http.post(this.url + "/users/editAnother/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
        }
    };
    UserService.prototype.changeActivateStatus = function (newStatus, token, id) {
        var token1 = encodeURIComponent(token);
        var params = "authorization=" + token1 + "&status=" + newStatus;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/users/changeActive/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    UserService.prototype.delete = function (user_to_delete, token) {
        var token1 = encodeURIComponent(token);
        var params = "authorization=" + token1;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/users/delete-user/" + user_to_delete, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    UserService.prototype.getUsersList = function (token) {
        var token1 = encodeURIComponent(token);
        var params = "authorization=" + token1;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/users/list", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    UserService.prototype.search = function (search, page, pagina, token, items) {
        if (search === void 0) { search = null; }
        if (page === void 0) { page = null; }
        var token1 = encodeURIComponent(token);
        var params = "authorization=" + token1 + "&items=" + items;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (page == null) {
            page = 1;
        }
        var http;
        var cont;
        var cont1;
        if (search == null && pagina == null) {
            cont = "/users/listUsers";
        }
        if (search == null && pagina != null) {
            cont = "/users/listUsers?page=" + page;
        }
        if (search != null && pagina == null) {
            cont = "/users/search/" + search;
        }
        if (search != null && pagina != null) {
            cont = "/users/search/" + search + "?page=" + page;
        }
        http = this._http.post(this.url + cont, params, { headers: headers }).map(function (res) { return res.json(); });
        return http;
    };
    UserService.prototype.searchUsers = function (token) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var http;
        return this._http.post(this.url + "/users/searchUsers", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.services.js.map