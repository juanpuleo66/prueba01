import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {globalVariables} from '../../global';

@Injectable()
export class ScriptsService{
	public url = globalVariables['base_api_url'];
	public identity;
	public token;

	constructor (private _http: Http){}
	
	search(search=null, page=null, pagina, token, userowner, items, activeUserId){
		token = encodeURIComponent(token);	
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token+"&items="+items+"&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		
		if (page == null){
			page = 1;
		}
		let http: any;
		let cont: any;
		let cont1: any;

		if (search == null && pagina == null){
			cont = "/scripts/script";
		}

		if (search == null && pagina != null){
			cont = "/scripts/script?page="+page;
		}

		if (search != null && pagina == null){
			cont = "/scripts/script/"+search;			
		}

		if (search != null && pagina != null){
			cont = "/scripts/script/"+search+"?page="+page;		
		}
		
		http = this._http.post(this.url+cont, params, {headers: headers}).map(res => res.json());
		return http;
	}

	detail(token, userowner, id, tp){
		token = encodeURIComponent(token);	
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/scripts/detail/"+id+"/"+tp, params, {headers: headers}).map(res => res.json());		
	}

	update(token, script_to_update, contParam, id, itemsPerPage){ 
		token = encodeURIComponent(token);	
		let json = JSON.stringify(script_to_update);
		let jsonContParam = encodeURIComponent(contParam);
		let params = "json="+json+"&jsonContParam="+jsonContParam+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/scripts/update/"+id, params, {headers: headers}).map(res => res.json());
	}

	register(token, script_to_register, contParam, itemsPerPage){ 
		token = encodeURIComponent(token);	
		let json = JSON.stringify(script_to_register);
		let jsonContParam = encodeURIComponent(contParam);
		let params = "json="+json+"&jsonContParam="+contParam+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/scripts/new", params, {headers: headers}).map(res => res.json());
	}

	delete(token, id, userowner){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(this.url+"/scripts/delete/"+id, params, {headers: headers}).map(res => res.json());		
	}

	saveFavorites(token, scriptFavorites){ 
		token = encodeURIComponent(token);
		let jsonScriptFavorites = JSON.stringify(scriptFavorites);
		let params = "authorization="+token+"&jsonScriptFavorites="+jsonScriptFavorites;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/scripts/saveFavorites", params, {headers: headers}).map(res => res.json());
	}
	
}