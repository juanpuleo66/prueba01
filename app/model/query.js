"use strict";
var Query = (function () {
    function Query(id, name, queryContent, userowner, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.queryContent = queryContent;
        this.userowner = userowner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.js.map