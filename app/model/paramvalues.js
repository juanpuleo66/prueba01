"use strict";
var Paramvalues = (function () {
    function Paramvalues(bid, bidScript, did, idScriptConfig, idScriptParam, paramValue, paramName, paramDescription, paramMandatory) {
        this.bid = bid;
        this.bidScript = bidScript;
        this.did = did;
        this.idScriptConfig = idScriptConfig;
        this.idScriptParam = idScriptParam;
        this.paramValue = paramValue;
        this.paramName = paramName;
        this.paramDescription = paramDescription;
        this.paramMandatory = paramMandatory;
    }
    return Paramvalues;
}());
exports.Paramvalues = Paramvalues;
//# sourceMappingURL=paramvalues.js.map