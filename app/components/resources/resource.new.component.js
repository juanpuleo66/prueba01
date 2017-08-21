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
var ResourceNewComponent = (function () {
    function ResourceNewComponent(_loginService, _resourcesService, _route, _router) {
        this._loginService = _loginService;
        this._resourcesService = _resourcesService;
        this._route = _route;
        this._router = _router;
        this.titulo = 'Create Resource';
        this.bid = 1;
        this.cid = 1;
        this.idAttri = [];
        this.valueAttri = [];
        this.valueEncrypt = [];
        //console.warn('A-1: resource.new.componenet.ts-constructor');
    }
    ResourceNewComponent.prototype.ngOnInit = function () {
        var _this = this;
        //console.warn('B-1: resource.new.componenet.ts-ngOnInit');		
        // loads theplatforms	
        this.getPlatforms();
        // loads the instances
        this.getInstances(this.bid);
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        this.resource = new resource_1.Resource(1, 1, 1, "", "", "", "", "", "");
        this._route.params.subscribe(function (params) {
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
        });
    };
    ResourceNewComponent.prototype.getPlatforms = function () {
        var _this = this;
        //console.warn('D-1:resources.new.component.ts-getPlatforms');		
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        this._resourcesService.searchPlatforms(token).subscribe(function (responseb) {
            _this.status = responseb.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = responseb.code;
                _this.msg = responseb.msg;
            }
            else {
                _this.platforms = responseb.data;
                _this.bid = _this.platforms[0].bid;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ResourceNewComponent.prototype.getInstances = function (bid) {
        var _this = this;
        //console.warn('E-1:resources.new.component.ts-getInstances');		
        this.loading = 'show';
        this.bid = bid;
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        bid = { "bid": this.bid };
        // serchs for the instance of the platform 
        this._resourcesService.searchInstances(token, bid).subscribe(function (responsec) {
            _this.status = responsec.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = responsec.code;
                _this.msg = responsec.msg;
            }
            else {
                _this.instances = responsec.data;
                _this.cid = _this.instances[0].cid;
                _this.getAttributes(_this.cid);
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ResourceNewComponent.prototype.getAttributes = function (cid) {
        var _this = this;
        //console.warn('F-1:resources.new.component.ts-getAttributes');		
        this.loading = 'show';
        this.cid = cid;
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        cid = { "cid": this.cid };
        // searchs for the instance of the platform 
        this._resourcesService.searchAttributes(token, cid).subscribe(function (responsed) {
            _this.status = responsed.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = responsed.code;
                _this.msg = responsed.msg;
            }
            else {
                _this.attributes = responsed.data;
                var lengthAttri = _this.attributes.length;
                // initializes the arrays for the id and values attributes
                _this.idAttri = [];
                _this.valueAttri = [];
                for (var i = 0; i < _this.attributes.length; i++) {
                    _this.idAttri[i] = _this.attributes[i].did;
                    _this.valueAttri[i] = '';
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
        this.loading = 'hide';
    };
    ResourceNewComponent.prototype.onSubmit = function () {
        var _this = this;
        //console.warn('G-1:resources.new.component.ts-onSumbmit');		
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        this.resource.userowner = identity.sub;
        this.resource.idPlatform = this.bid;
        this.resource.idInstance = this.cid;
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
            if (this.attributes[i].dsecure == 1) {
                this.valueEncrypt[i] = true;
            }
            contValueAttri = (i == cantValue - 1) ? contValueAttri + '{"value":"' + this.valueAttri[i] + '"}' : contValueAttri + '{"value":"' + this.valueAttri[i] + '"},';
            contValueEncrypt = (i == cantValue - 1) ? contValueEncrypt + '{"value":"' + this.valueEncrypt[i] + '"}' : contValueEncrypt + '{"value":"' + this.valueEncrypt[i] + '"},';
        }
        // creates the json for id and value of the attribute
        var contAttri = '{' + '"idAttribute":[' + contIdAttri + ']' + ',' + '"valueAttribute":[' + contValueAttri + ']' + ',' + '"valueEncrypt":[' + contValueEncrypt + ']' + '}';
        this._resourcesService.register(token, this.resource, contAttri, this.itemsPerPage).subscribe(function (response) {
            _this.status = response.status;
            _this.page = response.page;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this._router.navigate(['/resources', _this.page]);
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ResourceNewComponent = __decorate([
        core_1.Component({
            selector: 'reosurce-new',
            templateUrl: 'app/views/resources/resource.new.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, resources_service_1.ResourcesService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, resources_service_1.ResourcesService, router_1.ActivatedRoute, router_1.Router])
    ], ResourceNewComponent);
    return ResourceNewComponent;
}());
exports.ResourceNewComponent = ResourceNewComponent;
//# sourceMappingURL=resource.new.component.js.map