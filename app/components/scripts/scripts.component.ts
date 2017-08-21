import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ScriptsService} from '../../services/scripts/scripts.service';
import {UserService} from '../../services/users/user.services';
import {GenerateDatePipe} from '../../pipes/generate.date.pipe';
import {CommonFunctions} from '../../common/commonfunctions/common.functions';
import {globalVariables} from '../../global';

declare var $: any;

@Component({
    selector: 'scripts',
    templateUrl: 'app/views/scripts/scripts.html',
    directives: [ROUTER_DIRECTIVES, CommonFunctions],
    providers: [LoginService, ScriptsService, UserService],
    pipes: [GenerateDatePipe]
})
 
export class ScriptsComponent implements OnInit {
	public titulo = "Scripts: ";
	public identity;
	public scripts;
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
	public scriptFavorites;
	public activateScriptFavorites:string;

	@ViewChild(CommonFunctions) commonFunctions: CommonFunctions;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService,
		private _scriptsService: ScriptsService,		
		private elementRef: ElementRef,
		private _userService: UserService
	){
//console.warn('A-1:scripts.component.ts-constructor');		
	}

	ngOnInit() {
//console.warn('B-1:scripts.component.ts-ngOnInit');	
		this.loading = 'show';
		this.identity = this._loginService.getIdentity();
		this.colAct = localStorage.getItem('colAct');
		this.colOrd = localStorage.getItem('colOrd');

		this.itemsPerPage = localStorage.getItem('scriptsItemsPerPage');

		if ( this.itemsPerPage == null ) {
			this.itemsPerPage = this.globalItemsPerPage;		
			localStorage.setItem('scriptsItemsPerPage', this.itemsPerPage);
		}

		if ( this.identity.role == 'admin' ) {
			this.activeUserId = localStorage.getItem('scriptsActiveUserId');

			if ( this.activeUserId == null ) {
				localStorage.setItem('scriptsActiveUserId', this.identity.sub);
				this.activeUserId = this.identity.sub;
			}
		} else {
			this.activeUserId = this.identity.sub;
			localStorage.removeItem('scriptsActiveUserId');
		}

		if ( localStorage.getItem('activateScriptFavorites') != null ) {
			this.activateScriptFavorites = localStorage.getItem('activateScriptFavorites');	
		} else {
			this.activateScriptFavorites = 'false';
			localStorage.setItem('activateScriptFavorites', this.activateScriptFavorites);
		}

		if ( !this.colAct ) {
			this.colAct = null;
		} 
		
		if ( !this.colOrd ) {
			this.colOrd = null;
		} 

		this.setOrder(this.colAct);
		
		this._route.params.subscribe(params => {
			let page:any = +params["page"];	//recoge lo que se manda por la url segun la ruta scripts/:page 

			if( !page ){
				page = null;
			}
			
			let search:any = params["search"];	//recoge lo que se manda por la url segun la ruta scripts/:page/:search

			if (!search || search.trim().length == 0){
				search = null;
				this.searchString = null;
			} else {
				this.searchString = search;
			}
			this.getSearchScripts(page, this.searchString, this.itemsPerPage);
			
			if ( this.identity.role == 'admin' ) {
				this.searchUsers();
			}						
		});
	}
	
    search(page=null, searchString, itemsPerPage) {
		this.searchString = searchString;
		this.itemsPerPage = itemsPerPage;
		localStorage.setItem('scriptsItemsPerPage', itemsPerPage);
		this.getSearchScripts(page, this.searchString, itemsPerPage);
	} 

	getSearchScripts(page=null, search="", itemsPerPage){
//console.warn('D-1:scripts.component.ts-getSearchScripts');		

		if ( !search || search.trim().length == 0 ) {
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

		this._scriptsService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeUserId).subscribe(
			response => {
				this.status = response.status;
				
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.scripts = response.data;
					this.loading = 'hide';
// console.warn('scripts.component-getSearchScripts');
// console.warn(this.scripts);
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

	onSaveFavorites(scriptId, scriptFavorite){
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}
		this.scriptFavorites = [];
		this.scriptFavorites.push({scriptId: scriptId, scriptFavorite: scriptFavorite});
		 
		this._scriptsService.saveFavorites(token, this.scriptFavorites).subscribe(
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
		this.activateScriptFavorites = this.activateScriptFavorites == 'true' ? 'false' : 'true';
		localStorage.setItem('activateScriptFavorites', this.activateScriptFavorites)
	}

	rowHidden(favorite){
		switch (true) {
			case (this.activateScriptFavorites == 'false') :
				return false;	
			case (this.activateScriptFavorites == 'true' && favorite == 1) :
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
		localStorage.setItem('scriptsActiveUserId', userid);
		this.pageActual = 1;	
		this.getSearchScripts(this.pageActual, this.searchString, this.itemsPerPage);
	}
////////////////////////////////////////////////////////////////////
	
	deleteScript(id, page) {
//console.warn('E-1:scripts.component.ts-deleteScript');		
		this.loading = 'show';
					
		// if there is only one id for this table on this page
		if ( this.scripts.length === 1 && this.totalPages > 1 ) {
			page--;
		}
					
		if ( id != undefined ) {	
			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let userowner = {"userowner":identity.sub};
			
			this._scriptsService.delete(token, id, userowner).subscribe(
				response => {
					this.status = response.status;
					
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.getSearchScripts(page, this.searchString, this.itemsPerPage);					
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
				this.sortJsonArrayByProperty(this.scripts, columna, -1);
				this.colOrd = 'desc';
				break;
			case 'desc':
				this.sortJsonArrayByProperty(this.scripts, columna, 1);
				this.colOrd = 'asc';
				break;
			default:
				this.sortJsonArrayByProperty(this.scripts, columna, 1);
				this.colOrd = 'asc';
		}

	}

}