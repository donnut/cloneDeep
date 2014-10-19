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
        return baseClone(obj, refFrom, refTo);
    }

    var baseClone = function(obj, refFrom, refTo) {
        if (toString.call(obj) === '[object Object]') {
            return copyObj(obj, refFrom, refTo);
        } else if (toString.call(obj) === '[object Array]') {
            return copyArray(obj, refFrom, refTo);
        } else if (toString.call(obj) === '[object Function]') {
            return obj;
        } else if (toString.call(obj) === '[object Date]') {
            return new obj.constructor(+obj);
        } else {
            return obj;
        }
    };

    var copyObj = function(obj, refFrom, refTo) {
        var newObj = {};
        for (var key in obj) {
            newObj[key] = copyObjValue(obj[key], refFrom, refTo);
        }
        return newObj;
    };

    var copyArray = function(arr, refFrom, refTo) {
        var newArr = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            newArr.push(copyObjValue(arr[i], refFrom, refTo));
        }
        return newArr;
    };

    var copyObjValue = function(value, refFrom, refTo) {
        var copiedValue, i;
        var duplicate = false;

        if (toString.call(value) === '[object Object]' ||
            toString.call(value) === '[object Array]') {
            for (i = 0, len = refFrom.length; i < len; i++) {
                if (value === refFrom[i]) {
                    duplicate = true;
                    break;
                }
            }

            if (duplicate) {
                copiedValue = refTo[i];
            } else {
                if (toString.call(value) === '[object Object]') {
                    copiedValue = {};
                } else if (toString.call(value) === '[object Array]') {
                    copiedValue = [];
                }
                refFrom.push(value);
                refTo.push(copiedValue);
                for (var key in value) {
                    copiedValue[key] = baseClone(value[key], refFrom, refTo);
                }
            }
        } else {
            copiedValue = value;
        }
        return copiedValue;
    };

    return cloneDeep;
}));
