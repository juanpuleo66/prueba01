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
var LoginComponent = (function () {
    function LoginComponent(_route, _router, _loginService) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this.titulo = 'Login with your account';
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        // habilita el formulario
        this.showPage = true;
        // si se presiona sobre logout recoge el parametro que se esta mandando
        this._route.params.subscribe(function (params) {
            var logout = +params["id"];
            if (logout == 1) {
                //localStorage.removeItem('identity');
                //localStorage.removeItem('token');
                localStorage.clear();
                _this.identity = null;
                _this.token = null;
                // se va a la pagina y la refresca
                window.location.href = "/";
                _this.showPage = false;
            }
        });
        // por defecto inicializa los valores 
        this.user = {
            "email": "",
            "password": "",
            "getHash": "false"
        };
        var identity = this._loginService.getIdentity();
        if (identity != null && identity.sub) {
            this._router.navigate(["/index"]);
            this.showPage = false;
        }
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        //console.log(this.user);
        // se hace una peticion para validar el correo y la clave
        this._loginService.signup(this.user).subscribe(function (response) {
            var identity = response;
            _this.identity = identity;
            if (_this.identity.length <= 0) {
                // hubo un problema con el servidor y no se pudo realizar la peticion para la identity
                console.log('Error: Error on the server with identity');
            }
            else {
                if (!_this.identity.status) {
                    // si no existe status la peticion proceso satisfactoriamnete el correo y la clave 
                    localStorage.setItem('identity', JSON.stringify(identity));
                    // se realiza un peticion para sacar el token del usuario
                    _this.user.getHash = 'true';
                    _this._loginService.signup(_this.user).subscribe(function (response) {
                        var token = response;
                        _this.token = token;
                        if (_this.token.length <= 0) {
                            // hubo un problema con el servidor y no se pudo realizar la peticion para el token
                            console.log('Error: Error on the server with token');
                        }
                        else {
                            localStorage.setItem('token', token);
                            // se va a la pagina y la refresca
                            window.location.href = '/';
                        }
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            console.log('Error on the request for the token: ' + _this.errorMessage);
                        }
                    });
                }
                else {
                    _this.status = _this.identity.status;
                    //this.msg = this.identity.msg;
                    _this.msg = _this.identity.data;
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log('Error en la peticion de identity: ' + _this.errorMessage);
            }
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: 'app/views/access/login.html',
            providers: [login_service_1.LoginService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map