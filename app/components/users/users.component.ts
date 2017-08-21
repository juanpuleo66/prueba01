import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {UserService} from '../../services/users/user.services';
import {GenerateDatePipe} from '../../pipes/generate.date.pipe';
import {CommonFunctions} from '../../common/commonfunctions/common.functions';
import {globalVariables} from '../../global';

declare var $: any;

@Component({
	selector: 'listUsers',
	templateUrl: 'app/views/users/users.html',
    directives: [ROUTER_DIRECTIVES, CommonFunctions],
    providers: [LoginService, UserService],
    pipes: [GenerateDatePipe]
})
 
export class UsersComponent implements OnInit {
	public titulo = "Users:";
	public identity;
	public users;
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
	public searchUser;
	public colOrd;
	public colAct;
	public globalItemsPerPage = globalVariables['items_per_page'];

	@ViewChild(CommonFunctions) commonFunctions: CommonFunctions;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService,
		private _userService: UserService,
		private elementRef: ElementRef
	){
//console.warn('A-1:scripts.component.ts-constructor');		
	}


	ngOnInit() {
//console.warn('B-1:scripts.component.ts-ngOnInit');		
		this.loading = 'show';
		this.identity = this._loginService.getIdentity();
		this.colAct = localStorage.getItem('colAct');
		this.colOrd = localStorage.getItem('colOrd');
		 
		this.itemsPerPage = localStorage.getItem('usersItemsPerPage');

		if ( this.itemsPerPage == null ) {
			this.itemsPerPage = this.globalItemsPerPage;		
			localStorage.setItem('usersItemsPerPage', this.itemsPerPage);
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
				this.searchUser = null;
			} else {
				this.searchUser = search;
			}

			this.getSearchUsers(page, this.searchUser, this.itemsPerPage);
		});
	}

	search(page=null, searchUser, itemsPerPage) {
		this.searchUser = searchUser;
		this.itemsPerPage = itemsPerPage;
		localStorage.setItem('usersItemsPerPage', itemsPerPage);
		this.getSearchUsers(page, this.searchUser, itemsPerPage);
	}

	getSearchUsers(page=null, search="", itemsPerPage) {
			
		if (!search || search.trim().length == 0) {
			search = null;
			this.searchUser = null;
		} else {
			this.searchUser = search;
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
			
		this._userService.search(search, page, pagina, token, itemsPerPage).subscribe(
			response => {

				this.status = response.status;
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {

					this.users = response.data;
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
					this.totalRecords = response.total_items_counts;
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

	deleteUser(id, page){
		
		this.loading = 'show';
				
		// if there is only one id for this table on this page
		if ( this.users.length == 1 && this.totalPages > 1 ) {
			page--;
		}
					
		if ( id != undefined ) {	
			let token = this._loginService.getToken();
			this._userService.delete(id, token).subscribe(
				response => {
					this.status = response.status;
					
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.getSearchUsers(page, this.searchUser,this.itemsPerPage);					
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

	changeActivateStatus(id,newStatus){
		
		this.loading = 'show';	
					
		if ( id != undefined ) {	
			let token = this._loginService.getToken();
			this._userService.changeActivateStatus(newStatus,token,id).subscribe(
				response => {
					this.status = response.status;
					
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.getSearchUsers(this.pageActual, this.searchUser,this.itemsPerPage);					
					}					
				},
				error => {
					this.errorMessage = <any>error;

					if (this.errorMessage != null){
						alert('Error-updated: '+this.errorMessage);
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
				this.sortJsonArrayByProperty(this.users, columna, -1);
				this.colOrd = 'desc';
				break;
			case 'desc':
				this.sortJsonArrayByProperty(this.users, columna, 1);
				this.colOrd = 'asc';
				break;
			default:
				this.sortJsonArrayByProperty(this.users, columna, 1);
				this.colOrd = 'asc';
				break;
		}

	}

}