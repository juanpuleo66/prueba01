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
var configs_service_1 = require('../../services/configs/configs.service');
var user_services_1 = require('../../services/users/user.services');
var generate_date_pipe_1 = require('../../pipes/generate.date.pipe');
var common_functions_1 = require('../../common/commonfunctions/common.functions');
var global_1 = require('../../global');
var general_services_1 = require('../../services/general/general.services');
var ConfigsComponent = (function () {
    function ConfigsComponent(_route, _router, _loginService, _configsService, elementRef, _userService, _generalservices) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this._configsService = _configsService;
        this.elementRef = elementRef;
        this._userService = _userService;
        this._generalservices = _generalservices;
        this.titulo = "Configs: ";
        this.totalPages = 1;
        this.firstPage = 1;
        this.totalRecords = 1;
        this.pagePrev = 1;
        this.pageNext = 1;
        this.globalItemsPerPage = global_1.globalVariables['items_per_page'];
    }
    ConfigsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        this.colAct = localStorage.getItem('colAct');
        this.colOrd = localStorage.getItem('colOrd');
        this.itemsPerPage = localStorage.getItem('configsItemsPerPage');
        if (this.itemsPerPage == null) {
            this.itemsPerPage = this.globalItemsPerPage;
            localStorage.setItem('configsItemsPerPage', this.itemsPerPage);
        }
        if (this.identity.role == 'admin') {
            this.activeUserId = localStorage.getItem('configsActiveUserId');
            if (this.activeUserId == null) {
                localStorage.setItem('configsActiveUserId', this.identity.sub);
                this.activeUserId = this.identity.sub;
            }
        }
        else {
            this.activeUserId = this.identity.sub;
            localStorage.removeItem('configsActiveUserId');
        }
        if (localStorage.getItem('activeConfigScriptName') != null) {
            this.activeConfigScriptName = localStorage.getItem('activeConfigScriptName');
            this.activeConfigScriptId = localStorage.getItem('activeConfigScriptId');
        }
        else {
            this.activeConfigScriptName = 'All';
            localStorage.setItem('activeConfigScriptName', this.activeConfigScriptName);
            this.activeConfigScriptId = '0';
            localStorage.setItem('activeConfigScriptId', this.activeConfigScriptId);
        }
        if (localStorage.getItem('activateConfigFavorites') != null) {
            this.activateConfigFavorites = localStorage.getItem('activateConfigFavorites');
        }
        else {
            this.activateConfigFavorites = 'false';
            localStorage.setItem('activateConfigFavorites', this.activateConfigFavorites);
        }
        if (!this.colAct) {
            this.colAct = null;
        }
        if (!this.colOrd) {
            this.colOrd = null;
        }
        this.setOrder(this.colAct);
        this._route.params.subscribe(function (params) {
            var page = +params["page"]; //recoge lo que se manda por la url segun la ruta configs/:page 
            if (!page) {
                page = null;
            }
            var search = params["search"]; //recoge lo que se manda por la url segun la ruta configs/:page/:search
            if (!search || search.trim().length == 0) {
                search = null;
                _this.searchString = null;
            }
            else {
                _this.searchString = search;
            }
            _this.getSearchConfigs(page, _this.searchString, _this.itemsPerPage);
            _this.getConfigScriptNames();
            if (_this.identity.role == 'admin') {
                _this.searchUsers();
            }
        });
    };
    ConfigsComponent.prototype.search = function (page, searchString, itemsPerPage) {
        if (page === void 0) { page = null; }
        this.searchString = searchString;
        this.itemsPerPage = itemsPerPage;
        localStorage.setItem('configsItemsPerPage', itemsPerPage);
        this.getSearchConfigs(page, this.searchString, itemsPerPage);
    };
    ConfigsComponent.prototype.getSearchConfigs = function (page, search, itemsPerPage) {
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
        this._configsService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeConfigScriptId, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.configs = response.data;
                for (var i = 0; i < _this.configs.length; i++) {
                    _this.configs[i].scriptConfigName = _this._generalservices.columnContentFormat(_this.configs[i].scriptConfigName, 20);
                }
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
    ConfigsComponent.prototype.onSaveFavorites = function (configId, configFavorite) {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this.configFavorites = [];
        this.configFavorites.push({ configId: configId, configFavorite: configFavorite });
        this._configsService.saveFavorites(token, this.configFavorites).subscribe(function (response) {
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
    ConfigsComponent.prototype.onChangeFavorites = function () {
        // localStorage transforms everything to text, booleans are not accepted
        this.activateConfigFavorites = this.activateConfigFavorites == 'true' ? 'false' : 'true';
        localStorage.setItem('activateConfigFavorites', this.activateConfigFavorites);
    };
    ConfigsComponent.prototype.rowHidden = function (favorite) {
        switch (true) {
            case (this.activateConfigFavorites == 'false'):
                return false;
            case (this.activateConfigFavorites == 'true' && favorite == 1):
                return false;
            default:
                return true;
        }
    };
    ConfigsComponent.prototype.searchUsers = function () {
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
    ConfigsComponent.prototype.getUser = function (userid) {
        this.activeUserId = userid;
        localStorage.setItem('configsActiveUserId', userid);
        this.pageActual = 1;
        this.activeConfigScriptName = 'All';
        localStorage.setItem('activeConfigScriptName', this.activeConfigScriptName);
        this.activeConfigScriptId = '0';
        localStorage.setItem('activeConfigScriptId', this.activeConfigScriptId);
        this.getSearchConfigs(this.pageActual, this.searchString, this.itemsPerPage);
        var self = this;
        var timeOut = setInterval(function () {
            clearInterval(timeOut);
            self.getConfigScriptNames();
        }, 500);
    };
    ConfigsComponent.prototype.getConfigScriptNames = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        this._configsService.getConfigScriptNames(token, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.configScriptNames = response.data;
                _this.configScriptNames.unshift({ scriptConfigId: 0, scriptConfigName: 'All' });
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ConfigsComponent.prototype.getConfigName = function (scriptName) {
        // console.warn('getConfigName');			
        var objConfigScriptName = this.configScriptNames[this.configScriptNames.findIndex(function (x) { return x.scriptConfigName == scriptName; })];
        this.activeConfigScriptName = objConfigScriptName.scriptConfigName;
        this.activeConfigScriptId = objConfigScriptName.scriptConfigId;
        localStorage.setItem('activeConfigScriptName', this.activeConfigScriptName);
        localStorage.setItem('activeConfigScriptId', this.activeConfigScriptId);
        this.getSearchConfigs(this.pageActual, this.searchString, this.itemsPerPage);
    };
    ConfigsComponent.prototype.deleteConfig = function (id, page) {
        var _this = this;
        this.loading = 'show';
        // if there is only one id for this table on this page
        if (this.configs.length === 1 && this.totalPages > 1) {
            page--;
        }
        if (id != undefined) {
            var token = this._loginService.getToken();
            this._configsService.delete(token, id).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.getSearchConfigs(page, _this.searchString, _this.itemsPerPage);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error-delete: ' + _this.errorMessage);
                }
            });
        }
    };
    ConfigsComponent.prototype.createTask = function (id) {
        var _this = this;
        this.loading = 'show';
        if (id != undefined) {
            var token = this._loginService.getToken();
            var identity = this._loginService.getIdentity();
            var userowner = { "userowner": identity.sub };
            this._configsService.createTask(token, id, userowner).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.status = "success-task";
                    _this.code = response.code;
                    _this.msg = response.msg;
                    var idTask = response.idTask;
                    _this.totalPages = response.totalPages;
                    _this._router.navigate(['/taskconfig_view', idTask, _this.totalPages, _this.itemsPerPage]);
                }
                _this.loading = 'hide';
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error-loadTask: ' + _this.errorMessage);
                }
            });
        }
    };
    ConfigsComponent.prototype.sortJsonArrayByProperty = function (objArray, prop, direction) {
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
    ConfigsComponent.prototype.setOrder = function (columna) {
        this.colAct = columna;
        localStorage.setItem('colAct', this.colAct);
        localStorage.setItem('colOrd', this.colOrd);
        switch (this.colOrd) {
            case 'asc':
                this.sortJsonArrayByProperty(this.configs, columna, -1);
                this.colOrd = 'desc';
                break;
            case 'desc':
                this.sortJsonArrayByProperty(this.configs, columna, 1);
                this.colOrd = 'asc';
                break;
            default:
                this.sortJsonArrayByProperty(this.configs, columna, 1);
                this.colOrd = 'asc';
        }
    };
    ConfigsComponent.prototype.exportConfigToFileJson = function (idConfig, nameConfig) {
        var _this = this;
        var link = document.createElement("a");
        link.id = "lnkDwnldLnk";
        document.body.appendChild(link);
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub }; // save in json format the userowner
        var jsonConfig;
        this._configsService.detail(token, userowner, idConfig).subscribe(function (response) {
            jsonConfig = JSON.stringify(response);
            var blob = new Blob([jsonConfig], { type: 'json' });
            var jsonUrl = window.URL.createObjectURL(blob);
            var filename = idConfig + "-" + nameConfig + ".json";
            $("#lnkDwnldLnk")
                .attr({
                'download': filename,
                'href': jsonUrl
            });
            $('#lnkDwnldLnk')[0].click();
            document.body.removeChild(link);
            _this.status = response.status;
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
    };
    __decorate([
        core_1.ViewChild(common_functions_1.CommonFunctions), 
        __metadata('design:type', common_functions_1.CommonFunctions)
    ], ConfigsComponent.prototype, "commonFunctions", void 0);
    ConfigsComponent = __decorate([
        core_1.Component({
            selector: 'configs',
            templateUrl: 'app/views/configs/configs.html',
            directives: [router_1.ROUTER_DIRECTIVES, common_functions_1.CommonFunctions],
            providers: [login_service_1.LoginService, configs_service_1.ConfigsService, user_services_1.UserService, general_services_1.GeneralServices],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService, configs_service_1.ConfigsService, core_1.ElementRef, user_services_1.UserService, general_services_1.GeneralServices])
    ], ConfigsComponent);
    return ConfigsComponent;
}());
exports.ConfigsComponent = ConfigsComponent;
//# sourceMappingURL=configs.component.js.map