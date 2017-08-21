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
var upload_services_1 = require('../../services/users/upload.services');
var user_1 = require('../../model/user');
var global_1 = require('../../global');
var UserEditComponent = (function () {
    function UserEditComponent(_loginService, _userService, _uploadService, _route, _router) {
        this._loginService = _loginService;
        this._userService = _userService;
        this._uploadService = _uploadService;
        this._route = _route;
        this._router = _router;
        this.titulo = "Edit User";
        this.url = global_1.globalVariables['url_user_image'];
    }
    UserEditComponent.prototype.ngOnInit = function () {
        this.clearFormUser();
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        else {
            this.getUser();
            this.getUserGroups();
        }
    };
    UserEditComponent.prototype.getUserGroups = function () {
        var _this = this;
        var token = this._loginService.getToken();
        this._userService.getUserGroups(token).subscribe(function (response) {
            //this.status = response.status;
            if (response.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.userGroups = response.data;
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    UserEditComponent.prototype.getUser = function () {
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
                _this.searchUser = null;
            }
            else {
                _this.searchUser = searchString;
            }
            if (id != undefined) {
                _this.getDataUser(+id);
            }
            else {
                _this.getDataUser(_this.identity.sub);
            }
        });
    };
    UserEditComponent.prototype.clearFormUser = function () {
        this.idGroup = -1;
        this.user = new user_1.User(1, "", "", "", "", "", null, -1, "");
        this.userUpdated = new user_1.User(1, "", "", "", "", "", null, -1, "");
        this.filesToUpload = new Array();
        this.status = null;
    };
    UserEditComponent.prototype.onSubmit = function () {
        var _this = this;
        //this.checkSesion();
        this.loading = 'show';
        if (this.emailVerify == this.user.email && this.passwordVerify == this.user.password) {
            var token_1 = this._loginService.getToken();
            this.user.idGroup = this.idGroup;
            this._userService.edit(this.user, token_1, this.id).subscribe(function (response) {
                if (response.status == "success") {
                    _this.status = response.status;
                    var url = global_1.globalVariables['base_api_url'] + "/users/upload-image-user";
                    _this.passwordVerify = "**********";
                    _this.user.password = "**********";
                    _this.userUpdated.name = _this.user.name;
                    _this.userUpdated.surname = _this.user.surname;
                    if (_this.filesToUpload.length > 0) {
                        _this._uploadService.makeFileRequest(token_1, url, ['image'], _this.filesToUpload, _this.id).then(function (result) {
                            _this.resultUpload = result;
                            if (_this.resultUpload.status == "success") {
                                _this.user.image = _this.resultUpload.user_details.image;
                            }
                            // window.location.href = "/";  CAMBIAR VALORES DE LA CABECERA SIN EJECUTAR LA SENTENCIA ANTERIOR
                        }, function (error) { console.log(error); });
                    }
                    if (_this.searchUser == null) {
                        if (_this.id != undefined)
                            _this._router.navigate(['/users', _this.pageActual]);
                        else
                            _this._router.navigate(['/']);
                    }
                    else {
                        if (_this.id != undefined)
                            _this._router.navigate(['/users', _this.pageActual, _this.searchUser]);
                        else
                            _this._router.navigate(['/']);
                    }
                }
                else {
                    _this.status = response.status;
                    _this.msg = response.msg;
                    _this.code = response.code;
                }
                _this.loading = 'hide';
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
    UserEditComponent.prototype.getDataUser = function (id) {
        var _this = this;
        var token = this._loginService.getToken();
        this._userService.getUserById(id, token).subscribe(function (response) {
            _this.response = response;
            _this.code = _this.response.code;
            if (_this.response.status == "success") {
                _this.user.id = _this.response.user_details.id;
                _this.user.name = _this.response.user_details.name;
                _this.user.surname = _this.response.user_details.surname;
                _this.user.email = _this.response.user_details.email;
                _this.user.password = _this.response.user_details.password;
                _this.user.image = _this.response.user_details.image;
                _this.user.role = _this.response.user_details.role;
                _this.user.idGroup = _this.response.user_details.idGroup;
                _this.passwordVerify = _this.response.user_details.password;
                _this.emailVerify = _this.response.user_details.email;
                _this.idGroup = _this.user.idGroup;
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
            }
        });
    };
    UserEditComponent.prototype.fileChangeEvent = function (fileInput) {
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
    UserEditComponent = __decorate([
        core_1.Component({
            selector: 'editUser',
            templateUrl: 'app/views/users/user.edit.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, user_services_1.UserService, upload_services_1.UploadService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, user_services_1.UserService, upload_services_1.UploadService, router_1.ActivatedRoute, router_1.Router])
    ], UserEditComponent);
    return UserEditComponent;
}());
exports.UserEditComponent = UserEditComponent;
//# sourceMappingURL=user.edit.component.js.map