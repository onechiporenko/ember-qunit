import { getWarnings, getWarningsDuringCallback } from '@ember/test-helpers';

export default function expectNoWarnings(callback) {
  const warnings = typeof callback === 'function' ? getWarningsDuringCallback(callback) : getWarnings();

  let warningStr = warnings.reduce((a, b) => {
    return `${b}${a.message}\n`;
  }, '');

  this.pushResult({
    result: warnings.length === 0,
    actual: warnings,
    expected: [],
    message: `Expected no warnings during test, but warnings were found.\n${warningStr}`
  });
}
