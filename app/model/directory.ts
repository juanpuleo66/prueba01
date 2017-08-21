import {File} from './file';
import {S3Service} from '../services/s3browser/s3.service';
import {LoginService} from '../services/login.service';

declare const AWS: any;

export class Directory{
	private _name:string;
	private _prefix:string;
	private _parentDirectory:Directory;
	private _directories:Directory[];
	private _files:File[];
	private _isLoaded:boolean;
	private _s3service: S3Service;
	private _loginService: LoginService;

	constructor(name:string, prefix:string, parentDirectory:Directory, s3service:S3Service, _loginService: LoginService){
		this._name = name;
		this._prefix = prefix;
		this._parentDirectory = parentDirectory;
		this._directories = [];
		this._files = [];
		this._isLoaded = false;
		this._s3service = s3service;
		this._loginService = _loginService;
	}

    setIsLoaded(status:boolean){
    	this._isLoaded = status;
    } 

	getName():string{
		return this._name;
	}

	getPrefix():string{
		return this._prefix;
	}

	getParentDirectory():Directory{
		return this._parentDirectory;
	}

	isRootDirectory():boolean{
		return this._parentDirectory == null;
	}
	
	getDirectories(resourceIdSelected):Directory[]{
		if(!this._isLoaded){
			this.load(resourceIdSelected);
			this._isLoaded = true;
		}
		return this._directories;
	}

	getFiles(resourceIdSelected):File[]{
		if(!this._isLoaded){
			this.load(resourceIdSelected);
			this._isLoaded = true;
		}
		return this._files;
	}


	refresh(resourceIdSelected):void{
		this._directories = [];
		this._files = [];
		this.load(resourceIdSelected);
	}

	load(resourceIdSelected):void{

		let self = this;
       	let params = {'idResource': resourceIdSelected, 'Delimiter': '/', 'Prefix':this._prefix};
		let token = this._loginService.getToken();
		this._s3service.listObjects(token, params).subscribe(
			response => {
				if(response.CommonPrefixes)
					for(let i=0, len=response.CommonPrefixes.length; i<len; i++){
			  			self._directories.push(new Directory(response.CommonPrefixes[i].Prefix.replace(response.Prefix, ''), response.CommonPrefixes[i].Prefix, self, self._s3service, self._loginService));
			  		}
		  		self._directories.sort((s1, s2)=>s1._name.localeCompare(s2._name));
		  		if(response.Contents)
			  		for(let i=1, len=response.Contents.length; i<len; i++){
			  			self._files.push(new File(response.Contents[i].Key.replace(response.Prefix, ''), response.Contents[i].Key, response.Contents[i].Size, response.Contents[i].Date));
			  		}
		  		self._files.sort((s1, s2)=>s1.getName().localeCompare(s2.getName()));
			},
			error => {
				console.log('There is a problem loading data.'); // an error occurred
				console.log(error);
			}
		);
	}
}