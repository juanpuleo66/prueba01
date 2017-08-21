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
var resources_service_1 = require('../../services/resources/resources.service');
var generate_date_pipe_1 = require('../../pipes/generate.date.pipe');
var common_functions_1 = require('../../common/commonfunctions/common.functions');
var user_services_1 = require('../../services/users/user.services');
var global_1 = require('../../global');
var general_services_1 = require('../../services/general/general.services');
var ResourcesComponent = (function () {
    function ResourcesComponent(_route, _router, _loginService, _resourcesService, elementRef, _userService, _generalServices) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this._resourcesService = _resourcesService;
        this.elementRef = elementRef;
        this._userService = _userService;
        this._generalServices = _generalServices;
        this.titulo = "Resources: ";
        this.totalPages = 1;
        this.firstPage = 1;
        this.totalRecords = 1;
        this.pagePrev = 1;
        this.pageNext = 1;
        this.globalItemsPerPage = global_1.globalVariables['items_per_page'];
    }
    ResourcesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        this.colAct = localStorage.getItem('colAct');
        this.colOrd = localStorage.getItem('colOrd');
        this.itemsPerPage = localStorage.getItem('resourcesItemsPerPage');
        if (this.itemsPerPage == null) {
            this.itemsPerPage = this.globalItemsPerPage;
            localStorage.setItem('resourcesItemsPerPage', this.itemsPerPage);
        }
        if (this.identity.role == 'admin') {
            this.activeUserId = localStorage.getItem('resourcesActiveUserId');
            if (this.activeUserId == null) {
                localStorage.setItem('resourcesActiveUserId', this.identity.sub);
                this.activeUserId = this.identity.sub;
            }
        }
        else {
            this.activeUserId = this.identity.sub;
            localStorage.removeItem('resourcesActiveUserId');
        }
        if (localStorage.getItem('activeResourcePlatformName') != null) {
            this.activeResourcePlatformName = localStorage.getItem('activeResourcePlatformName');
            this.activeResourcePlatformId = localStorage.getItem('activeResourcePlatformId');
        }
        else {
            this.activeResourcePlatformName = 'All';
            localStorage.setItem('activeResourcePlatformName', this.activeResourcePlatformName);
            this.activeResourcePlatformId = '0';
            localStorage.setItem('activeResourcePlatformId', this.activeResourcePlatformId);
        }
        if (localStorage.getItem('activeResourceInstanceName') != null) {
            this.activeResourceInstanceName = localStorage.getItem('activeResourceInstanceName');
            this.activeResourceInstanceId = localStorage.getItem('activeResourceInstanceId');
        }
        else {
            this.activeResourceInstanceName = 'All';
            localStorage.setItem('activeResourceInstanceName', this.activeResourceInstanceName);
            this.activeResourceInstanceId = '0';
            localStorage.setItem('activeResourceInstanceId', this.activeResourceInstanceId);
        }
        if (localStorage.getItem('activateResourceFavorites') != null) {
            this.activateResourceFavorites = localStorage.getItem('activateResourceFavorites');
        }
        else {
            this.activateResourceFavorites = 'false';
            localStorage.setItem('activateResourceFavorites', this.activateResourceFavorites);
        }
        if (!this.colAct) {
            this.colAct = null;
        }
        if (!this.colOrd) {
            this.colOrd = null;
        }
        this.setOrder(this.colAct);
        this._route.params.subscribe(function (params) {
            var page = +params["page"]; //recoge lo que se manda por la url segun la ruta resources/:page 
            if (!page) {
                page = null;
            }
            var search = params["search"]; //recoge lo que se manda por la url segun la ruta resources/:page/:search
            if (!search || search.trim().length == 0) {
                search = null;
                _this.searchString = null;
            }
            else {
                _this.searchString = search;
            }
            _this.getSearchResources(page, _this.searchString, _this.itemsPerPage);
            _this.getResourcePlatforms();
            _this.getResourceInstances();
            if (_this.identity.role == 'admin') {
                _this.searchUsers();
            }
        });
    };
    ResourcesComponent.prototype.search = function (page, searchString, itemsPerPage) {
        if (page === void 0) { page = null; }
        this.searchString = searchString;
        this.itemsPerPage = itemsPerPage;
        localStorage.setItem('resourcesItemsPerPage', itemsPerPage);
        this.getSearchResources(page, this.searchString, itemsPerPage);
    };
    ResourcesComponent.prototype.getSearchResources = function (page, search, itemsPerPage) {
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
        this._resourcesService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeResourcePlatformId, this.activeResourceInstanceId, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.resources = response.data;
                for (var i = 0; i < _this.resources.length; i++) {
                    _this.resources[i].name = _this._generalServices.columnContentFormat(_this.resources[i].name, 30);
                    _this.resources[i].notes = _this._generalServices.columnContentFormat(_this.resources[i].notes, 50);
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
    ResourcesComponent.prototype.onSaveFavorites = function (resourceId, resourceFavorite) {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this.resourceFavorites = [];
        this.resourceFavorites.push({ resourceId: resourceId, resourceFavorite: resourceFavorite });
        this._resourcesService.saveFavorites(token, this.resourceFavorites).subscribe(function (response) {
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
    ResourcesComponent.prototype.onChangeFavorites = function () {
        // localStorage transforms everything to text, booleans are not accepted
        this.activateResourceFavorites = this.activateResourceFavorites == 'true' ? 'false' : 'true';
        localStorage.setItem('activateResourceFavorites', this.activateResourceFavorites);
    };
    ResourcesComponent.prototype.rowHidden = function (favorite) {
        switch (true) {
            case (this.activateResourceFavorites == 'false'):
                return false;
            case (this.activateResourceFavorites == 'true' && favorite == 1):
                return false;
            default:
                return true;
        }
    };
    ResourcesComponent.prototype.searchUsers = function () {
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
    ResourcesComponent.prototype.getUser = function (userid) {
        this.activeUserId = userid;
        localStorage.setItem('resourcesActiveUserId', userid);
        this.pageActual = 1;
        this.activeResourcePlatformName = 'All';
        localStorage.setItem('activeResourcePlatformName', this.activeResourcePlatformName);
        this.activeResourcePlatformId = '0';
        localStorage.setItem('activeResourcePlatformId', this.activeResourcePlatformId);
        this.activeResourceInstanceName = 'All';
        localStorage.setItem('activeResourceInstanceName', this.activeResourceInstanceName);
        this.activeResourceInstanceId = '0';
        localStorage.setItem('activeResourceInstanceId', this.activeResourceInstanceId);
        this.getSearchResources(this.pageActual, this.searchString, this.itemsPerPage);
        var self = this;
        var timeOut = setInterval(function () {
            clearInterval(timeOut);
            self.getResourcePlatforms();
            self.getResourceInstances();
        }, 500);
    };
    ResourcesComponent.prototype.getResourcePlatforms = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        this._resourcesService.getResourcePlatforms(token, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.resourcePlatforms = response.data;
                _this.resourcePlatforms.unshift({ resourcePlatformId: 0, resourcePlatformName: 'All' });
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ResourcesComponent.prototype.getResourceInstances = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        this._resourcesService.getResourceInstances(token, this.activeUserId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.resourceInstances = response.data;
                _this.resourceInstances.unshift({ resourceInstanceId: 0, resourceInstanceName: 'All' });
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ResourcesComponent.prototype.getPlatformName = function (platformName) {
        // console.log('platformName: '+platformName);
        var objPlatformName = this.resourcePlatforms[this.resourcePlatforms.findIndex(function (x) { return x.resourcePlatformName == platformName; })];
        this.activeResourcePlatformName = objPlatformName.resourcePlatformName;
        this.activeResourcePlatformId = objPlatformName.resourcePlatformId;
        localStorage.setItem('activeResourcePlatformName', this.activeResourcePlatformName);
        localStorage.setItem('activeResourcePlatformId', this.activeResourcePlatformId);
        this.getSearchResources(this.pageActual, this.searchString, this.itemsPerPage);
    };
    ResourcesComponent.prototype.getInstanceName = function (instanceName) {
        // console.log('instanceName: '+instanceName);
        var objInstanceName = this.resourceInstances[this.resourceInstances.findIndex(function (x) { return x.resourceInstanceName == instanceName; })];
        this.activeResourceInstanceName = objInstanceName.resourceInstanceName;
        this.activeResourceInstanceId = objInstanceName.resourceInstanceId;
        localStorage.setItem('activeResourceInstanceName', this.activeResourceInstanceName);
        localStorage.setItem('activeResourceInstanceId', this.activeResourceInstanceId);
        this.getSearchResources(this.pageActual, this.searchString, this.itemsPerPage);
    };
    ResourcesComponent.prototype.deleteResource = function (id, page) {
        var _this = this;
        this.loading = 'show';
        // if there is only one id for this table on this page
        if (this.resources.length === 1 && this.totalPages > 1) {
            page--;
        }
        if (id != undefined) {
            var token = this._loginService.getToken();
            this._resourcesService.delete(token, id).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.getSearchResources(page, _this.searchString, _this.itemsPerPage);
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
    ResourcesComponent.prototype.sortJsonArrayByProperty = function (objArray, prop, direction) {
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
    ResourcesComponent.prototype.setOrder = function (columna) {
        this.colAct = columna;
        localStorage.setItem('colAct', this.colAct);
        localStorage.setItem('colOrd', this.colOrd);
        switch (this.colOrd) {
            case 'asc':
                this.sortJsonArrayByProperty(this.resources, columna, -1);
                this.colOrd = 'desc';
                break;
            case 'desc':
                this.sortJsonArrayByProperty(this.resources, columna, 1);
                this.colOrd = 'asc';
                break;
            default:
                this.sortJsonArrayByProperty(this.resources, columna, 1);
                this.colOrd = 'asc';
        }
    };
    __decorate([
        core_1.ViewChild(common_functions_1.CommonFunctions), 
        __metadata('design:type', common_functions_1.CommonFunctions)
    ], ResourcesComponent.prototype, "commonFunctions", void 0);
    ResourcesComponent = __decorate([
        core_1.Component({
            selector: 'resources',
            templateUrl: 'app/views/resources/resources.html',
            directives: [router_1.ROUTER_DIRECTIVES, common_functions_1.CommonFunctions],
            providers: [login_service_1.LoginService, resources_service_1.ResourcesService, user_services_1.UserService, general_services_1.GeneralServices],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService, resources_service_1.ResourcesService, core_1.ElementRef, user_services_1.UserService, general_services_1.GeneralServices])
    ], ResourcesComponent);
    return ResourcesComponent;
}());
exports.ResourcesComponent = ResourcesComponent;
//# sourceMappingURL=resources.component.js.map