export class User{
	constructor (
		public id:number,
		public role:string,
		public name:string,
		public surname:string,
		public email:string,
		public password: string,
		public image:string,
		public idGroup:number,
		public idEncrypted : string
	){}
}