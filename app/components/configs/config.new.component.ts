import {Component, OnInit, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ConfigsService} from '../../services/configs/configs.service';
import {WindowModalMessage} from '../../common/windowmodal/window.modal.message';
import {Config} from '../../model/config';
import {Paramvalues} from '../../model/paramvalues';
import {GeneralServices} from '../../services/general/general.services';

@Component({
    selector: 'config-new',
    templateUrl: 'app/views/configs/config.new.html',
    directives: [ROUTER_DIRECTIVES, WindowModalMessage],
    providers: [LoginService, ConfigsService, GeneralServices]
})

export class ConfigNewComponent implements OnInit{
	public titulo: string = 'Create Config';
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
	public idScript;
	public inputResources = [];
	public outputResources = [];
	public dataConfig = [];
	public noFindedResources;	

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
								
				if ( this.status != "success" ) {
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
//console.warn('E-1:configs.new.component.ts-getScripts');		
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
					this.idScript = this.scripts[0].aid;
					this.getParameters(this.idScript);
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

	getParameters(idScript){
//console.warn('F-1:configs.new.component.ts-getParameters');		
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
					let lenParameters =  this.parameters.length;
					this.arrparamvalues = [];

					// initializes the array for the id and values for the parameters
					for ( let i=0; i < lenParameters; i++) { 
						this.arrparamvalues[i] = new Paramvalues(
							this.parameters[i].bid, 
							this.parameters[i].bidScript, 
							this.parameters[i].did, 
							null, 
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
					alert('Error: '+this.errorMessage);
				}
			}
		);		
		this.loading = 'hide';
	}

	addInputResource(gid, gname){
		var tam = this.inputResources.length;
				
		if ( tam == 0 ) {	
			this.inputResources[0] = {eid:0, gid:gid, gnameInput:gname};
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
				this.inputResources[tam] = {eid:0, gid:gid, gnameInput:gname};	
			}
//		}
	}	
	
	removeInputResource(indice){
		this.inputResources.splice(indice, 1)	
	}	

	addOutputResource(gid, gname){
		var tam = this.outputResources.length;
		if ( tam == 0 ) {	
			this.outputResources[0] = {eid:0, gid:gid, gnameOutput:gname};
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
				this.outputResources[tam] = {eid:0, gid:gid, gnameOutput:gname};	
			}
//		}
	}	
	
	removeOutputResource(indice){
		this.outputResources.splice(indice, 1)	
	}	

	onSubmit(){	
//console.warn('G-1:configs.new.component.ts-onSumbmit');		
		let cont = true;

		let cantParamValues = this.arrparamvalues.length;
		
		this.findResources(this.inputResources.concat(this.outputResources));
		if(this.noFindedResources.length>0){
			cont = false;
			this.loading = 'hide';
			

		}

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
				
			this._configsService.register(token, this.config, dataConfig, this.itemsPerPage).subscribe(
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

	public filesToUpload:Array<File>;
    public resultUpload;

    fileChangeEvent(fileInput: any){

      this.filesToUpload = <Array<File>>fileInput.target.files;
      if(this.filesToUpload.length>0 && this.verifyExtension(this.filesToUpload[0].name)==0){
      	this.status = "";
        document.getElementById("upload-progress-bar").setAttribute("value","100");
        document.getElementById("upload-progress-bar").setAttribute("aria-valuenow","100");
        document.getElementById("upload-progress-bar").style.width = "100%"; 
        this.importConfigFromFileJson(this.filesToUpload[0]);
      } else{
        document.getElementById("upload-progress-bar").setAttribute("value","0%");
        document.getElementById("upload-progress-bar").setAttribute("aria-valuenow","0%");
        document.getElementById("upload-progress-bar").style.width = "0%";
       } 
    }

    verifyExtension(file) { 
     let extensions_allowed = new Array(".json"); 
     let extension = (file.substring(file.lastIndexOf("."))).toLowerCase(); 
     let isCorrect = false; 
     let value=0;
     for (var i = 0; i < extensions_allowed.length; i++) { 
         if (extensions_allowed[i] == extension) { 
         isCorrect = true; 
         break; 
         } 
     } 
     if (!isCorrect) {

         this.msg = "Please verify the file's extension. \nOnly are accepted files with extension: " + extensions_allowed.join(); 
      	 this.code = 400;
      	 this.status = "error";
      	 value = 1; 
     }
     return value;
   }

   findResources(configResources){
    	this.noFindedResources = new Array();
    	
    	for (var i = configResources.length - 1; i >= 0; i--) {
    		for (var j = this.resources.length - 1; j >= 0; j--) {
                if(this.resources[j].gid==configResources[i].gid){
                   break;
                } else if (j==0){
                	     this.status = "Warning";
                	     this.code = '';
                	     if(configResources[i].gnameInput){
                	     	this.noFindedResources.push("Input Resource: "+configResources[i].gnameInput+".");
                	     	
                	     } else {
                            this.noFindedResources.push("Output Resource: "+configResources[i].gnameOutput+".");
                	       }
                         
                       }
    		}
    	   
    	}
        if(this.noFindedResources.length>0){
    		this.msg = "The following Resources are not yours. You must delete those and insert new resources.";
        }
    }

   importConfigFromFileJson(file){
        var reader = new FileReader();
        var configTemp;
        var configData;
        var configOBJ;
        var self = this; 
		reader.onload = function (e) {
            try{
             	var configTXT = reader.result;
			    var configJSON = JSON.parse(configTXT);
			    configData = configJSON.config[0];
                if(configData){
	             	self.config = new Config(configData.id,configData.scriptConfigName,configData.idScript,"",configData.type);
		     	    self.idScript = configData.idScript;
		     	    self.inputResources = configJSON.inputResources;
		     	    self.outputResources = configJSON.outputResources;
		     	    self.arrparamvalues = configJSON.arrparamvalues;
		            self.viewParam = true;
		            self.findResources(self.inputResources.concat(self.outputResources));
                }
            }catch(exception){
                self.status = 'error';
                self.msg = "Not valid Config JSON file's format.";
                self.code = 400;
                self.config = new Config(1, "", 1, "", "");	
                self.idScript = -1;
		     	self.inputResources = new Array();
		     	self.outputResources = new Array();
		     	self.arrparamvalues = new Array();
		        self.viewParam = false;
             }
     	};     
        reader.readAsText(file);
    }

    
}
