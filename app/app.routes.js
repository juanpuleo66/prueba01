"use strict";
var router_1 = require('@angular/router');
var s3b_panel_component_1 = require('./components/s3browser/s3b.panel.component');
var register_component_1 = require('./components/access/register.component');
var default_component_1 = require('./components/default.component');
var login_component_1 = require('./components/access/login.component');
var users_component_1 = require('./components/users/users.component');
var user_edit_component_1 = require('./components/users/user.edit.component');
var user_new_component_1 = require('./components/users/user.new.component');
var user_view_component_1 = require('./components/users/user.view.component');
var resources_component_1 = require('./components/resources/resources.component');
var resource_new_component_1 = require('./components/resources/resource.new.component');
var resource_edit_component_1 = require('./components/resources/resource.edit.component');
var resource_view_component_1 = require('./components/resources/resource.view.component');
var scripts_component_1 = require('./components/scripts/scripts.component');
var script_edit_component_1 = require('./components/scripts/script.edit.component');
var script_view_component_1 = require('./components/scripts/script.view.component');
var script_new_component_1 = require('./components/scripts/script.new.component');
var configs_component_1 = require('./components/configs/configs.component');
var config_new_component_1 = require('./components/configs/config.new.component');
var config_edit_component_1 = require('./components/configs/config.edit.component');
var config_view_component_1 = require('./components/configs/config.view.component');
var config_duplicate_component_1 = require('./components/configs/config.duplicate.component');
var tasks_component_1 = require('./components/tasks/tasks.component');
var task_edit_component_1 = require('./components/tasks/task.edit.component');
var taskconfig_view_component_1 = require('./components/tasks/taskconfig.view.component');
var querys_component_1 = require('./components/querys/querys.component');
exports.routes = [
    { path: '', redirectTo: '/index', terminal: true },
    { path: 'index', component: default_component_1.DefaultComponent },
    { path: 'register', component: register_component_1.RegisterComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'login/:id', component: login_component_1.LoginComponent },
    { path: 's3browser', component: s3b_panel_component_1.S3BrowserPanelComponent },
    { path: 'resources', component: resources_component_1.ResourcesComponent },
    { path: 'resources/:page', component: resources_component_1.ResourcesComponent },
    { path: 'resources/:page/:search', component: resources_component_1.ResourcesComponent },
    { path: 'resource_new/:pageActual/:itemsPerPage', component: resource_new_component_1.ResourceNewComponent },
    { path: 'resource_new/:pageActual/:itemsPerPage/:search', component: resource_new_component_1.ResourceNewComponent },
    { path: 'resource_edit/:id/:pageActual/:itemsPerPage', component: resource_edit_component_1.ResourceEditComponent },
    { path: 'resource_edit/:id/:pageActual/:search/:itemsPerPage', component: resource_edit_component_1.ResourceEditComponent },
    { path: 'resource_view/:id/:pageActual', component: resource_view_component_1.ResourceViewComponent },
    { path: 'resource_view/:id/:pageActual/:search', component: resource_view_component_1.ResourceViewComponent },
    { path: 'users', component: users_component_1.UsersComponent },
    { path: 'users/:page', component: users_component_1.UsersComponent },
    { path: 'users/:page/:search', component: users_component_1.UsersComponent },
    { path: 'user_new/:pageActual/:itemsPerPage', component: user_new_component_1.UserRegisterComponent },
    { path: 'user_new/:pageActual/:itemsPerPage/:search', component: user_new_component_1.UserRegisterComponent },
    { path: 'user_edit', component: user_edit_component_1.UserEditComponent },
    { path: 'user_edit/:id/:pageActual/:itemsPerPage', component: user_edit_component_1.UserEditComponent },
    { path: 'user_edit/:id/:pageActual/:search/:itemsPerPage', component: user_edit_component_1.UserEditComponent },
    { path: 'user_view', component: user_view_component_1.UserViewComponent },
    { path: 'user_view/:id/:pageActual/:itemsPerPage', component: user_view_component_1.UserViewComponent },
    { path: 'user_view/:id/:pageActual/:search/:itemsPerPage', component: user_view_component_1.UserViewComponent },
    { path: 'scripts', component: scripts_component_1.ScriptsComponent },
    { path: 'scripts/:page', component: scripts_component_1.ScriptsComponent },
    { path: 'scripts/:page/:search', component: scripts_component_1.ScriptsComponent },
    { path: 'script_new/:pageActual/:itemsPerPage', component: script_new_component_1.ScriptNewComponent },
    { path: 'script_new/:pageActual/:itemsPerPage/:search', component: script_new_component_1.ScriptNewComponent },
    { path: 'script_edit/:id/:pageActual/:itemsPerPage', component: script_edit_component_1.ScriptEditComponent },
    { path: 'script_edit/:id/:pageActual/:search/:itemsPerPage', component: script_edit_component_1.ScriptEditComponent },
    { path: 'script_view/:id/:pageActual', component: script_view_component_1.ScriptViewComponent },
    { path: 'script_view/:id/:pageActual/:search', component: script_view_component_1.ScriptViewComponent },
    { path: 'configs', component: configs_component_1.ConfigsComponent },
    { path: 'configs/:page', component: configs_component_1.ConfigsComponent },
    { path: 'configs/:page/:search', component: configs_component_1.ConfigsComponent },
    { path: 'config_new/:pageActual/:itemsPerPage', component: config_new_component_1.ConfigNewComponent },
    { path: 'config_new/:pageActual/:itemsPerPage/:search', component: config_new_component_1.ConfigNewComponent },
    { path: 'config_edit/:id/:pageActual/:itemsPerPage', component: config_edit_component_1.ConfigEditComponent },
    { path: 'config_edit/:id/:pageActual/:search/:itemsPerPage', component: config_edit_component_1.ConfigEditComponent },
    { path: 'config_view/:id/:pageActual', component: config_view_component_1.ConfigViewComponent },
    { path: 'config_view/:id/:pageActual/:search', component: config_view_component_1.ConfigViewComponent },
    { path: 'config_duplicate/:id/:pageActual/:itemsPerPage', component: config_duplicate_component_1.ConfigDuplicateComponent },
    { path: 'config_duplicate/:id/:pageActual/:search/:itemsPerPage', component: config_duplicate_component_1.ConfigDuplicateComponent },
    { path: 'tasks', component: tasks_component_1.TasksComponent },
    { path: 'tasks/:page', component: tasks_component_1.TasksComponent },
    { path: 'tasks/:page/:search', component: tasks_component_1.TasksComponent },
    { path: 'task_edit/:id/:pageActual/:itemsPerPage', component: task_edit_component_1.TaskEditComponent },
    { path: 'task_edit/:id/:pageActual/:search/:itemsPerPage', component: task_edit_component_1.TaskEditComponent },
    { path: 'taskconfig_view/:id/:pageActual/:itemsPerPage', component: taskconfig_view_component_1.TaskconfigViewComponent },
    { path: 'taskconfig_view/:id/:pageActual/:search/:itemsPerPage', component: taskconfig_view_component_1.TaskconfigViewComponent },
    { path: 'querys', component: querys_component_1.QuerysComponent }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(exports.routes)
];
//# sourceMappingURL=app.routes.js.map