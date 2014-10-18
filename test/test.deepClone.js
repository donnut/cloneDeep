var assert = require('assert');
var R = require('../ramda');
var cloneDeep = require('..');

describe('clone numbers and string', function() {
    it('should clone integers', function() {
        assert.equal(-4, cloneDeep(-4));
        assert.equal(9007199254740991, cloneDeep(9007199254740991));
    });

    it('should clone floats', function() {
        assert.equal(-4.5, cloneDeep(-4.5));
        assert.equal(0.0, cloneDeep(0.0));
    });

    it('should clone strings', function() {
        assert.equal('ramda', cloneDeep('ramda'));
    });
});

describe('clone objects', function() {
    it('should clone shallow object', function() {
        var obj = {a: 1, b: 'ramda', c: true, d: new Date('2013')};
        var clone = cloneDeep(obj);
        obj.c = false;
        assert.deepEqual({a: 1, b: 'ramda', c: true, d: new Date('2013')}, clone);
    });

    it('should clone deep object', function() {
        var obj = {a: {b: {c: 'ramda'}}};
        var clone = cloneDeep(obj);
        obj.a.b.c = null;
        assert.deepEqual({a: {b: {c: 'ramda'}}}, clone);
    });

    it('should clone objects with circular references', function() {
        var x = {c: null};
        var y = {a: x};
        var z = {b: y};
        x.c = z;
        var clone = cloneDeep(x);
        assert.deepEqual(R.keys(x), R.keys(clone));
        assert.deepEqual(R.keys(x.c), R.keys(clone.c));
        assert.deepEqual(R.keys(x.c.b), R.keys(clone.c.b));
        assert.deepEqual(R.keys(x.c.b.a), R.keys(clone.c.b.a));
        assert.deepEqual(R.keys(x.c.b.a.c), R.keys(clone.c.b.a.c));

        x.c.b = 1;
        assert.notDeepEqual(R.keys(x.c.b), R.keys(clone.c.b));
    });
});

describe('clone arrays', function() {
    it('should clone shallow arrays', function() {
        var arr = [1, 2, 3];
        var clone = cloneDeep(arr);
        arr.pop();
        assert.deepEqual([1, 2, 3], clone);
    });

    it('should clone deep arrays', function() {
        var arr = [1, [1, 2, 3], [[[5]]]];
        var clone = cloneDeep(arr);
        arr[2] = 4;
        assert.deepEqual([1, [1, 2, 3], [[[5]]]], clone);
    });
});

describe('clone Dates', function() {
    it('should clone date', function() {
        var date = new Date(2014, 10, 14, 23, 59, 59, 999);
        var clone = cloneDeep(date);
        date = null;
        assert.deepEqual(new Date(2014, 10, 14, 23, 59, 59, 999), clone);

        assert.equal(5, clone.getDay()); // friday
    });
});

describe('clone deep nested mixed objects', function() {
    it('should clone array with objects', function() {
        var arr = [{a: {b: 1}}, [{a: {b: 1}}]];
        var clone = cloneDeep(arr);
        arr[1][0] = null;
        assert.deepEqual([{a: {b: 1}}, [{a: {b: 1}}]], clone);
    });
});

describe('clone edge cases', function() {
    it('nulls, undefineds and empty objects and arrays', function() {
        assert.ok(null === cloneDeep(null));
        assert.ok(undefined === cloneDeep(undefined));
        assert.ok(undefined === cloneDeep());
        assert.ok(null !== cloneDeep(undefined));
        assert.ok({} !== cloneDeep({}));
        assert.ok([] !== cloneDeep([]));

        var obj = {};
        assert.ok(obj !== cloneDeep(obj));

        var arr = [];
        assert.ok(arr !== cloneDeep(arr));

    });
});
