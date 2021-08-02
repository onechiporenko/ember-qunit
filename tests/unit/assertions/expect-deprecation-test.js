import { module, test } from 'qunit';
import expectDeprecation from 'ember-qunit/assertions/expect-deprecation';
import { deprecate } from '@ember/debug';

// ............................................................
// Deprecation outside of a test. Should not cause test failures.
deprecate('Deprecation outside of a test', false, { id: 'deprecation-test', until: '3.0.0' });
// ............................................................

module('expectDeprecation', function(hooks) {
  let mockAssert;

  hooks.beforeEach(() => {
    mockAssert = {
      pushedResults: [],
      expectDeprecation,
    };
  });

  test('expectDeprecation called after test and with deprecation', function(assert) {
    deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    mockAssert.expectDeprecation();

    assert.ok(mockAssert.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called after test and without deprecation', function(assert) {
    mockAssert.expectDeprecation();
    assert.notOk(mockAssert.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectDeprecation called with callback and with deprecation', function(assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    assert.ok(mockAssert.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called with callback and without deprecation', function(assert) {
    mockAssert.expectDeprecation(() => { });
    assert.notOk(mockAssert.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectDeprecation called with callback and after test', function(assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    mockAssert.expectDeprecation();
    assert.ok(mockAssert.pushedResults[0].result, 'first `expectDeprecation` captured deprecation call');
    assert.notOk(mockAssert.pushedResults[1].result, 'second `expectDeprecation` logged failed result');
  });

  test('expectDeprecation called after test, with matcher and matched deprecation', function(assert) {
    deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    mockAssert.expectDeprecation(/Something deprecated/);
    assert.ok(mockAssert.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called after test, with matcher and unmatched deprecation', function(assert) {
    deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    mockAssert.expectDeprecation(/different deprecation/);
    assert.notOk(mockAssert.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectDeprecation called with callback, matcher and matched deprecation', function(assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /Something deprecated/);

    assert.ok(mockAssert.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called with callback, matcher and unmatched deprecation', function(assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /different deprecation/);

    assert.notOk(mockAssert.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectNoDeprecation called after test and without deprecation', function(assert) {
    assert.expectNoDeprecation();
    assert.ok(mockAssert.pushedResults[0].result, '`expectNoDeprecation` caught no deprecation');
  });

  test('expectNoDeprecation called after test and with deprecation', function(assert) {
    deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    assert.expectNoDeprecation();
    assert.notOk(mockAssert.pushedResults[0].result, '`expectNoDeprecation` caught logged failed result');
  });

  test('expectNoDeprecation called with callback and with deprecation', function(assert) {
    assert.expectNoDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    assert.notOk(mockAssert.pushedResults[0].result, '`expectNoDeprecation` caught logged failed result');
  });

  test('expectNoDeprecation called with callback and without deprecation', function(assert) {
    assert.expectNoDeprecation(() => { });
    assert.ok(mockAssert.pushedResults[0].result, '`expectNoDeprecation` caught no deprecation');
  });

  test('expectNoDeprecation called with callback and after test', function(assert) {
    assert.expectNoDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    assert.expectNoDeprecation();
    assert.notOk(mockAssert.pushedResults[0].result, 'first `expectNoDeprecation` caught logged failed result');
    assert.ok(mockAssert.pushedResults[1].result, 'second `expectNoDeprecation` caught no deprecation');
  });

  test('expectDeprecation with regex matcher', function(assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /Somethi[a-z ]*ecated/);
    mockAssert.expectDeprecation(() => {
      deprecate('/Something* deprecated/', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /Something* deprecated/);

    assert.ok(mockAssert.pushedResults[0].result, '`expectDeprecation` matched RegExp');
    assert.notOk(mockAssert.pushedResults[1].result, '`expectDeprecation` didn\'t RegExp as String match');
  });

  test('expectDeprecation with string matcher', function(assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, 'Something');

    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, 'Something.*');

    assert.ok(mockAssert.pushedResults[0].result, '`expectDeprecation` captured deprecation for partial String match');
    assert.notOk(mockAssert.pushedResults[1].result, '`expectDeprecation` didn\'t test a String match as RegExp');
  });
});
