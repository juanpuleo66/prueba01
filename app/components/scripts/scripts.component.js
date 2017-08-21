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
var scripts_service_1 = require('../../services/scripts/scripts.service');
var user_services_1 = require('../../services/users/user.services');
var generate_date_pipe_1 = require('../../pipes/generate.date.pipe');
var common_functions_1 = require('../../common/commonfunctions/common.functions');
var global_1 = require('../../global');
var ScriptsComponent = (function () {
    function ScriptsComponent(_route, _router, _loginService, _scriptsService, elementRef, _userService) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this._scriptsService = _scriptsService;
        this.elementRef = elementRef;
        this._userService = _userService;
        this.titulo = "Scripts: ";
        this.totalPages = 1;
        this.firstPage = 1;
        this.totalRecords = 1;
        this.pagePrev = 1;
        this.pageNext = 1;
        this.globalItemsPerPage = global_1.globalVariables['items_per_page'];
        //console.warn('A-1:scripts.component.ts-constructor');		
    }
    ScriptsComponent.prototype.ngOnInit = function () {
        var _this = this;
        //console.warn('B-1:scripts.component.ts-ngOnInit');	
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        this.colAct = localStorage.getItem('colAct');
        this.colOrd = localStorage.getItem('colOrd');
        this.itemsPerPage = localStorage.getItem('scriptsItemsPerPage');
        if (this.itemsPerPage == null) {
            this.itemsPerPage = this.globalItemsPerPage;
            localStorage.setItem('scriptsItemsPerPage', this.itemsPerPage);
        }
        if (this.identity.role == 'admin') {
            this.activeUserId = localStorage.getItem('scriptsActiveUserId');
            if (this.activeUserId == null) {
                localStorage.setItem('scriptsActiveUserId', this.identity.sub);
                this.activeUserId = this.identity.sub;
            }
        }
        else {
            this.activeUserId = this.identity.sub;
            localStorage.removeItem('scriptsActiveUserId');
        }
        if (localStorage.getItem('activateScriptFavorites') != null) {
            this.activateScriptFavorites = localStorage.getItem('activateScriptFavorites');
        }
        else {
            this.activateScriptFavorites = 'false';
            localStorage.setItem('activateScriptFavorites', this.activateScriptFavorites);
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
                _this.searchString = null;
            }
            else {
                _this.searchString = search;
            }
            _this.getSearchScripts(page, _this.searchString, _this.itemsPerPage);
            if (_this.identity.role == 'admin') {
                _this.searchUsers();
            }
        });
    };
    ScriptsComponent.prototype.search = function (page, searchString, itemsPerPage) {
        if (page === void 0) { page = null; }
        this.searchString = searchString;
        this.itemsPerPage = itemsPerPage;
        localStorage.setItem('scriptsItemsPerPage', itemsPerPage);
        this.getSearchScripts(page, this.searchString, itemsPerPage);
    };
    ScriptsComponent.prototype.getSearchScripts = function (page, search, itemsPerPage) {
        //console.warn('D-1:scripts.component.ts-getSearchScripts');		
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
        this._scriptsService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.scripts = response.data;
                _this.loading = 'hide';
                // console.warn('scripts.component-getSearchScripts');
                // console.warn(this.scripts);
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
    ScriptsComponent.prototype.onSaveFavorites = function (scriptId, scriptFavorite) {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this.scriptFavorites = [];
        this.scriptFavorites.push({ scriptId: scriptId, scriptFavorite: scriptFavorite });
        this._scriptsService.saveFavorites(token, this.scriptFavorites).subscribe(function (response) {
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
    ScriptsComponent.prototype.onChangeFavorites = function () {
        // localStorage transforms everything to text, booleans are not accepted
        this.activateScriptFavorites = this.activateScriptFavorites == 'true' ? 'false' : 'true';
        localStorage.setItem('activateScriptFavorites', this.activateScriptFavorites);
    };
    ScriptsComponent.prototype.rowHidden = function (favorite) {
        switch (true) {
            case (this.activateScriptFavorites == 'false'):
                return false;
            case (this.activateScriptFavorites == 'true' && favorite == 1):
                return false;
            default:
                return true;
        }
    };
    ScriptsComponent.prototype.searchUsers = function () {
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
    ScriptsComponent.prototype.getUser = function (userid) {
        this.activeUserId = userid;
        localStorage.setItem('scriptsActiveUserId', userid);
        this.pageActual = 1;
        this.getSearchScripts(this.pageActual, this.searchString, this.itemsPerPage);
    };
    ////////////////////////////////////////////////////////////////////
    ScriptsComponent.prototype.deleteScript = function (id, page) {
        var _this = this;
        //console.warn('E-1:scripts.component.ts-deleteScript');		
        this.loading = 'show';
        // if there is only one id for this table on this page
        if (this.scripts.length === 1 && this.totalPages > 1) {
            page--;
        }
        if (id != undefined) {
            var token = this._loginService.getToken();
            var identity = this._loginService.getIdentity();
            var userowner = { "userowner": identity.sub };
            this._scriptsService.delete(token, id, userowner).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.getSearchScripts(page, _this.searchString, _this.itemsPerPage);
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
    ScriptsComponent.prototype.sortJsonArrayByProperty = function (objArray, prop, direction) {
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
    ScriptsComponent.prototype.setOrder = function (columna) {
        this.colAct = columna;
        localStorage.setItem('colAct', this.colAct);
        localStorage.setItem('colOrd', this.colOrd);
        switch (this.colOrd) {
            case 'asc':
                this.sortJsonArrayByProperty(this.scripts, columna, -1);
                this.colOrd = 'desc';
                break;
            case 'desc':
                this.sortJsonArrayByProperty(this.scripts, columna, 1);
                this.colOrd = 'asc';
                break;
            default:
                this.sortJsonArrayByProperty(this.scripts, columna, 1);
                this.colOrd = 'asc';
        }
    };
    __decorate([
        core_1.ViewChild(common_functions_1.CommonFunctions), 
        __metadata('design:type', common_functions_1.CommonFunctions)
    ], ScriptsComponent.prototype, "commonFunctions", void 0);
    ScriptsComponent = __decorate([
        core_1.Component({
            selector: 'scripts',
            templateUrl: 'app/views/scripts/scripts.html',
            directives: [router_1.ROUTER_DIRECTIVES, common_functions_1.CommonFunctions],
            providers: [login_service_1.LoginService, scripts_service_1.ScriptsService, user_services_1.UserService],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService, scripts_service_1.ScriptsService, core_1.ElementRef, user_services_1.UserService])
    ], ScriptsComponent);
    return ScriptsComponent;
}());
exports.ScriptsComponent = ScriptsComponent;
//# sourceMappingURL=scripts.component.js.map