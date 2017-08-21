import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {User} from '../../model/user';
 
@Component({
    selector: 'register',
    templateUrl: 'app/views/access/register.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService]
})

export class RegisterComponent implements OnInit{
	public titulo: string = 'Register a user';
	//public showPage: boolean;	// muestra el formulario asociado
	public user: User;
	public errorMessage;
	public status;
	public code;
	public msg;
	public identity;

	constructor(
		private _loginService: LoginService,
		private _route: ActivatedRoute,
		private _router: Router
	){}

	ngOnInit(){
		this.identity = this._loginService.getIdentity();
		
		if (this.identity == null || this.identity.role != 'admin') {
			this._router.navigate(["/index"]);
		}

		this.user = new User(1, "user", "", "", "", "", "null", -1,"");
	}

	onSubmit(){		
		let token = this._loginService.getToken();
			
		this._loginService.register(token, this.user).subscribe(
			response => {
				this.status = response.status;
				this.code = response.code;
				this.msg = response.msg;

				if ( this.status != "success" ){
					this.status = 'error';
				}
			},
			error => {
				this.errorMessage = <any>error;

				if (this.errorMessage != null){
console.log('Error-1: '+this.errorMessage);					
				}
			}
		);
	}

}