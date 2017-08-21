import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../services/login.service';
 
@Component({
    selector: 'default',
    templateUrl: 'app/views/default.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService]
})
 
export class DefaultComponent {
	public titulo = "Welcome to BOSS-Business and Operating System Support";
	public identity;
	public videos;
	public errorMessage;
	public status;
	public loading;
	public pages;
	public pagePrev = 1;
	public pageNext = 1;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService
	){
//console.warn('A-1:default.component.ts-constructor');		
	}

	ngOnInit(){
//console.warn('B-1:default.component.ts-ngOnInit');		
		this.loading = 'show';
		this.identity = this._loginService.getIdentity();
		if ( this.identity || this. identity != null) {
			this._router.navigate(['/tasks']);
		}
	}
	
}
