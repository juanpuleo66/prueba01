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
var user_services_1 = require('../../services/users/user.services');
var window_modal_message_1 = require('../../common/windowmodal/window.modal.message');
var common_functions_1 = require('../../common/commonfunctions/common.functions');
var generate_date_pipe_1 = require('../../pipes/generate.date.pipe');
var global_1 = require('../../global');
var general_services_1 = require('../../services/general/general.services');
var Rx_1 = require('rxjs/Rx');
var TasksComponent = (function () {
    function TasksComponent(_route, _router, _loginService, _tasksService, elementRef, _userService, _generalServices) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this._tasksService = _tasksService;
        this.elementRef = elementRef;
        this._userService = _userService;
        this._generalServices = _generalServices;
        this.titulo = "Tasks: ";
        this.totalPages = 1;
        this.firstPage = 1;
        this.totalRecords = 1;
        this.pagePrev = 1;
        this.pageNext = 1;
        this.globalItemsPerPage = global_1.globalVariables['items_per_page'];
        this.obsSubscription = [];
        this.subscriptionsActive = false;
    }
    TasksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        this.colAct = localStorage.getItem('colAct');
        this.colOrd = localStorage.getItem('colOrd');
        this.itemsPerPage = localStorage.getItem('tasksItemsPerPage');
        if (this.itemsPerPage == null) {
            this.itemsPerPage = this.globalItemsPerPage;
            localStorage.setItem('tasksItemsPerPage', this.itemsPerPage);
        }
        if (this.identity.role == 'admin') {
            this.activeUserId = localStorage.getItem('tasksActiveUserId');
            if (this.activeUserId == null) {
                localStorage.setItem('tasksActiveUserId', this.identity.sub);
                this.activeUserId = this.identity.sub;
            }
        }
        else {
            this.activeUserId = this.identity.sub;
            localStorage.removeItem('tasksActiveUserId');
        }
        if (localStorage.getItem('activateTaskFavorites') != null) {
            this.activateTaskFavorites = localStorage.getItem('activateTaskFavorites');
        }
        else {
            this.activateTaskFavorites = 'false';
            localStorage.setItem('activateTaskFavorites', this.activateTaskFavorites);
        }
        if (localStorage.getItem('activeConfigName') != null) {
            this.activeConfigName = localStorage.getItem('activeConfigName');
        }
        else {
            this.activeConfigName = 'All';
            localStorage.setItem('activeConfigName', this.activeConfigName);
        }
        if (localStorage.getItem('activeScriptName') != null) {
            this.activeScriptName = localStorage.getItem('activeScriptName');
        }
        else {
            this.activeScriptName = 'All';
            localStorage.setItem('activeScriptName', this.activeScriptName);
        }
        if (localStorage.getItem('activeTaskStatusId') != null) {
            this.activeTaskStatusId = localStorage.getItem('activeTaskStatusId');
        }
        else {
            this.activeTaskStatusId = 'A';
            localStorage.setItem('activeTaskStatusId', this.activeTaskStatusId);
        }
        if (!this.colAct) {
            this.colAct = null;
        }
        if (!this.colOrd) {
            this.colOrd = null;
        }
        this.setOrder(this.colAct);
        this._route.params.subscribe(function (params) {
            var page = +params["page"];
            if (!page) {
                page = null;
            }
            var search = params["search"];
            if (!search || search.trim().length == 0) {
                search = null;
                _this.searchString = null;
            }
            else {
                _this.searchString = search;
            }
            _this.getSearchTasks(page, _this.searchString, _this.itemsPerPage);
            _this.getTaskConfigNames();
            _this.getTaskScriptNames();
            _this.getTaskLogStatus();
            if (_this.identity.role == 'admin') {
                _this.searchUsers();
            }
        });
    };
    TasksComponent.prototype.ngOnDestroy = function () {
        // console.log('task.component.ts-ngOnDestroy');
        this.unSubscribeAll();
    };
    TasksComponent.prototype.search = function (page, searchString, itemsPerPage) {
        if (page === void 0) { page = null; }
        this.unSubscribeAll();
        this.searchString = searchString;
        this.itemsPerPage = itemsPerPage;
        localStorage.setItem('tasksItemsPerPage', itemsPerPage);
        this.getSearchTasks(page, this.searchString, itemsPerPage);
    };
    TasksComponent.prototype.getSearchTasks = function (page, search, itemsPerPage) {
        var _this = this;
        if (page === void 0) { page = null; }
        if (search === void 0) { search = ""; }
        if (!search || search.trim().length == 0) {
            search = null;
            this.searchString = null;
        }
        else {
            this.searchString = search;
        }
        var pagina = true;
        if (!page) {
            page = 1;
            pagina = null;
        }
        this.pageActual = page;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this._tasksService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeUserId, this.activeConfigName, this.activeScriptName, this.activeTaskStatusId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.tasks = response.data;
                for (var i = 0; i < _this.tasks.length; i++) {
                    _this.tasks[i].scriptPath = _this._generalServices.columnContentFormat(_this.tasks[i].scriptPath, 30);
                    _this.tasks[i].comment = _this._generalServices.columnContentFormat(_this.tasks[i].comment, 50);
                }
                _this.subscribeAll();
                _this.loading = 'hide';
                if (page >= 2) {
                    _this.pagePrev = (page - 1);
                }
                else {
                    _this.pagePrev = page;
                }
                if (page < response.total_pages || page == 1) {
                    _this.pageNext = (page + 1);
                }
                else {
                    _this.pageNext = page;
                }
                _this.firstPage = 1;
                _this.totalPages = response.total_pages;
                _this.totalRecords = response.total_items_count;
                _this.itemsPerPage = response.items_per_page;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TasksComponent.prototype.onClickFunction = function (taskId, taskFavorite, index) {
        console.error('onClickFunction: this.obsSubscription.length: ' + this.obsSubscription.length);
        console.error(this.obsSubscription);
        console.error('index: ' + index);
        console.error('taskId: ' + taskId);
        console.error('taskFavorite: ' + taskFavorite);
    };
    TasksComponent.prototype.onSaveFavorites = function (taskId, taskFavorite, index) {
        var _this = this;
        switch (true) {
            case (taskFavorite == 0):
                console.warn(index + ' tasks.component.ts-onSaveFavorites: ' + taskFavorite + ' unsubscribe this taskId: ' + taskId);
                if (this.obsSubscription[index] != undefined) {
                    this.obsSubscription[index].unsubscribe();
                    this.obsSubscription.splice(index, 1);
                }
                if (this.obsSubscription.length == 0) {
                    // falta revisar que los indices de los otros no sean undefined, ya quie al momento de subscribirse y elindex es nueve el crea uno para cada indice pero undefined
                    this.subscriptionsActive = false;
                }
                console.log('onSaveFavorites: this.obsSubscription.length: ' + this.obsSubscription.length);
                break;
            case (taskFavorite == 1):
                console.warn(index + ' tasks.component.ts-onSaveFavorites: ' + taskFavorite + ' subscribe this taskId: ' + taskId);
                this.subscribeOne(index, taskId);
                break;
        }
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this.taskFavorites = [];
        this.taskFavorites.push({ taskId: taskId, taskFavorite: taskFavorite });
        this._tasksService.saveFavorites(token, this.taskFavorites).subscribe(function (response) {
            _this.status = response.status;
            _this.loading = 'hide';
            if (_this.status != "success") {
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TasksComponent.prototype.onChangeFavorites = function () {
        // localStorage transforms everything to text, booleans are not accepted
        this.activateTaskFavorites = this.activateTaskFavorites == 'true' ? 'false' : 'true';
        localStorage.setItem('activateTaskFavorites', this.activateTaskFavorites);
    };
    TasksComponent.prototype.rowHidden = function (favorite) {
        switch (true) {
            case (this.activateTaskFavorites == 'false'):
                return false;
            case (this.activateTaskFavorites == 'true' && favorite == 1):
                return false;
            default:
                return true;
        }
    };
    TasksComponent.prototype.getTaskConfigNames = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        this._tasksService.getTaskConfigNames(token, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.taskConfigNames = response.data;
                _this.taskConfigNames.unshift({ configName: 'All' });
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TasksComponent.prototype.getConfigName = function (configName) {
        this.unSubscribeAll();
        this.activeConfigName = configName;
        localStorage.setItem('activeConfigName', this.activeConfigName);
        this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);
    };
    TasksComponent.prototype.getTaskScriptNames = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        this._tasksService.getTaskScriptNames(token, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.taskScriptNames = response.data;
                _this.taskScriptNames.unshift({ scriptName: 'All' });
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TasksComponent.prototype.getScriptName = function (scriptName) {
        this.unSubscribeAll();
        this.activeScriptName = scriptName;
        localStorage.setItem('activeScriptName', this.activeScriptName);
        this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);
    };
    TasksComponent.prototype.getTaskLogStatusUnique = function (idStatus) {
        this.unSubscribeAll();
        this.activeTaskStatusId = idStatus;
        localStorage.setItem('activeTaskStatusId', this.activeTaskStatusId);
        this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);
    };
    TasksComponent.prototype.getTaskLogStatus = function () {
        this.taskLogStatus = [];
        this.taskLogStatus[0] = { idStatus: 'A', logStatus: 'All' };
        this.taskLogStatus[1] = { idStatus: '0', logStatus: 'Unrun' };
        this.taskLogStatus[2] = { idStatus: '1', logStatus: 'Success' };
        this.taskLogStatus[3] = { idStatus: '2', logStatus: 'Running' };
        this.taskLogStatus[4] = { idStatus: '3', logStatus: 'Stopped' };
        this.taskLogStatus[5] = { idStatus: '4', logStatus: 'Error' };
        this.taskLogStatus[6] = { idStatus: '5', logStatus: 'Server-Error' };
        this.taskLogStatus[7] = { idStatus: '6', logStatus: 'Warning' };
        this.taskLogStatus[8] = { idStatus: '7', logStatus: 'W-success' };
    };
    TasksComponent.prototype.searchUsers = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        this._userService.searchUsers(token).subscribe(function (responseb) {
            _this.status = responseb.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = responseb.code;
                _this.msg = responseb.msg;
            }
            else {
                _this.users = responseb.data;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TasksComponent.prototype.getUser = function (userid) {
        this.unSubscribeAll();
        this.activeUserId = userid;
        localStorage.setItem('tasksActiveUserId', userid);
        this.pageActual = 1;
        this.activeConfigName = 'All';
        localStorage.setItem('activeConfigName', this.activeConfigName);
        this.activeScriptName = 'All';
        localStorage.setItem('activeScriptName', this.activeScriptName);
        this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);
        var self = this;
        var timeOut = setInterval(function () {
            clearInterval(timeOut);
            self.getTaskConfigNames();
            self.getTaskScriptNames();
        }, 500);
    };
    TasksComponent.prototype.subscribeAll = function () {
        // console.warn('task.component.ts-subscribeAll');
        for (var index = 0; index < this.tasks.length; index++) {
            var idTask = this.tasks[index].id;
            if (this.tasks[index].favorite == 1) {
                // only the tasks that are mark as favorite while subscribe to the Observable
                console.error('id: ' + this.tasks[index].id + ' - this.tasks[' + index + '].favorite: ' + this.tasks[index].favorite);
                this.subscribeOne(index, idTask);
            }
        }
        this.subscriptionsActive = true;
    };
    TasksComponent.prototype.unSubscribeAll = function () {
        // console.warn('task.component.ts-unSubscribeAll');
        console.warn('antes:this.obsSubscription:');
        console.log(this.obsSubscription);
        for (var i = 0; i < this.obsSubscription.length; i++) {
            if (this.obsSubscription[i] != undefined) {
                this.obsSubscription[i].unsubscribe();
            }
        }
        // this is done because the unsubscribe() function is done asynchronously and some times is still running and the code flows continues
        while (this.obsSubscription.length != 0) {
            for (var i = 0; i < this.obsSubscription.length; i++) {
                if (this.obsSubscription[i] == undefined || (this.obsSubscription[i] != undefined && this.obsSubscription[i].isUnsubscribed)) {
                    this.obsSubscription.splice(i, 1);
                    console.log(i + ' this.obsSubscription');
                }
            }
        }
        this.subscriptionsActive = false;
        console.warn('despues:this.obsSubscription:');
        console.log(this.obsSubscription);
    };
    TasksComponent.prototype.subscribeOne = function (index, idTask) {
        var _this = this;
        // console.warn('task.component.ts-subscribeOne');
        var foundIdTask = true;
        // console.warn('index: '+index);
        // console.warn('idTask: '+idTask);
        if (this.obsSubscription[index] != undefined) {
            // console.error('task.component.ts-subscribeOne - inside the if - this.obsSubscription['+index+'] exist');
            // checks if the subscribe already exists
            foundIdTask = false;
        }
        if (foundIdTask) {
            // console.log('task.component.ts-subscribeOne-foundIdTask: '+idTask);
            // subscribes the idTask to an Observable
            this.obsSubscription[index] = Rx_1.Observable
                .timer(500, 5000)
                .subscribe(function (numb) {
                console.log('obsSubscription-idTask: ' + idTask);
                var token = _this._loginService.getToken();
                _this._tasksService.taskIdRefresh(token, idTask).subscribe(function (response) {
                    _this.status = response.status;
                    if (_this.status != "success") {
                        _this.code = response.code;
                        _this.msg = response.msg;
                    }
                    else {
                        var taskIdRecord = response.data;
                        taskIdRecord[0].scriptPath = _this._generalServices.columnContentFormat(taskIdRecord[0].scriptPath, 30);
                        taskIdRecord[0].comment = _this._generalServices.columnContentFormat(taskIdRecord[0].comment, 50);
                        _this.tasks[index] = taskIdRecord[0];
                    }
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error: ' + _this.errorMessage);
                    }
                });
            });
        }
        // console.log('this.obsSubscription');
        // console.log(this.obsSubscription);
        // console.error('this.obsSubscription.length: '+this.obsSubscription.length);
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    TasksComponent.prototype.runTask = function (index) {
        var _this = this;
        // console.warn('task.component.ts-runTask');
        var cont = true;
        if (this.tasks[index].comment == null || this.tasks[index].comment.trim().length == 0) {
            cont = false;
            this.windowModalMessage.showWindowModalMessage('The task needs to have a comment to run');
        }
        if (cont) {
            this.loading = 'show';
            // whats this for ?			
            // this.tasks[index].status = "1";
            var idTask_1 = this.tasks[index].id;
            var token = this._loginService.getToken();
            var identity = this._loginService.getIdentity();
            var userowner = { "userowner": identity.sub };
            // console.warn('index: '+index+' - idTask: '+idTask);			
            this._tasksService.runTask(token, idTask_1, this.itemsPerPage, userowner).subscribe(function (response) {
                _this.status = response.status;
                _this.page = response.page;
                _this.loading = 'hide';
                if (_this.status != "success") {
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    // this.getSearchTasks(this.page, this.searchString, this.itemsPerPage);
                    _this.subscribeOne(index, idTask_1);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error: ' + _this.errorMessage);
                }
            });
        }
    };
    TasksComponent.prototype.stopTask = function (index) {
        var _this = this;
        // console.warn('task.component.ts-stopTask');
        this.loading = 'show';
        // whats this for ?			
        // this.tasks[index].status = "3";
        var idTask = this.tasks[index].id;
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        // console.warn('index: '+index+' - idTask: '+idTask);			
        this._tasksService.stopTask(token, idTask, this.itemsPerPage, userowner).subscribe(function (response) {
            _this.status = response.status;
            _this.page = response.page;
            _this.loading = 'hide';
            if (_this.status != "success") {
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TasksComponent.prototype.deleteConfig = function (id, page) {
        var _this = this;
        this.loading = 'show';
        // if there is only one id for this table on this page
        if (this.tasks.length === 1 && this.totalPages > 1) {
            page--;
        }
        if (id != undefined) {
            var token = this._loginService.getToken();
            this._tasksService.delete(token, id).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.getSearchTasks(page, _this.searchString, _this.itemsPerPage);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error-delete: ' + _this.errorMessage);
                }
            });
        }
    };
    TasksComponent.prototype.activateTaskManager = function (id) {
        alert('id: ' + id);
    };
    TasksComponent.prototype.sortJsonArrayByProperty = function (objArray, prop, direction) {
        var direct = arguments.length > 2 ? arguments[2] : 1; //Default to ascending
        if (objArray && objArray.constructor === Array) {
            var propPath = (prop.constructor === Array) ? prop : prop.split(".");
            objArray.sort(function (a, b) {
                for (var p in propPath) {
                    if (a[propPath[p]] && b[propPath[p]]) {
                        a = a[propPath[p]];
                        b = b[propPath[p]];
                    }
                }
                // convert numeric strings to integers
                //a = a.match(/^\d+$/) ? +a : a;
                //b = b.match(/^\d+$/) ? +b : b;
                return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
            });
        }
    };
    TasksComponent.prototype.setOrder = function (columna) {
        this.colAct = columna;
        localStorage.setItem('colAct', this.colAct);
        localStorage.setItem('colOrd', this.colOrd);
        switch (this.colOrd) {
            case 'asc':
                this.sortJsonArrayByProperty(this.tasks, columna, -1);
                this.colOrd = 'desc';
                break;
            case 'desc':
                this.sortJsonArrayByProperty(this.tasks, columna, 1);
                this.colOrd = 'asc';
                break;
            default:
                this.sortJsonArrayByProperty(this.tasks, columna, 1);
                this.colOrd = 'asc';
        }
    };
    __decorate([
        core_1.ViewChild(common_functions_1.CommonFunctions), 
        __metadata('design:type', common_functions_1.CommonFunctions)
    ], TasksComponent.prototype, "commonFunctions", void 0);
    __decorate([
        core_1.ViewChild(window_modal_message_1.WindowModalMessage), 
        __metadata('design:type', window_modal_message_1.WindowModalMessage)
    ], TasksComponent.prototype, "windowModalMessage", void 0);
    TasksComponent = __decorate([
        core_1.Component({
            selector: 'tasks',
            templateUrl: 'app/views/tasks/tasks.html',
            directives: [router_1.ROUTER_DIRECTIVES, common_functions_1.CommonFunctions, window_modal_message_1.WindowModalMessage],
            providers: [login_service_1.LoginService, tasks_service_1.TasksService, user_services_1.UserService, general_services_1.GeneralServices],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService, tasks_service_1.TasksService, core_1.ElementRef, user_services_1.UserService, general_services_1.GeneralServices])
    ], TasksComponent);
    return TasksComponent;
}());
exports.TasksComponent = TasksComponent;
//# sourceMappingURL=tasks.component.js.map