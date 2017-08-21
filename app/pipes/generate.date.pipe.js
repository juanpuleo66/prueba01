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
var GenerateDatePipe = (function () {
    function GenerateDatePipe() {
    }
    GenerateDatePipe.prototype.transform = function (value) {
        var date = new Date(value * 1000);
        var day = date.getDate();
        var final_day = day.toString();
        if (day <= 9) {
            final_day = "0" + day;
        }
        var month = (date.getMonth() + 1);
        var final_month = month.toString();
        if (month <= 9) {
            final_month = "0" + month;
        }
        var hour = date.getHours();
        var final_hour = hour.toString();
        if (hour <= 9) {
            final_hour = "0" + hour;
        }
        var minutes = date.getMinutes();
        var final_minutes = minutes.toString();
        if (minutes <= 9) {
            final_minutes = "0" + minutes;
        }
        var seconds = date.getSeconds();
        var final_seconds = seconds.toString();
        if (seconds <= 9) {
            final_seconds = "0" + seconds;
        }
        var result = final_month + "/" + final_day + "/" + date.getFullYear() + " " + final_hour + ":" + final_minutes + ":" + final_seconds;
        return result;
    };
    GenerateDatePipe = __decorate([
        core_1.Pipe({ name: 'generateDate' }), 
        __metadata('design:paramtypes', [])
    ], GenerateDatePipe);
    return GenerateDatePipe;
}());
exports.GenerateDatePipe = GenerateDatePipe;
//# sourceMappingURL=generate.date.pipe.js.map