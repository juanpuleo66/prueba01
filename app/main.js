"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
var app_routes_1 = require('./app.routes');
var common_1 = require('@angular/common');
//enableProdMode();
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [app_routes_1.APP_ROUTER_PROVIDERS, http_1.HTTP_PROVIDERS, { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy }])
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map