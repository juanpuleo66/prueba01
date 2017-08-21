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
var user_services_1 = require('../../services/users/user.services');
var user_1 = require('../../model/user');
var global_1 = require('../../global');
var UserViewComponent = (function () {
    function UserViewComponent(_loginService, _userService, _route, _router) {
        this._loginService = _loginService;
        this._userService = _userService;
        this._route = _route;
        this._router = _router;
        this.url = global_1.globalVariables['url_user_image'];
    }
    UserViewComponent.prototype.ngOnInit = function () {
        this.clearFormUser();
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        else {
            this.getUser();
        }
    };
    UserViewComponent.prototype.getUser = function () {
        var _this = this;
        //console.warn('C-1:script.edit.componenet.ts-getScript');    
        this.loading = 'show';
        this._route.params.subscribe(function (params) {
            var id = params["id"];
            _this.id = id;
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
            if (id != undefined) {
                _this.getDataUser(+id);
            }
            else {
                _this.getDataUser(_this.identity.subEncrypted);
            }
        });
    };
    UserViewComponent.prototype.clearFormUser = function () {
        this.user = new user_1.User(1, "", "", "", "", "", null, -1, "");
        this.status = null;
    };
    UserViewComponent.prototype.getDataUser = function (id) {
        var _this = this;
        var token = this._loginService.getToken();
        this._userService.getUserById(id, token).subscribe(function (response) {
            _this.response = response;
            _this.code = _this.response.code;
            if (_this.response.status == "success") {
                _this.groupUser = _this.response.group_user;
                _this.user.id = _this.response.user_details.id;
                _this.user.name = _this.response.user_details.name;
                _this.user.surname = _this.response.user_details.surname;
                _this.user.email = _this.response.user_details.email;
                _this.user.password = _this.response.user_details.password;
                _this.user.image = _this.response.user_details.image;
                _this.user.role = _this.response.user_details.role;
                _this.titulo = "View User";
                _this.loading = 'hide';
            }
            else {
                _this.msg = _this.response.msg;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
            }
        });
    };
    UserViewComponent = __decorate([
        core_1.Component({
            selector: 'viewUser',
            templateUrl: 'app/views/users/user.view.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, user_services_1.UserService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_services_1.UserService, router_1.ActivatedRoute, router_1.Router])
    ], UserViewComponent);
    return UserViewComponent;
}());
exports.UserViewComponent = UserViewComponent;
//# sourceMappingURL=user.view.component.js.map