import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../../services/login.service';

@Component({
	selector: 'login',
	templateUrl: 'app/views/access/login.html',
	providers: [LoginService]
})

export class LoginComponent implements OnInit {
	public titulo: string = 'Login with your account';
	public showPage: boolean;	// muestra el formulario para el login
	public user;
	public errorMessage;
	public identity;
	public token;
	public status;
	public msg;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService
	){}

	ngOnInit() {
		// habilita el formulario
		this.showPage = true;
		// si se presiona sobre logout recoge el parametro que se esta mandando
		this._route.params.subscribe(params => {
			let logout = +params["id"];
			
			if ( logout == 1 ) {
				//localStorage.removeItem('identity');
				//localStorage.removeItem('token');
				localStorage.clear();
				this.identity = null;
				this.token = null;
				// se va a la pagina y la refresca
				window.location.href = "/";
				this.showPage = false;
			}
		});

		// por defecto inicializa los valores 
		this.user = {
			"email":"",
			"password":"",
			"getHash":"false"
		};

		let identity = this._loginService.getIdentity();
		
		if ( identity != null && identity.sub ){
			this._router.navigate(["/index"]);
			this.showPage = false;
		} 
	}

	onSubmit() {
//console.log(this.user);
		// se hace una peticion para validar el correo y la clave
		this._loginService.signup(this.user).subscribe(
			response => {
				let identity = response;
				this.identity = identity;

				if (this.identity.length <= 0) {
					// hubo un problema con el servidor y no se pudo realizar la peticion para la identity
console.log('Error: Error on the server with identity');					
				} else {
					
					if ( !this.identity.status ) {
						// si no existe status la peticion proceso satisfactoriamnete el correo y la clave 
						localStorage.setItem('identity', JSON.stringify(identity));

						// se realiza un peticion para sacar el token del usuario
						this.user.getHash = 'true';
						
						this._loginService.signup(this.user).subscribe(
							response => {
								let token = response;
								this.token = token;

								if ( this.token.length <= 0 ) {
									// hubo un problema con el servidor y no se pudo realizar la peticion para el token
console.log('Error: Error on the server with token');					
								} else {
									localStorage.setItem('token', token);
									// se va a la pagina y la refresca
									window.location.href ='/';
									//this._router.navigate(['/tasks']);
								}
							},
							error => {
								this.errorMessage = <any>error;
								
								if ( this.errorMessage != null ) {
console.log('Error on the request for the token: '+this.errorMessage);
								}
							}
						);
					} else {
						this.status = this.identity.status;
						//this.msg = this.identity.msg;
						this.msg = this.identity.data;
//console.log('this.status: '+this.status);
//console.log('this.msg: '+this.msg);
//console.log('this.data: '+this.data);
					}
				}
			},
			error => {
				this.errorMessage = <any>error;
								
				if ( this.errorMessage != null ) {
console.log('Error en la peticion de identity: '+this.errorMessage);
				}
			}
		);
	}

}
