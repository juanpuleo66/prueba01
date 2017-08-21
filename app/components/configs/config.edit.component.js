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
var window_modal_message_1 = require('../../common/windowmodal/window.modal.message');
var config_1 = require('../../model/config');
var paramvalues_1 = require('../../model/paramvalues');
var general_services_1 = require('../../services/general/general.services');
var ConfigEditComponent = (function () {
    function ConfigEditComponent(_loginService, _configsService, _route, _router, _generalServices) {
        this._loginService = _loginService;
        this._configsService = _configsService;
        this._route = _route;
        this._router = _router;
        this._generalServices = _generalServices;
        this.titulo = 'Edit Config';
        this.titulo2 = 'Resources';
        this.arrparamvalues = [];
        this.inputResources = [];
        this.outputResources = [];
        this.dataConfig = [];
        this.viewParam = false;
    }
    ConfigEditComponent.prototype.ngOnInit = function () {
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
    ConfigEditComponent.prototype.viewParameters = function () {
        // 	expands collapses the parameters view in config.new.html
        this.viewParam = (this.viewParam == true) ? false : true;
    };
    ConfigEditComponent.prototype.getResources = function () {
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
    ConfigEditComponent.prototype.getScripts = function () {
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
                alert('Error ' + _this.errorMessage);
            }
        });
    };
    ConfigEditComponent.prototype.getParameters = function (idScript) {
        var _this = this;
        this.loading = 'show';
        this.idScript = idScript;
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        idScript = { "idScript": this.idScript };
        // searchs for the parameters of the script
        this._configsService.searchParameters(token, idScript).subscribe(function (responsed) {
            _this.status = responsed.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = responsed.code;
                _this.msg = responsed.msg;
            }
            else {
                _this.parameters = responsed.data;
                var lengthAttri = _this.parameters.length;
                _this.arrparamvalues = [];
                // initializes the array for the id and values for the parameters
                for (var i = 0; i < _this.parameters.length; i++) {
                    _this.arrparamvalues[i] = new paramvalues_1.Paramvalues(_this.parameters[i].bid, _this.parameters[i].bidScript, _this.parameters[i].did, _this.idScriptConfig, _this.parameters[i].bid, '', _this.parameters[i].bparamName, _this.parameters[i].bparamDescription, _this.parameters[i].bparamMandatory);
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error ' + _this.errorMessage);
            }
        });
        this.loading = 'hide';
    };
    ConfigEditComponent.prototype.addInputResource = function (gid, gname) {
        var tam = this.inputResources.length;
        if (tam == 0) {
            this.inputResources[0] = { eid: 0, idScriptConfig: this.idScriptConfig, gid: gid, gnameInput: gname };
        }
        // if needs more than one resource comment the instruction line below
        //		if ( tam == 0 ) {	
        var cond = true;
        for (var i = 0; i < tam; i++) {
            if (this.inputResources[i].gid == gid) {
                cond = false;
                break;
            }
        }
        if (cond) {
            this.inputResources[tam] = { eid: 0, idScriptConfig: this.idScriptConfig, gid: gid, gnameInput: gname };
        }
        //		}
    };
    ConfigEditComponent.prototype.removeInputResource = function (indice) {
        this.inputResources.splice(indice, 1);
    };
    ConfigEditComponent.prototype.addOutputResource = function (gid, gname) {
        var tam = this.outputResources.length;
        if (tam == 0) {
            this.outputResources[0] = { fid: 0, idScriptConfig: this.idScriptConfig, gid: gid, gnameOutput: gname };
        }
        // if needs more than one resource comment the instruction line below
        //		if ( tam == 0 ) {	
        var cond = true;
        for (var i = 0; i < tam; i++) {
            if (this.outputResources[i].gid == gid) {
                cond = false;
                break;
            }
        }
        if (cond) {
            this.outputResources[tam] = { fid: 0, idScriptConfig: this.idScriptConfig, gid: gid, gnameOutput: gname };
        }
        //		}
    };
    ConfigEditComponent.prototype.removeOutputResource = function (indice) {
        this.outputResources.splice(indice, 1);
    };
    ConfigEditComponent.prototype.onSubmit = function () {
        var _this = this;
        //console.warn('F-1:config.edit.componenet.ts-onSumbmit');	
        var cont = true;
        var cantParamValues = this.arrparamvalues.length;
        if (cont) {
            if (cantParamValues == 0) {
                // checks that there is at least one parameter
                cont = false;
                this.loading = 'hide';
                this.windowModalMessage.showWindowModalMessage('There has to be at least one parameter');
            }
        }
        if (this.inputResources.length == 0) {
            cont = false;
            this.windowModalMessage.showWindowModalMessage('There is no input resource for this config');
        }
        else if (this.outputResources.length == 0) {
            cont = false;
            this.windowModalMessage.showWindowModalMessage('There is no output resource for this config');
        }
        if (cont) {
            for (var i = 0; i < this.arrparamvalues.length; i++) {
                if (this.arrparamvalues[i].paramMandatory == 1 && this.arrparamvalues[i].paramValue.trim().length == 0) {
                    this.windowModalMessage.showWindowModalMessage('The value for a parameter that is mandatory can not be empty');
                    cont = false;
                    break;
                }
            }
        }
        if (cont) {
            this.loading = 'show';
            var token = this._loginService.getToken();
            var identity = this._loginService.getIdentity();
            this.config.userowner = identity.sub;
            this.config.idScript = this.idScript;
            var json1 = JSON.stringify(this.arrparamvalues);
            var json2 = JSON.stringify(this.inputResources);
            var json3 = JSON.stringify(this.outputResources);
            // puts all the data together in the same json
            var dataConfig = '{' + '"arrparamvalues":' + json1 + ', "inputResources":' + json2 + ', "outputResources":' + json3 + '}';
            this._configsService.update(token, this.config, dataConfig, this.config.id, this.itemsPerPage).subscribe(function (response) {
                _this.status = response.status;
                _this.page = response.page;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this._router.navigate(['/configs', _this.page]);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error: ' + _this.errorMessage);
                }
            });
        }
    };
    __decorate([
        core_1.ViewChild(window_modal_message_1.WindowModalMessage), 
        __metadata('design:type', window_modal_message_1.WindowModalMessage)
    ], ConfigEditComponent.prototype, "windowModalMessage", void 0);
    ConfigEditComponent = __decorate([
        core_1.Component({
            selector: 'config-edit',
            templateUrl: 'app/views/configs/config.edit.html',
            directives: [router_1.ROUTER_DIRECTIVES, window_modal_message_1.WindowModalMessage],
            providers: [login_service_1.LoginService, configs_service_1.ConfigsService, general_services_1.GeneralServices]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, configs_service_1.ConfigsService, router_1.ActivatedRoute, router_1.Router, general_services_1.GeneralServices])
    ], ConfigEditComponent);
    return ConfigEditComponent;
}());
exports.ConfigEditComponent = ConfigEditComponent;
//# sourceMappingURL=config.edit.component.js.map