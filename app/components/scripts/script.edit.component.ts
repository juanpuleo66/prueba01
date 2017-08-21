import {Component, OnInit, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ScriptsService} from '../../services/scripts/scripts.service';
import {WindowModalMessage} from '../../common/windowmodal/window.modal.message';
import {Script} from '../../model/script';

@Component({
    selector: 'script-edit',
    templateUrl: 'app/views/scripts/script.edit.html',
    directives: [ROUTER_DIRECTIVES, WindowModalMessage],
    providers: [LoginService, ScriptsService]
})

export class ScriptEditComponent implements OnInit{
	public titulo: string = 'Edit Script';
	public script: Script;
	public pageActual;
	public searchString;
	public errorMessage;
	public status;
	public code;
	public msg;
	public page;
	public identity;
	public itemsPerPage;
	public loading;
	public scriptParam;

	@ViewChild(WindowModalMessage) windowModalMessage: WindowModalMessage;

	constructor(
		private _loginService: LoginService,
		private _scriptsService: ScriptsService,
		private _route: ActivatedRoute,
		private _router: Router
	){
//console.warn('A-1: script.edit.componenet.ts-constructor');
	}

	ngOnInit(){
//console.warn('B-1: script.edit.componenet.ts-ngOnInit');
		this.identity = this._loginService.getIdentity();

		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}
		this.script = new Script(1, 0, "", "", "", "");
		this.getScript();
	}

	getScript(){
//console.warn('C-1:script.edit.componenet.ts-getScript');		
		this.loading = 'show';

		this._route.params.subscribe(params => {
			let id = +params["id"];
			let pageActual = +params["pageActual"];
			this.pageActual = pageActual;
			let itemsPerPage = params["itemsPerPage"];
			this.itemsPerPage = itemsPerPage;
			let searchString = params["search"];

			if ( !searchString || searchString.trim().length == 0 ){
				this.searchString = null;
			} else {
				this.searchString = searchString;
			}

			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let userowner = {"userowner":identity.sub}	// save in json format the userowner
			
			this._scriptsService.detail(token, userowner, id, 'edit').subscribe(
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
						this.loading = 'hide';
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

	addParameter(){	
//console.warn('D-1:script.edit.componenet.ts-addParameter');
		var tam = this.scriptParam.length;
		this.scriptParam[tam] = {bidScript: this.script.id, bid:0, bparamName:'', bparamDescription:'', bparamMandatory:1};
	}

	removeParameter(indice){	
//console.warn('E-1:script.edit.componenet.ts-addParameter');
		this.scriptParam.splice(indice, 1)
	}

	onSubmit(){	
//console.warn('F-1: script.edit.componenet.ts-onSubmit');
		this.loading = 'show';
		let token = this._loginService.getToken();
		let id = this.script.id
		let identity = this._loginService.getIdentity();
		this.script.userowner = identity.sub;

		// saves the names for each parameter
		let cantParam = this.scriptParam.length;
		let valuParam = ''; 

		for ( let i=0; i < cantParam; i++ ) {
			if ( this.scriptParam[i].bparamDescription === null ) {
				this.scriptParam[i].bparamDescription = '';	
			} 

			if ( this.scriptParam[i].bparamMandatory == true || this.scriptParam[i].bparamMandatory == null ) {
				this.scriptParam[i].bparamMandatory = 1;	
			} else {
				this.scriptParam[i].bparamMandatory = 0;
			}
		}

		let cont = true;

		if ( cont ) {
			if ( cantParam == 0 ) {
				// checks that there is at least one parameter
				cont = false;
				this.loading = 'hide';
				this.windowModalMessage.showWindowModalMessage('There has to be at least one parameter');
			}
		}

		if ( cont ) {
			for ( let i=0; i < cantParam; i++ ) {

				if ( this.scriptParam[i].bparamName.trim().length == 0 ) {
					// checks that each name for a parameter is not empty
					cont = false;
					this.loading = 'hide';
					this.scriptParam[i].bparamName = this.scriptParam[i].bparamName.trim();
					this.windowModalMessage.showWindowModalMessage('The name of the parameter can not be empty');
				} else if ( this.scriptParam[i].bparamDescription.trim().length == 0 ) {
					// checks that each description for a parameter is not empty
					cont = false;
					this.loading = 'hide';
					this.scriptParam[i].bparamDescription = this.scriptParam[i].bparamDescription.trim();
					this.windowModalMessage.showWindowModalMessage('The description for the parameter can not be empty');
				}
			}
		}

		if ( cont ) {
			// checks that name for a parameter is not repeated
			let paramNames1 = [];
			
			for ( let i=0; i < cantParam; i++ ) {
				paramNames1.push(this.scriptParam[i].bparamName.trim());
			}

			let paramNames2= this.eliminateDuplicates(paramNames1);

			if ( paramNames1.length != paramNames2.length ) {
				cont = false;
				this.loading = 'hide';
				this.windowModalMessage.showWindowModalMessage('The name for a parameter is repeated');
			}
		}
		
		if ( cont ) {

			for ( let i=0; i < cantParam; i++ ) {

				valuParam = valuParam + '{"bid":"'+this.scriptParam[i].bid+'", '+'"bparamName":"'+this.scriptParam[i].bparamName+'", "bparamDescription":"'+this.scriptParam[i].bparamDescription+'", "bparamMandatory":"'+this.scriptParam[i].bparamMandatory+'"}';

				if ( i < cantParam-1 ) {
					valuParam = valuParam + ', ';	
				}
			}

			// creates the json for id and value of the attribute
			let contParam = '{'+'"valuParam":['+valuParam+']'+'}';

			this._scriptsService.update(token, this.script, contParam, id, this.itemsPerPage).subscribe(
				response => {
					this.status = response.status;
					this.page = response.page;

					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						if ( this.searchString == null ) {
							this._router.navigate(['/scripts', this.page]);
						} else {
							this._router.navigate(['/scripts', this.page, this.searchString]);
						}
					}
				},
				error => {
					this.errorMessage = <any>error;

					if (this.errorMessage != null){
						alert('Error: '+this.errorMessage);		
					}
				}
			);
		}
	}

	eliminateDuplicates(arr) {
 		var i,
     	len=arr.length,
     	out=[],
     	obj={};

 		for ( i=0; i < len; i++ ) {
    		obj[arr[i]]=0;
 		}
 		
 		for (i in obj) {
    		out.push(i);
 		}

 		return out;
	}

}
