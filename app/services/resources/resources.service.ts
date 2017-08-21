import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {globalVariables} from '../../global';

@Injectable()
export class ResourcesService{
	public url = globalVariables['base_api_url'];
	public identity;
	public token;

	constructor (private _http: Http){}
	
	register(token, resource_to_register, contAttri, itemsPerPage){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(resource_to_register);
		json = encodeURIComponent(json);
		let jsonContAttri = encodeURIComponent(contAttri);
		let params = "json="+json+"&jsonContAttri="+jsonContAttri+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/resources/new", params, {headers: headers}).map(res => res.json());
	}

	searchPlatforms(token){
		token = encodeURIComponent(token);
		let json = JSON.stringify({"":""});
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		let http: any;
		return this._http.post(this.url+"/resources/platforms", params, {headers: headers}).map(res => res.json());
	}
	
	searchInstances(token, bid){
		token = encodeURIComponent(token);	
		let json = JSON.stringify(bid);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		let http: any;
		return this._http.post(this.url+"/resources/instances", params, {headers: headers}).map(res => res.json());
	}
	
	searchAttributes(token, cid){
		token = encodeURIComponent(token);	
		let json = JSON.stringify(cid);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		let http: any;
		return this._http.post(this.url+"/resources/attributes", params, {headers: headers}).map(res => res.json());
	}

	search(search=null, page=null, pagina, token, userowner, itemsPerPage, activeResourcePlatformId, activeResourceInstanceId, activeUserId){
		token = encodeURIComponent(token);	
		let json = JSON.stringify(userowner);
		let params = "json="+json+
		             "&authorization="+token+
					 "&items="+itemsPerPage+
					 "&activeResourcePlatformId="+activeResourcePlatformId+
					 "&activeResourceInstanceId="+activeResourceInstanceId+
					 "&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		
		if (page == null){
			page = 1;
		}
		let http: any;
		let cont: any;
		let cont1: any;

		if (search == null && pagina == null){
			cont = "/resources/resource";
		}

		if (search == null && pagina != null){
			cont = "/resources/resource?page="+page;
		}

		if (search != null && pagina == null){
			cont = "/resources/resource/"+search;			
		}

		if (search != null && pagina != null){
			cont = "/resources/resource/"+search+"?page="+page;		
		}
// console.log(this.url+cont);				
// console.log(params);				
      	return this._http.post(this.url+cont, params, {headers: headers}).map(res => res.json());
	}

	detail(token, userowner, id){
		token = encodeURIComponent(token);	
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/resources/detail/"+id, params, {headers: headers}).map(res => res.json());		
	}

	update(token, resource_to_update, contAttri, id, itemsPerPage){ 
		token = encodeURIComponent(token);	
		let json = JSON.stringify(resource_to_update);
		json = encodeURIComponent(json);
		let jsonContAttri = encodeURIComponent(contAttri);
		let params = "json="+json+"&jsonContAttri="+jsonContAttri+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/resources/update/"+id, params, {headers: headers}).map(res => res.json());
	}

	delete(token, id){
		token = encodeURIComponent(token);	
		let params = "authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/resources/delete/"+id, params, {headers: headers}).map(res => res.json());		
	}

	getResourcePlatforms(token, activeUserId){
		token = encodeURIComponent(token);
		let params = "authorization="+token+"&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/resources/getResourcePlatforms", params, {headers: headers}).map(res => res.json());		
	}

	getResourceInstances(token, activeUserId){
		token = encodeURIComponent(token);
		let params = "authorization="+token+"&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/resources/getResourceInstances", params, {headers: headers}).map(res => res.json());		
	}

	saveFavorites(token, resourceFavorites){ 
		token = encodeURIComponent(token);
		let jsonResourceFavorites = JSON.stringify(resourceFavorites);
		let params = "authorization="+token+"&jsonResourceFavorites="+jsonResourceFavorites;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/resources/saveFavorites", params, {headers: headers}).map(res => res.json());
	}
}