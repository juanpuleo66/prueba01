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
var script_1 = require('../../model/script');
var ScriptViewComponent = (function () {
    function ScriptViewComponent(_loginService, _scriptsService, _route, _router) {
        this._loginService = _loginService;
        this._scriptsService = _scriptsService;
        this._route = _route;
        this._router = _router;
        this.titulo = 'View Script';
        //console.warn('A-1: script.edit.componenet.ts-constructor');
    }
    ScriptViewComponent.prototype.ngOnInit = function () {
        //console.warn('B-1: script.view.componenet.ts-ngOnInit');
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        this.script = new script_1.Script(1, 0, "", "", "", "");
        this.getScript();
    };
    ScriptViewComponent.prototype.getScript = function () {
        var _this = this;
        //console.warn('C-1:script.view.componenet.ts-getScripr');		
        this.loading = 'show';
        this._route.params.subscribe(function (params) {
            var id = +params["id"];
            var pageActual = +params["pageActual"];
            _this.pageActual = pageActual;
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
            _this._scriptsService.detail(token, userowner, id, 'view').subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.scriptParam = response.data;
                    _this.script.id = response.data[0].id;
                    _this.script.scriptName = response.data[0].scriptName;
                    _this.script.scriptPath = response.data[0].scriptPath;
                    _this.script.scriptLanguage = response.data[0].scriptLanguage;
                    _this.script.description = response.data[0].description;
                    _this.status = response.status;
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
    ScriptViewComponent = __decorate([
        core_1.Component({
            selector: 'script-view',
            templateUrl: 'app/views/scripts/script.view.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, scripts_service_1.ScriptsService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, scripts_service_1.ScriptsService, router_1.ActivatedRoute, router_1.Router])
    ], ScriptViewComponent);
    return ScriptViewComponent;
}());
exports.ScriptViewComponent = ScriptViewComponent;
//# sourceMappingURL=script.view.component.js.map