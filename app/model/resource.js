"use strict";
var Resource = (function () {
    function Resource(id, idPlatform, idInstance, name, notes, userowner, type, bname, cname) {
        this.id = id;
        this.idPlatform = idPlatform;
        this.idInstance = idInstance;
        this.name = name;
        this.notes = notes;
        this.userowner = userowner;
        this.type = type;
        this.bname = bname;
        this.cname = cname;
    }
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map