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
var window_modal_message_1 = require('../../common/windowmodal/window.modal.message');
var script_1 = require('../../model/script');
var ScriptNewComponent = (function () {
    function ScriptNewComponent(_loginService, _scriptsService, _route, _router) {
        this._loginService = _loginService;
        this._scriptsService = _scriptsService;
        this._route = _route;
        this._router = _router;
        this.titulo = 'New Script';
        this.scriptParam = [];
        //console.warn('A-1: script.new.componenet.ts-constructor');
    }
    ScriptNewComponent.prototype.ngOnInit = function () {
        //console.warn('B-1: script.new.componenet.ts-ngOnInit');
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        this.script = new script_1.Script(1, 0, "", "", "", "");
        if (this.scriptParam.length == 0) {
            this.scriptParam[0] = { bidScript: this.script.id, bid: 0, bparamName: '', bparamDescription: '', bparamMandatory: 1 };
        }
        this.getScript();
    };
    ScriptNewComponent.prototype.getScript = function () {
        var _this = this;
        //console.warn('C-1:script.new.componenet.ts-getScript');		
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
        });
    };
    ScriptNewComponent.prototype.addParameter = function () {
        //console.warn('D-1: script.new.componenet.ts-addParameter');
        var tam = this.scriptParam.length;
        this.scriptParam[tam] = { bidScript: this.script.id, bid: 0, bparamName: '', bparamDescription: '', bparamMandatory: 1 };
    };
    ScriptNewComponent.prototype.removeParameter = function (indice) {
        //console.warn('E-1: script.new.componenet.ts-removeParameter');
        this.scriptParam.splice(indice, 1);
    };
    ScriptNewComponent.prototype.onSubmit = function () {
        var _this = this;
        //console.warn('F-1: script.new.componenet.ts-onSubmit');
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        this.script.userowner = identity.sub;
        var id = this.script.id;
        // saves the names for each parameter
        var cantParam = this.scriptParam.length;
        var valuParam = '';
        for (var i = 0; i < cantParam; i++) {
            this.scriptParam[i].bparamMandatory = (this.scriptParam[i].bparamMandatory == true) ? 1 : 0;
        }
        var cont = true;
        if (cont) {
            if (cantParam == 0) {
                // checks that there is at least one parameter
                cont = false;
                this.loading = 'hide';
                this.windowModalMessage.showWindowModalMessage('There has to be at least one parameter');
            }
        }
        if (cont) {
            for (var i = 0; i < cantParam; i++) {
                if (this.scriptParam[i].bparamName.trim().length == 0) {
                    // checks that each name for a parameter is not empty
                    cont = false;
                    this.loading = 'hide';
                    this.scriptParam[i].bparamName = this.scriptParam[i].bparamName.trim();
                    this.windowModalMessage.showWindowModalMessage('The name of the parameter can not be empty');
                }
                else if (this.scriptParam[i].bparamDescription.trim().length == 0) {
                    // checks that each description for a parameter is not empty
                    cont = false;
                    this.loading = 'hide';
                    this.scriptParam[i].bparamDescription = this.scriptParam[i].bparamDescription.trim();
                    this.windowModalMessage.showWindowModalMessage('The description for the parameter can not be empty');
                }
            }
        }
        if (cont) {
            // checks that name for a parameter is not repeated
            var paramNames1 = [];
            for (var i = 0; i < cantParam; i++) {
                paramNames1.push(this.scriptParam[i].bparamName.trim());
            }
            var paramNames2 = this.eliminateDuplicates(paramNames1);
            if (paramNames1.length != paramNames2.length) {
                cont = false;
                this.loading = 'hide';
                this.windowModalMessage.showWindowModalMessage('The name for a parameter is repeated');
            }
        }
        if (cont) {
            for (var i = 0; i < cantParam; i++) {
                valuParam = valuParam + '{"bid":"' + this.scriptParam[i].bid + '", ' + '"bparamName":"' + this.scriptParam[i].bparamName + '", "bparamDescription":"' + this.scriptParam[i].bparamDescription + '", "bparamMandatory":"' + this.scriptParam[i].bparamMandatory + '"}';
                if (i < cantParam - 1) {
                    valuParam = valuParam + ', ';
                }
            }
            // creates the json for id and value of the attribute
            var contParam = '{' + '"valuParam":[' + valuParam + ']' + '}';
            this._scriptsService.register(token, this.script, contParam, this.itemsPerPage).subscribe(function (response) {
                _this.status = response.status;
                _this.page = response.page;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    if (_this.searchString == null) {
                        _this._router.navigate(['/scripts', _this.page]);
                    }
                    else {
                        _this._router.navigate(['/scripts', _this.page, _this.searchString]);
                    }
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error: ' + _this.errorMessage);
                }
            });
            this.loading = 'hide';
        }
    };
    ScriptNewComponent.prototype.eliminateDuplicates = function (arr) {
        var i, len = arr.length, out = [], obj = {};
        for (i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    };
    __decorate([
        core_1.ViewChild(window_modal_message_1.WindowModalMessage), 
        __metadata('design:type', window_modal_message_1.WindowModalMessage)
    ], ScriptNewComponent.prototype, "windowModalMessage", void 0);
    ScriptNewComponent = __decorate([
        core_1.Component({
            selector: 'script-new',
            templateUrl: 'app/views/scripts/script.new.html',
            directives: [router_1.ROUTER_DIRECTIVES, window_modal_message_1.WindowModalMessage],
            providers: [login_service_1.LoginService, scripts_service_1.ScriptsService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, scripts_service_1.ScriptsService, router_1.ActivatedRoute, router_1.Router])
    ], ScriptNewComponent);
    return ScriptNewComponent;
}());
exports.ScriptNewComponent = ScriptNewComponent;
//# sourceMappingURL=script.new.component.js.map