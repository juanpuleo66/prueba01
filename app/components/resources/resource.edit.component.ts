import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ResourcesService} from '../../services/resources/resources.service';
import {Resource} from '../../model/resource';

@Component({
    selector: 'resource-edit',
    templateUrl: 'app/views/resources/resource.edit.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, ResourcesService]
})

export class ResourceEditComponent implements OnInit{
	public titulo: string = 'Edit Resource';
	public resource: Resource;
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
//console.warn('B-1: resource.edit.componenet.ts-ngOnInit');
		this.identity = this._loginService.getIdentity();

		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}
		this.resource = new Resource(1, 1, 1, "", "", "", "", "", "");
		this.getResource();
	}

	getResource(){
//console.warn('D-1:resource.edit.component.ts-getResource');		
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

			this._resourcesService.detail(token, userowner, id).subscribe(
				response => {
					this.resourceAttrib = response.data;
					this.resource.id = response.data[0].id;
					this.resource.name = response.data[0].name;
					this.resource.notes = response.data[0].notes;
					this.resource.type = response.data[0].type;
					this.resource.bname = response.data[0].bname;
					this.resource.cname = response.data[0].cname;

					for ( let i=0; i < this.resourceAttrib.length; i++) { 
						this.idAttri[i] = this.resourceAttrib[i].did;
						this.nameAttri[i] = this.resourceAttrib[i].dname;
						this.valueAttri[i] = this.resourceAttrib[i].evalue;
						this.valueEncrypt[i] = this.resourceAttrib[i].esecure;

						if ( this.resourceAttrib[i].dsecure == 1 ) { this.valueEncrypt[i] = 1; }

						if ( ( this.resourceAttrib[i].dsecure == 1 && this.resourceAttrib[i].esecure == 1 ) ||  this.resourceAttrib[i].esecure == 1 ) {
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
		this.loading = 'hide';
	}

	onSubmit(){	
//console.warn('C-1: resource.edit.componenet.ts-onSubmit');
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		this.resource.userowner = identity.sub;
		let id = this.resource.id

		// saves the ids for each attribute
		let cantId = this.idAttri.length;
		let contIdAttri = ''; 

		for ( let i=0; i < cantId; i++ ) {
			contIdAttri = ( i == cantId-1 ) ? contIdAttri + '{"id":"'+this.idAttri[i]+'"}' : contIdAttri + '{"id":"'+this.idAttri[i]+'"},';
		}

		// saves the values for each attribute
		let cantValue = this.valueAttri.length;
		let contValueAttri = ''; 
		let contValueEncrypt = ''; 

		for ( let i=0; i < cantValue; i++ )
		{
			if ( this.resourceAttrib[i].dsecure == 1 ) { this.valueEncrypt[i] = true; }			

			contValueAttri = ( i == cantValue-1 ) ? contValueAttri + '{"value":"'+this.valueAttri[i]+'"}' : contValueAttri + '{"value":"'+this.valueAttri[i]+'"},';
			contValueEncrypt = ( i == cantValue-1 ) ? contValueEncrypt + '{"value":"'+this.valueEncrypt[i]+'"}' : contValueEncrypt + '{"value":"'+this.valueEncrypt[i]+'"},';
		}
		// creates the json for id and value of the attribute
		let contAttri = '{'+'"idAttribute":['+contIdAttri+']'+','+'"valueAttribute":['+contValueAttri+']'+','+'"valueEncrypt":['+contValueEncrypt+']'+'}';

		this._resourcesService.update(token, this.resource, contAttri, id, this.itemsPerPage).subscribe(
			response => {
				this.status = response.status;
				this.page = response.page;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					if ( this.searchString == null ) {
						this._router.navigate(['/resources', this.page]);
					} else {
						this._router.navigate(['/resources', this.page, this.searchString]);
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
