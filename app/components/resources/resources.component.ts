import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ResourcesService} from '../../services/resources/resources.service';
import {GenerateDatePipe} from '../../pipes/generate.date.pipe';
import {CommonFunctions} from '../../common/commonfunctions/common.functions';
import {UserService} from '../../services/users/user.services';
import {globalVariables} from '../../global';
import {GeneralServices} from '../../services/general/general.services';
declare var $: any;

@Component({
    selector: 'resources',
    templateUrl: 'app/views/resources/resources.html',
    directives: [ROUTER_DIRECTIVES, CommonFunctions],
    providers: [LoginService, ResourcesService, UserService, GeneralServices],
    pipes: [GenerateDatePipe]
})
 
export class ResourcesComponent implements OnInit {
	public titulo = "Resources: ";
	public identity;
	public resources;
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
	public resourcePlatforms;
	public resourceInstances;
	public activeResourcePlatformId;
	public activeResourcePlatformName;
	public activeResourceInstanceId;
	public activeResourceInstanceName;
	public resourceFavorites;
	public activateResourceFavorites:string;
	
	@ViewChild(CommonFunctions) commonFunctions: CommonFunctions;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService,
		private _resourcesService: ResourcesService,
		private elementRef: ElementRef,
		private _userService: UserService,
		private _generalServices: GeneralServices
	){
	}

	ngOnInit() {
		this.loading = 'show';
		this.identity = this._loginService.getIdentity();
		
		this.colAct = localStorage.getItem('colAct');
		this.colOrd = localStorage.getItem('colOrd');
		this.itemsPerPage = localStorage.getItem('resourcesItemsPerPage');

		if ( this.itemsPerPage == null ) {
			this.itemsPerPage = this.globalItemsPerPage;		
			localStorage.setItem('resourcesItemsPerPage', this.itemsPerPage);
		}

		if ( this.identity.role == 'admin' ) {
			this.activeUserId = localStorage.getItem('resourcesActiveUserId');

			if ( this.activeUserId == null ) {
				localStorage.setItem('resourcesActiveUserId', this.identity.sub);
				this.activeUserId = this.identity.sub;
			}
		} else {
			this.activeUserId = this.identity.sub;
			localStorage.removeItem('resourcesActiveUserId');
		}
		
		if ( localStorage.getItem('activeResourcePlatformName') != null ) {
			this.activeResourcePlatformName = localStorage.getItem('activeResourcePlatformName');	
			this.activeResourcePlatformId = localStorage.getItem('activeResourcePlatformId');	
		} else {
			this.activeResourcePlatformName = 'All';
			localStorage.setItem('activeResourcePlatformName', this.activeResourcePlatformName);
			this.activeResourcePlatformId = '0';
			localStorage.setItem('activeResourcePlatformId', this.activeResourcePlatformId);
		}
		
		if ( localStorage.getItem('activeResourceInstanceName') != null ) {
			this.activeResourceInstanceName = localStorage.getItem('activeResourceInstanceName');	
			this.activeResourceInstanceId = localStorage.getItem('activeResourceInstanceId');	
		} else {
			this.activeResourceInstanceName = 'All';
			localStorage.setItem('activeResourceInstanceName', this.activeResourceInstanceName);
			this.activeResourceInstanceId = '0'
			localStorage.setItem('activeResourceInstanceId', this.activeResourceInstanceId);
		}

		if ( localStorage.getItem('activateResourceFavorites') != null ) {
			this.activateResourceFavorites = localStorage.getItem('activateResourceFavorites');	
		} else {
			this.activateResourceFavorites = 'false';
			localStorage.setItem('activateResourceFavorites', this.activateResourceFavorites);
		}
		
		if ( !this.colAct ) {
			this.colAct = null;
		} 
		
		if ( !this.colOrd ) {
			this.colOrd = null;
		} 

		this.setOrder(this.colAct);
	
		this._route.params.subscribe(params => {
			let page:any = +params["page"];	//recoge lo que se manda por la url segun la ruta resources/:page 

			if( !page ){
				page = null;
			}
			
			let search:any = params["search"];	//recoge lo que se manda por la url segun la ruta resources/:page/:search

			if (!search || search.trim().length == 0){
				search = null;
				this.searchString = null;
			} else {
				this.searchString = search;
			}
            
			this.getSearchResources(page, this.searchString, this.itemsPerPage);
			this.getResourcePlatforms();
			this.getResourceInstances();

			if ( this.identity.role == 'admin' ) {
				this.searchUsers();
			}	
		});
	}

	search(page=null, searchString, itemsPerPage){
		this.searchString = searchString;
		this.itemsPerPage = itemsPerPage;
		localStorage.setItem('resourcesItemsPerPage', itemsPerPage);
		this.getSearchResources(page, this.searchString, itemsPerPage);
	}

	getSearchResources(page=null, search="", itemsPerPage){
		
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

		this._resourcesService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeResourcePlatformId, this.activeResourceInstanceId, this.activeUserId).subscribe(
			response => {
				this.status = response.status;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.resources = response.data;
					
					for ( let i=0; i<this.resources.length; i++ ) {
						this.resources[i].name = this._generalServices.columnContentFormat(this.resources[i].name, 30);
						this.resources[i].notes = this._generalServices.columnContentFormat(this.resources[i].notes, 50);
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

	onSaveFavorites(resourceId, resourceFavorite){
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}
		this.resourceFavorites = [];
		this.resourceFavorites.push({resourceId: resourceId, resourceFavorite: resourceFavorite});
		 
		this._resourcesService.saveFavorites(token, this.resourceFavorites).subscribe(
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
		this.activateResourceFavorites = this.activateResourceFavorites == 'true' ? 'false' : 'true';
		localStorage.setItem('activateResourceFavorites', this.activateResourceFavorites)
	}

	rowHidden(favorite){
		switch (true) {
			case (this.activateResourceFavorites == 'false') :
				return false;	
			case (this.activateResourceFavorites == 'true' && favorite == 1) :
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
		localStorage.setItem('resourcesActiveUserId', userid);
		this.pageActual = 1;
		 
		this.activeResourcePlatformName = 'All';
		localStorage.setItem('activeResourcePlatformName', this.activeResourcePlatformName);
		this.activeResourcePlatformId = '0';
		localStorage.setItem('activeResourcePlatformId', this.activeResourcePlatformId);
		this.activeResourceInstanceName = 'All';
		localStorage.setItem('activeResourceInstanceName', this.activeResourceInstanceName);
		this.activeResourceInstanceId = '0';
		localStorage.setItem('activeResourceInstanceId', this.activeResourceInstanceId);
		  
		this.getSearchResources(this.pageActual, this.searchString, this.itemsPerPage);

		let self = this;
		let timeOut = setInterval(function(){
			clearInterval(timeOut);
			self.getResourcePlatforms();
			self.getResourceInstances();
		}, 500);
	}

	getResourcePlatforms(){
		this.loading = 'show';
		let token = this._loginService.getToken();

		this._resourcesService.getResourcePlatforms(token, this.activeUserId).subscribe(
			response => {
				this.status = response.status;
				
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.resourcePlatforms = response.data;
					this.resourcePlatforms.unshift({resourcePlatformId:0, resourcePlatformName:'All'});
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

	getResourceInstances(){
		this.loading = 'show';
		let token = this._loginService.getToken();

		this._resourcesService.getResourceInstances(token, this.activeUserId).subscribe(
			response => {
				this.status = response.status;
				
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.resourceInstances = response.data;
					this.resourceInstances.unshift({resourceInstanceId:0, resourceInstanceName:'All'});
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

	getPlatformName(platformName) {		
// console.log('platformName: '+platformName);
		let objPlatformName = this.resourcePlatforms[this.resourcePlatforms.findIndex(x => x.resourcePlatformName == platformName)];
		this.activeResourcePlatformName = objPlatformName.resourcePlatformName;
		this.activeResourcePlatformId = objPlatformName.resourcePlatformId;
		localStorage.setItem('activeResourcePlatformName', this.activeResourcePlatformName);
		localStorage.setItem('activeResourcePlatformId', this.activeResourcePlatformId);
		this.getSearchResources(this.pageActual, this.searchString, this.itemsPerPage)
	}

	getInstanceName(instanceName) {		
// console.log('instanceName: '+instanceName);
		let objInstanceName = this.resourceInstances[this.resourceInstances.findIndex(x => x.resourceInstanceName == instanceName)];
		this.activeResourceInstanceName = objInstanceName.resourceInstanceName;
		this.activeResourceInstanceId = objInstanceName.resourceInstanceId;
		localStorage.setItem('activeResourceInstanceName', this.activeResourceInstanceName);
		localStorage.setItem('activeResourceInstanceId', this.activeResourceInstanceId);
		this.getSearchResources(this.pageActual, this.searchString, this.itemsPerPage);
 	}

	deleteResource(id, page){
		this.loading = 'show';

		// if there is only one id for this table on this page
		if ( this.resources.length === 1 && this.totalPages > 1 ) {
			page--;
		}
		
		if ( id != undefined ) {	
			let token = this._loginService.getToken();
			
			this._resourcesService.delete(token, id).subscribe(
				response => {
					this.status = response.status;
										
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.getSearchResources(page, this.searchString, this.itemsPerPage);					
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
		this.loading = 'hide';
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
				this.sortJsonArrayByProperty(this.resources, columna, -1);
				this.colOrd = 'desc';
				break;
			case 'desc':
				this.sortJsonArrayByProperty(this.resources, columna, 1);
				this.colOrd = 'asc';
				break;
			default:
				this.sortJsonArrayByProperty(this.resources, columna, 1);
				this.colOrd = 'asc';
		}
	}

}