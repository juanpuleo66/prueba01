import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {globalVariables} from '../global';

@Injectable()
export class LoginService{
	public url = globalVariables['base_api_url'];
	public identity;
	public token;

	constructor (private _http: Http){}

	signup(user_to_login){ 
		let json = JSON.stringify(user_to_login);
		let params = "json="+json;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/login", params, {headers: headers}).map(res => res.json());
	}
	
	register(token, user_to_register){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(user_to_register);
		json = encodeURIComponent(json);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(this.url+"/user/new", params, {headers: headers}).map(res => res.json());
	}

	getIdentity(){
		// function that returns the user identity form localStorage
		let identity = JSON.parse(localStorage.getItem('identity'));

		if (identity != "undefined"){
			this.identity = identity;
		} else {
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		// function that returns the token from localStorage
		let token = localStorage.getItem('token');

		if (token != "undefined"){
			this.token = token;
		} else {
			this.token = null;
		}

		return this.token;
	}

}
