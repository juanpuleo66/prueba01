export class Task{
	constructor (
		public id:number,
		public idConfig:number,
		public configName:string,
		public scriptName:string,
		public comment:string,
		public scriptLanguage:string,
		public scriptPath:string,
		public userowner:string,
		public userexecute:string,
		public cronExeTime:string,
		public status: string,
		public statusLog: string,
		public usernameowner: string
	){}
}
