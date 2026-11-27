import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocalDateInputValue } from '../src/lib/bookingEngine.ts';

test('formats the local calendar date without converting it to UTC', () => {
  const localDate = new Date(2026, 10, 28, 0, 30, 0);
  assert.equal(getLocalDateInputValue(localDate), '2026-11-28');
});

test('pads single-digit months and days for date inputs', () => {
  const localDate = new Date(2026, 0, 5, 12, 0, 0);
  assert.equal(getLocalDateInputValue(localDate), '2026-01-05');
});
