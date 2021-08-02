import { begin, end, later }from '@ember/runloop';
import { test, module } from 'qunit';
import expectNoRunloop from 'ember-qunit/assertions/expect-no-runloop';

module('expectNoRunLoop', function(hooks) {
  let mockAssert;
  hooks.beforeEach(function() {
    mockAssert = {
      pushedResults: [],
      expectNoRunloop,
    };
  });

  test('in a run loop', function(assert) {
    mockAssert.expectNoRunloop();
    assert.ok(mockAssert.pushedResults.length, 0, '`expectNoRunLoop` detected NO active runloop');

    begin();

    mockAssert.expectNoRunloop();

    assert.notOk(mockAssert.pushedResults[0].result, '`expectNoRunLoop` detected active runloop');
    assert.ok(mockAssert.pushedResults.length, 1, '`expectNoRunLoop` detected ONE active runloop');

    end();
    assert.ok(mockAssert.pushedResults.length, 1, '`expectNoRunLoop` detected no new active runloop');
  });

  test('`expectNoRunLoop` when timers are active', function(assert) {
    later(() => {
      assert.ok(false, 'should not execute');
    });

    mockAssert.expectNoRunloop();

    assert.notOk(mockAssert.pushedResults[0].result, '`expectNoRunLoop` detected active runloop');
    assert.notOk(Ember.run.hasScheduledTimers(), 'ends run loop');
  });
});
