import {Component, OnInit, ViewChild } from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ConfigsService} from '../../services/configs/configs.service';
import {WindowModalMessage} from '../../common/windowmodal/window.modal.message';
import {Config} from '../../model/config';
import {Paramvalues} from '../../model/paramvalues';
import {GeneralServices} from '../../services/general/general.services';

@Component({
    selector: 'config-edit',
    templateUrl: 'app/views/configs/config.edit.html',
    directives: [ROUTER_DIRECTIVES, WindowModalMessage],
    providers: [LoginService, ConfigsService, GeneralServices]
})

export class ConfigEditComponent implements OnInit{
	public titulo: string = 'Edit Config';
	public titulo2: string = 'Resources';
	public config: Config;
	public paramvalues: Paramvalues;
	public arrparamvalues = [];
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
	public resources;
	public viewParam;
	public scripts;
	public parameters;
	public idScriptConfig;
	public idScript;
	public inputResources = [];
	public outputResources = [];
	public dataConfig = [];	

	@ViewChild(WindowModalMessage) windowModalMessage: WindowModalMessage;

	constructor(
		private _loginService: LoginService,
		private _configsService: ConfigsService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _generalServices: GeneralServices
	){
		this.viewParam = false;
	}

	ngOnInit(){
		this.identity = this._loginService.getIdentity();
		
		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}

		// loads the resources
		this.getResources();
		// loads the scripts	
		this.getScripts();	

		this.config = new Config(1, "", 1, "", "");	
		this.loading = 'show';

		this._route.params.subscribe(params => {
			let id = +params["id"];
			this.idScriptConfig = id;
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

			this._configsService.detail(token, userowner, id).subscribe(
				response => {
					this.config = response.config[0];
					this.inputResources = response.inputResources;
					this.outputResources = response.outputResources;
					this.arrparamvalues = response.arrparamvalues;
					// puts the script that belongs to the config
					this.idScript = this.config.idScript;
					this.status = response.status;

					if (this.status != "success"){
						this._router.navigate(["/index"]);
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

	viewParameters(){
		// 	expands collapses the parameters view in config.new.html
		this.viewParam = ( this.viewParam == true ) ? false : true;
	}

	getResources(){
		this.loading = 'show';
		
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub};

		this._configsService.searchResources(token, userowner).subscribe(
			responseb => {
				this.status = responseb.status;
								
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = responseb.code;
					this.msg = responseb.msg;						
				} else {
					this.resources = responseb.data;

					for ( let i=0; i<this.resources.length; i++ ) {
						this.resources[i].gname = this._generalServices.columnContentFormat(this.resources[i].gname, 20);
						this.resources[i].gnotes = this._generalServices.columnContentFormat(this.resources[i].gnotes, 30);
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

	getScripts(){
		this.loading = 'show';
		
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();

		// serchs for the instance of the platform 
		this._configsService.searchScripts(token).subscribe(
			responsec => {
				this.status = responsec.status;
								
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = responsec.code;
					this.msg = responsec.msg;						
				} else {
					this.scripts = responsec.data;
				}					
			},
			error => {
				this.errorMessage = <any>error;
							
				if (this.errorMessage != null){
					alert('Error '+this.errorMessage);
				}
			}
		);		
	}

	getParameters(idScript){
		this.loading = 'show';
		this.idScript = idScript;
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		idScript = {"idScript":this.idScript};

		// searchs for the parameters of the script
		this._configsService.searchParameters(token, idScript).subscribe(
			responsed => {
				this.status = responsed.status;
										
				if ( this.status != "success" ) {
					this.loading = 'hide';
					this.code = responsed.code;
					this.msg = responsed.msg;						
				} else {
					this.parameters = responsed.data;
					let lengthAttri =  this.parameters.length;
					this.arrparamvalues = [];
					
					// initializes the array for the id and values for the parameters
					for ( let i=0; i < this.parameters.length; i++) { 
						this.arrparamvalues[i] = new Paramvalues(
							this.parameters[i].bid, 
							this.parameters[i].bidScript, 
							this.parameters[i].did, 
							this.idScriptConfig, 
							this.parameters[i].bid, 
							'', 
							this.parameters[i].bparamName,
							this.parameters[i].bparamDescription,
							this.parameters[i].bparamMandatory
						); 
					}
				}	
			},
			error => {
				this.errorMessage = <any>error;
														
				if (this.errorMessage != null){
					alert('Error '+this.errorMessage);
				}
			}
		);		
		this.loading = 'hide';
	}

	addInputResource(gid, gname){
		var tam = this.inputResources.length;
				
		if ( tam == 0 ) {	
			this.inputResources[0] = {eid:0, idScriptConfig:this.idScriptConfig, gid:gid, gnameInput:gname};
		}

		// if needs more than one resource comment the instruction line below
//		if ( tam == 0 ) {	
			let cond = true;

			for ( let i=0; i < tam; i++) {

				if ( this.inputResources[i].gid == gid) {
					cond = false; 
					break;	
				}
			}
			
			if ( cond ) {	
				this.inputResources[tam] = {eid:0, idScriptConfig:this.idScriptConfig, gid:gid, gnameInput:gname};	
			}
//		}
	}	
	
	removeInputResource(indice){
		this.inputResources.splice(indice, 1)	
	}	

	addOutputResource(gid, gname){
		var tam = this.outputResources.length;
		if ( tam == 0 ) {	
			this.outputResources[0] = {fid:0, idScriptConfig:this.idScriptConfig, gid:gid, gnameOutput:gname};
		}

		// if needs more than one resource comment the instruction line below
//		if ( tam == 0 ) {	
			let cond = true;

			for ( let i=0; i < tam; i++) {

				if ( this.outputResources[i].gid == gid) {
					cond = false; 
					break;	
				}
			}
			
			if ( cond ) {	
				this.outputResources[tam] = {fid:0, idScriptConfig:this.idScriptConfig, gid:gid, gnameOutput:gname};	
			}
//		}
	}	
	
	removeOutputResource(indice){
		this.outputResources.splice(indice, 1)	
	}	

	onSubmit(){	
//console.warn('F-1:config.edit.componenet.ts-onSumbmit');	
		let cont = true;

		let cantParamValues = this.arrparamvalues.length;
		
		if ( cont ) {
			if ( cantParamValues == 0 ) {
				// checks that there is at least one parameter
				cont = false;
				this.loading = 'hide';
				this.windowModalMessage.showWindowModalMessage('There has to be at least one parameter');
			}
		}

		if ( this.inputResources.length == 0 ) {
			cont = false;
			this.windowModalMessage.showWindowModalMessage('There is no input resource for this config');
		} else if ( this.outputResources.length == 0 ) {
			cont = false;
			this.windowModalMessage.showWindowModalMessage('There is no output resource for this config');	
		}

		if ( cont ) {

			for ( let i=0; i < this.arrparamvalues.length; i++ ) {
				if ( this.arrparamvalues[i].paramMandatory == 1 && this.arrparamvalues[i].paramValue.trim().length == 0 ) {
					this.windowModalMessage.showWindowModalMessage('The value for a parameter that is mandatory can not be empty');	
					cont = false;
					break;
				}
			}
		}

		if ( cont ) {
			this.loading = 'show';
			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			this.config.userowner = identity.sub;
			this.config.idScript = this.idScript;
			let json1 = JSON.stringify(this.arrparamvalues);
			let json2 = JSON.stringify(this.inputResources);
			let json3 = JSON.stringify(this.outputResources);
			// puts all the data together in the same json
			let dataConfig = '{'+'"arrparamvalues":'+json1+', "inputResources":'+json2+', "outputResources":'+json3+'}';
			
			this._configsService.update(token, this.config, dataConfig, this.config.id, this.itemsPerPage).subscribe(
				response => {
					this.status = response.status;
					this.page   = response.page;

					if ( this.status != "success" ){
						this.loading = 'hide';				
						this.code   = response.code;
						this.msg    = response.msg;
					} else {
						this._router.navigate(['/configs', this.page]);
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
}
