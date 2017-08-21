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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var UploadService = (function () {
    function UploadService(_http) {
        this._http = _http;
    }
    UploadService.prototype.makeFileRequest = function (token, url, params, files, id) {
        return new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            var name_file_input = params[0];
            for (var i = 0; i < files.length; i++) {
                formData.append(name_file_input, files[i], files[i].name);
            }
            formData.append("authorization", token);
            if (id != undefined) {
                formData.append("userToChange", id);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.upload.addEventListener("progress", function (event) {
                var percent = (event.loaded / event.total) * 100;
                /*let prc = Math.round(percent).toString();
                document.getElementById("upload-progress-bar").setAttribute("value",prc);
                document.getElementById("upload-progress-bar").style.width = prc+"%";
                document.getElementById("status").innerHTML = Math.round(percent)+" % uploaded please wait...";*/
            }, false);
            xhr.addEventListener("load", function (event) {
                /*  document.getElementById("status").innerHTML = "Complete Upload";
                  let prc = "100";
                  document.getElementById("upload-progress-bar").setAttribute("value",prc);
                  document.getElementById("upload-progress-bar").setAttribute("aria-valuenow",prc);
                  document.getElementById("upload-progress-bar").style.width = prc+"%";*/
            }, false);
            // xhr.addEventListener("error",function(event:any){}, false);
            xhr.addEventListener("error", function (event) {
                /* document.getElementById("status").innerHTML = "Upload Failed";
                let prc = "0";
                document.getElementById("upload-progress-bar").setAttribute("value",prc);
                document.getElementById("upload-progress-bar").setAttribute("aria-valuenow",prc);
                document.getElementById("upload-progress-bar").style.width = prc+"%";*/
            }, false);
            xhr.addEventListener("abort", function (event) {
                /*document.getElementById("status").innerHTML = "Upload Aborted";
              let prc = "0";
                 document.getElementById("upload-progress-bar").setAttribute("value",prc);
                 document.getElementById("upload-progress-bar").setAttribute("aria-valuenow",prc);
                 document.getElementById("upload-progress-bar").style.width = prc+"%";*/
            }, false);
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    };
    UploadService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UploadService);
    return UploadService;
}());
exports.UploadService = UploadService;
//# sourceMappingURL=upload.services.js.map