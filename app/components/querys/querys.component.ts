import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {QuerysService} from '../../services/querys/querys.service';
import {GenerateDatePipe} from '../../pipes/generate.date.pipe';
import {CommonFunctions} from '../../common/commonfunctions/common.functions';
import {WindowModalMessage} from '../../common/windowmodal/window.modal.message';
import {Query} from '../../model/query';
import {Queryslogs} from '../../model/queryslogs';

declare var $: any;

@Component({
    selector: 'querys',
    templateUrl: 'app/views/querys/querys.html',
    directives: [ROUTER_DIRECTIVES, CommonFunctions, WindowModalMessage],
    providers: [LoginService, QuerysService],
    pipes: [GenerateDatePipe]
})
 
export class QuerysComponent implements OnInit {
	public titulo = "Query";
	public query: Query;
	public queryslogs: Queryslogs;
	public arrqueryslogs = [];
	public queryHeaders = [];

	public tamArrqueryslogs;
	public identity;
	public resources;
	public resource;
	
	public queryResults;

	public querys;
	public errorMessage;
	public status;
	public code;
	public msg;
	public loading;
	public queryContent;
	public activeLine;
	public queryId: number = 0;
	public caretPos: number = 0;
	public actualDate;
	
	@ViewChild(CommonFunctions) commonFunctions: CommonFunctions;
	@ViewChild(WindowModalMessage) windowModalMessage: WindowModalMessage;
	
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _loginService: LoginService,
		private _querysService: QuerysService,
		private elementRef: ElementRef
	){
	}

	ngOnInit() {
		//commonFunctions.funcion1('prueba');
		this.loading = 'show';
		this.identity = this._loginService.getIdentity();
		
		if (this.identity == null) {
			this._router.navigate(["/index"]);
		}

		if ( this.queryId == 0 ) 
		{
			this.query = new Query(0, "", "", "", "", "");	
			this.arrqueryslogs = [];
		}

		this.getSearchQuerys();
		this.getSearchResources();
	}

	getSearchQuerys(){	
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}	
		
		this._querysService.searchQuerys(token, userowner).subscribe(
			response => {
				this.status = response.status;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.querys = response.data;
					this.loading = 'hide';

					if ( this.queryId > 0 && this.activeLine == undefined)
					{
						// if there is a saved query selected, this lines activates it in the Saved Querys table
						this.activeLine = this.querys.length-1;
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

	getSearchResources(){
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}	// save in json format the userowner
		
		this._querysService.searchResources(token, userowner).subscribe(
			response => {
				this.status = response.status;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.resources = response.data;
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

	saveQuery(queryContent, name){
		queryContent = ( queryContent != undefined ) ? queryContent.trim() : queryContent;

		if ( name.trim().length == 0 )
		{
			this.windowModalMessage.showWindowModalMessage('The name for the query can not be empty');	
		} else {

			if ( queryContent == undefined || queryContent.length == 0 )
			{
				this.windowModalMessage.showWindowModalMessage('The content of the query can not be empty');
				this.queryContent = queryContent;				
			} else {

				queryContent = queryContent.toUpperCase();	
				var pos = -1;
				var textSearch = ["INSERT", "DELETE", "UPDATE", "ALTER", "CREATE", "DROP", "SHOW", "DESCRIPTION"];

				for ( var i=0; i < textSearch.length; i++ )
				{
					pos = queryContent.search(textSearch[i]);

					if ( pos >= 0 )
					{
						this.windowModalMessage.showWindowModalMessage('Impossible to process with the instruction: '+textSearch[i].toUpperCase()+' on the position: '+pos);	
						break;
					}
				}

				if ( this.queryId > 0 ) 
				{
					// there is a Saved Query seleceted
					this.query.id = this.queryId;
					this.query.queryContent = this.queryContent;
				} else {
					// there is no Saved Query seleceted
					this.query.name = name.trim();
					this.query.queryContent = this.queryContent;
				}

				this.loading = 'show';
				let token = this._loginService.getToken();
				let identity = this._loginService.getIdentity();
				this.query.userowner = identity.sub;
				
				this._querysService.register(token, this.query, this.arrqueryslogs).subscribe(
					response => {
						this.status = response.status;

						if ( this.status != "success" ){
							this.loading = 'hide';				
							this.code   = response.code;
							this.msg    = response.msg;
						} else {
							this.loading = 'hide';
							this.queryId = response.idQuery;
							this.loading = 'show';
							let token = this._loginService.getToken();
							let identity = this._loginService.getIdentity();
							let userowner = identity.sub;

							this._querysService.searchLogs(token, userowner, this.queryId).subscribe(
								response => {
									this.status = response.status;

									if ( this.status != "success" ){
										this.loading = 'hide';
										this.code = response.code;
										this.msg = response.msg;	
									} else {
										this.arrqueryslogs = response.data;
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
							this.ngOnInit();
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
	}

	executeQuerysContent(queryContent){
//console.warn('F-1:querys.component.ts-runQuerysContent');
		queryContent = ( queryContent != undefined ) ? queryContent.trim() : queryContent;

		if ( queryContent == undefined || queryContent.length == 0 )
		{
			this.windowModalMessage.showWindowModalMessage('The content of the query can not be empty');
			this.queryContent = queryContent;				
		} else {
			this.loading = 'show';
			let token = this._loginService.getToken();
			let identity = this._loginService.getIdentity();
			let dataJson = {"userowner":identity.sub, "queryContent":queryContent};

			this._querysService.executeQuery(token, dataJson).subscribe(
				response => {
					this.status = response.status;

					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
//console.warn('response.queryContentDef: ', response.queryContentDef);						
//this.queryContent = response.queryContentDef;
						this.queryHeaders = [];	// cleans the headers
						this.queryResults = response.result;
						this.tamArrqueryslogs = this.arrqueryslogs.length;
						let actualDate = new Date();
						let actualMonth = actualDate.getMonth()+1;
						let queryTime = ((actualDate.getFullYear()) + '-' + 
			    			((actualMonth < 10) ? ("0" + actualMonth) : (actualMonth)) + '-' +
			    			((actualDate.getDate() < 10) ? ("0" + actualDate.getDate()) : (actualDate.getDate())) + " " + 
			    			((actualDate.getHours() < 10) ? ("0" + actualDate.getHours()) : (actualDate.getHours())) + ':' + 
			    			((actualDate.getMinutes() < 10) ? ("0" + actualDate.getMinutes()) : (actualDate.getMinutes())) + ':' + 
			    			((actualDate.getSeconds() < 10) ? ("0" + actualDate.getSeconds()) : (actualDate.getSeconds())));
						// adds the log for the request
						this.arrqueryslogs[this.tamArrqueryslogs] = new Queryslogs(0, this.tamArrqueryslogs+1, queryTime,response.queryContentDef,response.logResult); 
						// orders the logs descending 
						this.arrqueryslogs.sort(function(a, b) { return parseFloat(b.idLog) - parseFloat(a.idLog); });				
						this.loading = 'hide';
						var results = this.queryResults;
						
						// saves the header for the result
						if (results.length > 0){ 
	  						var columnsIn = results[0]; 

		  					for(var key in columnsIn){
    							this.queryHeaders.push(key);
//console.warn('key: ',key);
  							} 
						}else{
//console.warn("No columns");
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

	refreshQuerysContent(){
		this.queryContent = '';
		this.queryHeaders = [];
		this.queryResults = [];
		this.arrqueryslogs = [];

	}

	addQuery(queryContent, activeLine, queryId, queryName) {
		
		if ( this.queryContent == undefined )
		{
			this.queryContent = queryContent;
		} else {
			this.queryContent = this.queryContent.substring(0,this.caretPos) + queryContent + this.queryContent.substring(this.caretPos);
		}
		this.activeLine = activeLine;
		this.queryId = queryId;
		this.query.name = queryName;

		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let userowner = {"userowner":identity.sub}	
		
		this._querysService.searchLogs(token, userowner, queryId).subscribe(
			response => {
				this.status = response.status;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.arrqueryslogs = response.data;
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

	addQueryLog(queryContent) {
		this.queryContent = queryContent;
	}
	
	unselectQuery(){
		this.activeLine = undefined;
		this.queryId = 0;
		this.query.name = '';
		this.queryHeaders = [];
		this.queryResults = [];
		this.arrqueryslogs = [];
	}

	addResourceId(resourceId) {
		this.loading = 'show';
		let token = this._loginService.getToken();
		let identity = this._loginService.getIdentity();
		let dataJson = {"userowner":identity.sub, "resourceId":resourceId};
		
		this._querysService.addResources(token, dataJson).subscribe(
			response => {
				this.status = response.status;

				if ( this.status != "success" ){
					this.loading = 'hide';
					this.code = response.code;
					this.msg = response.msg;	
				} else {
					this.resource = response.data;
					this.loading = 'hide';

					let database = 'DATABASE';
					let table = 'table';

					for (let i=0; i < this.resource.length; i++ ) 
					{
						if ( this.resource[i]['attributeName'] == 'DATABASE' )
						{
							database = this.resource[i]['attributeValue'];
						}

						if ( this.resource[i]['attributeName'] == 'TABLE' )
						{
							table = this.resource[i]['attributeValue'];
						}
					}

					if ( this.queryContent == undefined )
					{ 
						this.queryContent = '['+database+'.'+table+'~'+resourceId+']';
//						this.queryContent = '['+resourceId+']';
					} else {
						this.queryContent = this.queryContent.substring(0,this.caretPos) + '['+database+'.'+table+'~'+resourceId+']' + this.queryContent.substring(this.caretPos);
//						this.queryContent = this.queryContent.substring(0,this.caretPos) + '[' + resourceId + ']' + this.queryContent.substring(this.caretPos);
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
	getCaretPos(oField) {
		// saves in this.caretPos the position of the cursor in the textarea, each time that you click en texarea this function is called
    	
    	if (oField.selectionStart || oField.selectionStart == '0') {
       		this.caretPos = oField.selectionStart;
    	}
	}

	deleteQuery(id){
		this.loading = 'show';

		if ( id != '' ) {	
			let token = this._loginService.getToken();
			
			this._querysService.delete(token, id).subscribe(
				response => {
					this.status = response.status;
										
					if ( this.status != "success" ){
						this.loading = 'hide';
						this.code = response.code;
						this.msg = response.msg;	
					} else {
						this.activeLine = undefined;
						this.queryId = 0;
						this.query.name = '';
						this.queryContent = '';
						this.ngOnInit();
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
		this.loading = 'hide';
	}

	transJsonCsv() {    
//console.warn('this.queryResults: ',this.queryResults);
		if ( this.queryResults == undefined || this.queryResults.length == 0 )
		{
			this.windowModalMessage.showWindowModalMessage('There is no results to export for this query');
		} else {
			this.loading = 'show';

			 let JSONData = this.queryResults;
			 let ReportTitle = 'ReportTitle';
			 let ShowLabel = 'ShowLabel';

			//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = '';    
			
			//This condition will generate the Label/Header
			if (ShowLabel) {	
		    	var row = "";

		    	//This loop will extract the label from 1st index of on array
		    	for (var index in arrData[0]) {
		        	//Now convert each value to string and comma-seprated
		        	row += index + ',';
		    	}
		    	row = row.slice(0, -1);
		    	//append Label row with line break
		    	CSV += row + '\r\n';
			}

			//1st loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
		    	var row = "";
		    	
		    	//2nd loop will extract each column and convert it in string comma-seprated
		    	for (var index in arrData[i]) {
		        	row += '"' + arrData[i][index] + '",';
		    	}
		    	row.slice(0, row.length - 1);
		    	//add a line break after each row
		    	CSV += row + '\r\n';
			}

			if (CSV == '') {        
		    	alert("Invalid data");
		    	return;
			}   

			//this trick will generate a temp "a" tag
			var link = document.createElement("a");    
			link.id="lnkDwnldLnk";

			//this part will append the anchor tag and remove it after automatic click
			document.body.appendChild(link);

			var csv = CSV;  
			var blob = new Blob([csv], { type: 'text/csv' }); 
//			var csvUrl = window.webkitURL.createObjectURL(blob);
			var csvUrl = window.URL.createObjectURL(blob);
			var filename = 'AResultExport.csv';
			$("#lnkDwnldLnk")
			.attr({
		    	'download': filename,
		    	'href': csvUrl
			}); 

			$('#lnkDwnldLnk')[0].click();    
			document.body.removeChild(link);

			this.loading = 'hide';
		}
	}
}