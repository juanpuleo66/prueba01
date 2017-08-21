import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {globalVariables} from '../../global';

@Injectable()
export class ConfigsService{
	public url = globalVariables['base_api_url'];
	public identity;
	public token;

	constructor (private _http: Http){}
	
	search(search=null, page=null, pagina, token, userowner, itemsPerPage, activeConfigScriptId, activeUserId){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+
				     "&authorization="+token+
					 "&items="+itemsPerPage+
					 "&activeConfigScriptId="+activeConfigScriptId+
					 "&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		
		if (page == null){
			page = 1;
		}
		let http: any;
		let cont: any;
		let cont1: any;

		if (search == null && pagina == null){
			cont = "/configs/config";
		}

		if (search == null && pagina != null){
			cont = "/configs/config?page="+page;
		}

		if (search != null && pagina == null){
			cont = "/configs/config/"+search;			
		}

		if (search != null && pagina != null){
			cont = "/configs/config/"+search+"?page="+page;		
		}

// console.log(this.url+cont);
// console.log(params);
		http = this._http.post(this.url+cont, params, {headers: headers}).map(res => res.json());
		return http;
	}

	searchResources(token, userowner){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		let http: any;
		http = this._http.post(this.url+"/configs/resources", params, {headers: headers}).map(res => res.json());
		return http;
	}

	searchScripts(token){
		token = encodeURIComponent(token);
		let json = JSON.stringify({"":""});
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		let http: any;
		http = this._http.post(this.url+"/configs/scripts", params, {headers: headers}).map(res => res.json());
		return http;
	}

	searchParameters(token, idScript){
		token = encodeURIComponent(token);
		let json = JSON.stringify(idScript);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		let http: any;
		http = this._http.post(this.url+"/configs/parameters", params, {headers: headers}).map(res => res.json());
		return http;
	}

	register(token, config_to_register, dataConfig, itemsPerPage){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(config_to_register);
		json = encodeURIComponent(json);
		dataConfig = encodeURIComponent(dataConfig);
		let jsonDataConfig = dataConfig;
		let params = "json="+json+"&jsonDataConfig="+jsonDataConfig+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
//		return this._http.post(this.url+"/configs/new", params, {headers: headers}).map(res => res.json());
		return this._http.post(this.url+"/configs/newduplicate/"+1, params, {headers: headers}).map(res => res.json());
	}

	duplicate(token, config_to_update, dataConfig, itemsPerPage){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(config_to_update);
		json = encodeURIComponent(json);
		let jsonDataConfig = dataConfig;
		dataConfig = encodeURIComponent(dataConfig);
		let params = "json="+json+"&jsonDataConfig="+jsonDataConfig+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
//		return this._http.post(this.url+"/configs/duplicate", params, {headers: headers}).map(res => res.json());
		return this._http.post(this.url+"/configs/newduplicate/"+2, params, {headers: headers}).map(res => res.json());
	}

	detail(token, userowner, id){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/configs/detail/"+id, params, {headers: headers}).map(res => res.json());		
	}

	update(token, config_to_update, dataConfig, id, itemsPerPage){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(config_to_update);
		json = encodeURIComponent(json);
		dataConfig = encodeURIComponent(dataConfig);
		let jsonDataConfig = dataConfig;
		let params = "json="+json+"&jsonDataConfig="+jsonDataConfig+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/configs/update/"+id, params, {headers: headers}).map(res => res.json());
	}

	delete(token, id){
		token = encodeURIComponent(token);
		let params = "authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/configs/delete/"+id, params, {headers: headers}).map(res => res.json());		
	}
	
	createTask(token, id, userowner){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/configs/createTask/"+id, params, {headers: headers}).map(res => res.json());		
	}

	getConfigScriptNames(token, activeUserId){
		token = encodeURIComponent(token);
		let params = "authorization="+token+"&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/configs/getConfigScriptNames", params, {headers: headers}).map(res => res.json());		
	}

	saveFavorites(token, configFavorites){ 
		token = encodeURIComponent(token);
		let jsonConfigFavorites = JSON.stringify(configFavorites);
		let params = "authorization="+token+"&jsonConfigFavorites="+jsonConfigFavorites;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/configs/saveFavorites", params, {headers: headers}).map(res => res.json());
	}
}