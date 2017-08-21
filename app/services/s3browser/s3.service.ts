import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
import {globalVariables} from '../../global';

@Injectable()
export class S3Service{

	public url = globalVariables['base_api_url'];

	constructor(private _http:Http){}
	
	searchResources(token, userowner){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/aws/resources", params, {headers: headers}).map(res => res.json());
	}

	listObjects(token, config){
		token = encodeURIComponent(token);
		let json = JSON.stringify(config);
     	json = encodeURIComponent(json);
		let params = "params="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+"/aws/listObjects", params, {headers: headers}).map(res => res.json());
	}

	copyTo(token, config){
		token = encodeURIComponent(token);
		let json = JSON.stringify(config);
		json = encodeURIComponent(json);
		let params = "params="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(this.url+"/aws/copyTo", params, {headers: headers})
							.map(res => res.json());
	}

	moveTo(token, config){
		token = encodeURIComponent(token);
		let json = JSON.stringify(config);
		json = encodeURIComponent(json);
		let params = "params="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(this.url+"/aws/moveTo", params, {headers: headers})
							.map(res => res.json());
	}

}