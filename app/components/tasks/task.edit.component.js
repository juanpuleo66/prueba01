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
var router_1 = require('@angular/router');
var login_service_1 = require('../../services/login.service');
var tasks_service_1 = require('../../services/tasks/tasks.service');
var task_1 = require('../../model/task');
var TaskEditComponent = (function () {
    function TaskEditComponent(_loginService, _tasksService, _route, _router) {
        this._loginService = _loginService;
        this._tasksService = _tasksService;
        this._route = _route;
        this._router = _router;
        this.titulo = 'Edit Task';
        //console.warn('A-1: task.edit.componenet.ts-constructor');
    }
    TaskEditComponent.prototype.ngOnInit = function () {
        //console.warn('B-1: task.edit.componenet.ts-ngOnInit');
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        this.task = new task_1.Task(0, 0, "", "", "", "", "", "", "", "", "", "", "");
        this.getTask();
    };
    TaskEditComponent.prototype.getTask = function () {
        var _this = this;
        //console.warn('D-1:task.edit.componenet.ts-getTask');		
        this.loading = 'show';
        this._route.params.subscribe(function (params) {
            var id = +params["id"];
            var pageActual = +params["pageActual"];
            _this.pageActual = pageActual;
            var itemsPerPage = params["itemsPerPage"];
            _this.itemsPerPage = itemsPerPage;
            var searchString = params["search"];
            if (!searchString || searchString.trim().length == 0) {
                _this.searchString = null;
            }
            else {
                _this.searchString = searchString;
            }
            var token = _this._loginService.getToken();
            var identity = _this._loginService.getIdentity();
            var userowner = { "userowner": identity.sub }; // save in json format the userowner
            _this._tasksService.detail(token, userowner, id).subscribe(function (response) {
                _this.status = response.status;
                _this.task = response.task[0];
                if (_this.status != "success") {
                    _this._router.navigate(["/index"]);
                }
                _this.loading = 'hide';
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error: ' + _this.errorMessage);
                }
            });
        });
        console.log('task.edit.componenet.ts-getTask : ');
        console.log('task.edit.componenet.ts-getTask : ');
        console.log('task.edit.componenet.ts-getTask : ');
    };
    TaskEditComponent.prototype.onSubmit = function () {
        var _this = this;
        //console.warn('C-1: task.edit.componenet.ts-onSubmit');
        this.loading = 'show';
        var token = this._loginService.getToken();
        this._tasksService.update(token, this.task, this.task.id, this.itemsPerPage).subscribe(function (response) {
            _this.status = response.status;
            _this.page = response.page;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                if (_this.searchString == null) {
                    _this._router.navigate(['/tasks', _this.page]);
                }
                else {
                    _this._router.navigate(['/tasks', _this.page, _this.searchString]);
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TaskEditComponent = __decorate([
        core_1.Component({
            selector: 'task-edit',
            templateUrl: 'app/views/tasks/task.edit.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, tasks_service_1.TasksService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, tasks_service_1.TasksService, router_1.ActivatedRoute, router_1.Router])
    ], TaskEditComponent);
    return TaskEditComponent;
}());
exports.TaskEditComponent = TaskEditComponent;
//# sourceMappingURL=task.edit.component.js.map