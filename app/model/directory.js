"use strict";
var file_1 = require('./file');
var Directory = (function () {
    function Directory(name, prefix, parentDirectory, s3service, _loginService) {
        this._name = name;
        this._prefix = prefix;
        this._parentDirectory = parentDirectory;
        this._directories = [];
        this._files = [];
        this._isLoaded = false;
        this._s3service = s3service;
        this._loginService = _loginService;
    }
    Directory.prototype.setIsLoaded = function (status) {
        this._isLoaded = status;
    };
    Directory.prototype.getName = function () {
        return this._name;
    };
    Directory.prototype.getPrefix = function () {
        return this._prefix;
    };
    Directory.prototype.getParentDirectory = function () {
        return this._parentDirectory;
    };
    Directory.prototype.isRootDirectory = function () {
        return this._parentDirectory == null;
    };
    Directory.prototype.getDirectories = function (resourceIdSelected) {
        if (!this._isLoaded) {
            this.load(resourceIdSelected);
            this._isLoaded = true;
        }
        return this._directories;
    };
    Directory.prototype.getFiles = function (resourceIdSelected) {
        if (!this._isLoaded) {
            this.load(resourceIdSelected);
            this._isLoaded = true;
        }
        return this._files;
    };
    Directory.prototype.refresh = function (resourceIdSelected) {
        this._directories = [];
        this._files = [];
        this.load(resourceIdSelected);
    };
    Directory.prototype.load = function (resourceIdSelected) {
        var self = this;
        var params = { 'idResource': resourceIdSelected, 'Delimiter': '/', 'Prefix': this._prefix };
        var token = this._loginService.getToken();
        this._s3service.listObjects(token, params).subscribe(function (response) {
            if (response.CommonPrefixes)
                for (var i = 0, len = response.CommonPrefixes.length; i < len; i++) {
                    self._directories.push(new Directory(response.CommonPrefixes[i].Prefix.replace(response.Prefix, ''), response.CommonPrefixes[i].Prefix, self, self._s3service, self._loginService));
                }
            self._directories.sort(function (s1, s2) { return s1._name.localeCompare(s2._name); });
            if (response.Contents)
                for (var i = 1, len = response.Contents.length; i < len; i++) {
                    self._files.push(new file_1.File(response.Contents[i].Key.replace(response.Prefix, ''), response.Contents[i].Key, response.Contents[i].Size, response.Contents[i].Date));
                }
            self._files.sort(function (s1, s2) { return s1.getName().localeCompare(s2.getName()); });
        }, function (error) {
            console.log('There is a problem loading data.'); // an error occurred
            console.log(error);
        });
    };
    return Directory;
}());
exports.Directory = Directory;
//# sourceMappingURL=directory.js.map