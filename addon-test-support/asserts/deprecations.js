import { getDeprecationsDuringCallback } from '@ember/test-helpers';
import toAssertionMessage from './utils/to-assertion-message';

export default async function deprecations(callback, expectedDeprecations) {
  const maybeThenable = getDeprecationsDuringCallback(callback);

  const operation = (deprecations) => {
    this.deepEqual(
      deprecations.map(toAssertionMessage),
      expectedDeprecations,
      'Expected deprecations during test.'
    );
  };

  if (
    typeof maybeThenable === 'object' &&
    maybeThenable !== null &&
    typeof maybeThenable.then === 'function'
  ) {
    operation(await maybeThenable);
  } else {
    operation(maybeThenable);
  }
}
