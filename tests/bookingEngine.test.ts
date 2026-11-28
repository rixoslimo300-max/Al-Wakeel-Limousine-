import test from 'node:test';
import assert from 'node:assert/strict';
import { allocateVehicleForTrip, getLocalDateInputValue } from '../src/lib/bookingEngine.ts';

test('formats the local calendar date without converting it to UTC', () => {
  const localDate = new Date(2026, 10, 28, 0, 30, 0);
  assert.equal(getLocalDateInputValue(localDate), '2026-11-28');
});

test('pads single-digit months and days for date inputs', () => {
  const localDate = new Date(2026, 0, 5, 12, 0, 0);
  assert.equal(getLocalDateInputValue(localDate), '2026-01-05');
});

test('vehicle allocation follows passenger and luggage capacity together', () => {
  const fourPassengersFourBags = allocateVehicleForTrip({ passengersCount: 4, luggageCount: 4 });
  assert.equal(fourPassengersFourBags.effectiveCategory, 'suv_premium');

  const fourPassengersFiveBags = allocateVehicleForTrip({ passengersCount: 4, luggageCount: 5 });
  assert.equal(fourPassengersFiveBags.effectiveCategory, 'mini_van');
  assert.equal(fourPassengersFiveBags.matrixVehicleId, 'mitsubishi-xpander');

  const fourPassengersSixBags = allocateVehicleForTrip({ passengersCount: 4, luggageCount: 6 });
  assert.equal(fourPassengersSixBags.effectiveCategory, 'mini_van');
  assert.equal(fourPassengersSixBags.matrixVehicleId, 'toyota-hiace-m55');

  const fivePassengersOneBag = allocateVehicleForTrip({ passengersCount: 5, luggageCount: 1 });
  assert.equal(fivePassengersOneBag.effectiveCategory, 'mini_van');
  assert.equal(fivePassengersOneBag.matrixVehicleId, 'toyota-hiace-m55');
});

test('premium mini van is available only within its stated capacity', () => {
  const eligible = allocateVehicleForTrip({
    passengersCount: 4,
    luggageCount: 5,
    preferredCategory: 'mini_van_premium',
  });
  assert.equal(eligible.effectiveCategory, 'mini_van_premium');

  const tooManyPassengers = allocateVehicleForTrip({
    passengersCount: 5,
    luggageCount: 2,
    preferredCategory: 'mini_van_premium',
  });
  assert.notEqual(tooManyPassengers.effectiveCategory, 'mini_van_premium');

  const tooManyBags = allocateVehicleForTrip({
    passengersCount: 3,
    luggageCount: 6,
    preferredCategory: 'mini_van_premium',
  });
  assert.notEqual(tooManyBags.effectiveCategory, 'mini_van_premium');
});
