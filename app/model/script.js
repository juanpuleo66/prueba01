"use strict";
var Script = (function () {
    function Script(id, userowner, scriptName, scriptPath, scriptLanguage, description) {
        this.id = id;
        this.userowner = userowner;
        this.scriptName = scriptName;
        this.scriptPath = scriptPath;
        this.scriptLanguage = scriptLanguage;
        this.description = description;
    }
    return Script;
}());
exports.Script = Script;
//# sourceMappingURL=script.js.map