import checkMatcher from './utils/check-matcher';
import { getWarningsDuringCallback } from '@ember/test-helpers';

export default function expectWarnings(callback, matcher) {
  let warnings;
  if (typeof callback === 'function') {
    warnings = getWarningsDuringCallback(callback);
  } else {
    matcher = callback;
    warnings = getWarnings();
  }

  const matchedWarnings = warnings.filter(warning => checkMatcher(warning.message, matcher);

  this.pushResult({
    result: matchedWarnings.length !== 0,
    actual: matchedWarnings,
    expected: null,
    message: 'Expected warnings during test, but no warnings were found.'
  });
}
