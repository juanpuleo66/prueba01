import {Component} from '@angular/core';
import {Directory} from '../../model/directory';
import {File} from '../../model/file';
import {S3Service} from '../../services/s3browser/s3.service';
import {LoginService} from '../../services/login.service';

@Component({
    selector: 's3b-panel',
    templateUrl: 'app/views/s3browser/s3b.panel.html',
    providers: [LoginService, S3Service]
}) 
export class S3BrowserPanelComponent {
	private _rootDirectory: Directory;
	private _currentDirectory: Directory;	
	private _directorySource:Directory;
	private _isCopy:boolean;

	public files:File[];
	public directories:Directory[];
	public filesToCopy:string[];
	public pathes:Directory[];
	public showGoBackRow:boolean;
	public readyToPaste:boolean;
	public listTitle:string;
	public errorMessage;
	public status;
	public code;
	public msg;
	public loading;
	public resources;
	public resourceIdSelected;

	constructor(private _s3service: S3Service, private _loginService: LoginService){	
		this.showGoBackRow = false;
		this.pathes = [];
		this.filesToCopy = [];
		this.readyToPaste = false;
		this._isCopy = true;
		this.listTitle = "No Files to Copy or Move.";
		this.getSearchResources();
		this.directories = new Array();
		this.files = new Array();
	}

	onSelectSourceClick(resource):void{
		if(resource.id!=this.resourceIdSelected){
           this.pathes = [];
		   this.resourceIdSelected = resource.id;
		   this._rootDirectory = new Directory('/','', null, this._s3service, this._loginService);
		   this._currentDirectory = this._rootDirectory;
           this.load();
           //this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
		   //this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
		   this.pathes.push(this._rootDirectory);	
		
		} else {
			this.resourceIdSelected = undefined;
			this.showGoBackRow = false;
		    this.pathes = [];
		    this.filesToCopy = [];
		    this.readyToPaste = false;
		    this._isCopy = true;
		    this.listTitle = "No Files to Copy or Move.";
		    this.directories = new Array();
		    this.files = new Array();
		    this.pathes = new Array();
		}
		
			
	}	

	onOpenClick(directory:Directory):void{		
		this._currentDirectory = directory;
		this.showGoBackRow = true;
		this.load();
		//this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
		//this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
		this.pathes.push(directory);
		this.loading = 'hide';		
	}

	onGoBackButton():void{
		this._currentDirectory = this._currentDirectory.getParentDirectory();
		this.showGoBackRow = !this._currentDirectory.isRootDirectory();
		this.load();
		//this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
		//this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
		this.pathes.pop();
	}

	onPathClick(directory:Directory):void{
		if(this._currentDirectory.getPrefix() == directory.getPrefix())
			return;
		while(this._currentDirectory.getPrefix()!=directory.getPrefix()){	
			this._currentDirectory = this.pathes.pop();			
		}
		this.pathes.push(this._currentDirectory);
		this.showGoBackRow = !this._currentDirectory.isRootDirectory();
		this.load();
		//this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
		//this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
	}

	onRefreshClick():void{
		//this._currentDirectory.refresh(this.resourceIdSelected);
		this.files = new Array();
		this.directories = new Array();
		this.load();
		//this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
		//this.files = this._currentDirectory.getFiles(this.resourceIdSelected);	
	}

	onCopyClick():void{
		this.filesToCopy = [];		
		for(let f in this.files){
			if(this.files[f].state)
				this.filesToCopy.push(this.files[f].getName());
		}
		this._directorySource = this._currentDirectory;
		this.readyToPaste = true;
		this._isCopy = true;
		this.listTitle = "Files to Copy:";
	}

	onCutClick():void{
		this.filesToCopy = [];		
		for(let f in this.files){
			if(this.files[f].state)
				this.filesToCopy.push(this.files[f].getName());
		}
		this._directorySource = this._currentDirectory;
		this.readyToPaste = true;
		this._isCopy = false;
		this.listTitle = "Files to Move:";
	}

	onClearClick():void{
		if(this.readyToPaste){
			this.filesToCopy = [];
			this.readyToPaste = false;
			this._directorySource = null;
			this.listTitle = "No Files to Copy or Move.";
		}		
	}

	onPasteClick():void{	
		if(this.readyToPaste){
			let self = this;

			let params = {
				'Source':{
					'Bucket': 'msp-development', 
					'Prefix':this._directorySource.getPrefix(),
					'Keys': this.filesToCopy
				},
				'Target':{
					'Bucket': 'msp-development', 
					'Prefix':this._currentDirectory.getPrefix()
				}							
			};
			
			if(this._isCopy){

				this._s3service.copyTo(this._loginService.getToken(),params).subscribe(
					response => {
						self._currentDirectory.refresh(this.resourceIdSelected);
						self.load();
					    //self.directories = self._currentDirectory.getDirectories(this.resourceIdSelected);
					    //self.files = self._currentDirectory.getFiles(this.resourceIdSelected);	
						this.onClearClick();			
					},
					error => {
						console.log('There is a problem.'); // an error occurred
						console.log(error);
						this.onClearClick();
					}
				);	
			}
			else{
				this._s3service.moveTo(this._loginService.getToken(),params).subscribe(
					response => {
						self._currentDirectory.refresh(this.resourceIdSelected);						
						self.load();
						//self.directories = self._currentDirectory.getDirectories(this.resourceIdSelected);
						//self.files = self._currentDirectory.getFiles(this.resourceIdSelected);	
						if(self._directorySource!=null)
							self._directorySource.refresh(this.resourceIdSelected);
						this.onClearClick();			
					},
					error => {
						console.log('There is a problem.'); // an error occurred
						console.log(error);
						this.onClearClick();
					}
				);	
			}		
				 
		}
	}

	confirmationYes(){}

	confirmationNo(){
		this.onClearClick();
	}

	getSearchResources(){
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}	// save in json format the userowner
		
		this._s3service.searchResources(token, userowner).subscribe(
			response => {
				this.status = response.status;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.resources = response.data;
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

	load():void{
        this.loading = 'show';
        let params = {'idResource': this.resourceIdSelected, 'Delimiter': '/', 'Prefix':this._currentDirectory.getPrefix()};
		let token = this._loginService.getToken();
		this._s3service.listObjects(token, params).subscribe(
			response => {
                if(response.status){
                	this.status = response.status;
                	this.msg = response.msg;
                	this.code = response.code;
                	this.loading = 'hide';
                	this.files = new Array();
					this.directories = new Array();
                }
				if(response.CommonPrefixes){
                    if(!response.Contents)
                    	this.files = new Array();
					this.directories = new Array();
					for(let i=0, len=response.CommonPrefixes.length; i<len; i++){
			  			this.directories.push(new Directory(response.CommonPrefixes[i].Prefix.replace(response.Prefix, ''), response.CommonPrefixes[i].Prefix, this._currentDirectory, this._s3service, this._loginService));
			  		}
			  		this.directories.sort((s1, s2)=>s1.getName().localeCompare(s2.getName()));
			  		this._currentDirectory.setIsLoaded(true);
			  		this.loading = 'hide';
			  		this.status = 'success';
				}
		  		if(response.Contents){
		  			if(!response.CommonPrefixes)
			  		  this.directories = new Array();
					this.files = new Array();
		  			for(let i=1, len=response.Contents.length; i<len; i++){
			  			this.files.push(new File(response.Contents[i].Key.replace(response.Prefix, ''), response.Contents[i].Key, response.Contents[i].Size, response.Contents[i].Date));
			  		}
			  		this.files.sort((s1, s2)=>s1.getName().localeCompare(s2.getName()));
			  		this._currentDirectory.setIsLoaded(true);
			  		this.loading = 'hide';
			  		this.status = 'success';
		  		}  		
			},
			error => {
				console.log('There is a problem loading data. '); // an error occurred
				console.log(error);
				this.loading = 'hide';
			}
		);
	}
}