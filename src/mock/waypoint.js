import { getRandomInteger, getRandomValue } from '../utils/common.js';
import { BASE_PRICE, DATE_FROM, DATE_TO, TYPE } from './const.js';

export const generateWaypoint = (id) => ({
  basePrice: getRandomValue(BASE_PRICE),
  dateFrom: getRandomValue(DATE_FROM),
  dateTo: getRandomValue(DATE_TO),
  destination: getRandomInteger(1, 3),
  type: getRandomValue(TYPE),
  id: id,
});
