'use strict';
require('es5-shim');
require('es6-shim');

var Record = require('./record.dist');
var test = require('tape');

test("Can only use defined keys", function(t) {
  var createItem = new Record(['foo', 'bar']);
  var item;
  t.doesNotThrow(function() {
    item = createItem({foo: 1, bar: 2});
  }, 'can make item with properties under allowed keys, and assign new values to them');
  t.equals(item.foo, 1);
  t.equals(item.bar, 2);

  item.foo = 4;
  item.bar = 2;

  t.equals(item.foo, 4);
  t.equals(item.bar, 2);

  t.throws(function() {
    var item = createItem({foo: 1, bar: 2, baz: 3});
  }, 'Throws when created with an invalid key');

  t.throws(function() {
    var item = createItem({foo: 1, bar: 2});
    item.baz = 3;
  }, 'Throws when trying to assign to a new property');
  t.end();
});

test('Default values work', function(t) {
  var createItem = new Record(['foo', 'bar'], {defaults: {Moe: 'why', Larry: 'I', Curly: 'oughtta', foo: 999 }});

  var stooges;
  t.doesNotThrow(function() {
    stooges = createItem();
  }, 'Can create default values in the assignable and non-assignable keys');

  t.deepEquals([stooges.Moe, stooges.Larry, stooges.Curly, stooges.foo], ['why', 'I', 'oughtta', 999], 'defaults match');
  t.doesNotThrow(function() {
    stooges.foo = 1;
    stooges.bar = 11;
  }, 'can assign to assignable');
  t.throws(function() {
    stooges.Moe = 'lamebrain!';
  }, "Can't assign to the non-assignable defaults");
  t.end();
});