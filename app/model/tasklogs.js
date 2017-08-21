"use strict";
var Tasklogs = (function () {
    function Tasklogs(id, idTask, pid, started, finished, updated, error, userexecute, status) {
        this.id = id;
        this.idTask = idTask;
        this.pid = pid;
        this.started = started;
        this.finished = finished;
        this.updated = updated;
        this.error = error;
        this.userexecute = userexecute;
        this.status = status;
    }
    return Tasklogs;
}());
exports.Tasklogs = Tasklogs;
//# sourceMappingURL=tasklogs.js.map