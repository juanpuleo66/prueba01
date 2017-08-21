"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var login_service_1 = require('../../services/login.service');
var querys_service_1 = require('../../services/querys/querys.service');
var generate_date_pipe_1 = require('../../pipes/generate.date.pipe');
var common_functions_1 = require('../../common/commonfunctions/common.functions');
var window_modal_message_1 = require('../../common/windowmodal/window.modal.message');
var query_1 = require('../../model/query');
var queryslogs_1 = require('../../model/queryslogs');
var QuerysComponent = (function () {
    function QuerysComponent(_route, _router, _loginService, _querysService, elementRef) {
        this._route = _route;
        this._router = _router;
        this._loginService = _loginService;
        this._querysService = _querysService;
        this.elementRef = elementRef;
        this.titulo = "Query";
        this.arrqueryslogs = [];
        this.queryHeaders = [];
        this.queryId = 0;
        this.caretPos = 0;
    }
    QuerysComponent.prototype.ngOnInit = function () {
        //commonFunctions.funcion1('prueba');
        this.loading = 'show';
        this.identity = this._loginService.getIdentity();
        if (this.identity == null) {
            this._router.navigate(["/index"]);
        }
        if (this.queryId == 0) {
            this.query = new query_1.Query(0, "", "", "", "", "");
            this.arrqueryslogs = [];
        }
        this.getSearchQuerys();
        this.getSearchResources();
    };
    QuerysComponent.prototype.getSearchQuerys = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this._querysService.searchQuerys(token, userowner).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.querys = response.data;
                _this.loading = 'hide';
                if (_this.queryId > 0 && _this.activeLine == undefined) {
                    // if there is a saved query selected, this lines activates it in the Saved Querys table
                    _this.activeLine = _this.querys.length - 1;
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    QuerysComponent.prototype.getSearchResources = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub }; // save in json format the userowner
        this._querysService.searchResources(token, userowner).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.resources = response.data;
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    QuerysComponent.prototype.saveQuery = function (queryContent, name) {
        var _this = this;
        queryContent = (queryContent != undefined) ? queryContent.trim() : queryContent;
        if (name.trim().length == 0) {
            this.windowModalMessage.showWindowModalMessage('The name for the query can not be empty');
        }
        else {
            if (queryContent == undefined || queryContent.length == 0) {
                this.windowModalMessage.showWindowModalMessage('The content of the query can not be empty');
                this.queryContent = queryContent;
            }
            else {
                queryContent = queryContent.toUpperCase();
                var pos = -1;
                var textSearch = ["INSERT", "DELETE", "UPDATE", "ALTER", "CREATE", "DROP", "SHOW", "DESCRIPTION"];
                for (var i = 0; i < textSearch.length; i++) {
                    pos = queryContent.search(textSearch[i]);
                    if (pos >= 0) {
                        this.windowModalMessage.showWindowModalMessage('Impossible to process with the instruction: ' + textSearch[i].toUpperCase() + ' on the position: ' + pos);
                        break;
                    }
                }
                if (this.queryId > 0) {
                    // there is a Saved Query seleceted
                    this.query.id = this.queryId;
                    this.query.queryContent = this.queryContent;
                }
                else {
                    // there is no Saved Query seleceted
                    this.query.name = name.trim();
                    this.query.queryContent = this.queryContent;
                }
                this.loading = 'show';
                var token = this._loginService.getToken();
                var identity = this._loginService.getIdentity();
                this.query.userowner = identity.sub;
                this._querysService.register(token, this.query, this.arrqueryslogs).subscribe(function (response) {
                    _this.status = response.status;
                    if (_this.status != "success") {
                        _this.loading = 'hide';
                        _this.code = response.code;
                        _this.msg = response.msg;
                    }
                    else {
                        _this.loading = 'hide';
                        _this.queryId = response.idQuery;
                        _this.loading = 'show';
                        var token_1 = _this._loginService.getToken();
                        var identity_1 = _this._loginService.getIdentity();
                        var userowner = identity_1.sub;
                        _this._querysService.searchLogs(token_1, userowner, _this.queryId).subscribe(function (response) {
                            _this.status = response.status;
                            if (_this.status != "success") {
                                _this.loading = 'hide';
                                _this.code = response.code;
                                _this.msg = response.msg;
                            }
                            else {
                                _this.arrqueryslogs = response.data;
                                _this.loading = 'hide';
                            }
                        }, function (error) {
                            _this.errorMessage = error;
                            if (_this.errorMessage != null) {
                                alert('Error: ' + _this.errorMessage);
                            }
                        });
                        _this.ngOnInit();
                    }
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error: ' + _this.errorMessage);
                    }
                });
            }
        }
    };
    QuerysComponent.prototype.executeQuerysContent = function (queryContent) {
        var _this = this;
        //console.warn('F-1:querys.component.ts-runQuerysContent');
        queryContent = (queryContent != undefined) ? queryContent.trim() : queryContent;
        if (queryContent == undefined || queryContent.length == 0) {
            this.windowModalMessage.showWindowModalMessage('The content of the query can not be empty');
            this.queryContent = queryContent;
        }
        else {
            this.loading = 'show';
            var token = this._loginService.getToken();
            var identity = this._loginService.getIdentity();
            var dataJson = { "userowner": identity.sub, "queryContent": queryContent };
            this._querysService.executeQuery(token, dataJson).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    //console.warn('response.queryContentDef: ', response.queryContentDef);						
                    //this.queryContent = response.queryContentDef;
                    _this.queryHeaders = []; // cleans the headers
                    _this.queryResults = response.result;
                    _this.tamArrqueryslogs = _this.arrqueryslogs.length;
                    var actualDate = new Date();
                    var actualMonth = actualDate.getMonth() + 1;
                    var queryTime = ((actualDate.getFullYear()) + '-' +
                        ((actualMonth < 10) ? ("0" + actualMonth) : (actualMonth)) + '-' +
                        ((actualDate.getDate() < 10) ? ("0" + actualDate.getDate()) : (actualDate.getDate())) + " " +
                        ((actualDate.getHours() < 10) ? ("0" + actualDate.getHours()) : (actualDate.getHours())) + ':' +
                        ((actualDate.getMinutes() < 10) ? ("0" + actualDate.getMinutes()) : (actualDate.getMinutes())) + ':' +
                        ((actualDate.getSeconds() < 10) ? ("0" + actualDate.getSeconds()) : (actualDate.getSeconds())));
                    // adds the log for the request
                    _this.arrqueryslogs[_this.tamArrqueryslogs] = new queryslogs_1.Queryslogs(0, _this.tamArrqueryslogs + 1, queryTime, response.queryContentDef, response.logResult);
                    // orders the logs descending 
                    _this.arrqueryslogs.sort(function (a, b) { return parseFloat(b.idLog) - parseFloat(a.idLog); });
                    _this.loading = 'hide';
                    var results = _this.queryResults;
                    // saves the header for the result
                    if (results.length > 0) {
                        var columnsIn = results[0];
                        for (var key in columnsIn) {
                            _this.queryHeaders.push(key);
                        }
                    }
                    else {
                    }
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error: ' + _this.errorMessage);
                }
            });
        }
    };
    QuerysComponent.prototype.refreshQuerysContent = function () {
        this.queryContent = '';
        this.queryHeaders = [];
        this.queryResults = [];
        this.arrqueryslogs = [];
    };
    QuerysComponent.prototype.addQuery = function (queryContent, activeLine, queryId, queryName) {
        var _this = this;
        if (this.queryContent == undefined) {
            this.queryContent = queryContent;
        }
        else {
            this.queryContent = this.queryContent.substring(0, this.caretPos) + queryContent + this.queryContent.substring(this.caretPos);
        }
        this.activeLine = activeLine;
        this.queryId = queryId;
        this.query.name = queryName;
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub };
        this._querysService.searchLogs(token, userowner, queryId).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.arrqueryslogs = response.data;
                _this.loading = 'hide';
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    QuerysComponent.prototype.addQueryLog = function (queryContent) {
        this.queryContent = queryContent;
    };
    QuerysComponent.prototype.unselectQuery = function () {
        this.activeLine = undefined;
        this.queryId = 0;
        this.query.name = '';
        this.queryHeaders = [];
        this.queryResults = [];
        this.arrqueryslogs = [];
    };
    QuerysComponent.prototype.addResourceId = function (resourceId) {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var dataJson = { "userowner": identity.sub, "resourceId": resourceId };
        this._querysService.addResources(token, dataJson).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.loading = 'hide';
                _this.code = response.code;
                _this.msg = response.msg;
            }
            else {
                _this.resource = response.data;
                _this.loading = 'hide';
                var database = 'DATABASE';
                var table = 'table';
                for (var i = 0; i < _this.resource.length; i++) {
                    if (_this.resource[i]['attributeName'] == 'DATABASE') {
                        database = _this.resource[i]['attributeValue'];
                    }
                    if (_this.resource[i]['attributeName'] == 'TABLE') {
                        table = _this.resource[i]['attributeValue'];
                    }
                }
                if (_this.queryContent == undefined) {
                    _this.queryContent = '[' + database + '.' + table + '~' + resourceId + ']';
                }
                else {
                    _this.queryContent = _this.queryContent.substring(0, _this.caretPos) + '[' + database + '.' + table + '~' + resourceId + ']' + _this.queryContent.substring(_this.caretPos);
                }
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error: ' + _this.errorMessage);
            }
        });
    };
    QuerysComponent.prototype.getCaretPos = function (oField) {
        // saves in this.caretPos the position of the cursor in the textarea, each time that you click en texarea this function is called
        if (oField.selectionStart || oField.selectionStart == '0') {
            this.caretPos = oField.selectionStart;
        }
    };
    QuerysComponent.prototype.deleteQuery = function (id) {
        var _this = this;
        this.loading = 'show';
        if (id != '') {
            var token = this._loginService.getToken();
            this._querysService.delete(token, id).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != "success") {
                    _this.loading = 'hide';
                    _this.code = response.code;
                    _this.msg = response.msg;
                }
                else {
                    _this.activeLine = undefined;
                    _this.queryId = 0;
                    _this.query.name = '';
                    _this.queryContent = '';
                    _this.ngOnInit();
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error-delete: ' + _this.errorMessage);
                }
            });
        }
        this.loading = 'hide';
    };
    QuerysComponent.prototype.transJsonCsv = function () {
        //console.warn('this.queryResults: ',this.queryResults);
        if (this.queryResults == undefined || this.queryResults.length == 0) {
            this.windowModalMessage.showWindowModalMessage('There is no results to export for this query');
        }
        else {
            this.loading = 'show';
            var JSONData = this.queryResults;
            var ReportTitle = 'ReportTitle';
            var ShowLabel = 'ShowLabel';
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
            link.id = "lnkDwnldLnk";
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
    };
    __decorate([
        core_1.ViewChild(common_functions_1.CommonFunctions), 
        __metadata('design:type', common_functions_1.CommonFunctions)
    ], QuerysComponent.prototype, "commonFunctions", void 0);
    __decorate([
        core_1.ViewChild(window_modal_message_1.WindowModalMessage), 
        __metadata('design:type', window_modal_message_1.WindowModalMessage)
    ], QuerysComponent.prototype, "windowModalMessage", void 0);
    QuerysComponent = __decorate([
        core_1.Component({
            selector: 'querys',
            templateUrl: 'app/views/querys/querys.html',
            directives: [router_1.ROUTER_DIRECTIVES, common_functions_1.CommonFunctions, window_modal_message_1.WindowModalMessage],
            providers: [login_service_1.LoginService, querys_service_1.QuerysService],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, login_service_1.LoginService, querys_service_1.QuerysService, core_1.ElementRef])
    ], QuerysComponent);
    return QuerysComponent;
}());
exports.QuerysComponent = QuerysComponent;
//# sourceMappingURL=querys.component.js.map