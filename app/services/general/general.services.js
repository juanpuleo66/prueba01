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
var GeneralServices = (function () {
    function GeneralServices() {
    }
    GeneralServices.prototype.columnContentFormat = function (content, contentLen) {
        // receives a content and inserts each contentLen a \n (new line) so it does not collapse on the grid
        if (content != null && content != undefined) {
            var contentSub = [];
            var y = 0;
            if (content.length <= contentLen) {
                contentSub[y] = content;
            }
            else {
                for (var x = 0; x < content.length; x++) {
                    if (x == contentLen) {
                        contentSub[y] = content.slice(0, x);
                        if (contentSub[y].substr(-1) != " ") {
                            contentSub[y] = contentSub[y] + '\n';
                        }
                        content = content.slice(x);
                        if (content.length <= x) {
                            y++;
                            contentSub[y] = content;
                        }
                        y++;
                        x = 0;
                    }
                }
            }
            return contentSub.join('');
        }
        return content;
    };
    GeneralServices = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GeneralServices);
    return GeneralServices;
}());
exports.GeneralServices = GeneralServices;
//# sourceMappingURL=general.services.js.map