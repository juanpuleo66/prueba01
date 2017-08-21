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
var config_1 = require('../../model/config');
var general_services_1 = require('../../services/general/general.services');
var ConfigViewComponent = (function () {
    function ConfigViewComponent(_loginService, _configsService, _route, _router, _generalServices) {
        this._loginService = _loginService;
        this._configsService = _configsService;
        this._route = _route;
        this._router = _router;
        this._generalServices = _generalServices;
        this.titulo = 'View Config';
        this.titulo2 = 'Resources';
        this.arrparamvalues = [];
        this.inputResources = [];
        this.outputResources = [];
        this.dataConfig = [];
        this.viewParam = false;
    }
    ConfigViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        // loads the resources
        this.getResources();
        // loads the scripts	
        this.getScripts();
        this.config = new config_1.Config(1, "", 1, "", "");
        this.loading = 'show';
        this._route.params.subscribe(function (params) {
            var id = +params["id"];
            _this.idScriptConfig = id;
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
            _this._configsService.detail(token, userowner, id).subscribe(function (response) {
                _this.config = response.config[0];
                _this.inputResources = response.inputResources;
                _this.outputResources = response.outputResources;
                _this.arrparamvalues = response.arrparamvalues;
                // puts the script that belongs to the config
                _this.idScript = _this.config.idScript;
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
    };
    ConfigViewComponent.prototype.viewParameters = function () {
        // 	expands collapses the parameters view in config.new.html
        this.viewParam = (this.viewParam == true) ? false : true;
    };
    ConfigViewComponent.prototype.getResources = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this._configsService.searchResources(token, userowner).subscribe(function (responseb) {
            _this.status = responseb.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = responseb.code;
                _this.msg = responseb.msg;
            }
            else {
                _this.resources = responseb.data;
                for (var i = 0; i < _this.resources.length; i++) {
                    _this.resources[i].gname = _this._generalServices.columnContentFormat(_this.resources[i].gname, 20);
                    _this.resources[i].gnotes = _this._generalServices.columnContentFormat(_this.resources[i].gnotes, 30);
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ConfigViewComponent.prototype.getScripts = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        // serchs for the instance of the platform 
        this._configsService.searchScripts(token).subscribe(function (responsec) {
            _this.status = responsec.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = responsec.code;
                _this.msg = responsec.msg;
            }
            else {
                _this.scripts = responsec.data;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    ConfigViewComponent = __decorate([
        core_1.Component({
            selector: 'config-view',
            templateUrl: 'app/views/configs/config.view.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, configs_service_1.ConfigsService, general_services_1.GeneralServices]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, configs_service_1.ConfigsService, router_1.ActivatedRoute, router_1.Router, general_services_1.GeneralServices])
    ], ConfigViewComponent);
    return ConfigViewComponent;
}());
exports.ConfigViewComponent = ConfigViewComponent;
//# sourceMappingURL=config.view.component.js.map