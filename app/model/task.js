"use strict";
var Task = (function () {
    function Task(id, idConfig, configName, scriptName, comment, scriptLanguage, scriptPath, userowner, userexecute, cronExeTime, status, statusLog, usernameowner) {
        this.id = id;
        this.idConfig = idConfig;
        this.configName = configName;
        this.scriptName = scriptName;
        this.comment = comment;
        this.scriptLanguage = scriptLanguage;
        this.scriptPath = scriptPath;
        this.userowner = userowner;
        this.userexecute = userexecute;
        this.cronExeTime = cronExeTime;
        this.status = status;
        this.statusLog = statusLog;
        this.usernameowner = usernameowner;
    }
    return Task;
}());
exports.Task = Task;
//# sourceMappingURL=task.js.map