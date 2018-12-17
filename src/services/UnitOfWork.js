"use strict";
/**
 * Unit of Work (184)
 *
 * Need an Identity Map -> Necessary any time we store domain object state in memory
 * b/c multiple copies of the same object would result in undefined behavior
 *
 */
exports.__esModule = true;
var assertHasID = function (object) {
    if (!object.id) {
        throw new Error("No ID in object");
    }
};
var UnitOfWork = /** @class */ (function () {
    function UnitOfWork() {
        this.newObjects = [];
        this.dirtyObjects = [];
        this.removedObjects = [];
    }
    UnitOfWork.newCurrent = function () {
        this.current = new UnitOfWork();
    };
    UnitOfWork.setCurrent = function (uow) {
        this.current = uow;
    };
    UnitOfWork.getCurrent = function () {
        return this.current;
    };
    UnitOfWork.prototype.commit = function () {
        this.insertNew();
        this.updateDirty();
        this.deleteRemoved();
    };
    UnitOfWork.prototype.insertNew = function () {
    };
    UnitOfWork.prototype.updateDirty = function () {
    };
    UnitOfWork.prototype.deleteRemoved = function () {
    };
    UnitOfWork.prototype.registerNew = function (object) {
        // Is this a shallow or deep compare
        if (!this.dirtyObjects.includes(object)) {
            throw new Error("Object dirty");
        }
        if (!this.removedObjects.includes(object)) {
            throw new Error("Object removed");
        }
        if (!this.newObjects.includes(object)) {
            throw new Error("Object already registered new");
        }
        this.newObjects.push(object);
    };
    UnitOfWork.prototype.registerDirty = function (object) {
        if (!this.removedObjects.includes(object)) {
            throw new Error("");
        }
        if (!this.dirtyObjects.includes(object) && !this.newObjects.includes(object)) {
            this.dirtyObjects.push(object);
        }
    };
    UnitOfWork.prototype.registerRemoved = function (object) {
        // Find and remove
        if (this.newObjects.findIndex(object) !== -1) {
            this.newObjects = this.newObjects.splice(this.newObjects.findIndex(object), 1);
            return;
        }
        this.dirtyObjects.splice(this.dirtyObjects.findIndex(object), 1);
        if (!this.removedObjects.includes(object)) {
            this.removedObjects.push(object);
        }
    };
    UnitOfWork.prototype.registerClean = function (object) {
    };
    UnitOfWork.current = new UnitOfWork();
    return UnitOfWork;
}());
exports["default"] = UnitOfWork;
