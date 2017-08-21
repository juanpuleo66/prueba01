import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {globalVariables} from '../../global';

@Injectable()
export class TasksService{
	public url = globalVariables['base_api_url'];
	public identity;
	public token;

	constructor (private _http: Http){}
	
	search(search=null, page=null, pagina, token, userowner, itemsPerPage, activeUserId, activeConfigName, activeScriptName, activeTaskStatusId){
        token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+
					 "&authorization="+token+
					 "&items="+itemsPerPage+
					 "&activeUserId="+activeUserId+
					 "&activeConfigName="+activeConfigName+
					 "&activeScriptName="+activeScriptName+
					 "&activeTaskStatusId="+activeTaskStatusId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		
		if (page == null){
			page = 1;
		}
		let http: any;
		let cont: any;
		let cont1: any;

		if (search == null && pagina == null){
			cont = "/tasks/task";
		}

		if (search == null && pagina != null){
			cont = "/tasks/task?page="+page;
		}

		if (search != null && pagina == null){
			cont = "/tasks/task/"+search;			
		}

		if (search != null && pagina != null){
			cont = "/tasks/task/"+search+"?page="+page;		
		}
// console.log(this.url+cont);
// console.log(params);
		http = this._http.post(this.url+cont, params, {headers: headers}).map(res => res.json());
		return http;
	}

	taskIdRefresh(token, taskId){
		token = encodeURIComponent(token);
		let params = "authorization="+token+"&taskId="+taskId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/taskIdRefresh", params, {headers: headers}).map(res => res.json());		
	}
	
	detail(token, userowner, id){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/detail/"+id, params, {headers: headers}).map(res => res.json());		
	}
	
	update(token, task_to_update, id, itemsPerPage){ 
		token = encodeURIComponent(token);	
		let json = JSON.stringify(task_to_update);
		json = encodeURIComponent(json);
		let params = "json="+json+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/update/"+id, params, {headers: headers}).map(res => res.json());
	}
	
	updateTaskComment(token, comment_to_update, id ){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(comment_to_update);
		json = encodeURIComponent(json);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/updateTaskComment/"+id, params, {headers: headers}).map(res => res.json());
	}
	
	updateActionWarning(token, action_to_update, idTaskLog ){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(action_to_update);
		json = encodeURIComponent(json);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/updateActionWarning/"+idTaskLog, params, {headers: headers}).map(res => res.json());
	}
	
	runTask(token, id, itemsPerPage, userowner){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/runTask/"+id, params, {headers: headers}).map(res => res.json());
	}

	stopTask(token, id, itemsPerPage, userowner){ 
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token+"&itemsPerPage="+itemsPerPage;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/stopTask/"+id, params, {headers: headers}).map(res => res.json());
	}

	saveFavorites(token, taskFavorites){ 
		token = encodeURIComponent(token);
		let jsonTaskFavorites = JSON.stringify(taskFavorites);
		let params = "authorization="+token+"&jsonTaskFavorites="+jsonTaskFavorites;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/saveFavorites", params, {headers: headers}).map(res => res.json());
	}

	detailTaskConfig(token, userowner, id){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/detailTaskConfig/"+id, params, {headers: headers}).map(res => res.json());		
	}

	detailTaskConfigLogs(token, userowner, id){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/detailTaskConfigLogs/"+id, params, {headers: headers}).map(res => res.json());		
	}

	statusTaskConfigLogs(token,id){
		token = encodeURIComponent(token);
		let params = "authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/statusTaskLogs/"+id, params, {headers: headers}).map(res => res.json());		
	}

	gotoConfig(token, userowner, id, itemsPerPage, activeUserId){
		token = encodeURIComponent(token);
		let json = JSON.stringify(userowner);
		let params = "json="+json+"&authorization="+token+"&itemsPerPage="+itemsPerPage+"&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/gotoConfig/"+id, params, {headers: headers}).map(res => res.json());		
	}

	getTaskScriptNames(token, activeUserId){
		token = encodeURIComponent(token);
		let params = "authorization="+token+"&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/getTaskScriptNames", params, {headers: headers}).map(res => res.json());		
	}

	getTaskConfigNames(token, activeUserId){
		token = encodeURIComponent(token);
		let params = "authorization="+token+"&activeUserId="+activeUserId;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/tasks/getTaskConfigNames", params, {headers: headers}).map(res => res.json());		
	}

	delete(token, id){
		token = encodeURIComponent(token);
		let params = "authorization="+token;
		let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+"/configs/delete/"+id, params, {headers: headers}).map(res => res.json());		
	}

}