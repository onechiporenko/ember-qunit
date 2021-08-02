import { module, test } from 'qunit';
import expectWarning from 'ember-qunit/assertions/expect-warning';
import { warn } from '@ember/warn';

// ............................................................
// Warning outside of a test. Should not cause test failures.
warn('Warning outside of a test', false, { id: 'warning-test', until: '3.0.0' });
// ............................................................

module('expectWarning', function() {
  let mockAssert;

  hooks.beforeEach(() => {
    mockAssert = {
      pushedResults: [],
      expectWarning,
    };
  });

  test('expectWarning called after test and with warning', function(assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    mockAssert.expectWarning();

    assert.ok(mockAssert.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called after test and without warning', function(assert) {
    mockAssert.expectWarning();

    assert.notOk(mockAssert.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectWarning called with callback and with warning', function(assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.ok(mockAssert.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called with callback and without warning', function(assert) {
    mockAssert.expectWarning(() => { });

    assert.notOk(mockAssert.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectWarning called with callback and after test', function(assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    mockAssert.expectWarning();

    assert.ok(mockAssert.pushedResults[0].result, 'first `expectWarning` captured warning call');
    assert.notOk(mockAssert.pushedResults[1].result, 'second `expectWarning` logged failed result');
  });

  test('expectWarning called after test, with matcher and matched warning', function(assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    mockAssert.expectWarning(/Something warned/);

    assert.ok(mockAssert.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called after test, with matcher and unmatched warning', function(assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    mockAssert.expectWarning(/different warning/);

    assert.notOk(mockAssert.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectWarning called with callback, matcher and matched warning', function(assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /Something warned/);

    assert.ok(mockAssert.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called with callback, matcher and unmatched warning', function(assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /different warning/);

    assert.notOk(mockAssert.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectNoWarning called after test and without warning', function(assert) {
    assert.expectNoWarning();
    assert.ok(mockAssert.pushedResults[0].result, '`expectNoWarning` caught no warning');
  });

  test('expectNoWarning called after test and with warning', function(assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    assert.expectNoWarning();
    assert.notOk(mockAssert.pushedResults[0].result, '`expectNoWarning` caught logged failed result');
  });

  test('expectNoWarning called with callback and with warning', function(assert) {
    assert.expectNoWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });
    assert.notOk(mockAssert.pushedResults[0].result, '`expectNoWarning` caught logged failed result');
  });

  test('expectNoWarning called with callback and without warning', function(assert) {
    assert.expectNoWarning(() => { });
    assert.ok(mockAssert.pushedResults[0].result, '`expectNoWarning` caught no warning');
  });

  test('expectNoWarning called with callback and after test', function(assert) {
    assert.expectNoWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.expectNoWarning();
    assert.notOk(mockAssert.pushedResults[0].result, 'first `expectNoWarning` caught logged failed result');
    assert.ok(mockAssert.pushedResults[1].result, 'second `expectNoWarning` caught no warning');
  });

  test('expectWarning with regex matcher', function(assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /Somethi[a-z ]*rned/);

    mockAssert.expectWarning(() => {
      Ember.deprecate('/Something* warned/', false, { id: 'warning-test', until: '3.0.0' });
    }, /Something* warned/);

    assert.ok(mockAssert.pushedResults[0].result, '`expectWarning` matched RegExp');
    assert.notOk(mockAssert.pushedResults[1].result, '`expectWarning` didn\'t RegExp as String match');
  });

  test('expectWarning with string matcher', function(assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, 'Something');

    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, 'Something.*');

    assert.ok(mockAssert.pushedResults[0].result, '`expectWarning` captured warning for partial string match');
    assert.notOk(mockAssert.pushedResults[1].result, '`expectWarning` didn\'t test a string match as RegExp');
  });
});
