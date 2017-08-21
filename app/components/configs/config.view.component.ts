import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ConfigsService} from '../../services/configs/configs.service';
import {Config} from '../../model/config';
import {Paramvalues} from '../../model/paramvalues';
import {GeneralServices} from '../../services/general/general.services';

@Component({
    selector: 'config-view',
    templateUrl: 'app/views/configs/config.view.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, ConfigsService, GeneralServices]
})

export class ConfigViewComponent implements OnInit{
	public titulo: string = 'View Config';
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

					if ( this.status != "success" ){
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
					alert('Error: '+this.errorMessage);
				}
			}
		);		
	}
}
