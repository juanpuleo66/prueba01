export class Queryslogs{
	constructor (
		public id:number,
		public idLog:number,
		public queryTime,
		public queryContent:string,
		public queryLog:string
	){}
}
