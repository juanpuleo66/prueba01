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
var TasksService = (function () {
    function TasksService(_http) {
        this._http = _http;
        this.url = global_1.globalVariables['base_api_url'];
    }
    TasksService.prototype.search = function (search, page, pagina, token, userowner, itemsPerPage, activeUserId, activeConfigName, activeScriptName, activeTaskStatusId) {
        if (search === void 0) { search = null; }
        if (page === void 0) { page = null; }
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json +
            "&authorization=" + token +
            "&items=" + itemsPerPage +
            "&activeUserId=" + activeUserId +
            "&activeConfigName=" + activeConfigName +
            "&activeScriptName=" + activeScriptName +
            "&activeTaskStatusId=" + activeTaskStatusId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (page == null) {
            page = 1;
        }
        var http;
        var cont;
        var cont1;
        if (search == null && pagina == null) {
            cont = "/tasks/task";
        }
        if (search == null && pagina != null) {
            cont = "/tasks/task?page=" + page;
        }
        if (search != null && pagina == null) {
            cont = "/tasks/task/" + search;
        }
        if (search != null && pagina != null) {
            cont = "/tasks/task/" + search + "?page=" + page;
        }
        // console.log(this.url+cont);
        // console.log(params);
        http = this._http.post(this.url + cont, params, { headers: headers }).map(function (res) { return res.json(); });
        return http;
    };
    TasksService.prototype.taskIdRefresh = function (token, taskId) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token + "&taskId=" + taskId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/taskIdRefresh", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.detail = function (token, userowner, id) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/detail/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.update = function (token, task_to_update, id, itemsPerPage) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(task_to_update);
        json = encodeURIComponent(json);
        var params = "json=" + json + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/update/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.updateTaskComment = function (token, comment_to_update, id) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(comment_to_update);
        json = encodeURIComponent(json);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/updateTaskComment/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.updateActionWarning = function (token, action_to_update, idTaskLog) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(action_to_update);
        json = encodeURIComponent(json);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/updateActionWarning/" + idTaskLog, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.runTask = function (token, id, itemsPerPage, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/runTask/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.stopTask = function (token, id, itemsPerPage, userowner) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/stopTask/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.saveFavorites = function (token, taskFavorites) {
        token = encodeURIComponent(token);
        var jsonTaskFavorites = JSON.stringify(taskFavorites);
        var params = "authorization=" + token + "&jsonTaskFavorites=" + jsonTaskFavorites;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/saveFavorites", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.detailTaskConfig = function (token, userowner, id) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/detailTaskConfig/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.detailTaskConfigLogs = function (token, userowner, id) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/detailTaskConfigLogs/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.statusTaskConfigLogs = function (token, id) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/statusTaskLogs/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.gotoConfig = function (token, userowner, id, itemsPerPage, activeUserId) {
        token = encodeURIComponent(token);
        var json = JSON.stringify(userowner);
        var params = "json=" + json + "&authorization=" + token + "&itemsPerPage=" + itemsPerPage + "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/gotoConfig/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.getTaskScriptNames = function (token, activeUserId) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token + "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/getTaskScriptNames", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.getTaskConfigNames = function (token, activeUserId) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token + "&activeUserId=" + activeUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/tasks/getTaskConfigNames", params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService.prototype.delete = function (token, id) {
        token = encodeURIComponent(token);
        var params = "authorization=" + token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(this.url + "/configs/delete/" + id, params, { headers: headers }).map(function (res) { return res.json(); });
    };
    TasksService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TasksService);
    return TasksService;
}());
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map