import { getDeprecationsForCallback, getDeprecations } from '@ember/test-helpers';
import checkMatcher from './utils/check-matcher';

export default function expectDeprecation(cb, matcher) {
  const test = deprecations => {
    const matchedDeprecations = deprecations.filter(deprecation => {
      return checkMatcher(deprecation.message, matcher);
    });

    this.pushResult({
      result: matchedDeprecations.length !== 0,
      actual: matchedDeprecations,
      expected: null,
      message: 'Expected deprecations during test, but no deprecations were found.'
    });
  }

  if (typeof cb !== 'function') {
    test(getDeprecations());
  } else {
    const maybeThenable = getDeprecationsForCallback(cb);
    if (maybeThenable !== null && typeof maybeThenable === 'object' && typeof maybeThenable.then === 'function') {
      return maybeThenable.then(test);
    } else {
      test(maybeThenable);
    }
  }

}
