import { XHRBackend } from '@angular/http';

import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
import { APP_ROUTER_PROVIDERS} from './app.routes';
import { Location, LocationStrategy, HashLocationStrategy} from '@angular/common';

import {enableProdMode} from '@angular/core';

//enableProdMode();

bootstrap(AppComponent, [APP_ROUTER_PROVIDERS, HTTP_PROVIDERS, {provide: LocationStrategy, useClass: HashLocationStrategy}])
.catch(err => console.log(err));