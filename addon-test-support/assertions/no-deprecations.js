import { getDeprecations } from '@ember/test-helpers';

export default function noDeprecations() {
  // TODO: implement
  this.pushResult({
    result: getDeprecations(),
    actual: [],
    expected: null,
    message: 'Expected no deprecations during test, but deprecations did occure.'
  });
}
