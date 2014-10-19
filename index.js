(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./ramda'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./ramda'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.ramda);
    }
}(this, function(R) {

    var toString = Object.prototype.toString;

    var cloneDeep = function(obj) {
        var refFrom = [];
        var refTo = [];
        return baseCopy(obj, refFrom, refTo);
    }

    var baseCopy = function(obj, refFrom, refTo) {
        var type = toString.call(obj);
        if (type === '[object Object]' || type === '[object Array]') {
            return copyObj(obj, refFrom, refTo);
        } else if (type === '[object Function]') {
            return obj;
        } else if (type === '[object Date]') {
            return new obj.constructor(obj);
        } else {
            return obj;
        }
    };

    var copyObj = function(value, refFrom, refTo) {
        var copiedValue, idx;
        var duplicate = false;

        for (idx = 0, len = refFrom.length; idx < len; idx++) {
            if (value === refFrom[idx]) {
                duplicate = true;
                break;
            }
        }

        if (duplicate) {
            copiedValue = refTo[idx];
        } else {
            if (toString.call(value) === '[object Object]') {
                copiedValue = {};
            } else {
                copiedValue = [];
            }
            refFrom.push(value);
            refTo.push(copiedValue);
            for (var key in value) {
                copiedValue[key] = baseCopy(value[key], refFrom, refTo);
            }
        }
        return copiedValue;
    };

    return cloneDeep;
}));
