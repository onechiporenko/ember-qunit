import { getDeprecations } from '@ember/test-helpers';
import toAssertionMessage from './utils/to-assertion-message';

export default function noDeprecations() {
  this.deepEqual(
    getDeprecations().map(toAssertionMessage),
    [],
    'Expected no deprecations during test.'
  );
}
