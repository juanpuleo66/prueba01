import {Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {TasksService} from '../../services/tasks/tasks.service';
import {UserService} from '../../services/users/user.services';
import {WindowModalMessage} from '../../common/windowmodal/window.modal.message';
import {CommonFunctions}    from '../../common/commonfunctions/common.functions';
import {GenerateDatePipe} from '../../pipes/generate.date.pipe';
import {globalVariables} from '../../global';
import {GeneralServices} from '../../services/general/general.services';
import {Observable} from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';

declare var $: any;

@Component({
    selector: 'tasks',
    templateUrl: 'app/views/tasks/tasks.html',
    directives: [ROUTER_DIRECTIVES, CommonFunctions, WindowModalMessage],
    providers: [LoginService, TasksService, UserService, GeneralServices],
    pipes: [GenerateDatePipe]
})
 
export class TasksComponent implements OnInit {
	public titulo = "Tasks: ";
	public identity;
	public tasks;
	public errorMessage;
	public status;
	public code;
	public msg;
	public loading;
	public page;
	public pageActual;
	public totalPages = 1;
	public firstPage = 1;
	public totalRecords = 1;
	public itemsPerPage;
	public pagePrev = 1;
	public pageNext = 1;
	public searchString;
	public colOrd;
	public colAct;			
	public users;
	public activeUserId;
	public activeTaskStatusId;
	public globalItemsPerPage = globalVariables['items_per_page'];
	public taskFavorites;
	public activeScriptName;
	public taskScriptNames;
	public activeConfigName;
	public taskConfigNames;
	public taskLogStatus;
	public activateTaskFavorites:string;
	public obsSubscription = [];
	public subscriptionsActive:boolean = false;

	@ViewChild(CommonFunctions) commonFunctions: CommonFunctions;
	@ViewChild(WindowModalMessage) windowModalMessage: WindowModalMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService,
		private _tasksService: TasksService,
		private elementRef: ElementRef,
		private _userService: UserService,
		private _generalServices: GeneralServices
	){
	}

	ngOnInit() {
		this.loading = 'show';

		this.identity = this._loginService.getIdentity();
		
		this.colAct = localStorage.getItem('colAct');
		this.colOrd = localStorage.getItem('colOrd');
		this.itemsPerPage = localStorage.getItem('tasksItemsPerPage');
		 
		if ( this.itemsPerPage == null ) {
			this.itemsPerPage = this.globalItemsPerPage;		
			localStorage.setItem('tasksItemsPerPage', this.itemsPerPage);
		}
		 
		if ( this.identity.role == 'admin' ) {
			this.activeUserId = localStorage.getItem('tasksActiveUserId');
			 
			if ( this.activeUserId == null ) {
				localStorage.setItem('tasksActiveUserId', this.identity.sub);
				this.activeUserId = this.identity.sub;
			}
		} else {
			this.activeUserId = this.identity.sub;
			localStorage.removeItem('tasksActiveUserId');
		}

		if ( localStorage.getItem('activateTaskFavorites') != null ) {
			this.activateTaskFavorites = localStorage.getItem('activateTaskFavorites');	
		} else {
			this.activateTaskFavorites = 'false';
			localStorage.setItem('activateTaskFavorites', this.activateTaskFavorites);
		}

		if ( localStorage.getItem('activeConfigName') != null ) {
			this.activeConfigName = localStorage.getItem('activeConfigName');	
		} else {
			this.activeConfigName = 'All';
			localStorage.setItem('activeConfigName', this.activeConfigName);
		}

		if ( localStorage.getItem('activeScriptName') != null ) {
			this.activeScriptName = localStorage.getItem('activeScriptName');	
		} else {
			this.activeScriptName = 'All';
			localStorage.setItem('activeScriptName', this.activeScriptName);
		}

		if ( localStorage.getItem('activeTaskStatusId') != null ) {
			this.activeTaskStatusId = localStorage.getItem('activeTaskStatusId');	
		} else {
			this.activeTaskStatusId = 'A';
			localStorage.setItem('activeTaskStatusId', this.activeTaskStatusId);
		}

		if ( !this.colAct ) {
			this.colAct = null;
		} 
		
		if ( !this.colOrd ) {
			this.colOrd = null;
		} 

		this.setOrder(this.colAct);
		
		this._route.params.subscribe(params => {
			let page:any = +params["page"];

			if( !page ){
				page = null;
			}
			
			let search:any = params["search"];

			if (!search || search.trim().length == 0){
				search = null;
				this.searchString = null;
			} else {
				this.searchString = search;
			}

			this.getSearchTasks(page, this.searchString, this.itemsPerPage);
			this.getTaskConfigNames();
			this.getTaskScriptNames();
			this.getTaskLogStatus();
			
			if ( this.identity.role == 'admin' ) {
				this.searchUsers();
			}	
		});
	}
	 
	ngOnDestroy() {
// console.log('task.component.ts-ngOnDestroy');
		this.unSubscribeAll();
	}
	
	search(page=null, searchString, itemsPerPage){
		this.unSubscribeAll();
		this.searchString = searchString;
		this.itemsPerPage = itemsPerPage;
		localStorage.setItem('tasksItemsPerPage', itemsPerPage);
		this.getSearchTasks(page, this.searchString, itemsPerPage);
	}

	getSearchTasks(page=null, search="", itemsPerPage){

		if (!search || search.trim().length == 0){
			search = null;
			this.searchString = null;
		} else {
			this.searchString = search;
		}
		
		let pagina = true;

		if( !page ){
			page = 1;
			pagina = null;
		}

		this.pageActual = page;
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub};

		this._tasksService.search(search, page, pagina, token, userowner, itemsPerPage, this.activeUserId, this.activeConfigName, this.activeScriptName, this.activeTaskStatusId).subscribe(
			response => {
				this.status = response.status;
				
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.tasks = response.data;

					for ( let i=0; i<this.tasks.length; i++ ) {
						this.tasks[i].scriptPath = this._generalServices.columnContentFormat(this.tasks[i].scriptPath, 30);
						this.tasks[i].comment = this._generalServices.columnContentFormat(this.tasks[i].comment, 50);
					}
					this.subscribeAll();
					this.loading = 'hide';

					if (page >= 2) {
						this.pagePrev = (page-1);
					} else {
						this.pagePrev = page;
					}

					if (page < response.total_pages || page == 1) {
						this.pageNext = (page+1);
					} else {
						this.pageNext = page;
					}

					this.firstPage = 1;
					this.totalPages = response.total_pages;
					this.totalRecords = response.total_items_count;
					this.itemsPerPage = response.items_per_page;	
				}					
			},
			error => {
				this.errorMessage = <any>error;
					
				if (this.errorMessage != null) {
					alert('Error: '+this.errorMessage);
				}
			}
		); 
	}

	onClickFunction(taskId, taskFavorite, index) {
		console.error('onClickFunction: this.obsSubscription.length: '+this.obsSubscription.length);				
		console.error(this.obsSubscription);				
		console.error('index: '+index);
		console.error('taskId: '+taskId);
		console.error('taskFavorite: '+taskFavorite);
	}

	onSaveFavorites(taskId, taskFavorite, index){
		switch ( true ) {
			case (taskFavorite == 0):
console.warn(index+' tasks.component.ts-onSaveFavorites: '+taskFavorite+' unsubscribe this taskId: '+taskId);	
				if ( this.obsSubscription[index] != undefined ) {
					this.obsSubscription[index].unsubscribe();
					this.obsSubscription.splice(index,1);
				}	
				
				if ( this.obsSubscription.length == 0 ) { 
// falta revisar que los indices de los otros no sean undefined, ya quie al momento de subscribirse y elindex es nueve el crea uno para cada indice pero undefined
					this.subscriptionsActive = false;
				}
console.log('onSaveFavorites: this.obsSubscription.length: '+this.obsSubscription.length);				
				break;

			case (taskFavorite == 1):
console.warn(index+' tasks.component.ts-onSaveFavorites: '+taskFavorite+' subscribe this taskId: '+taskId);
				this.subscribeOne(index, taskId);
			break;
		}

		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}
		this.taskFavorites = [];
		this.taskFavorites.push({taskId: taskId, taskFavorite: taskFavorite});
		 
		this._tasksService.saveFavorites(token, this.taskFavorites).subscribe(
			response => {
				this.status = response.status;
				this.loading = 'hide';
				
				if ( this.status != "success" ){
					this.code   = response.code;
					this.msg    = response.msg;	
				} else {
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

	onChangeFavorites() {
		// localStorage transforms everything to text, booleans are not accepted
		this.activateTaskFavorites = this.activateTaskFavorites == 'true' ? 'false' : 'true';
		localStorage.setItem('activateTaskFavorites', this.activateTaskFavorites)
	}

	rowHidden(favorite){
		switch (true) {
			case (this.activateTaskFavorites == 'false') :
				return false;	
			case (this.activateTaskFavorites == 'true' && favorite == 1) :
				return false;
			default:
				return true;
		}
	}

	getTaskConfigNames(){
		this.loading = 'show';
		let token = this._loginService.getToken();

		this._tasksService.getTaskConfigNames(token, this.activeUserId).subscribe(
			response => {
				this.status = response.status;
				
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.taskConfigNames = response.data;
					this.taskConfigNames.unshift({configName:'All'});
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

	getConfigName(configName) {		
		this.unSubscribeAll();
		this.activeConfigName = configName;
		localStorage.setItem('activeConfigName', this.activeConfigName);
		this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);
	}
	 
	getTaskScriptNames(){
		this.loading = 'show';
		let token = this._loginService.getToken();
		
		this._tasksService.getTaskScriptNames(token, this.activeUserId).subscribe(
			response => {
				this.status = response.status;
				
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.taskScriptNames = response.data;
					this.taskScriptNames.unshift({scriptName:'All'});
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
	 
	getScriptName(scriptName) {		
		this.unSubscribeAll();
		this.activeScriptName = scriptName;
		localStorage.setItem('activeScriptName', this.activeScriptName);
		this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);
	}

	getTaskLogStatusUnique(idStatus){
		this.unSubscribeAll();
		this.activeTaskStatusId = idStatus;
		localStorage.setItem('activeTaskStatusId', this.activeTaskStatusId);
		this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);
	} 

	getTaskLogStatus(){
		this.taskLogStatus = [];
		this.taskLogStatus[0] = {idStatus:'A', logStatus:'All'};
		this.taskLogStatus[1] = {idStatus:'0', logStatus:'Unrun'};
		this.taskLogStatus[2] = {idStatus:'1', logStatus:'Success'};
		this.taskLogStatus[3] = {idStatus:'2', logStatus:'Running'};
		this.taskLogStatus[4] = {idStatus:'3', logStatus:'Stopped'};
		this.taskLogStatus[5] = {idStatus:'4', logStatus:'Error'};
		this.taskLogStatus[6] = {idStatus:'5', logStatus:'Server-Error'};
		this.taskLogStatus[7] = {idStatus:'6', logStatus:'Warning'};
		this.taskLogStatus[8] = {idStatus:'7', logStatus:'W-success'};
	}

	searchUsers(){
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
			
		this._userService.searchUsers(token).subscribe(
			responseb => {
				this.status = responseb.status;
									
				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = responseb.code;
					this.msg = responseb.msg;	
				} else {
					this.users = responseb.data;
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
	
	getUser(userid) {
		this.unSubscribeAll();
		this.activeUserId = userid;
		localStorage.setItem('tasksActiveUserId', userid);
		this.pageActual = 1;
		
		this.activeConfigName = 'All';
		localStorage.setItem('activeConfigName', this.activeConfigName);
		this.activeScriptName = 'All';
		localStorage.setItem('activeScriptName', this.activeScriptName);

		this.getSearchTasks(this.pageActual, this.searchString, this.itemsPerPage);

		let self = this;
		let timeOut = setInterval(function(){
			clearInterval(timeOut);
			self.getTaskConfigNames();
			self.getTaskScriptNames();
		}, 500);
	}

	subscribeAll() {
// console.warn('task.component.ts-subscribeAll');

		for ( let index=0; index<this.tasks.length; index++ ) {
			let idTask = this.tasks[index].id;
				
			if ( this.tasks[index].favorite == 1 ) { 			
			// only the tasks that are mark as favorite while subscribe to the Observable
console.error('id: '+this.tasks[index].id+' - this.tasks['+index+'].favorite: '+this.tasks[index].favorite);
				this.subscribeOne(index, idTask);
			}
		}
		this.subscriptionsActive = true;
	}

	unSubscribeAll() {
// console.warn('task.component.ts-unSubscribeAll');
console.warn('antes:this.obsSubscription:');
console.log(this.obsSubscription);
		for ( let i=0; i<this.obsSubscription.length; i++ ) {
			
			if ( this.obsSubscription[i] != undefined ) {
				this.obsSubscription[i].unsubscribe();
			}
		}

		// this is done because the unsubscribe() function is done asynchronously and some times is still running and the code flows continues
		while ( this.obsSubscription.length != 0 ) {
			
			for ( let i=0; i<this.obsSubscription.length; i++ ) {

				if ( this.obsSubscription[i] == undefined || (this.obsSubscription[i] != undefined && this.obsSubscription[i].isUnsubscribed) ) {
					this.obsSubscription.splice(i,1);
console.log(i+' this.obsSubscription');
				}
			}
		}
		this.subscriptionsActive = false;
console.warn('despues:this.obsSubscription:');
console.log(this.obsSubscription);

	}

	subscribeOne(index, idTask){
// console.warn('task.component.ts-subscribeOne');
		let foundIdTask = true;
// console.warn('index: '+index);
// console.warn('idTask: '+idTask);

		if ( this.obsSubscription[index] != undefined ) {
// console.error('task.component.ts-subscribeOne - inside the if - this.obsSubscription['+index+'] exist');
			// checks if the subscribe already exists
			foundIdTask = false;
		}

		if ( foundIdTask ) {
// console.log('task.component.ts-subscribeOne-foundIdTask: '+idTask);
			// subscribes the idTask to an Observable
	
			this.obsSubscription[index] = Observable
				.timer(500,5000)
				.subscribe(
					(numb:number) => {
console.log('obsSubscription-idTask: '+idTask);
						let token = this._loginService.getToken();
									 
						this._tasksService.taskIdRefresh(token, idTask).subscribe(
							response => {
								this.status = response.status;
			     							 								 
								if ( this.status != "success" ){
									this.code = response.code;
									this.msg = response.msg;	
								} else {
									let taskIdRecord = response.data;
									taskIdRecord[0].scriptPath = this._generalServices.columnContentFormat(taskIdRecord[0].scriptPath, 30);
									taskIdRecord[0].comment = this._generalServices.columnContentFormat(taskIdRecord[0].comment, 50);
									this.tasks[index] = taskIdRecord[0];
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
				); 
		}
// console.log('this.obsSubscription');
// console.log(this.obsSubscription);
// console.error('this.obsSubscription.length: '+this.obsSubscription.length);
	}
////////////////////////////////////////////////////////////////////////////////////////////////////

	runTask(index){
// console.warn('task.component.ts-runTask');
		let cont = true;

		if ( this.tasks[index].comment == null || this.tasks[index].comment.trim().length == 0) {
			cont = false;
			this.windowModalMessage.showWindowModalMessage('The task needs to have a comment to run');
		} 

		if ( cont ) {
			this.loading = 'show';
// whats this for ?			
// this.tasks[index].status = "1";
			let idTask = this.tasks[index].id;
			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let userowner = {"userowner":identity.sub};
// console.warn('index: '+index+' - idTask: '+idTask);			
			this._tasksService.runTask(token, idTask, this.itemsPerPage, userowner).subscribe(
				response => {
					this.status = response.status;
					this.page = response.page;
					this.loading = 'hide';
					
					if ( this.status != "success" ){
						this.code   = response.code;
						this.msg    = response.msg;	
					} else {
						// this.getSearchTasks(this.page, this.searchString, this.itemsPerPage);
						this.subscribeOne(index, idTask);
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
	}
	
	stopTask(index){
// console.warn('task.component.ts-stopTask');
		this.loading = 'show';
// whats this for ?			
// this.tasks[index].status = "3";
		let idTask = this.tasks[index].id;
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub};
// console.warn('index: '+index+' - idTask: '+idTask);			
		this._tasksService.stopTask(token, idTask, this.itemsPerPage, userowner).subscribe(
			response => {
				this.status = response.status;
				this.page = response.page;
				this.loading = 'hide';
				
				if ( this.status != "success" ){
					this.code   = response.code;
					this.msg    = response.msg;	
				} else {
					// this.getSearchTasks(this.page, this.searchString, this.itemsPerPage);
					// this.subscribeOne(index, idTask);
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

	deleteConfig(id, page){
		this.loading = 'show';

		// if there is only one id for this table on this page
		if ( this.tasks.length === 1 && this.totalPages > 1 ) {
			page--;
		}
		
		if ( id != undefined ) {	
			let token = this._loginService.getToken();
			
			this._tasksService.delete(token, id).subscribe(
				response => {
					this.status = response.status;
										
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
				} else {
						this.getSearchTasks(page, this.searchString,this.itemsPerPage);					
					}					
				},
				error => {
					this.errorMessage = <any>error;

					if (this.errorMessage != null){
						alert('Error-delete: '+this.errorMessage);
					}
				}
			);	
		}
	}

	activateTaskManager(id){
alert('id: '+id);
	}

	sortJsonArrayByProperty(objArray, prop, direction){   
	    var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

	    if (objArray && objArray.constructor===Array){
				var propPath = (prop.constructor===Array) ? prop : prop.split(".");
	        objArray.sort(function(a,b){
	            for (var p in propPath){
	                if (a[propPath[p]] && b[propPath[p]]){
	                    a = a[propPath[p]];
	                    b = b[propPath[p]];
	                }
	            }
	            // convert numeric strings to integers
	            //a = a.match(/^\d+$/) ? +a : a;
	            //b = b.match(/^\d+$/) ? +b : b;
	            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
	        });
	    }
	}

	setOrder(columna){
		this.colAct = columna;
		localStorage.setItem('colAct', this.colAct);
		localStorage.setItem('colOrd', this.colOrd);
		
		switch( this.colOrd ) {
			case 'asc':
				this.sortJsonArrayByProperty(this.tasks, columna, -1);
				this.colOrd = 'desc';
				break;
			case 'desc':
				this.sortJsonArrayByProperty(this.tasks, columna, 1);
				this.colOrd = 'asc';
				break;
			default:
				this.sortJsonArrayByProperty(this.tasks, columna, 1);
				this.colOrd = 'asc';
		}
	}

}