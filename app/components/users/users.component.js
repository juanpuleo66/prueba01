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
var user_services_1 = require('../../services/users/user.services');
var generate_date_pipe_1 = require('../../pipes/generate.date.pipe');
var common_functions_1 = require('../../common/commonfunctions/common.functions');
var global_1 = require('../../global');
var UsersComponent = (function () {
    function UsersComponent(_route, _router, _loginService, _userService, elementRef) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this._userService = _userService;
        this.elementRef = elementRef;
        this.titulo = "Users:";
        this.totalPages = 1;
        this.firstPage = 1;
        this.totalRecords = 1;
        this.pagePrev = 1;
        this.pageNext = 1;
        this.globalItemsPerPage = global_1.globalVariables['items_per_page'];
        //console.warn('A-1:scripts.component.ts-constructor');		
    }
    UsersComponent.prototype.ngOnInit = function () {
        var _this = this;
        //console.warn('B-1:scripts.component.ts-ngOnInit');		
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        this.colAct = localStorage.getItem('colAct');
        this.colOrd = localStorage.getItem('colOrd');
        this.itemsPerPage = localStorage.getItem('usersItemsPerPage');
        if (this.itemsPerPage == null) {
            this.itemsPerPage = this.globalItemsPerPage;
            localStorage.setItem('usersItemsPerPage', this.itemsPerPage);
        }
        if (!this.colAct) {
            this.colAct = null;
        }
        if (!this.colOrd) {
            this.colOrd = null;
        }
        this.setOrder(this.colAct);
        this._route.params.subscribe(function (params) {
            var page = +params["page"]; //recoge lo que se manda por la url segun la ruta scripts/:page 
            if (!page) {
                page = null;
            }
            var search = params["search"]; //recoge lo que se manda por la url segun la ruta scripts/:page/:search
            if (!search || search.trim().length == 0) {
                search = null;
                _this.searchUser = null;
            }
            else {
                _this.searchUser = search;
            }
            _this.getSearchUsers(page, _this.searchUser, _this.itemsPerPage);
        });
    };
    UsersComponent.prototype.search = function (page, searchUser, itemsPerPage) {
        if (page === void 0) { page = null; }
        this.searchUser = searchUser;
        this.itemsPerPage = itemsPerPage;
        localStorage.setItem('usersItemsPerPage', itemsPerPage);
        this.getSearchUsers(page, this.searchUser, itemsPerPage);
    };
    UsersComponent.prototype.getSearchUsers = function (page, search, itemsPerPage) {
        var _this = this;
        if (page === void 0) { page = null; }
        if (search === void 0) { search = ""; }
        if (!search || search.trim().length == 0) {
            search = null;
            this.searchUser = null;
        }
        else {
            this.searchUser = search;
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
        this._userService.search(search, page, pagina, token, itemsPerPage).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.users = response.data;
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
                _this.totalRecords = response.total_items_counts;
                _this.itemsPerPage = response.items_per_page;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    UsersComponent.prototype.deleteUser = function (id, page) {
        var _this = this;
        this.loading = 'show';
        // if there is only one id for this table on this page
        if (this.users.length == 1 && this.totalPages > 1) {
            page--;
        }
        if (id != undefined) {
            var token = this._loginService.getToken();
            this._userService.delete(id, token).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.getSearchUsers(page, _this.searchUser, _this.itemsPerPage);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error-delete: ' + _this.errorMessage);
                }
            });
        }
        this.loading = 'hide';
    };
    UsersComponent.prototype.changeActivateStatus = function (id, newStatus) {
        var _this = this;
        this.loading = 'show';
        if (id != undefined) {
            var token = this._loginService.getToken();
            this._userService.changeActivateStatus(newStatus, token, id).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.getSearchUsers(_this.pageActual, _this.searchUser, _this.itemsPerPage);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error-updated: ' + _this.errorMessage);
                }
            });
        }
        this.loading = 'hide';
    };
    UsersComponent.prototype.sortJsonArrayByProperty = function (objArray, prop, direction) {
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
    UsersComponent.prototype.setOrder = function (columna) {
        this.colAct = columna;
        localStorage.setItem('colAct', this.colAct);
        localStorage.setItem('colOrd', this.colOrd);
        switch (this.colOrd) {
            case 'asc':
                this.sortJsonArrayByProperty(this.users, columna, -1);
                this.colOrd = 'desc';
                break;
            case 'desc':
                this.sortJsonArrayByProperty(this.users, columna, 1);
                this.colOrd = 'asc';
                break;
            default:
                this.sortJsonArrayByProperty(this.users, columna, 1);
                this.colOrd = 'asc';
                break;
        }
    };
    __decorate([
        core_1.ViewChild(common_functions_1.CommonFunctions), 
        __metadata('design:type', common_functions_1.CommonFunctions)
    ], UsersComponent.prototype, "commonFunctions", void 0);
    UsersComponent = __decorate([
        core_1.Component({
            selector: 'listUsers',
            templateUrl: 'app/views/users/users.html',
            directives: [router_1.ROUTER_DIRECTIVES, common_functions_1.CommonFunctions],
            providers: [login_service_1.LoginService, user_services_1.UserService],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService, user_services_1.UserService, core_1.ElementRef])
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map