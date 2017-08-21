import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {TasksService} from '../../services/tasks/tasks.service';
import {WindowModalMessage} from '../../common/windowmodal/window.modal.message';
import {GenerateDatePipe} from '../../pipes/generate.date.pipe';
import {Task} from '../../model/task';
import {Observable} from 'rxjs/Rx';						// observable
import 'rxjs/Rx';										// observable
import {Observer} from 'rxjs/Observer';					// observable
import {Subscription} from 'rxjs/Subscription';			// observable

declare var $: any;

@Component({
    selector: 'taskconfig-view',
    templateUrl: 'app/views/tasks/taskconfig.view.html',
    directives: [ROUTER_DIRECTIVES, WindowModalMessage],
    providers: [LoginService, TasksService],
    pipes: [GenerateDatePipe]
})

export class TaskconfigViewComponent implements OnInit, OnDestroy {
	public titulo: string = 'View Task Config';
	public task: Task;
	public tasklogs;
	public tasklogswarnings;
	public tasklogsoutputs;
	public scriptparams;
	public inputparams;
	public outputparams;
	public pageActual;
	public searchString;
	public errorMessage;
	public status;
	public status2;
	public code;
	public msg;
	public identity;
	public loading;
	public colOrd;
	public colAct;
	public itemsPerPage;
	public tempStatus = 0;
	public obsSubscription: Subscription;				// observable
	public activeUserId;
	public refreshLogsActive;
	public taskLogsStatus;

	@ViewChild(WindowModalMessage) windowModalMessage: WindowModalMessage;

	constructor(
		private _loginService: LoginService,
		private _tasksService: TasksService,
		private _route: ActivatedRoute,
		private _router: Router
	){ }

	ngOnInit(){
		this.identity = this._loginService.getIdentity();
		
		// if true makes the logo of refresh spin
		this.refreshLogsActive = false;

		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}

		this.colAct = localStorage.getItem('colAct');
		this.colOrd = localStorage.getItem('colOrd');
		
		if ( !this.colAct ) {
			this.colAct = null;
		} 
		
		if ( !this.colOrd ) {
			this.colOrd = null;
		} 

		this.setOrder(this.colAct);

		this.task = new Task(0, 0, "", "", "", "", "", "", "", "", "", "", "");
		this.getTask();
	}

	ngOnDestroy() {										// observable
		if ( this.obsSubscription != undefined ) {		// observable
			this.obsSubscription.unsubscribe();			// observable
		}
	}
	
	getTask() {
		this.loading = 'show';

		this._route.params.subscribe(params => {
			let id = +params["id"];
			let pageActual = +params["pageActual"];
			this.pageActual = pageActual;
			let itemsPerPage = params["itemsPerPage"];
			this.itemsPerPage = itemsPerPage;
			let searchString = params["search"];

			if ( !searchString || searchString.trim().length == 0 ){
				this.searchString = null;
			} else {
				this.searchString = searchString;
			}

			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let userowner = {"userowner":identity.sub}
			
			this._tasksService.detailTaskConfig(token, userowner, id).subscribe(
				response => {
					
					this.status = response.status;

					if (this.status != "success"){
						this.status = response.status;
						this.code   = response.code;
						this.msg    = response.msg;	
					} else {
						this.task = response.atask;
						this.task.id = response.atask[0].id;
						this.task.idConfig = response.atask[0].idConfig;
						this.task.configName = response.atask[0].configName;
						this.task.scriptName = response.atask[0].scriptName;
						this.task.scriptPath = response.atask[0].scriptPath;
						this.task.status = response.atask[0].status;
						this.task.scriptLanguage = response.atask[0].scriptLanguage;
						this.task.comment = response.atask[0].comment;
						this.task.usernameowner = response.atask[0].usernameowner;
						this.scriptparams = response.scriptparams;
						this.inputparams = response.inputparams;
						
						for ( let i=0; i < this.inputparams.length; i++) { 

							if ( this.inputparams[i].paramSecure == 1 ) {
								this.inputparams[i].paramValue = '********************';
							}
						}
						this.outputparams = response.outputparams;

						for ( let i=0; i < this.outputparams.length; i++) { 

							if ( this.outputparams[i].paramSecure == 1 ) {
								this.outputparams[i].paramValue = '********************';
							}
						}
						this.tasklogs = response.atasklog;
						
						if( this.tasklogs.length>0 ) {
							this.taskLogsStatus = this.tasklogs[0].status;
						}
						this.tasklogswarnings = response.atasklogwarning;
						this.tasklogsoutputs = response.atasklogoutput;
					}
					this.loading = 'hide';
				},
				error => {
					this.errorMessage = <any>error;

					if ( this.errorMessage != null ) {
						alert('Error: '+this.errorMessage);
					}
				}
			);
		});
	}

	detailTaskConfigLogs(idTask) {
		let cont = true;

		if ( this.task.comment == null || this.task.comment.trim().length == 0) {
			cont = false;
			this.windowModalMessage.showWindowModalMessage('The task needs to have a comment to run');
		} 

		if ( cont ) {
			this.refreshLogsActive = true;

			this.obsSubscription = Observable
				.interval(3000)
				.subscribe(
					(numb:number) => {
						this.loading = 'show';
						let token = this._loginService.getToken();
						let identity = this._loginService.getIdentity();
						let userowner = {"userowner":identity.sub}

						this._tasksService.detailTaskConfigLogs(token, userowner, idTask).subscribe(
							response => {
								this.status2 = response.status;
								this.loading = 'hide';

								if ( this.status2 != "success" ) {
									this.code = response.code;
									this.msg = response.msg;	
								} else {
									this.tasklogs = response.atasklog;
									this.taskLogsStatus = this.tasklogs[0].status;
									this.task.status = response.ataskstatus[0].status;
									
									if ( this.tasklogs.length > 0 && this.taskLogsStatus != "2" ) {
										this.obsSubscription.unsubscribe();
										this.refreshLogsActive = false;
									}
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
	}

	runTask(idTask) {
		let cont = true;

		if ( this.task.comment == null || this.task.comment.trim().length == 0 ) {
			cont = false;
			this.windowModalMessage.showWindowModalMessage('The task needs to have a comment to run');
		} 

		if ( cont ) {
			this.loading = 'show';
			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let userowner = {"userowner":identity.sub}
			this.task.status = "1";

			this._tasksService.runTask(token, idTask, this.itemsPerPage, userowner).subscribe(
				response => {
					this.status = response.status;
					
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code    = response.code;
						this.msg     = response.msg;	
					} else {	
											
						this._tasksService.detailTaskConfigLogs(token, userowner, idTask).subscribe(
							response => {
								this.status2 = response.status;
								this.loading = 'hide';

								if (this.status2 != "success"){
									this.code   = response.code;
									this.msg    = response.msg;	
								} else {
									this.tasklogs = response.atasklog;
									this.detailTaskConfigLogs(idTask);
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

	stopTask(idTask) {
		//this.task.status = '0';
		alert("This option is not available...");
	}

	gotoConfig(idConfig) {
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}
		this.activeUserId = localStorage.getItem('tasksActiveUserId');

		this._tasksService.gotoConfig(token, userowner, idConfig, this.itemsPerPage, this.activeUserId).subscribe(
			response => {
				this.status2 = response.status;
				this.loading = 'hide';

				if (this.status2 != "success"){
					this.code   = response.code;
					this.msg    = response.msg;	
				} else {
					let page = response.page;
					localStorage.setItem('configsActiveUserId', this.activeUserId);
					localStorage.setItem('configsItemsPerPage', this.itemsPerPage);
					this._router.navigate(["/config_edit", idConfig, page, this.itemsPerPage]);
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

	updateData(recordShowB, recordShowIndexB, recordShowOptionB) {
		let cont = true;
		
		switch (recordShowOptionB) 
		{
			case 'A':
				if ( recordShowB.trim().length == 0)
				{
					cont = false;
					this.windowModalMessage.showWindowModalMessage('The comment for the task can not be empty');
				}

				if ( cont ) {
					this.loading = 'show';
					let token = this._loginService.getToken();
					let comment = {"comment":recordShowB}; 
					this.task.comment = recordShowB;

					this._tasksService.updateTaskComment(token, comment, this.task.id).subscribe(
						response => {
							this.status2 = response.status;
												
							if ( this.status2 != "success" ) {
								this.code = response.code;
								this.msg = response.msg;	
							} else {
								this.getTask(); // refresh the page
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
				break;
			
			case 'B':
				if ( recordShowB.trim().length == 0)
				{
					cont = false;
					this.windowModalMessage.showWindowModalMessage('The action for the warning can not be empty');
				}

				let idTaskLog = this.tasklogswarnings[recordShowIndexB].id; 

				if ( cont ) {
					this.loading = 'show';
					let token = this._loginService.getToken();
					let action = {"action":recordShowB}; 
					this.task.comment = recordShowB;

					this._tasksService.updateActionWarning(token, action, idTaskLog).subscribe(
						response => {
							this.status2 = response.status;
												
							if ( this.status2 != "success" ) {
								this.code = response.code;
								this.msg = response.msg;	
							} else {
								this.getTask(); // refresh the page
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
				break;
		}
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
				this.sortJsonArrayByProperty(this.tasklogs, columna, -1);
				this.colOrd = 'desc';
				break;
			case 'desc':
				this.sortJsonArrayByProperty(this.tasklogs, columna, 1);
				this.colOrd = 'asc';
				break;
			default:
				this.sortJsonArrayByProperty(this.tasklogs, columna, 1);
				this.colOrd = 'asc';
		}
	}

}
