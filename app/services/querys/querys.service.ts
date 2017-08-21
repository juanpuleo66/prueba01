import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {globalVariables} from '../../global';

@Injectable()
export class QuerysService{
	public url = globalVariables['base_api_url'];
	public identity;
	public token;

	constructor (private _http: Http){}

	searchQuerys(token, userowner){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/querys/querys", params, {headers: headers}).map(res => res.json());
	}

	searchResources(token, userowner){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/querys/resources", params, {headers: headers}).map(res => res.json());
	}	

	searchLogs(token, userowner, id){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/querys/logs/"+id, params, {headers: headers}).map(res => res.json());
	}	

	addResources(token, dataJson){
		token = encodeURIComponent(token);
		let json = JSON.stringify(dataJson);
		json = encodeURIComponent(json);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/querys/addResource", params, {headers: headers}).map(res => res.json());
	}	
	
	executeQuery(token, dataJson){
		token = encodeURIComponent(token);
		let json = JSON.stringify(dataJson);
		json = encodeURIComponent(json);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/querys/execute", params, {headers: headers}).map(res => res.json());
	}	
	
	register(token, query_to_register, logs_to_register){ 
		token = encodeURIComponent(token);
		let json1 = JSON.stringify(query_to_register);
		json1 = encodeURIComponent(json1);
		let json2 = JSON.stringify(logs_to_register);
		json2 = encodeURIComponent(json2);
		let params = "json1="+json1+"&json2="+json2+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		if ( query_to_register.id == 0 )
		{
			return this._http.post(this.url+"/querys/new", params, {headers: headers}).map(res => res.json());
		} else {
			return this._http.post(this.url+"/querys/update", params, {headers: headers}).map(res => res.json());
		}
	}

	delete(token, id){
		token = encodeURIComponent(token);
		let params = "authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/querys/delete/"+id, params, {headers: headers}).map(res => res.json());		
	}
}