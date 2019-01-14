
// AgcFieldCapacity: Custom Elements Define Library, ES Module/es5 Target

import { defineCustomElement } from './agc-field-capacity.core.js';
import {
  AgcFieldCapacity,
  AgcFieldCapacityInputs,
  AgcFieldCapacityProgress,
  AgcFieldCapacityResults,
  AgcFieldCapacityResultsPlaceholder
} from './agc-field-capacity.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, [
    AgcFieldCapacity,
    AgcFieldCapacityInputs,
    AgcFieldCapacityProgress,
    AgcFieldCapacityResults,
    AgcFieldCapacityResultsPlaceholder
  ], opts);
}
