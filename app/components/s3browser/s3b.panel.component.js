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
var directory_1 = require('../../model/directory');
var file_1 = require('../../model/file');
var s3_service_1 = require('../../services/s3browser/s3.service');
var login_service_1 = require('../../services/login.service');
var S3BrowserPanelComponent = (function () {
    function S3BrowserPanelComponent(_s3service, _loginService) {
        this._s3service = _s3service;
        this._loginService = _loginService;
        this.showGoBackRow = false;
        this.pathes = [];
        this.filesToCopy = [];
        this.readyToPaste = false;
        this._isCopy = true;
        this.listTitle = "No Files to Copy or Move.";
        this.getSearchResources();
        this.directories = new Array();
        this.files = new Array();
    }
    S3BrowserPanelComponent.prototype.onSelectSourceClick = function (resource) {
        if (resource.id != this.resourceIdSelected) {
            this.pathes = [];
            this.resourceIdSelected = resource.id;
            this._rootDirectory = new directory_1.Directory('/', '', null, this._s3service, this._loginService);
            this._currentDirectory = this._rootDirectory;
            this.load();
            //this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
            //this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
            this.pathes.push(this._rootDirectory);
        }
        else {
            this.resourceIdSelected = undefined;
            this.showGoBackRow = false;
            this.pathes = [];
            this.filesToCopy = [];
            this.readyToPaste = false;
            this._isCopy = true;
            this.listTitle = "No Files to Copy or Move.";
            this.directories = new Array();
            this.files = new Array();
            this.pathes = new Array();
        }
    };
    S3BrowserPanelComponent.prototype.onOpenClick = function (directory) {
        this._currentDirectory = directory;
        this.showGoBackRow = true;
        this.load();
        //this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
        //this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
        this.pathes.push(directory);
        this.loading = 'hide';
    };
    S3BrowserPanelComponent.prototype.onGoBackButton = function () {
        this._currentDirectory = this._currentDirectory.getParentDirectory();
        this.showGoBackRow = !this._currentDirectory.isRootDirectory();
        this.load();
        //this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
        //this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
        this.pathes.pop();
    };
    S3BrowserPanelComponent.prototype.onPathClick = function (directory) {
        if (this._currentDirectory.getPrefix() == directory.getPrefix())
            return;
        while (this._currentDirectory.getPrefix() != directory.getPrefix()) {
            this._currentDirectory = this.pathes.pop();
        }
        this.pathes.push(this._currentDirectory);
        this.showGoBackRow = !this._currentDirectory.isRootDirectory();
        this.load();
        //this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
        //this.files = this._currentDirectory.getFiles(this.resourceIdSelected);
    };
    S3BrowserPanelComponent.prototype.onRefreshClick = function () {
        //this._currentDirectory.refresh(this.resourceIdSelected);
        this.files = new Array();
        this.directories = new Array();
        this.load();
        //this.directories = this._currentDirectory.getDirectories(this.resourceIdSelected);
        //this.files = this._currentDirectory.getFiles(this.resourceIdSelected);	
    };
    S3BrowserPanelComponent.prototype.onCopyClick = function () {
        this.filesToCopy = [];
        for (var f in this.files) {
            if (this.files[f].state)
                this.filesToCopy.push(this.files[f].getName());
        }
        this._directorySource = this._currentDirectory;
        this.readyToPaste = true;
        this._isCopy = true;
        this.listTitle = "Files to Copy:";
    };
    S3BrowserPanelComponent.prototype.onCutClick = function () {
        this.filesToCopy = [];
        for (var f in this.files) {
            if (this.files[f].state)
                this.filesToCopy.push(this.files[f].getName());
        }
        this._directorySource = this._currentDirectory;
        this.readyToPaste = true;
        this._isCopy = false;
        this.listTitle = "Files to Move:";
    };
    S3BrowserPanelComponent.prototype.onClearClick = function () {
        if (this.readyToPaste) {
            this.filesToCopy = [];
            this.readyToPaste = false;
            this._directorySource = null;
            this.listTitle = "No Files to Copy or Move.";
        }
    };
    S3BrowserPanelComponent.prototype.onPasteClick = function () {
        var _this = this;
        if (this.readyToPaste) {
            var self_1 = this;
            var params = {
                'Source': {
                    'Bucket': 'msp-development',
                    'Prefix': this._directorySource.getPrefix(),
                    'Keys': this.filesToCopy
                },
                'Target': {
                    'Bucket': 'msp-development',
                    'Prefix': this._currentDirectory.getPrefix()
                }
            };
            if (this._isCopy) {
                this._s3service.copyTo(this._loginService.getToken(), params).subscribe(function (response) {
                    self_1._currentDirectory.refresh(_this.resourceIdSelected);
                    self_1.load();
                    //self.directories = self._currentDirectory.getDirectories(this.resourceIdSelected);
                    //self.files = self._currentDirectory.getFiles(this.resourceIdSelected);	
                    _this.onClearClick();
                }, function (error) {
                    console.log('There is a problem.'); // an error occurred
                    console.log(error);
                    _this.onClearClick();
                });
            }
            else {
                this._s3service.moveTo(this._loginService.getToken(), params).subscribe(function (response) {
                    self_1._currentDirectory.refresh(_this.resourceIdSelected);
                    self_1.load();
                    //self.directories = self._currentDirectory.getDirectories(this.resourceIdSelected);
                    //self.files = self._currentDirectory.getFiles(this.resourceIdSelected);	
                    if (self_1._directorySource != null)
                        self_1._directorySource.refresh(_this.resourceIdSelected);
                    _this.onClearClick();
                }, function (error) {
                    console.log('There is a problem.'); // an error occurred
                    console.log(error);
                    _this.onClearClick();
                });
            }
        }
    };
    S3BrowserPanelComponent.prototype.confirmationYes = function () { };
    S3BrowserPanelComponent.prototype.confirmationNo = function () {
        this.onClearClick();
    };
    S3BrowserPanelComponent.prototype.getSearchResources = function () {
        var _this = this;
        this.loading = 'show';
        var token = this._loginService.getToken();
        var identity = this._loginService.getIdentity();
        var userowner = { "userowner": identity.sub }; // save in json format the userowner
        this._s3service.searchResources(token, userowner).subscribe(function (response) {
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
    S3BrowserPanelComponent.prototype.load = function () {
        var _this = this;
        this.loading = 'show';
        var params = { 'idResource': this.resourceIdSelected, 'Delimiter': '/', 'Prefix': this._currentDirectory.getPrefix() };
        var token = this._loginService.getToken();
        this._s3service.listObjects(token, params).subscribe(function (response) {
            if (response.status) {
                _this.status = response.status;
                _this.msg = response.msg;
                _this.code = response.code;
                _this.loading = 'hide';
                _this.files = new Array();
                _this.directories = new Array();
            }
            if (response.CommonPrefixes) {
                if (!response.Contents)
                    _this.files = new Array();
                _this.directories = new Array();
                for (var i = 0, len = response.CommonPrefixes.length; i < len; i++) {
                    _this.directories.push(new directory_1.Directory(response.CommonPrefixes[i].Prefix.replace(response.Prefix, ''), response.CommonPrefixes[i].Prefix, _this._currentDirectory, _this._s3service, _this._loginService));
                }
                _this.directories.sort(function (s1, s2) { return s1.getName().localeCompare(s2.getName()); });
                _this._currentDirectory.setIsLoaded(true);
                _this.loading = 'hide';
                _this.status = 'success';
            }
            if (response.Contents) {
                if (!response.CommonPrefixes)
                    _this.directories = new Array();
                _this.files = new Array();
                for (var i = 1, len = response.Contents.length; i < len; i++) {
                    _this.files.push(new file_1.File(response.Contents[i].Key.replace(response.Prefix, ''), response.Contents[i].Key, response.Contents[i].Size, response.Contents[i].Date));
                }
                _this.files.sort(function (s1, s2) { return s1.getName().localeCompare(s2.getName()); });
                _this._currentDirectory.setIsLoaded(true);
                _this.loading = 'hide';
                _this.status = 'success';
            }
        }, function (error) {
            console.log('There is a problem loading data. '); // an error occurred
            console.log(error);
            _this.loading = 'hide';
        });
    };
    S3BrowserPanelComponent = __decorate([
        core_1.Component({
            selector: 's3b-panel',
            templateUrl: 'app/views/s3browser/s3b.panel.html',
            providers: [login_service_1.LoginService, s3_service_1.S3Service]
        }), 
        __metadata('design:paramtypes', [s3_service_1.S3Service, login_service_1.LoginService])
    ], S3BrowserPanelComponent);
    return S3BrowserPanelComponent;
}());
exports.S3BrowserPanelComponent = S3BrowserPanelComponent;
//# sourceMappingURL=s3b.panel.component.js.map