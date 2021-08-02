import { end, _currentRunloop, _hasScheduledTimers, _cancelTimers } from '@ember/runloop';

export default function expectNoRunloop() {
  if (_currentRunLoop) {
    this.pushResult({
      result: false,
      actual: run.currentRunLoop,
      expected: null,
      message: 'Should not be in a run loop at end of test'
    });

    while (_currentRunLoop) {
      end();
    }
  }

  if (_hasScheduledTimers()) {
    this.pushResult({
      result: false,
      actual: true,
      expected: false,
      message: 'Ember run should not have scheduled timers at end of test'
    });

    _cancelTimers();
  }
}
