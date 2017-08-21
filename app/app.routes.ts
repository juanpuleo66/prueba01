import {provideRouter, RouterConfig} from '@angular/router';



import {S3BrowserPanelComponent} from './components/s3browser/s3b.panel.component';

import {RegisterComponent} from './components/access/register.component';
import {DefaultComponent} from './components/default.component';
import {LoginComponent} from './components/access/login.component';

import {UsersComponent} from './components/users/users.component';
import {UserEditComponent} from './components/users/user.edit.component';
import {UserRegisterComponent} from './components/users/user.new.component';
import {UserViewComponent} from './components/users/user.view.component';

import {ResourcesComponent} from './components/resources/resources.component';
import {ResourceNewComponent} from './components/resources/resource.new.component';
import {ResourceEditComponent} from './components/resources/resource.edit.component';
import {ResourceViewComponent} from './components/resources/resource.view.component';

import {ScriptsComponent} from './components/scripts/scripts.component';
import {ScriptEditComponent} from './components/scripts/script.edit.component';
import {ScriptViewComponent} from './components/scripts/script.view.component';
import {ScriptNewComponent} from './components/scripts/script.new.component';

import {ConfigsComponent} from './components/configs/configs.component';
import {ConfigNewComponent} from './components/configs/config.new.component';
import {ConfigEditComponent} from './components/configs/config.edit.component';
import {ConfigViewComponent} from './components/configs/config.view.component';
import {ConfigDuplicateComponent} from './components/configs/config.duplicate.component';

import {TasksComponent} from './components/tasks/tasks.component';
import {TaskEditComponent} from './components/tasks/task.edit.component';
import {TaskconfigViewComponent} from './components/tasks/taskconfig.view.component';

import {QuerysComponent} from './components/querys/querys.component';

export const routes:RouterConfig = [
	{path: '', redirectTo: '/index', terminal: true},
	{path: 'index', component: DefaultComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'login', component: LoginComponent},
	{path: 'login/:id', component: LoginComponent},

	{path: 's3browser', component: S3BrowserPanelComponent},

	{path: 'resources', component: ResourcesComponent},
	{path: 'resources/:page', component: ResourcesComponent},
	{path: 'resources/:page/:search', component: ResourcesComponent},	

	{path: 'resource_new/:pageActual/:itemsPerPage', component: ResourceNewComponent},	
	{path: 'resource_new/:pageActual/:itemsPerPage/:search', component: ResourceNewComponent},	

	{path: 'resource_edit/:id/:pageActual/:itemsPerPage', component: ResourceEditComponent},	
	{path: 'resource_edit/:id/:pageActual/:search/:itemsPerPage', component: ResourceEditComponent},	

	{path: 'resource_view/:id/:pageActual', component: ResourceViewComponent},	
	{path: 'resource_view/:id/:pageActual/:search', component: ResourceViewComponent},	

	{path: 'users', component: UsersComponent},
	{path: 'users/:page', component: UsersComponent},
	{path: 'users/:page/:search', component: UsersComponent},	

	{path: 'user_new/:pageActual/:itemsPerPage', component: UserRegisterComponent},	
	{path: 'user_new/:pageActual/:itemsPerPage/:search', component: UserRegisterComponent},	

	{path: 'user_edit', component: UserEditComponent},
	{path: 'user_edit/:id/:pageActual/:itemsPerPage', component: UserEditComponent},	
	{path: 'user_edit/:id/:pageActual/:search/:itemsPerPage', component: UserEditComponent},

	{path: 'user_view', component: UserViewComponent},
	{path: 'user_view/:id/:pageActual/:itemsPerPage', component: UserViewComponent},	
	{path: 'user_view/:id/:pageActual/:search/:itemsPerPage', component: UserViewComponent},	

	{path: 'scripts', component: ScriptsComponent},
	{path: 'scripts/:page', component: ScriptsComponent},
	{path: 'scripts/:page/:search', component: ScriptsComponent},	

	{path: 'script_new/:pageActual/:itemsPerPage', component: ScriptNewComponent},	
	{path: 'script_new/:pageActual/:itemsPerPage/:search', component: ScriptNewComponent},	

	{path: 'script_edit/:id/:pageActual/:itemsPerPage', component: ScriptEditComponent},	
	{path: 'script_edit/:id/:pageActual/:search/:itemsPerPage', component: ScriptEditComponent},	

	{path: 'script_view/:id/:pageActual', component: ScriptViewComponent},	
	{path: 'script_view/:id/:pageActual/:search', component: ScriptViewComponent},	

	{path: 'configs', component: ConfigsComponent},
	{path: 'configs/:page', component: ConfigsComponent},
	{path: 'configs/:page/:search', component: ConfigsComponent},	

	{path: 'config_new/:pageActual/:itemsPerPage', component: ConfigNewComponent},	
	{path: 'config_new/:pageActual/:itemsPerPage/:search', component: ConfigNewComponent},	

	{path: 'config_edit/:id/:pageActual/:itemsPerPage', component: ConfigEditComponent},	
	{path: 'config_edit/:id/:pageActual/:search/:itemsPerPage', component: ConfigEditComponent},	
	
	{path: 'config_view/:id/:pageActual', component: ConfigViewComponent},	
	{path: 'config_view/:id/:pageActual/:search', component: ConfigViewComponent},	

	{path: 'config_duplicate/:id/:pageActual/:itemsPerPage', component: ConfigDuplicateComponent},	
	{path: 'config_duplicate/:id/:pageActual/:search/:itemsPerPage', component: ConfigDuplicateComponent},	
	
	{path: 'tasks', component: TasksComponent},
	{path: 'tasks/:page', component: TasksComponent},
	{path: 'tasks/:page/:search', component: TasksComponent},	

	{path: 'task_edit/:id/:pageActual/:itemsPerPage', component: TaskEditComponent},	
	{path: 'task_edit/:id/:pageActual/:search/:itemsPerPage', component: TaskEditComponent},	

	{path: 'taskconfig_view/:id/:pageActual/:itemsPerPage', component: TaskconfigViewComponent},	
	{path: 'taskconfig_view/:id/:pageActual/:search/:itemsPerPage', component: TaskconfigViewComponent},	

	{path: 'querys', component: QuerysComponent}
]

export const APP_ROUTER_PROVIDERS = [
	provideRouter(routes)
];

