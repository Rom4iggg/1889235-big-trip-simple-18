import { getRandomInteger, getRandomValue } from '../utils/common.js';
import { BASE_PRICE, DATE_FROM, DATE_TO, TYPE } from './const.js';

export const generateWaypoint = (id) => ({
  basePrice: getRandomValue(BASE_PRICE),
  dateFrom: getRandomValue(DATE_FROM),
  dateTo: getRandomValue(DATE_TO),
  type: getRandomValue(TYPE),
  offers: Array.from(new Set([getRandomInteger(1, 4), getRandomInteger(1, 4), getRandomInteger(1, 4), getRandomInteger(1, 4)])),
  destination: id,
  id: id,
});
