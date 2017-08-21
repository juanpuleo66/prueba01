"use strict";
var ResourceS3 = (function () {
    function ResourceS3(id, idPlatform, idInstance, name, notes, userowner, type, bname, cname, selected) {
        this.id = id;
        this.idPlatform = idPlatform;
        this.idInstance = idInstance;
        this.name = name;
        this.notes = notes;
        this.userowner = userowner;
        this.type = type;
        this.bname = bname;
        this.cname = cname;
        this.selected = selected;
    }
    return ResourceS3;
}());
exports.ResourceS3 = ResourceS3;
//# sourceMappingURL=resources3.js.map