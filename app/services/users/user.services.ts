import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
import {globalVariables} from '../../global';

@Injectable()
export class UserService{

	public url = globalVariables['base_api_url'];
	constructor(private _http: Http){}
	
	register(user_to_register,token){

		let json = JSON.stringify(user_to_register);
		let json1 = encodeURIComponent(json);
		let token1 = encodeURIComponent(token);
		let params = "json="+json1+"&authorization="+token1;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
	
		return this._http.post(this.url+"/users/new", params,{headers: headers}).map(res=>res.json());
	}

	getUserById(id_user, token){
		
		let token1 = encodeURIComponent(token);
		let params = "authorization="+token1;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		
		return this._http.post(this.url+"/users/user-details/"+id_user, params,{headers: headers}).map(res=>res.json());
	}

	getUserGroups(token){
		
		let token1 = encodeURIComponent(token);
		let params = "authorization="+token1;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/users/groups", params,{headers: headers}).map(res=>res.json());
	}

	edit(user_to_edit,token, id){
		
		let json = JSON.stringify(user_to_edit);
		let json1 = encodeURIComponent(json);
		let token1 = encodeURIComponent(token);

		let params = "json="+json+"&authorization="+token1;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		if(id==undefined){
			return this._http.post(this.url+"/users/edit", params,{headers: headers}).map(res=>res.json());
		}
		
		else{
			return this._http.post(this.url+"/users/editAnother/"+id, params,{headers: headers}).map(res=>res.json());
		}
	}

	changeActivateStatus(newStatus,token,id){

		let token1 = encodeURIComponent(token);
		let params = "authorization="+token1+"&status="+newStatus;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/users/changeActive/"+id, params,{headers: headers}).map(res=>res.json());

	}

	delete(user_to_delete,token){
		let token1 = encodeURIComponent(token);
		let params = "authorization="+token1;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/users/delete-user/"+user_to_delete, params,{headers: headers}).map(res=>res.json());
	}

	getUsersList(token){
		let token1 = encodeURIComponent(token);
		let params = "authorization="+token1;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/users/list", params,{headers: headers}).map(res=>res.json());
	}

	search(search=null, page=null, pagina, token, items){

		let token1 = encodeURIComponent(token);
		let params = "authorization="+token1+"&items="+items;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		
		if (page == null){
			page = 1;
		}
		let http: any;
		let cont: any;
		let cont1: any;

		if (search == null && pagina == null){
			cont = "/users/listUsers";
		}

		if (search == null && pagina != null){
			cont = "/users/listUsers?page="+page;
		}

		if (search != null && pagina == null){
			
			cont = "/users/search/"+search;			
		}

		if (search != null && pagina != null){
			cont = "/users/search/"+search+"?page="+page;		
		}
		http = this._http.post(this.url+cont, params, {headers: headers}).map(res => res.json());
		return http;
	}

	searchUsers(token){
		token = encodeURIComponent(token);
		let params = "authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		let http: any;
		return this._http.post(this.url+"/users/searchUsers", params, {headers: headers}).map(res => res.json());
	}
	
}