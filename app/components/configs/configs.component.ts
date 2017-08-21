import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ConfigsService} from '../../services/configs/configs.service';
import {UserService} from '../../services/users/user.services';
import {GenerateDatePipe} from '../../pipes/generate.date.pipe';
import {CommonFunctions} from '../../common/commonfunctions/common.functions';
import {globalVariables} from '../../global';
import {GeneralServices} from '../../services/general/general.services';
declare var $: any;

@Component({
    selector: 'configs',
    templateUrl: 'app/views/configs/configs.html',
    directives: [ROUTER_DIRECTIVES, CommonFunctions],
    providers: [LoginService, ConfigsService, UserService, GeneralServices],
    pipes: [GenerateDatePipe]
})
 
export class ConfigsComponent implements OnInit {
	public titulo = "Configs: ";
	public identity;
	public configs;
	public errorMessage;
	public status;
	public code;
	public msg;
	public loading;
	public pages;
	public pageActual;
	public totalPages = 1;
	public firstPage = 1;
	public totalRecords = 1;
	public itemsPerPage;
	public pagePrev = 1;
	public pageNext = 1;
	public searchString;
	public colOrd;
	public colAct;
	public users;
	public activeUserId;
	public globalItemsPerPage = globalVariables['items_per_page'];
	public configScriptNames;
	public activeConfigScriptName;
	public activeConfigScriptId;
	public configFavorites;
	public activateConfigFavorites:string;

	@ViewChild(CommonFunctions) commonFunctions: CommonFunctions;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService,
		private _configsService: ConfigsService,
		private elementRef: ElementRef,
		private _userService: UserService,
		private _generalservices: GeneralServices
	){
	}

	ngOnInit() {
		this.loading = 'show';
		this.identity = this._loginService.getIdentity();		
		this.colAct = localStorage.getItem('colAct');
		this.colOrd = localStorage.getItem('colOrd');
		
		this.itemsPerPage = localStorage.getItem('configsItemsPerPage');
		 
		if ( this.itemsPerPage == null ) {
			this.itemsPerPage = this.globalItemsPerPage;		
			localStorage.setItem('configsItemsPerPage', this.itemsPerPage);
		}
		 
		if ( this.identity.role == 'admin' ) {
			this.activeUserId = localStorage.getItem('configsActiveUserId');

			if ( this.activeUserId == null ) {
				localStorage.setItem('configsActiveUserId', this.identity.sub);
				this.activeUserId = this.identity.sub;
			}
		} else {
			this.activeUserId = this.identity.sub;
			localStorage.removeItem('configsActiveUserId');
		}
		
		if ( localStorage.getItem('activeConfigScriptName') != null ) {
			this.activeConfigScriptName = localStorage.getItem('activeConfigScriptName');	
			this.activeConfigScriptId = localStorage.getItem('activeConfigScriptId');	
		} else {
			this.activeConfigScriptName = 'All';
			localStorage.setItem('activeConfigScriptName', this.activeConfigScriptName);
			this.activeConfigScriptId = '0';
			localStorage.setItem('activeConfigScriptId', this.activeConfigScriptId);
		}

		if ( localStorage.getItem('activateConfigFavorites') != null ) {
			this.activateConfigFavorites = localStorage.getItem('activateConfigFavorites');	
		} else {
			this.activateConfigFavorites = 'false';
			localStorage.setItem('activateConfigFavorites', this.activateConfigFavorites);
		}

		if ( !this.colAct ) {
			this.colAct = null;
		} 
		
		if ( !this.colOrd ) {
			this.colOrd = null;
		} 

		this.setOrder(this.colAct);
	
		this._route.params.subscribe(params => {
			let page:any = +params["page"];	//recoge lo que se manda por la url segun la ruta configs/:page 

			if( !page ){
				page = null;
			}
			
			let search:any = params["search"];	//recoge lo que se manda por la url segun la ruta configs/:page/:search

			if (!search || search.trim().length == 0){
				search = null;
				this.searchString = null;
			} else {
				this.searchString = search;
			}

			this.getSearchConfigs(page, this.searchString, this.itemsPerPage);
			this.getConfigScriptNames();

			if ( this.identity.role == 'admin' ) {
				this.searchUsers();
			}	
		});
	}

	search(page=null, searchString, itemsPerPage) {
		this.searchString = searchString;
		this.itemsPerPage = itemsPerPage;
		localStorage.setItem('configsItemsPerPage', itemsPerPage);
		this.getSearchConfigs(page, this.searchString, itemsPerPage);
	}

	getSearchConfigs(page=null, search="", itemsPerPage) {

		if (!search || search.trim().length == 0) {
			search = null;
			this.searchString = null;
		} else {
			this.searchString = search;
		}
		
		let pagina = true;

		if( !page ){
			page = 1;
			pagina = null;
		}

		this.pageActual = page;
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub};
		 
		this._configsService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeConfigScriptId, this.activeUserId).subscribe(
			response => {
				this.status = response.status;
				
				if (this.status != "success"){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {

					this.configs = response.data;

					for ( let i=0; i<this.configs.length; i++ ) {
						this.configs[i].scriptConfigName = this._generalservices.columnContentFormat(this.configs[i].scriptConfigName, 20);
					}
					this.loading = 'hide';

					if (page >= 2) {
						this.pagePrev = (page-1);
					} else {
						this.pagePrev = page;
					}

					if (page < response.total_pages || page == 1) {
						this.pageNext = (page+1);
					} else {
						this.pageNext = page;
					}

					this.firstPage = 1;
					this.totalPages = response.total_pages;
					this.totalRecords = response.total_items_count;
					this.itemsPerPage = response.items_per_page;	
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

	onSaveFavorites(configId, configFavorite){
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}
		this.configFavorites = [];
		this.configFavorites.push({configId: configId, configFavorite: configFavorite});
		 
		this._configsService.saveFavorites(token, this.configFavorites).subscribe(
			response => {
				this.status = response.status;
				this.loading = 'hide';

				if ( this.status != "success" ){
					this.code   = response.code;
					this.msg    = response.msg;	
				} else {
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

	onChangeFavorites() {
		// localStorage transforms everything to text, booleans are not accepted
		this.activateConfigFavorites = this.activateConfigFavorites == 'true' ? 'false' : 'true';
		localStorage.setItem('activateConfigFavorites', this.activateConfigFavorites)
	}

	rowHidden(favorite){
		switch (true) {
			case (this.activateConfigFavorites == 'false') :
				return false;	
			case (this.activateConfigFavorites == 'true' && favorite == 1) :
				return false;
			default:
				return true;
		}
	}

	searchUsers(){
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
			
		this._userService.searchUsers(token).subscribe(
			responseb => {
				this.status = responseb.status;
									
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = responseb.code;
					this.msg = responseb.msg;	
				} else {
					this.users = responseb.data;
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
	
	getUser(userid) {
		this.activeUserId = userid;
		localStorage.setItem('configsActiveUserId', userid);
		this.pageActual = 1;

		this.activeConfigScriptName = 'All';
		localStorage.setItem('activeConfigScriptName', this.activeConfigScriptName);
		this.activeConfigScriptId = '0';
		localStorage.setItem('activeConfigScriptId', this.activeConfigScriptId);

		this.getSearchConfigs(this.pageActual, this.searchString, this.itemsPerPage);

		let self = this;
		let timeOut = setInterval(function(){
			clearInterval(timeOut);
			self.getConfigScriptNames();
		}, 500);
	}

	getConfigScriptNames(){
		this.loading = 'show';
		let token = this._loginService.getToken();

		this._configsService.getConfigScriptNames(token, this.activeUserId).subscribe(
			response => {
				this.status = response.status;
				
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.configScriptNames = response.data;
					this.configScriptNames.unshift({scriptConfigId:0, scriptConfigName:'All'});
					this.loading = 'hide';
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

	getConfigName(scriptName) {	
// console.warn('getConfigName');			
		let objConfigScriptName = this.configScriptNames[this.configScriptNames.findIndex(x => x.scriptConfigName == scriptName)];
		this.activeConfigScriptName = objConfigScriptName.scriptConfigName;
		this.activeConfigScriptId = objConfigScriptName.scriptConfigId;
		
		localStorage.setItem('activeConfigScriptName', this.activeConfigScriptName);
		localStorage.setItem('activeConfigScriptId', this.activeConfigScriptId);
		this.getSearchConfigs(this.pageActual, this.searchString, this.itemsPerPage);
	}

	deleteConfig(id, page){
		this.loading = 'show';

		// if there is only one id for this table on this page
		if ( this.configs.length === 1 && this.totalPages > 1 ) {
			page--;
		}
		if ( id != undefined ) {	
			let token = this._loginService.getToken();
			
			this._configsService.delete(token, id).subscribe(
				response => {
					this.status = response.status;
										
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.getSearchConfigs(page, this.searchString, this.itemsPerPage);					
					}					
				},
				error => {
					this.errorMessage = <any>error;

					if (this.errorMessage != null){
						alert('Error-delete: '+this.errorMessage);
					}
				}
			);	
		}
	}

	createTask(id){
		this.loading = 'show';

		if ( id != undefined ) {	
			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let userowner = {"userowner":identity.sub};
										
			this._configsService.createTask(token, id, userowner).subscribe(
				response => {
					this.status = response.status;
					
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.status = "success-task";
						this.code = response.code;
						this.msg = response.msg;
						let idTask = response.idTask;
						this.totalPages = response.totalPages;
						this._router.navigate(['/taskconfig_view', idTask, this.totalPages, this.itemsPerPage]);
					}					
					this.loading = 'hide';
				},
				error => {
					this.errorMessage = <any>error;

					if (this.errorMessage != null){
						alert('Error-loadTask: '+this.errorMessage);
					}
				}
			);	
		}
	}

	sortJsonArrayByProperty(objArray, prop, direction){   
	    var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

	    if (objArray && objArray.constructor===Array){
				var propPath = (prop.constructor===Array) ? prop : prop.split(".");
	        objArray.sort(function(a,b){
	            for (var p in propPath){
	                if (a[propPath[p]] && b[propPath[p]]){
	                    a = a[propPath[p]];
	                    b = b[propPath[p]];
	                }
	            }
	            // convert numeric strings to integers
	            //a = a.match(/^\d+$/) ? +a : a;
	            //b = b.match(/^\d+$/) ? +b : b;
	            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
	        });
	    }
	}

	setOrder(columna){
		this.colAct = columna;
		localStorage.setItem('colAct', this.colAct);
		localStorage.setItem('colOrd', this.colOrd);
		
		switch( this.colOrd ) {
			case 'asc':
				this.sortJsonArrayByProperty(this.configs, columna, -1);
				this.colOrd = 'desc';
				break;
			case 'desc':
				this.sortJsonArrayByProperty(this.configs, columna, 1);
				this.colOrd = 'asc';
				break;
			default:
				this.sortJsonArrayByProperty(this.configs, columna, 1);
				this.colOrd = 'asc';
		}
	}

	exportConfigToFileJson(idConfig, nameConfig){
		var link = document.createElement("a");    
		link.id="lnkDwnldLnk";
		document.body.appendChild(link);
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}	// save in json format the userowner
		let jsonConfig;

		this._configsService.detail(token, userowner, idConfig).subscribe(
			response => {
				jsonConfig = JSON.stringify(response);
				var blob = new Blob([jsonConfig], { type: 'json' }); 
				var jsonUrl = window.URL.createObjectURL(blob);
				var filename = idConfig+"-"+nameConfig+".json";
				$("#lnkDwnldLnk")
				.attr({
					'download': filename,
					'href': jsonUrl
				}); 
				$('#lnkDwnldLnk')[0].click();    
				document.body.removeChild(link);
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
	}

}