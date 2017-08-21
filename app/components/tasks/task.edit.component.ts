import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {TasksService} from '../../services/tasks/tasks.service';
import {Task} from '../../model/task';

@Component({
    selector: 'task-edit',
    templateUrl: 'app/views/tasks/task.edit.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, TasksService]
})

export class TaskEditComponent implements OnInit{
	public titulo: string = 'Edit Task';
	public task: Task;
	public pageActual;
	public searchString;
	public errorMessage;
	public status;
	public code;
	public msg;
	public page;
	public identity;
	public itemsPerPage;
	public loading;


	constructor(
		private _loginService: LoginService,
		private _tasksService: TasksService,
		private _route: ActivatedRoute,
		private _router: Router
	){
//console.warn('A-1: task.edit.componenet.ts-constructor');
	}

	ngOnInit(){
//console.warn('B-1: task.edit.componenet.ts-ngOnInit');
		this.identity = this._loginService.getIdentity();
		
		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}
		this.task = new Task(0, 0, "", "", "", "", "", "", "", "", "", "", "");
		this.getTask();
	}

	getTask(){
//console.warn('D-1:task.edit.componenet.ts-getTask');		
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
			let userowner = {"userowner":identity.sub}	// save in json format the userowner
			
			this._tasksService.detail(token, userowner, id).subscribe(
				response => {
					this.status = response.status;
					this.task = response.task[0];

					if ( this.status != "success" ){
						this._router.navigate(["/index"]);
					}
					this.loading = 'hide';
				},
				error => {
					this.errorMessage = <any>error;

					if (this.errorMessage != null){
						alert('Error: '+this.errorMessage);
					}
				}
			);
		});

console.log('task.edit.componenet.ts-getTask : ' );
console.log('task.edit.componenet.ts-getTask : ' );
console.log('task.edit.componenet.ts-getTask : ' );
	}

	onSubmit(){	
//console.warn('C-1: task.edit.componenet.ts-onSubmit');
		this.loading = 'show';
		let token = this._loginService.getToken();
		
		this._tasksService.update(token, this.task, this.task.id, this.itemsPerPage).subscribe(
			response => {
				this.status = response.status;
				this.page = response.page;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code   = response.code;
					this.msg    = response.msg;	
				} else {
					if ( this.searchString == null ) {
						this._router.navigate(['/tasks', this.page]);
					} else {
						this._router.navigate(['/tasks', this.page, this.searchString]);
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

}
