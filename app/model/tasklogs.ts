export class Tasklogs{
	constructor (
		public id:number,
		public idTask:number,
		public pid:number,
		public started:string,
		public finished:string,
		public updated:string,
		public error:string,
		public userexecute:number,
		public status:string
	){}
}
