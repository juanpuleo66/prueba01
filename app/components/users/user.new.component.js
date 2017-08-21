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
var global_1 = require('../../global');
var user_1 = require('../../model/user');
var UserRegisterComponent = (function () {
    function UserRegisterComponent(_loginService, _userService, _route, _router) {
        this._loginService = _loginService;
        this._userService = _userService;
        this._route = _route;
        this._router = _router;
        this.titulo = "New User";
        this.url = global_1.globalVariables['url_user_image'];
    }
    UserRegisterComponent.prototype.ngOnInit = function () {
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        else {
            this.getUser();
            this.getUserGroups();
            this.clearFormUser();
        }
    };
    UserRegisterComponent.prototype.getUser = function () {
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
                _this.searchUser = null;
            }
            else {
                _this.searchUser = searchString;
            }
        });
        console.log('this.itemsPerPage: ' + this.itemsPerPage);
    };
    UserRegisterComponent.prototype.getUserGroups = function () {
        var _this = this;
        var token = this._loginService.getToken();
        this._userService.getUserGroups(token).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.userGroups = response.data;
                _this.idGroup = _this.userGroups[0].id;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    UserRegisterComponent.prototype.onSubmit = function () {
        var _this = this;
        this.loading = 'show';
        //this.checkSesion();
        if (this.emailVerify == this.user.email && this.passwordVerify == this.user.password) {
            this.loading = 'show';
            this.user.idGroup = this.idGroup;
            this._userService.register(this.user, this._loginService.getToken()).subscribe(function (response) {
                _this.status = response.status;
                _this.msg = response.msg;
                _this.code = response.code;
                if (_this.status == "success") {
                    _this.userRegistered = _this.user;
                    if (_this.searchUser == null) {
                        _this._router.navigate(['/users', _this.pageActual]);
                    }
                    else {
                        _this._router.navigate(['/users', _this.pageActual, _this.searchUser]);
                    }
                    _this.loading = 'hide';
                }
                else {
                    _this.loading = 'hide';
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                }
            });
        }
        else {
            if (this.emailVerify == this.user.email) {
                this.code = "400";
                this.msg = "Data is wrong verify password values these need be the same. Thank you";
                this.status = "error";
            }
            else {
                this.code = "400";
                this.msg = "Data is wrong verify email values these need be the same. Thank you";
                this.status = "error";
            }
            this.loading = 'hide';
        }
    };
    UserRegisterComponent.prototype.clearFormUser = function () {
        this.user = new user_1.User(1, "user", "", "", "", "", null, -1, "");
        this.passwordVerify = "";
        this.emailVerify = "";
        this.loading = 'hide';
    };
    UserRegisterComponent.prototype.fileChangeEvent = function (fileInput) {
        this.filesToUpload = fileInput.target.files;
        if (this.filesToUpload.length > 0) {
            document.getElementById("upload-progress-bar").setAttribute("value", "100");
            document.getElementById("upload-progress-bar").setAttribute("aria-valuenow", "100");
            document.getElementById("upload-progress-bar").style.width = "100%";
        }
        else {
            document.getElementById("upload-progress-bar").setAttribute("value", "0%");
            document.getElementById("upload-progress-bar").setAttribute("aria-valuenow", "0%");
            document.getElementById("upload-progress-bar").style.width = "0%";
        }
    };
    UserRegisterComponent = __decorate([
        core_1.Component({
            selector: 'register',
            templateUrl: 'app/views/users/user.new.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, user_services_1.UserService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_services_1.UserService, router_1.ActivatedRoute, router_1.Router])
    ], UserRegisterComponent);
    return UserRegisterComponent;
}());
exports.UserRegisterComponent = UserRegisterComponent;
//# sourceMappingURL=user.new.component.js.map