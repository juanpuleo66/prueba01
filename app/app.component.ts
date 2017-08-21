// Importar el núcleo de Angular
import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from './services/login.service';
import {globalVariables} from './global';

// Decorador component, indicamos en que etiqueta se va a cargar la 
@Component({
    selector: 'my-app',
    templateUrl: 'app/views/layout.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService]
})
 
// Clase del componente donde irán los datos y funcionalidades
export class AppComponent { 
	public identity;
	public token;
	public url = globalVariables['url_user_image'];

	constructor(
		private _loginService: LoginService,
		private _router: Router,
		private _route: ActivatedRoute
	){
//console.warn('A-1:app.component.ts-constructor');	
	}

	ngOnInit(){
//console.warn('B-1:app.component.ts-ngOnInit');	
		// se cargan estas variables de manera global para poder utilizarlas en cualquier parte 
		this.identity = this._loginService.getIdentity();
		localStorage.setItem('identity', JSON.stringify(this.identity));
		this.token = this._loginService.getToken();
		localStorage.setItem('token', this.token);
	}
}
