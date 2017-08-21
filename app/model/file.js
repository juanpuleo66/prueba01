"use strict";
var File = (function () {
    function File(name, prefix, size, lastModified) {
        this._name = name;
        this._prefix = prefix;
        this._size = size;
        this._lastModified = lastModified;
        this.state = false;
    }
    File.prototype.getName = function () {
        return this._name;
    };
    File.prototype.getPrefix = function () {
        return this._prefix;
    };
    File.prototype.getSize = function () {
        if (this._size > 1024 * 1024 * 1024)
            return (this._size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
        if (this._size > 1024 * 1024)
            return (this._size / (1024 * 1024)).toFixed(2) + " MB";
        if (this._size > 1024)
            return (this._size / (1024)).toFixed(2) + " KB";
        return (this._size).toFixed(2) + " bytes";
    };
    File.prototype.getLastModified = function () {
        return this._lastModified;
    };
    File.prototype.getType = function () {
        var splitter = this._name.split(".");
        if (splitter[splitter.length - 1] == "csv")
            return "Comma Separated Value File";
        if (splitter[splitter.length - 1] == "zip")
            return "WinRAR ZIP archive";
        if (splitter[splitter.length - 1] == "xls" || splitter[splitter.length - 1] == "xlsx")
            return "Microsoft Excel Document";
        if (splitter[splitter.length - 1] == "doc" || splitter[splitter.length - 1] == "docx")
            return "Microsoft Word Document";
        if (splitter[splitter.length - 1] == "rar")
            return "WinRAR RAR archive";
        if (splitter[splitter.length - 1] == "txt")
            return "Text Document";
        if (splitter[splitter.length - 1] == "dat")
            return "DAT Document";
        return "File";
    };
    return File;
}());
exports.File = File;
//# sourceMappingURL=file.js.map