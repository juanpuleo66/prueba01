import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ScriptsService} from '../../services/scripts/scripts.service';
import {Script} from '../../model/script';

@Component({
    selector: 'script-view',
    templateUrl: 'app/views/scripts/script.view.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, ScriptsService]
})

export class ScriptViewComponent implements OnInit{
	public titulo: string = 'View Script';
	public script: Script;
	public pageActual;
	public searchString;
	public errorMessage;
	public status;
	public code;
	public msg;
	public identity;
	public loading;
	public scriptParam;

	constructor(
		private _loginService: LoginService,
		private _scriptsService: ScriptsService,
		private _route: ActivatedRoute,
		private _router: Router
	){
//console.warn('A-1: script.edit.componenet.ts-constructor');
	}

	ngOnInit(){
//console.warn('B-1: script.view.componenet.ts-ngOnInit');
		this.identity = this._loginService.getIdentity();

		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}
		this.script = new Script(1, 0, "", "", "", "");
		this.getScript();
	}

	getScript(){
//console.warn('C-1:script.view.componenet.ts-getScripr');		
		this.loading = 'show';

		this._route.params.subscribe(params => {
			let id = +params["id"];
			let pageActual = +params["pageActual"];
			this.pageActual = pageActual;
			let searchString = params["search"];

			if ( !searchString || searchString.trim().length == 0 ){
				this.searchString = null;
			} else {
				this.searchString = searchString;
			}

			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let userowner = {"userowner":identity.sub}	// save in json format the userowner
			
			this._scriptsService.detail(token, userowner, id, 'view').subscribe(
				response => {
					this.status = response.status;

					if ( this.status != "success" ){
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.scriptParam = response.data;
						this.script.id = response.data[0].id;
						this.script.scriptName = response.data[0].scriptName;
						this.script.scriptPath = response.data[0].scriptPath;
						this.script.scriptLanguage = response.data[0].scriptLanguage;
						this.script.description = response.data[0].description;
						this.status = response.status;
					}
					this.loading = 'hide';
				},
				error => {
					this.errorMessage = <any>error;

					if (this.errorMessage != null){
						alert('Error: '+this.errorMessage);
					}
				}
			);
		});
	}

}
