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
var login_service_1 = require('../services/login.service');
var DefaultComponent = (function () {
    function DefaultComponent(_route, _router, _loginService) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this.titulo = "Welcome to BOSS-Business and Operating System Support";
        this.pagePrev = 1;
        this.pageNext = 1;
        //console.warn('A-1:default.component.ts-constructor');		
    }
    DefaultComponent.prototype.ngOnInit = function () {
        //console.warn('B-1:default.component.ts-ngOnInit');		
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        if (this.identity || this.identity != null) {
            this._router.navigate(['/tasks']);
        }
    };
    DefaultComponent = __decorate([
        core_1.Component({
            selector: 'default',
            templateUrl: 'app/views/default.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService])
    ], DefaultComponent);
    return DefaultComponent;
}());
exports.DefaultComponent = DefaultComponent;
//# sourceMappingURL=default.component.js.map