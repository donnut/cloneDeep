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
    var isArray = Array.isArray || function _isArray(val) {
        return val && val.length >= 0 && toString.call(val) === '[object Array]';
    };
    var equalVal = function(val) {
        return function(x) {
            return x === val;
        };
    };

    var refFrom = [];

    var cloneDeep = function(obj) {
        if (toString.call(obj) === '[object Object]') {
            return copyObj(obj);
        } else if (toString.call(obj) === '[object Array]') {
            return copyArray(obj);
        } else if (toString.call(obj) === '[object Function]') {
            return obj;
        } else if (toString.call(obj) === '[object Date]') {
            return new obj.constructor(+obj);
        } else {
            return obj;
        }
    };

    var copyObj = function(obj) {
        var newObj = {};
        for (var key in obj) {
            if (toString.call(obj[key]) === '[object Object]') {
                var i = R.findIndex(equalVal(obj[key]), refFrom);
                if (i !== -1) {
                    newObj[key] = refFrom[i];
                } else {
                    refFrom.push(obj[key]);
                    newObj[key] = cloneDeep(obj[key]);
                }
            } else {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    };

    var copyArray = function(arr) {
        var newArr = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            if (R.is(Object, arr[i])) {
                newArr.push(cloneDeep(arr[i]));
            } else {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    };

    return cloneDeep;
}));
