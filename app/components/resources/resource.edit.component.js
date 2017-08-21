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
var resource_1 = require('../../model/resource');
var ResourceEditComponent = (function () {
    function ResourceEditComponent(_loginService, _resourcesService, _route, _router) {
        this._loginService = _loginService;
        this._resourcesService = _resourcesService;
        this._route = _route;
        this._router = _router;
        this.titulo = 'Edit Resource';
        this.idAttri = [];
        this.nameAttri = [];
        this.valueAttri = [];
        this.valueEncrypt = [];
        //console.warn('A-1: resource.edit.componenet.ts-constructor');
    }
    ResourceEditComponent.prototype.ngOnInit = function () {
        //console.warn('B-1: resource.edit.componenet.ts-ngOnInit');
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        this.resource = new resource_1.Resource(1, 1, 1, "", "", "", "", "", "");
        this.getResource();
    };
    ResourceEditComponent.prototype.getResource = function () {
        var _this = this;
        //console.warn('D-1:resource.edit.component.ts-getResource');		
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
            _this._resourcesService.detail(token, userowner, id).subscribe(function (response) {
                _this.resourceAttrib = response.data;
                _this.resource.id = response.data[0].id;
                _this.resource.name = response.data[0].name;
                _this.resource.notes = response.data[0].notes;
                _this.resource.type = response.data[0].type;
                _this.resource.bname = response.data[0].bname;
                _this.resource.cname = response.data[0].cname;
                for (var i = 0; i < _this.resourceAttrib.length; i++) {
                    _this.idAttri[i] = _this.resourceAttrib[i].did;
                    _this.nameAttri[i] = _this.resourceAttrib[i].dname;
                    _this.valueAttri[i] = _this.resourceAttrib[i].evalue;
                    _this.valueEncrypt[i] = _this.resourceAttrib[i].esecure;
                    if (_this.resourceAttrib[i].dsecure == 1) {
                        _this.valueEncrypt[i] = 1;
                    }
                    if ((_this.resourceAttrib[i].dsecure == 1 && _this.resourceAttrib[i].esecure == 1) || _this.resourceAttrib[i].esecure == 1) {
                        _this.valueAttri[i] = '********************';
                    }
                }
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
        });
        this.loading = 'hide';
    };
    ResourceEditComponent.prototype.onSubmit = function () {
        var _this = this;
        //console.warn('C-1: resource.edit.componenet.ts-onSubmit');
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        this.resource.userowner = identity.sub;
        var id = this.resource.id;
        // saves the ids for each attribute
        var cantId = this.idAttri.length;
        var contIdAttri = '';
        for (var i = 0; i < cantId; i++) {
            contIdAttri = (i == cantId - 1) ? contIdAttri + '{"id":"' + this.idAttri[i] + '"}' : contIdAttri + '{"id":"' + this.idAttri[i] + '"},';
        }
        // saves the values for each attribute
        var cantValue = this.valueAttri.length;
        var contValueAttri = '';
        var contValueEncrypt = '';
        for (var i = 0; i < cantValue; i++) {
            if (this.resourceAttrib[i].dsecure == 1) {
                this.valueEncrypt[i] = true;
            }
            contValueAttri = (i == cantValue - 1) ? contValueAttri + '{"value":"' + this.valueAttri[i] + '"}' : contValueAttri + '{"value":"' + this.valueAttri[i] + '"},';
            contValueEncrypt = (i == cantValue - 1) ? contValueEncrypt + '{"value":"' + this.valueEncrypt[i] + '"}' : contValueEncrypt + '{"value":"' + this.valueEncrypt[i] + '"},';
        }
        // creates the json for id and value of the attribute
        var contAttri = '{' + '"idAttribute":[' + contIdAttri + ']' + ',' + '"valueAttribute":[' + contValueAttri + ']' + ',' + '"valueEncrypt":[' + contValueEncrypt + ']' + '}';
        this._resourcesService.update(token, this.resource, contAttri, id, this.itemsPerPage).subscribe(function (response) {
            _this.status = response.status;
            _this.page = response.page;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                if (_this.searchString == null) {
                    _this._router.navigate(['/resources', _this.page]);
                }
                else {
                    _this._router.navigate(['/resources', _this.page, _this.searchString]);
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ResourceEditComponent = __decorate([
        core_1.Component({
            selector: 'resource-edit',
            templateUrl: 'app/views/resources/resource.edit.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, resources_service_1.ResourcesService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, resources_service_1.ResourcesService, router_1.ActivatedRoute, router_1.Router])
    ], ResourceEditComponent);
    return ResourceEditComponent;
}());
exports.ResourceEditComponent = ResourceEditComponent;
//# sourceMappingURL=resource.edit.component.js.map