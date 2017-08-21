import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ResourcesService} from '../../services/resources/resources.service';
import {Resource} from '../../model/resource';

@Component({
    selector: 'reosurce-new',
    templateUrl: 'app/views/resources/resource.new.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, ResourcesService]
})

export class ResourceNewComponent implements OnInit{
	public titulo: string = 'Create Resource';
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
	public platforms;
	public instances;
	public attributes;
	public bid=1;
	public cid=1;
	public idAttri = [];
	public valueAttri = [];
	public valueEncrypt = [];

	constructor(
		private _loginService: LoginService,
		private _resourcesService: ResourcesService,
		private _route: ActivatedRoute,
		private _router: Router
	){
//console.warn('A-1: resource.new.componenet.ts-constructor');
	}

	ngOnInit(){
//console.warn('B-1: resource.new.componenet.ts-ngOnInit');		
		// loads theplatforms	
		this.getPlatforms();	
		// loads the instances
		this.getInstances(this.bid);

		this.identity = this._loginService.getIdentity();
		
		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}

		this.resource = new Resource(1, 1, 1, "", "", "", "", "", "");	

		this._route.params.subscribe(params => {
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
		});
	}

	getPlatforms(){
//console.warn('D-1:resources.new.component.ts-getPlatforms');		
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
			
		this._resourcesService.searchPlatforms(token).subscribe(
			responseb => {
				this.status = responseb.status;
									
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = responseb.code;
					this.msg = responseb.msg;	
				} else {
					this.platforms = responseb.data;
					this.bid = this.platforms[0].bid;
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

	getInstances(bid){
//console.warn('E-1:resources.new.component.ts-getInstances');		
		this.loading = 'show';
		this.bid = bid;

		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		bid = {"bid":this.bid};

		// serchs for the instance of the platform 
		this._resourcesService.searchInstances(token, bid).subscribe(
			responsec => {
				this.status = responsec.status;
								
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = responsec.code;
					this.msg = responsec.msg;	
				} else {
					this.instances = responsec.data;
					this.cid = this.instances[0].cid;
					this.getAttributes(this.cid);
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

	getAttributes(cid){
//console.warn('F-1:resources.new.component.ts-getAttributes');		
		this.loading = 'show';
		this.cid = cid;

		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		cid = {"cid":this.cid};
		
		// searchs for the instance of the platform 
		this._resourcesService.searchAttributes(token, cid).subscribe(
			responsed => {
				this.status = responsed.status;
										
				if ( this.status != "success" ) {
					this.loading = 'hide';
					this.code = responsed.code;
					this.msg = responsed.msg;	
				} else {
					this.attributes = responsed.data;
					let lengthAttri =  this.attributes.length;
					// initializes the arrays for the id and values attributes
					this.idAttri = [];
					this.valueAttri = [];

					for ( let i=0; i < this.attributes.length; i++) { 
						this.idAttri[i] = this.attributes[i].did;
						this.valueAttri[i] = '';
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
		this.loading = 'hide';
	}

	onSubmit(){	
//console.warn('G-1:resources.new.component.ts-onSumbmit');		
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		this.resource.userowner = identity.sub;
		this.resource.idPlatform = this.bid;
		this.resource.idInstance = this.cid;

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

		for ( let i=0; i < cantValue; i++ ) {

			if ( this.attributes[i].dsecure == 1 ) { this.valueEncrypt[i] = true; }

			contValueAttri = ( i == cantValue-1 ) ? contValueAttri + '{"value":"'+this.valueAttri[i]+'"}' : contValueAttri + '{"value":"'+this.valueAttri[i]+'"},';
			contValueEncrypt = ( i == cantValue-1 ) ? contValueEncrypt + '{"value":"'+this.valueEncrypt[i]+'"}' : contValueEncrypt + '{"value":"'+this.valueEncrypt[i]+'"},';
		}

		// creates the json for id and value of the attribute
		let contAttri = '{'+'"idAttribute":['+contIdAttri+']'+','+'"valueAttribute":['+contValueAttri+']'+','+'"valueEncrypt":['+contValueEncrypt+']'+'}';

		this._resourcesService.register(token, this.resource, contAttri, this.itemsPerPage).subscribe(
			response => {
				this.status = response.status;
				this.page   = response.page;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this._router.navigate(['/resources', this.page]);
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
