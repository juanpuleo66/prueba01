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
var window_modal_message_1 = require('../../common/windowmodal/window.modal.message');
var generate_date_pipe_1 = require('../../pipes/generate.date.pipe');
var task_1 = require('../../model/task');
var Rx_1 = require('rxjs/Rx'); // observable
require('rxjs/Rx'); // observable
var TaskconfigViewComponent = (function () {
    function TaskconfigViewComponent(_loginService, _tasksService, _route, _router) {
        this._loginService = _loginService;
        this._tasksService = _tasksService;
        this._route = _route;
        this._router = _router;
        this.titulo = 'View Task Config';
        this.tempStatus = 0;
    }
    TaskconfigViewComponent.prototype.ngOnInit = function () {
        this.identity = this._loginService.getIdentity();
        // if true makes the logo of refresh spin
        this.refreshLogsActive = false;
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        this.colAct = localStorage.getItem('colAct');
        this.colOrd = localStorage.getItem('colOrd');
        if (!this.colAct) {
            this.colAct = null;
        }
        if (!this.colOrd) {
            this.colOrd = null;
        }
        this.setOrder(this.colAct);
        this.task = new task_1.Task(0, 0, "", "", "", "", "", "", "", "", "", "", "");
        this.getTask();
    };
    TaskconfigViewComponent.prototype.ngOnDestroy = function () {
        if (this.obsSubscription != undefined) {
            this.obsSubscription.unsubscribe(); // observable
        }
    };
    TaskconfigViewComponent.prototype.getTask = function () {
        var _this = this;
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
            var userowner = { "userowner": identity.sub };
            _this._tasksService.detailTaskConfig(token, userowner, id).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.status = response.status;
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.task = response.atask;
                    _this.task.id = response.atask[0].id;
                    _this.task.idConfig = response.atask[0].idConfig;
                    _this.task.configName = response.atask[0].configName;
                    _this.task.scriptName = response.atask[0].scriptName;
                    _this.task.scriptPath = response.atask[0].scriptPath;
                    _this.task.status = response.atask[0].status;
                    _this.task.scriptLanguage = response.atask[0].scriptLanguage;
                    _this.task.comment = response.atask[0].comment;
                    _this.task.usernameowner = response.atask[0].usernameowner;
                    _this.scriptparams = response.scriptparams;
                    _this.inputparams = response.inputparams;
                    for (var i = 0; i < _this.inputparams.length; i++) {
                        if (_this.inputparams[i].paramSecure == 1) {
                            _this.inputparams[i].paramValue = '********************';
                        }
                    }
                    _this.outputparams = response.outputparams;
                    for (var i = 0; i < _this.outputparams.length; i++) {
                        if (_this.outputparams[i].paramSecure == 1) {
                            _this.outputparams[i].paramValue = '********************';
                        }
                    }
                    _this.tasklogs = response.atasklog;
                    if (_this.tasklogs.length > 0) {
                        _this.taskLogsStatus = _this.tasklogs[0].status;
                    }
                    _this.tasklogswarnings = response.atasklogwarning;
                    _this.tasklogsoutputs = response.atasklogoutput;
                }
                _this.loading = 'hide';
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error: ' + _this.errorMessage);
                }
            });
        });
    };
    TaskconfigViewComponent.prototype.detailTaskConfigLogs = function (idTask) {
        var _this = this;
        var cont = true;
        if (this.task.comment == null || this.task.comment.trim().length == 0) {
            cont = false;
            this.windowModalMessage.showWindowModalMessage('The task needs to have a comment to run');
        }
        if (cont) {
            this.refreshLogsActive = true;
            this.obsSubscription = Rx_1.Observable
                .interval(3000)
                .subscribe(function (numb) {
                _this.loading = 'show';
                var token = _this._loginService.getToken();
                var identity = _this._loginService.getIdentity();
                var userowner = { "userowner": identity.sub };
                _this._tasksService.detailTaskConfigLogs(token, userowner, idTask).subscribe(function (response) {
                    _this.status2 = response.status;
                    _this.loading = 'hide';
                    if (_this.status2 != "success") {
                        _this.code = response.code;
                        _this.msg = response.msg;
                    }
                    else {
                        _this.tasklogs = response.atasklog;
                        _this.taskLogsStatus = _this.tasklogs[0].status;
                        _this.task.status = response.ataskstatus[0].status;
                        if (_this.tasklogs.length > 0 && _this.taskLogsStatus != "2") {
                            _this.obsSubscription.unsubscribe();
                            _this.refreshLogsActive = false;
                        }
                    }
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error: ' + _this.errorMessage);
                    }
                });
            });
        }
    };
    TaskconfigViewComponent.prototype.runTask = function (idTask) {
        var _this = this;
        var cont = true;
        if (this.task.comment == null || this.task.comment.trim().length == 0) {
            cont = false;
            this.windowModalMessage.showWindowModalMessage('The task needs to have a comment to run');
        }
        if (cont) {
            this.loading = 'show';
            var token_1 = this._loginService.getToken();
            var identity = this._loginService.getIdentity();
            var userowner_1 = { "userowner": identity.sub };
            this.task.status = "1";
            this._tasksService.runTask(token_1, idTask, this.itemsPerPage, userowner_1).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this._tasksService.detailTaskConfigLogs(token_1, userowner_1, idTask).subscribe(function (response) {
                        _this.status2 = response.status;
                        _this.loading = 'hide';
                        if (_this.status2 != "success") {
                            _this.code = response.code;
                            _this.msg = response.msg;
                        }
                        else {
                            _this.tasklogs = response.atasklog;
                            _this.detailTaskConfigLogs(idTask);
                        }
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error: ' + _this.errorMessage);
                        }
                    });
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error: ' + _this.errorMessage);
                }
            });
        }
    };
    TaskconfigViewComponent.prototype.stopTask = function (idTask) {
        //this.task.status = '0';
        alert("This option is not available...");
    };
    TaskconfigViewComponent.prototype.gotoConfig = function (idConfig) {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this.activeUserId = localStorage.getItem('tasksActiveUserId');
        this._tasksService.gotoConfig(token, userowner, idConfig, this.itemsPerPage, this.activeUserId).subscribe(function (response) {
            _this.status2 = response.status;
            _this.loading = 'hide';
            if (_this.status2 != "success") {
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                var page = response.page;
                localStorage.setItem('configsActiveUserId', _this.activeUserId);
                localStorage.setItem('configsItemsPerPage', _this.itemsPerPage);
                _this._router.navigate(["/config_edit", idConfig, page, _this.itemsPerPage]);
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    TaskconfigViewComponent.prototype.updateData = function (recordShowB, recordShowIndexB, recordShowOptionB) {
        var _this = this;
        var cont = true;
        switch (recordShowOptionB) {
            case 'A':
                if (recordShowB.trim().length == 0) {
                    cont = false;
                    this.windowModalMessage.showWindowModalMessage('The comment for the task can not be empty');
                }
                if (cont) {
                    this.loading = 'show';
                    var token = this._loginService.getToken();
                    var comment = { "comment": recordShowB };
                    this.task.comment = recordShowB;
                    this._tasksService.updateTaskComment(token, comment, this.task.id).subscribe(function (response) {
                        _this.status2 = response.status;
                        if (_this.status2 != "success") {
                            _this.code = response.code;
                            _this.msg = response.msg;
                        }
                        else {
                            _this.getTask(); // refresh the page
                        }
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error-delete: ' + _this.errorMessage);
                        }
                    });
                }
                break;
            case 'B':
                if (recordShowB.trim().length == 0) {
                    cont = false;
                    this.windowModalMessage.showWindowModalMessage('The action for the warning can not be empty');
                }
                var idTaskLog = this.tasklogswarnings[recordShowIndexB].id;
                if (cont) {
                    this.loading = 'show';
                    var token = this._loginService.getToken();
                    var action = { "action": recordShowB };
                    this.task.comment = recordShowB;
                    this._tasksService.updateActionWarning(token, action, idTaskLog).subscribe(function (response) {
                        _this.status2 = response.status;
                        if (_this.status2 != "success") {
                            _this.code = response.code;
                            _this.msg = response.msg;
                        }
                        else {
                            _this.getTask(); // refresh the page
                        }
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error-delete: ' + _this.errorMessage);
                        }
                    });
                }
                break;
        }
    };
    TaskconfigViewComponent.prototype.sortJsonArrayByProperty = function (objArray, prop, direction) {
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
    TaskconfigViewComponent.prototype.setOrder = function (columna) {
        this.colAct = columna;
        localStorage.setItem('colAct', this.colAct);
        localStorage.setItem('colOrd', this.colOrd);
        switch (this.colOrd) {
            case 'asc':
                this.sortJsonArrayByProperty(this.tasklogs, columna, -1);
                this.colOrd = 'desc';
                break;
            case 'desc':
                this.sortJsonArrayByProperty(this.tasklogs, columna, 1);
                this.colOrd = 'asc';
                break;
            default:
                this.sortJsonArrayByProperty(this.tasklogs, columna, 1);
                this.colOrd = 'asc';
        }
    };
    __decorate([
        core_1.ViewChild(window_modal_message_1.WindowModalMessage), 
        __metadata('design:type', window_modal_message_1.WindowModalMessage)
    ], TaskconfigViewComponent.prototype, "windowModalMessage", void 0);
    TaskconfigViewComponent = __decorate([
        core_1.Component({
            selector: 'taskconfig-view',
            templateUrl: 'app/views/tasks/taskconfig.view.html',
            directives: [router_1.ROUTER_DIRECTIVES, window_modal_message_1.WindowModalMessage],
            providers: [login_service_1.LoginService, tasks_service_1.TasksService],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, tasks_service_1.TasksService, router_1.ActivatedRoute, router_1.Router])
    ], TaskconfigViewComponent);
    return TaskconfigViewComponent;
}());
exports.TaskconfigViewComponent = TaskconfigViewComponent;
//# sourceMappingURL=taskconfig.view.component.js.map