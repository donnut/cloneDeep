var assert = require('assert');
var R = require('../ramda');
var cloneDeep = require('..');

describe('clone numbers, strings and booleans', function() {
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

    it('should clone booleans', function() {
        assert.equal(true, cloneDeep(true));
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
        assert.ok(x !== clone);
        assert.ok(x.c !== clone.c);
        assert.ok(x.c.b !== clone.c.b);
        assert.ok(x.c.b.a !== clone.c.b.a);
        assert.ok(x.c.b.a.c !== clone.c.b.a.c);
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

        assert.ok(arr !== clone);
        assert.ok(arr[2] !== clone[2]);
        assert.ok(arr[2][0] !== clone[2][0]);

        assert.deepEqual([1, [1, 2, 3], [[[5]]]], clone);
    });
});

describe('`clone` functions', function() {
    it('should keep reference to function', function() {
        var func = function(x) { return x+x;};
        var arr = [{a: func}];

        var clone = cloneDeep(arr);

        assert.equal(clone[0].a(10), 20);
        assert.ok(arr[0].a === clone[0].a);

    });
});

describe('clone Dates', function() {
    it('should clone date', function() {
        var date = new Date(2014, 10, 14, 23, 59, 59, 999);

        var clone = cloneDeep(date);

        assert.ok(date !== clone);
        assert.deepEqual(new Date(2014, 10, 14, 23, 59, 59, 999), clone);

        assert.equal(5, clone.getDay()); // friday
    });
});

describe('clone deep nested mixed objects', function() {
    it('should clone array with objects', function() {
        var arr = [{a: {b: 1}}, [{c: {d: 1}}]];
        var clone = cloneDeep(arr);
        arr[1][0] = null;
        assert.deepEqual([{a: {b: 1}}, [{c: {d: 1}}]], clone);
    });
    it('should clone array with arrays', function() {
        var arr = [[1], [[3]]];
        var clone = cloneDeep(arr);
        arr[1][0] = null;
        assert.deepEqual([[1], [[3]]], clone);
    });
    it('should clone array with mutual ref object', function() {
        var obj = {a: 1};
        var arr = [{b: obj}, {b: obj}];
        var clone = cloneDeep(arr);

        assert.ok(arr[0].b === arr[1].b);
        assert.ok(clone[0].b === clone[1].b);
        assert.ok(clone[0].b !== arr[0].b);
        assert.ok(clone[1].b !== arr[1].b);

        assert.deepEqual(clone[0].b, {a:1});
        assert.deepEqual(clone[1].b, {a:1});

        obj.a = 2;
        assert.deepEqual(clone[0].b, {a:1});
        assert.deepEqual(clone[1].b, {a:1});
    });
});

describe('clone edge cases', function() {
    it('nulls, undefineds and empty objects and arrays', function() {
        assert.ok(null === cloneDeep(null));
        assert.ok(undefined === cloneDeep(undefined));
        assert.ok(undefined === cloneDeep());
        assert.ok(null !== cloneDeep(undefined));

        var obj = {};
        assert.ok(obj !== cloneDeep(obj));

        var arr = [];
        assert.ok(arr !== cloneDeep(arr));
    });
});
