import { getDeprecations } from '@ember/test-helpers';
import toAssertionMessage from './utils/to-assertion-message';

export default function deprecationsInclude(expected) {
  const deprecations = getDeprecations().map(toAssertionMessage);
  this.pushResult({
    result: deprecations.indexOf(expected) > -1,
    actual: deprecations,
    message: `expected to find \`${expected}\` deprecation`,
  });
}
