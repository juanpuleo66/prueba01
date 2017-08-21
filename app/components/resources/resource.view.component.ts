import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ResourcesService} from '../../services/resources/resources.service';
import {Resource} from '../../model/resource';

@Component({
    selector: 'resource-view',
    templateUrl: 'app/views/resources/resource.view.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, ResourcesService]
})

export class ResourceViewComponent implements OnInit{
	public titulo: string = 'View Resource';
	public resource: Resource;
	public pageActual;
	public searchString;
	public errorMessage;
	public status;
	public code;
	public msg;
	public identity;
	public loading;
	public resourceAttrib;
	public idAttri = [];
	public nameAttri = []; 
	public valueAttri = [];
	public valueEncrypt = [];

	constructor(
		private _loginService: LoginService,
		private _resourcesService: ResourcesService,
		private _route: ActivatedRoute,
		private _router: Router
	){
//console.warn('A-1: resource.edit.componenet.ts-constructor');
	}

	ngOnInit(){
//console.warn('B-1: resource.view.componenet.ts-ngOnInit');
		this.identity = this._loginService.getIdentity();

		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}
		this.resource = new Resource(1, 1, 1, "", "", "", "", "", "");
		this.getResource();
	}

	getResource(){
//console.warn('D-1:resource.view.componenet.ts-getResource');		
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

			this._resourcesService.detail(token, userowner, id).subscribe(
				response => {
					this.resourceAttrib = response.data;
					this.resource.id = response.data[0].id;
					this.resource.name = response.data[0].name;
					this.resource.notes = response.data[0].notes;
					this.resource.type = response.data[0].type;
					this.resource.bname = response.data[0].bname;
					this.resource.cname = response.data[0].cname;
					
					for ( let i=0; i < this.resourceAttrib.length; i++ ) { 
						this.idAttri[i] = this.resourceAttrib[i].did;
						this.nameAttri[i] = this.resourceAttrib[i].dname;
						this.valueAttri[i] = this.resourceAttrib[i].evalue;
						this.valueEncrypt[i] = this.resourceAttrib[i].esecure;

						if ( this.resourceAttrib[i].dsecure == 1 ) { this.valueEncrypt[i] = 1; }

						if ( this.resourceAttrib[i].dsecure == 1 || this.resourceAttrib[i].esecure == 1 ) {
							this.valueAttri[i] = '********************'
						}
					}
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

}